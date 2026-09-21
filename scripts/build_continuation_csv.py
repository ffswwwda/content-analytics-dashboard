#!/usr/bin/env python3
"""把「内容数据记录-X-续1_Grid View.csv」并入 content_data.json。

与 build_refresh_gridview.py 的区别：那份是**重叠刷新**（0 净新增），本份是**补漏 + 新增**：
- 与上一份 Grid View CSV（内容数据记录-X_Grid View.csv）**零重合**（5218 个 ID 全无交集）；
- 其中 168 发帖 + 1817 回帖已在 JSON（来自 8/14 的非 Grid View「-X-续1.csv」增量导入）→ 只刷新指标/时序，保留既有打标；
- 其余 594 发帖 + 2639 回帖为**首次出现** → 追加，字段映射与 8/14 增量一致，并复用 scripts/tag_new_rule.py 的规则粗打标（打 needs_llm_tag 供后续模型精修）。

幂等：按内容ID 判存在性；已存在的只刷新，不会重复追加。用法: python3 scripts/build_continuation_csv.py [--dry-run]
"""
import collections
import csv
import json
import math
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tag_new_rule as TAG  # 复用规则打标（无模型粗打）
from source_cutoff import build_meta_dates  # meta 日期自动派生

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSONP = os.path.join(ROOT, "data", "content_data.json")
NEW_CSV = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X-续1_Grid View.csv"
DAY_COLS = ["D0", "D1", "D2", "D7"]
METRIC_COLS = {"view": "View数", "like": "Like数", "reply": "Reply数", "repost": "Repost数", "bookmark": "Bookmark数"}
# 时序列后缀没有「数」字：D0-View / D0-Like / ...（与总量列 View数 不同名，勿混用）
TS_SUFFIX = {"view": "View", "like": "Like", "reply": "Reply", "repost": "Repost", "bookmark": "Bookmark"}


def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0


def norm(v):
    if v is None:
        return ""
    s = str(v).strip()
    return "" if s.lower() == "none" or s == "" else s


def norm_dt(v):
    if not v:
        return ""
    s = str(v).strip()
    m = re.match(r"^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})", s)
    return f"{m.group(1)}T{m.group(2)}" if m else s


def split_multi(v):
    if not v:
        return []
    return [x.strip() for x in re.split(r"[、,，/]", str(v)) if x.strip()]


def split_tags(v):
    if not v:
        return []
    return [p.strip().lstrip("#").strip() for p in re.split(r"[、,，/\s]+", str(v)) if p.strip().lstrip("#").strip()]


def rate(part, whole):
    return min(100.0, (part / whole * 100)) if whole else 0.0


def calc_viral(like, reply, repost, bookmark, exp):
    c = rate(like + reply + repost + bookmark, exp)
    return round(c * 0.4 + rate(like, exp) * 0.3 + rate(reply, exp) * 0.2 + rate(repost, exp) * 0.1, 2)


def build_ts(r):
    """只存非零天的稀疏时序；D{n} 的 n = 发布后第 n 天（真实抓取时点）。"""
    ts = {}
    for d in DAY_COLS:
        snap = {k: to_int(r.get(f"{d}-{col}")) for k, col in TS_SUFFIX.items()}
        if any(v > 0 for v in snap.values()):
            ts[d] = snap
    return ts or None


def refresh_metrics(c, r):
    exp, like, reply, repost, bookmark = (to_int(r.get(METRIC_COLS[k])) for k in ("view", "like", "reply", "repost", "bookmark"))
    eng = like + reply + repost + bookmark
    c.update({
        "exposure": exp, "likes": like, "shares": repost, "comments": reply, "collections": bookmark,
        "engagement": eng,
        "viral_score": calc_viral(like, reply, repost, bookmark, exp),
        "composite_rate": round(rate(eng, exp), 2), "like_rate": round(rate(like, exp), 2),
        "comment_rate": round(rate(reply, exp), 2), "repost_rate": round(rate(repost, exp), 2),
        "collect_rate": round(rate(bookmark, exp), 2),
    })


def main():
    dry = "--dry-run" in sys.argv
    data = json.load(open(JSONP, encoding="utf-8"))
    cont, voices = data["contents"], data["userVoices"]
    by_id = {str(c.get("id")): c for c in cont if c.get("id")}
    by_cid = {}
    for v in voices:
        cid = str(v.get("contentId") or "")
        if cid:
            by_cid.setdefault(cid, []).append(v)

    with open(NEW_CSV, newline="", encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    maj = {
        "emotion": collections.Counter(c["emotion"] for c in cont if c.get("emotion")).most_common(1)[0][0],
        "mkt": collections.Counter(c["marketing_goal"] for c in cont if c.get("marketing_goal")).most_common(1)[0][0],
        "intent": collections.Counter(v["reply_intent"] for v in voices if v.get("reply_intent")).most_common(1)[0][0],
        "focus": collections.Counter(v["reply_focus"] for v in voices if v.get("reply_focus")).most_common(1)[0][0],
    }
    print("多数类兜底:", maj)

    new_cont, new_voices = [], []
    ref_c = ref_v = 0
    ts_filled = ts_kept = ts_none = 0

    for r in rows:
        cid = norm(r.get("内容ID"))
        if not cid:
            continue
        ctype = norm(r.get("内容类型"))
        ts = build_ts(r)
        if ctype == "回帖":
            exists = by_cid.get(cid)
            if exists:  # 已在 JSON：只刷新互动数
                for v in exists:
                    v["likes"] = to_int(r.get("Like数"))
                ref_v += 1
                continue
            like = to_int(r.get("Like数"))
            nv = {
                "contentId": cid,
                "account": norm(r.get("品牌")),
                "platform": norm(r.get("社媒平台")),
                "category": norm(r.get("类目")),
                "author_type": "", "relationship": "",
                "text": (r.get("内容文本") or "")[:1500],
                "text_zh": "",
                "likes": like,
                "sentiment": "",
                "reply_intent": "", "reply_focus": "",
                "publishDate": norm(r.get("发布日期"))[:10],
                "originalLink": norm(r.get("主帖链接")),
                "replyLink": norm(r.get("回帖链接")),
                "associated_id": norm(r.get("关联帖ID")),
                "viral_score": 0.0, "is_top": False,
            }
            TAG.tag_voice(nv, maj)
            new_voices.append(nv)
        else:  # 发帖 / 被转发原帖
            c = by_id.get(cid)
            if c:  # 已存在：刷新指标（打标一律保留）+ 仅在新 CSV 有时序数据时更新时序
                refresh_metrics(c, r)
                if ts is not None:
                    c["timeseries"] = ts
                    ts_filled += 1
                else:
                    ts_none += 1
                ref_c += 1
                continue
            exp = to_int(r.get("View数")); like = to_int(r.get("Like数"))
            reply = to_int(r.get("Reply数")); repost = to_int(r.get("Repost数")); bookmark = to_int(r.get("Bookmark数"))
            eng = like + reply + repost + bookmark
            nc = {
                "id": cid,
                "account": norm(r.get("品牌")),
                "platform": norm(r.get("社媒平台")),
                "content_type": norm(r.get("发布内容形式")),
                "category": norm(r.get("类目")),
                "topic_tags": [], "emotion": "", "emotion_style": "",
                "marketing_goal": "", "content_source": "", "author_type": "", "relationship": "",
                "activity_tag": "无", "is_activity": False, "campaign_name": None,
                "text": (r.get("内容文本") or "")[:1500],
                "text_zh": "",
                "exposure": exp, "likes": like, "shares": repost, "comments": reply, "collections": bookmark,
                "engagement": eng,
                "viral_score": calc_viral(like, reply, repost, bookmark, exp), "is_top": False, "is_viral": False,
                "composite_rate": round(rate(eng, exp), 2), "like_rate": round(rate(like, exp), 2),
                "comment_rate": round(rate(reply, exp), 2), "repost_rate": round(rate(repost, exp), 2),
                "collect_rate": round(rate(bookmark, exp), 2),
                "brand_replies": 0, "avg_reply_time_minutes": 0, "comment_quality": {},
                "publish_time": norm_dt(r.get("发布时间")),
                "publish_date": norm(r.get("发布日期"))[:10],
                "image": None, "post_link": norm(r.get("主帖链接")),
                "is_reply": False,
                "content_tags": split_tags(r.get("内容标签")),
                "content_topic": "",
                "associated_id": norm(r.get("关联帖ID")),
                "timeseries": ts,
            }
            TAG.tag_content(nc, maj)
            new_cont.append(nc)
            if ts is None:
                ts_none += 1

    print(f"发帖：已存在刷新 {ref_c} / 新增 {len(new_cont)}（其中有 D 列时序 {sum(1 for c in new_cont if c.get('timeseries'))}，无时序待补快照 {sum(1 for c in new_cont if not c.get('timeseries'))}）")
    print(f"回帖：已存在刷新 {ref_v} / 新增 {len(new_voices)}")
    print(f"已存在帖时序：本次有 D 列写入 {ts_filled} | CSV 无 D 列(保持原样) {ts_none}")

    all_c = cont + new_cont
    all_v = voices + new_voices

    # is_top：全体阈值重算（新增帖 + 已刷新帖一起重判，旧帖保持既有判定语义）
    exp_sorted = sorted(all_c, key=lambda x: x.get("exposure") or 0, reverse=True)
    thr_e = exp_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1].get("exposure") or 0
    viral_sorted = sorted(all_c, key=lambda x: x.get("viral_score") or 0, reverse=True)
    thr_v = viral_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1].get("viral_score") or 0
    for c in new_cont:
        c["is_top"] = ((c["viral_score"] >= thr_v and c["exposure"] >= 1000) or c["exposure"] >= thr_e)
    print(f"is_top 阈值：曝光Top10%>={thr_e} / 爆款指数Top10%>={thr_v} | 新增帖中 is_top={sum(1 for c in new_cont if c['is_top'])}")

    # accounts：保留既有条目（含 handle 级，勿按品牌去重，否则 Tantaly 两个 handle 会被合并）+ 补真正的新品牌
    accounts = list(data.get("accounts", []))
    have_brand = set(a.get("account") for a in accounts)
    for c in new_cont:
        b = c["account"]
        if b and b not in have_brand:
            have_brand.add(b)
            accounts.append({"account": b, "category": c["category"], "subcategory": "", "platform": c["platform"],
                             "handle": "", "followers": 0, "following": 0, "total_posts": 0, "data_date": "",
                             "account_link": c["post_link"], "website": ""})
            print("  新增品牌账号:", b)
    acc_cnt = collections.Counter(c["account"] for c in all_c)
    for a in accounts:
        a["total_posts"] = acc_cnt.get(a.get("account"), 0)

    dates = sorted([c["publish_date"] for c in all_c if c.get("publish_date")])
    meta = data.get("meta", {})
    # 日期自动派生，别再硬编码：updated_at=构建当天，data_cutoff=源表最大抓取日（取较大值防回退）
    _ups, _cutoff = build_meta_dates(rows, meta.get("data_cutoff"))
    meta.update({
        "updated_at": _ups,
        "data_cutoff": _cutoff,
        "source": "real",
        "source_note": "Grid View 全量刷新 + 续1 补齐(新帖规则粗打标，needs_llm_tag 待模型精修)",
        "account_count": len(accounts),
        "content_count": len(all_c),
        "voice_count": len(all_v),
        "date_range": [dates[0], dates[-1]] if dates else meta.get("date_range", ["", ""]),
    })
    out = {"meta": meta, "contents": all_c, "userVoices": all_v, "accounts": accounts}

    print(f"结果：contents {len(all_c)} / voices {len(all_v)} / accounts {len(accounts)} / is_top {sum(1 for c in all_c if c.get('is_top'))}")
    print(f"时序覆盖：{sum(1 for c in all_c if c.get('timeseries'))} / {len(all_c)}")
    if dry:
        print("[dry-run] 未写盘")
        return
    from ts_purity import assert_pure, report
    report(all_c)
    assert_pure(all_c, where="build_continuation_csv")   # 写盘前口径断言：混用即中止
    shutil.copy(JSONP, JSONP + ".bak_pre_continuation")
    blob = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    for fn in ("content_data.json", "sample_data.json"):
        with open(os.path.join(ROOT, "data", fn), "w", encoding="utf-8") as f:
            f.write(blob)
    print("已写盘（content_data.json + sample_data.json），备份:", JSONP + ".bak_pre_continuation")
    print(f"文件大小: {os.path.getsize(os.path.join(ROOT, 'data', 'content_data.json')) / 1048576:.2f}MB")


if __name__ == "__main__":
    main()
