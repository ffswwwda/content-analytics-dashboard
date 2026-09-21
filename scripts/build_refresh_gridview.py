# -*- coding: utf-8 -*-
"""
Grid View 刷新合并：用两个新 CSV（内容数据 Grid View + 账号数据 Grid View）刷新现有 content_data.json。
策略 = 合并更新（不丢数据）：
- 发帖/被转发原帖：与现有 contents 按 内容ID 重叠的 4966 条 -> 用 CSV 刷新指标 + 重算 viral_score/rates +
  重建 timeseries（仅存非零天，不补假0）；保留全部语义打标与 needs_llm_tag。
- 回帖：与现有 voices 按 内容ID 重叠的 14236 条 -> 刷新指标 + 重算 viral_score；保留回帖意图/关注点/情绪。
- 非重叠的现有记录（168 帖 + 2817 回帖，来自旧监控导出）原样保留。
- accounts：整体替换为 878 条 handle 级（account=品牌 兼容 accountMeta；新增 handle 字段）。
- is_top：基于合并后全体阈值重算。
-   时序口径：D0/D1/D2/D7 每帖通常只被监控抓过一次（源仅 1 天有值），故只保存实际非零的天，
  缺失天不写 0，交由前端只渲染有值的天 + 动态标签，避免“平0跳起”的伪单日曲线。
  口径契约（见 scripts/ts_purity.py）：源表四窗=口径A，推算单点=口径B，一个帖只允许其一。
  本脚本对重叠帖是「整体替换」timeseries，因此源表口出现时会自动让推算单点整体让位。
"""
import csv, json, math, os, re, shutil, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from source_cutoff import build_meta_dates  # noqa: E402

CONTENT_CSV = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X_Grid View.csv"
ACCOUNT_CSV = "/Users/fsw/Downloads/GTM跨境社媒数据监控_账号数据记录-X_Grid View.csv"
JSONP = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"
OUT_DIR = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data"

DAYS = ["D0", "D1", "D2", "D7"]
METRIC_MAP = {"View": "view", "Like": "like", "Reply": "reply", "Repost": "repost", "Bookmark": "bookmark"}


def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0


def norm(v):
    s = str(v or "").strip()
    return s if s and s.lower() != "none" else ""


def norm_dt(v):
    if not v:
        return ""
    s = str(v).strip()
    import re
    m = re.match(r"^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})", s)
    return f"{m.group(1)}T{m.group(2)}" if m else s


def split_tags(v):
    if not v:
        return []
    out = []
    for p in re.split(r"[、,，/\s]+", str(v)):
        p = p.strip().lstrip("#").strip()
        if p:
            out.append(p)
    return out


def rate(part, whole):
    return min(100.0, (part / whole * 100)) if whole else 0.0


def calc_viral(like, reply, repost, bookmark, exp):
    c = rate(like + reply + repost + bookmark, exp)
    lr = rate(like, exp); cr = rate(reply, exp); rr = rate(repost, exp); kr = rate(bookmark, exp)
    return round(c * 0.4 + lr * 0.3 + cr * 0.2 + rr * 0.1, 2)


def build_ts(row):
    """只返回实际有数据的天（该天任一指标>0），缺失天不写。"""
    ts = {}
    for d in DAYS:
        bucket = {}
        present = False
        for raw_m, key in METRIC_MAP.items():
            iv = to_int(row.get(f"{d}-{raw_m}"))
            bucket[key] = iv
            if iv > 0:
                present = True
        if present:
            ts[d] = bucket
    return ts if ts else None


# ---------- 1. 加载现有 ----------
data = json.load(open(JSONP, encoding="utf-8"))
cont = data["contents"]; voices = data["userVoices"]
cont_by_id = {c["id"]: c for c in cont if c.get("id")}
voice_by_id = {v["contentId"]: v for v in voices if v.get("contentId")}
print(f"现有: contents {len(cont)} / voices {len(voices)}")


# ---------- 2. 读 CSV ----------
def load_csv(p):
    with open(p, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))


crows = load_csv(CONTENT_CSV)
print(f"内容 CSV 行: {len(crows)}")


# ---------- 3. 合并更新 contents（发帖/被转发原帖）----------
upd_cont = 0
for r in crows:
    ctype = norm(r.get("内容类型"))
    if ctype not in ("发帖", "被转发原帖"):
        continue
    cid = norm(r.get("内容ID"))
    if not cid or cid not in cont_by_id:
        continue  # 非重叠：保留现有，不新增
    c = cont_by_id[cid]
    exp = to_int(r.get("View数")); like = to_int(r.get("Like数"))
    reply = to_int(r.get("Reply数")); repost = to_int(r.get("Repost数")); bookmark = to_int(r.get("Bookmark数"))
    eng = like + reply + repost + bookmark
    vr = calc_viral(like, reply, repost, bookmark, exp)
    # 刷新指标 + 衍生（保留全部语义打标字段）
    c["exposure"] = exp; c["likes"] = like; c["shares"] = repost; c["comments"] = reply
    c["collections"] = bookmark; c["engagement"] = eng
    c["viral_score"] = vr
    c["composite_rate"] = round(rate(eng, exp), 2)
    c["like_rate"] = round(rate(like, exp), 2)
    c["comment_rate"] = round(rate(reply, exp), 2)
    c["repost_rate"] = round(rate(repost, exp), 2)
    c["collect_rate"] = round(rate(bookmark, exp), 2)
    c["content_type"] = norm(r.get("发布内容形式"))
    c["account"] = norm(r.get("品牌")) or c.get("account")
    c["platform"] = norm(r.get("社媒平台")) or c.get("platform")
    c["category"] = norm(r.get("类目")) or c.get("category")
    c["publish_time"] = norm_dt(r.get("发布时间")) or c.get("publish_time")
    c["publish_date"] = (norm(r.get("发布日期")) or "")[:10] or c.get("publish_date")
    c["content_tags"] = split_tags(r.get("内容标签"))
    c["post_link"] = norm(r.get("主帖链接")) or c.get("post_link")
    c["associated_id"] = norm(r.get("关联帖ID")) or c.get("associated_id")
    c["text"] = (r.get("内容文本") or c.get("text") or "")[:1500]
    new_ts = build_ts(r)
    if new_ts is not None:  # 仅在新 CSV 有数据时覆盖；全零则保留现有时序(避免回退丢数据)
        c["timeseries"] = new_ts
    upd_cont += 1

print(f"更新 contents(重叠刷新): {upd_cont}; 保留非重叠: {len(cont) - upd_cont}")


# ---------- 4. 合并更新 voices（回帖）----------
upd_voice = 0
for r in crows:
    if norm(r.get("内容类型")) != "回帖":
        continue
    cid = norm(r.get("内容ID"))
    if not cid or cid not in voice_by_id:
        continue
    v = voice_by_id[cid]
    like = to_int(r.get("Like数")); exp = to_int(r.get("View数"))
    reply = to_int(r.get("Reply数")); repost = to_int(r.get("Repost数")); bookmark = to_int(r.get("Bookmark数"))
    v["likes"] = like
    v["viral_score"] = calc_viral(like, reply, repost, bookmark, exp)
    v["account"] = norm(r.get("品牌")) or v.get("account")
    v["platform"] = norm(r.get("社媒平台")) or v.get("platform")
    v["category"] = norm(r.get("类目")) or v.get("category")
    v["text"] = (r.get("内容文本") or v.get("text") or "")[:1500]
    v["publishDate"] = (norm(r.get("发布日期")) or "")[:10] or v.get("publishDate")
    v["originalLink"] = norm(r.get("主帖链接")) or v.get("originalLink")
    v["replyLink"] = norm(r.get("回帖链接")) or v.get("replyLink")
    v["associated_id"] = norm(r.get("关联帖ID")) or v.get("associated_id")
    upd_voice += 1

print(f"更新 voices(重叠刷新): {upd_voice}; 保留非重叠: {len(voices) - upd_voice}")


# ---------- 5. accounts 替换为 878 handle 级 ----------
arows = load_csv(ACCOUNT_CSV)
accounts = []
seen = set()
for r in arows:
    brand = norm(r.get("品牌"))
    handle = norm(r.get("账号名"))
    key = (brand, handle)
    if not brand or key in seen:
        continue
    seen.add(key)
    accounts.append({
        "account": brand,
        "handle": handle,
        "category": norm(r.get("类目")),
        "subcategory": norm(r.get("子类目")),
        "platform": norm(r.get("社媒平台")),
        "followers": to_int(r.get("Followers")),
        "following": to_int(r.get("Following")),
        "total_posts": to_int(r.get("总帖数")),
        "data_date": norm(r.get("数据日期")),
        "account_link": norm(r.get("账号链接")),
        "website": norm(r.get("官网链接")),
    })
print(f"accounts 重建: {len(accounts)} (原 {len(data.get('accounts', []))})")


# ---------- 6. 重算 is_top（全体）----------
all_c = cont
exp_sorted = sorted(all_c, key=lambda x: x["exposure"], reverse=True)
thr_e = exp_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1]["exposure"]
viral_sorted = sorted(all_c, key=lambda x: x["viral_score"], reverse=True)
thr_v = viral_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1]["viral_score"]
for c in all_c:
    c["is_top"] = ((c["viral_score"] >= thr_v and c["exposure"] >= 1000) or (c["exposure"] >= thr_e))
is_top_n = sum(1 for c in all_c if c["is_top"])
print(f"is_top 阈值: 曝光Top10%>={thr_e} / 爆款指数Top10%>={thr_v}; 命中 is_top={is_top_n}")


# ---------- 7. 空标签统计（理论上 0）----------
empty_cont = sum(1 for c in cont if not (c.get("topic_tags") or c.get("emotion") or c.get("marketing_goal")))
empty_voice = sum(1 for v in voices if not (v.get("reply_intent") or v.get("reply_focus")))
print(f"刷新后空标签: contents {empty_cont} / voices {empty_voice}")


# ---------- 8. meta + 写出 ----------
dates = sorted([c["publish_date"] for c in all_c if c.get("publish_date")])
meta = data.get("meta", {})
# 日期自动派生，别再硬编码：updated_at=构建当天，data_cutoff=源表最大抓取日（取较大值防回退）
_ups, _cutoff = build_meta_dates(crows, meta.get("data_cutoff"))
meta.update({
    "updated_at": _ups,
    "data_cutoff": _cutoff,
    "source": "real",
    "source_note": "Grid View 刷新合并：重叠帖/回帖用新CSV刷新指标+重建时序(仅非零天)；accounts替换为878 handle级；非重叠旧记录保留",
    "account_count": len(accounts),
    "brand_count": len(set(a["account"] for a in accounts)),
    "content_count": len(all_c),
    "voice_count": len(voices),
    "date_range": [dates[0], dates[-1]] if dates else meta.get("date_range", ["", ""]),
})
out = {"meta": meta, "contents": all_c, "userVoices": voices, "accounts": accounts}
shutil.copy(JSONP, JSONP + ".bak_pre_refresh")
from ts_purity import assert_pure, report  # noqa: E402
report(all_c)
assert_pure(all_c, where="build_refresh_gridview")   # 写盘前口径断言：混用即中止
for fn in ("content_data.json", "sample_data.json"):
    with open(f"{OUT_DIR}/{fn}", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
print(f"写出完成 -> contents {len(all_c)} / voices {len(voices)} / accounts {len(accounts)}")
print(f"文件大小: {os.path.getsize(OUT_DIR+'/content_data.json')/1048576:.1f}MB")
