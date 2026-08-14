# -*- coding: utf-8 -*-
"""
增量更新：把两个新 CSV（原始抓取数据）按内容ID 并入现有 content_data.json。
- 现有 10512 条（= 旧 xlsx 全量）原样保留，含其打标。
- CSV 中「现有没有」的 10675 条新帖追加：
   · 基础字段 + 原始指标(View/Like/Reply/Repost/Bookmark) 从 CSV 取；
   · 打标维度(内容主题/情绪/营销目的/内容来源/发布者类型/关系类型/内容文本翻译) 优先查旧 xlsx（新帖实际无命中，留空）；
   · 爆款指数/互动率 用原始指标公式重算；
   · 发帖/被转发原帖 -> contents；回帖 -> userVoices。
- 旧帖一律不动；仅新增帖的 is_top 基于全体(旧+新)阈值重算。
"""
import csv, json, math, re, shutil, os

CSV1 = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X (2).csv"
CSV2 = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X-续1.csv"
JSONP = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"
XLSX = "/Users/fsw/Downloads/GTM社媒数据_打标全表_爆款版.xlsx"
OUT_DIR = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data"

def to_int(s):
    try: return int(float(s or 0))
    except Exception: return 0

def norm(v):
    if v is None: return ""
    s = str(v).strip()
    if s.lower() == "none" or s == "": return ""
    return s

def norm_dt(v):
    if not v: return ""
    s = str(v).strip()
    m = re.match(r"^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})", s)
    return f"{m.group(1)}T{m.group(2)}" if m else s

def split_multi(v):
    if not v: return []
    return [x.strip() for x in re.split(r"[、,，/]", str(v)) if x.strip()]

def split_tags(v):
    if not v: return []
    out = []
    for p in re.split(r"[、,，/\s]+", str(v)):
        p = p.strip().lstrip("#").strip()
        if p: out.append(p)
    return out

def rate(part, whole):
    return min(100.0, (part / whole * 100)) if whole else 0.0

def calc_viral(like, reply, repost, bookmark, exp):
    c = rate(like + reply + repost + bookmark, exp)
    lr = rate(like, exp); cr = rate(reply, exp); rr = rate(repost, exp); kr = rate(bookmark, exp)
    return round(c * 0.4 + lr * 0.3 + cr * 0.2 + rr * 0.1, 2)

# ---------- 1. 加载现有 ----------
data = json.load(open(JSONP, encoding="utf-8"))
cont = data["contents"]; voices = data["userVoices"]
existing = set(c["id"] for c in cont if c.get("id")) | set(v["contentId"] for v in voices if v.get("contentId"))
print(f"现有: contents {len(cont)} / voices {len(voices)}; 已存在id {len(existing)}")

# ---------- 2. 旧 xlsx 打标(供新帖查，预期命中少) ----------
import openpyxl
wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws = wb["Sheet1"]
xrows = list(ws.iter_rows(values_only=True))
xheader = [str(h) if h is not None else "" for h in xrows[0]]
xidx = {h: i for i, h in enumerate(xheader)}
xmap = {}
for r in xrows[1:]:
    rec = dict(zip(xheader, r))
    cid = norm(rec.get("内容ID"))
    if cid: xmap[cid] = rec
print(f"旧 xlsx 打标行: {len(xmap)}")

# ---------- 3. 读 CSV ----------
def load_csv(p):
    with open(p, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))
allcsv = load_csv(CSV1) + load_csv(CSV2)
print(f"CSV 合并行: {len(allcsv)}")

# ---------- 4. 处理新帖 ----------
new_cont, new_voices = [], []
for r in allcsv:
    cid = norm(r.get("内容ID"))
    if not cid or cid in existing: continue
    ctype = norm(r.get("内容类型"))
    xl = xmap.get(cid)
    exp = to_int(r.get("View数")); like = to_int(r.get("Like数"))
    reply = to_int(r.get("Reply数")); repost = to_int(r.get("Repost数")); bookmark = to_int(r.get("Bookmark数"))
    eng = like + reply + repost + bookmark
    vr = calc_viral(like, reply, repost, bookmark, exp)
    cr = round(rate(eng, exp), 2); lr = round(rate(like, exp), 2)
    ker = round(rate(reply, exp), 2); rr = round(rate(repost, exp), 2); kr = round(rate(bookmark, exp), 2)
    if ctype == "回帖":
        new_voices.append({
            "contentId": cid,
            "account": norm(r.get("品牌")),
            "platform": norm(r.get("社媒平台")),
            "category": norm(r.get("类目")),
            "author_type": norm(xl.get("发布者类型")) if xl else "",
            "relationship": norm(xl.get("关系类型")) if xl else "",
            "text": (r.get("内容文本") or "")[:1500],
            "text_zh": "",
            "likes": like,
            "sentiment": "",
            "reply_intent": norm(xl.get("回帖意图")) if xl else "",
            "reply_focus": norm(xl.get("回帖关注点")) if xl else "",
            "publishDate": norm(r.get("发布日期"))[:10],
            "originalLink": norm(r.get("主帖链接")),
            "replyLink": norm(r.get("回帖链接")),
            "associated_id": norm(r.get("关联帖ID")),
            "viral_score": vr,
            "is_top": False,
        })
    else:  # 发帖 / 被转发原帖 -> contents
        emo_raw = norm(xl.get("情绪风格")) if xl else ""
        emotion = (split_multi(emo_raw)[0] if emo_raw else "")
        new_cont.append({
            "id": cid,
            "account": norm(r.get("品牌")),
            "platform": norm(r.get("社媒平台")),
            "content_type": norm(r.get("发布内容形式")),
            "category": norm(r.get("类目")),
            "topic_tags": split_multi(xl.get("内容主题")) if xl else [],
            "emotion": emotion,
            "emotion_style": emo_raw,
            "marketing_goal": norm(xl.get("营销目的")) if xl else "",
            "content_source": norm(xl.get("内容来源")) if xl else "",
            "author_type": norm(xl.get("发布者类型")) if xl else "",
            "relationship": norm(xl.get("关系类型")) if xl else "",
            "activity_tag": "无", "is_activity": False, "campaign_name": None,
            "text": (r.get("内容文本") or "")[:1500],
            "text_zh": "",
            "exposure": exp, "likes": like, "shares": repost, "comments": reply, "collections": bookmark,
            "engagement": eng,
            "viral_score": vr, "is_top": False, "is_viral": False,
            "composite_rate": cr, "like_rate": lr, "comment_rate": ker, "repost_rate": rr, "collect_rate": kr,
            "brand_replies": 0, "avg_reply_time_minutes": 0, "comment_quality": {},
            "publish_time": norm_dt(r.get("发布时间")),
            "publish_date": norm(r.get("发布日期"))[:10],
            "image": None, "post_link": norm(r.get("主帖链接")),
            "is_reply": False,
            "content_tags": split_tags(r.get("内容标签")),
            "content_topic": norm(xl.get("内容主题")) if xl else "",
            "associated_id": norm(r.get("关联帖ID")),
            "timeseries": None,
        })

print(f"新增: contents {len(new_cont)} (发帖/被转发原帖) / voices {len(new_voices)}")

# ---------- 5. 重算 is_top（仅新增帖，基于全体阈值）----------
all_c = cont + new_cont
exp_sorted = sorted(all_c, key=lambda x: x["exposure"], reverse=True)
thr_e = exp_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1]["exposure"]
viral_sorted = sorted(all_c, key=lambda x: x["viral_score"], reverse=True)
thr_v = viral_sorted[max(1, math.ceil(len(all_c) * 0.1)) - 1]["viral_score"]
for c in new_cont:
    c["is_top"] = (c["viral_score"] >= thr_v and c["exposure"] >= 1000) or (c["exposure"] >= thr_e)
print(f"is_top 阈值: 曝光Top10%>={thr_e} / 爆款指数Top10%>={thr_v}")
new_top = sum(1 for c in new_cont if c["is_top"])
print(f"新增 contents 中 is_top={new_top}")

# ---------- 6. accounts 补齐新品牌 ----------
acc_map = {a["account"]: a for a in data.get("accounts", [])}
for c in new_cont:
    b = c["account"]
    if b and b not in acc_map:
        acc_map[b] = {"account": b, "category": c["category"], "subcategory": "", "platform": c["platform"],
                      "handle": "", "followers": 0, "following": 0, "total_posts": 0, "data_date": "",
                      "account_link": c["post_link"], "website": ""}
accounts = list(acc_map.values())
for a in accounts:
    a["total_posts"] = sum(1 for c in all_c if c["account"] == a["account"])

# ---------- 7. 组装 & 写出 ----------
dates = sorted([c["publish_date"] for c in all_c if c.get("publish_date")])
meta = data.get("meta", {})
meta.update({
    "updated_at": "2026-08-14T15:00:00",
    "source": "real",
    "source_note": "现有 xlsx 全量打标 + 两个新 CSV 增量补充(新帖公式重算爆款/互动率，语义打标留空)",
    "account_count": len(acc_map),
    "content_count": len(all_c),
    "voice_count": len(voices) + len(new_voices),
    "date_range": [dates[0], dates[-1]] if dates else meta.get("date_range", ["", ""]),
})
out = {"meta": meta, "contents": all_c, "userVoices": voices + new_voices, "accounts": accounts}
shutil.copy(JSONP, JSONP + ".bak_pre_incremental")
for fn in ("content_data.json", "sample_data.json"):
    with open(f"{OUT_DIR}/{fn}", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
print(f"写出完成 -> contents {len(all_c)} / voices {len(voices)+len(new_voices)} / accounts {len(accounts)}")
print(f"文件大小: {os.path.getsize(OUT_DIR+'/content_data.json')/1048576:.1f}MB")
