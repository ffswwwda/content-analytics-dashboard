# -*- coding: utf-8 -*-
"""
把真实 xlsx（GTM社媒数据_打标全表_爆款版）转成前端 content_data.json。
- 单 sheet 统一表：内容类型=发帖 → contents（竞品/品牌内容）；内容类型=回帖 → userVoices（真实用户声音，按关联帖ID 挂接原帖）
- 全部指标来自原始打标表真实列：
  · 爆款内容指数 → viral_score（最权威的「爆款指数」）
  · 爆款指数TOP10%   → is_top（经「曝光≥1000」过滤后，再与「曝光Top10%」取并集，作为前端「爆款」标签）
  · 是否爆款        → is_viral（更宽的真标爆款，前端已弃用）
  · 综合互动率/点赞率/评论率/传播率/收藏率 → 各真实分率
  · 类目 / 内容主题 / 情绪风格 / 营销目的 / 内容来源 / 发布者类型 → 真实打标维度
全量接入，不抽样。
"""
import json, re, math
from collections import defaultdict

XLSX = "/Users/fsw/Downloads/GTM社媒数据_打标全表_爆款版.xlsx"
OUT_DIR = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data"


def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0


def to_float(s):
    try:
        return float(s or 0)
    except Exception:
        return 0.0


def norm(v):
    """把 None / 空 / 字符串 'None' 统一成 ''，其余转字符串去空白。"""
    if v is None:
        return ""
    s = str(v).strip()
    if s.lower() == "none" or s == "":
        return ""
    return s


def norm_datetime(v):
    if v is None:
        return ""
    if hasattr(v, "strftime"):
        return v.strftime("%Y-%m-%dT%H:%M:%S")
    s = str(v).strip()
    m = re.match(r"^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})", s)
    if m:
        return f"{m.group(1)}T{m.group(2)}"
    return s


def split_multi(v):
    if not v:
        return []
    return [x.strip() for x in re.split(r"[、,，/]", str(v)) if x.strip()]


def split_tags(v):
    """内容标签形如 '#A,#B' -> ['A','B']"""
    if not v:
        return []
    out = []
    for part in re.split(r"[、,，/\s]+", str(v)):
        part = part.strip().lstrip("#").strip()
        if part:
            out.append(part)
    return out


def truthy(v):
    return v in (True, "True", "TRUE", 1, "1")


def load():
    import openpyxl
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["Sheet1"]
    rows = list(ws.iter_rows(values_only=True))
    header = [str(h) if h is not None else "" for h in rows[0]]
    return header, rows[1:]


print("读取 xlsx ...")
header, rows = load()
idx = {h: i for i, h in enumerate(header)}
NI = idx["内容ID"]
print(f"  总行数: {len(rows)}")

posts = [r for r in rows if norm(r[idx["内容类型"]]) == "发帖"]
reps = [r for r in rows if norm(r[idx["内容类型"]]) == "回帖"]
print(f"  发帖: {len(posts)} | 回帖: {len(reps)}")

# 关联帖ID -> 发帖 内容ID（用于回帖挂接）
post_ids = set(norm(r[NI]) for r in posts)

# ---------- 发帖 -> contents ----------
contents = []
for r in posts:
    rec = dict(zip(header, r))
    cid = norm(rec.get("内容ID"))
    text = rec.get("内容文本") or ""
    trans = rec.get("内容文本翻译") or ""
    emo_raw = norm(rec.get("情绪风格"))
    emotion = (split_multi(emo_raw)[0] if emo_raw else "")
    contents.append({
        "id": cid,
        "account": norm(rec.get("品牌")),
        "platform": norm(rec.get("社媒平台")),
        "content_type": norm(rec.get("发布内容形式")),
        "category": norm(rec.get("类目")),
        "topic_tags": split_multi(rec.get("内容主题")),   # 内容主题（产品展示/促销…）
        "emotion": emotion,
        "emotion_style": emo_raw,
        "marketing_goal": norm(rec.get("营销目的")),
        "content_source": norm(rec.get("内容来源")),
        "author_type": norm(rec.get("发布者类型")),
        "relationship": norm(rec.get("关系类型")),
        "activity_tag": "无",
        "is_activity": False,
        "campaign_name": None,
        "text": (text or "")[:1500],
        "text_zh": (trans or "")[:1500],
        "exposure": to_int(rec.get("View数")),
        "likes": to_int(rec.get("Like数")),
        "shares": to_int(rec.get("Repost数")),
        "comments": to_int(rec.get("Reply数")),
        "collections": to_int(rec.get("Bookmark数")),
        "engagement": to_int(rec.get("互动总数")),
        # —— 真实指标（来自原始打标表） ——
        "viral_score": to_float(rec.get("爆款内容指数")),     # 爆款指数（首要筛选项）
        "is_top": truthy(rec.get("爆款指数TOP10%")),          # 真实 Top10% 爆款
        "is_viral": truthy(rec.get("是否爆款")),              # 更宽的真标爆款
        "composite_rate": to_float(rec.get("综合互动率")),
        "like_rate": to_float(rec.get("点赞率")),
        "comment_rate": to_float(rec.get("评论率")),
        "repost_rate": to_float(rec.get("传播率")),
        "collect_rate": to_float(rec.get("收藏率")),
        "brand_replies": 0,
        "avg_reply_time_minutes": 0,
        "comment_quality": {},
        "publish_time": norm_datetime(rec.get("发布时间")),
        "publish_date": norm(rec.get("发布日期"))[:10],
        "image": None,
        "post_link": norm(rec.get("主帖链接")),
        "is_reply": False,
        "content_tags": split_tags(rec.get("内容标签")),
        "content_topic": norm(rec.get("内容主题")),
        "associated_id": norm(rec.get("关联帖ID")),
        "timeseries": None,   # 新表无 D0/D1/D2/D7 时序明细
    })

# ---------- 爆款定义：曝光 Top10% + 爆款指数 Top10% 且排除低曝光 ----------
# 理由：爆款指数由互动率、点赞率、评论率、传播率组成；曝光过低（如几十）时，分母小，率值极不稳定，
# 容易出现“几十个曝光却爆款指数极高”的噪声。因此要求 爆款指数Top10% 的内容曝光至少 1000 才视为真实爆款；
# 同时，曝光本身 Top10% 的内容自然有资格进入爆款池。
MIN_EXPOSURE_FOR_VIRAL_HOT = 1000
sorted_by_exposure = sorted(contents, key=lambda x: x["exposure"], reverse=True)
top10_exposure_count = max(1, math.ceil(len(contents) * 0.1))
top10_exposure_threshold = sorted_by_exposure[top10_exposure_count - 1]["exposure"]
for c in contents:
    hot_by_viral = c["is_top"] and c["exposure"] >= MIN_EXPOSURE_FOR_VIRAL_HOT
    hot_by_exposure = c["exposure"] >= top10_exposure_threshold
    c["is_top"] = hot_by_viral or hot_by_exposure
print(f"  爆款定义：曝光Top10%阈值={top10_exposure_threshold}；爆款指数Top10%需曝光≥{MIN_EXPOSURE_FOR_VIRAL_HOT}")

# ---------- 回帖 -> userVoices ----------
voices = []
for r in reps:
    rec = dict(zip(header, r))
    re_raw = norm(rec.get("回帖情绪"))
    sentiment = re_raw if re_raw in ("正面", "负面", "中性") else ""
    voices.append({
        "contentId": norm(rec.get("内容ID")),
        "account": norm(rec.get("品牌")),
        "platform": norm(rec.get("社媒平台")),
        "category": norm(rec.get("类目")),
        "author_type": norm(rec.get("发布者类型")),
        "relationship": norm(rec.get("关系类型")),
        "text": (rec.get("内容文本") or "")[:1500],
        "text_zh": (rec.get("内容文本翻译") or "")[:1500],
        "likes": to_int(rec.get("Like数")),
        "sentiment": sentiment,
        "reply_intent": norm(rec.get("回帖意图")),
        "reply_focus": norm(rec.get("回帖关注点")),
        "publishDate": norm(rec.get("发布日期"))[:10],
        "originalLink": norm(rec.get("主帖链接")),
        "replyLink": norm(rec.get("回帖链接")),
        "associated_id": norm(rec.get("关联帖ID")),
        "viral_score": to_float(rec.get("爆款内容指数")),
        "is_top": truthy(rec.get("爆款指数TOP10%")),
    })
linked = sum(1 for v in voices if v["associated_id"] in post_ids)
print(f"  回帖关联原帖命中: {linked}/{len(voices)}")

# ---------- 账号表（从发帖品牌去重派生） ----------
brand_meta = {}
for c in contents:
    b = c["account"]
    if b and b not in brand_meta:
        brand_meta[b] = {"category": c["category"], "platform": c["platform"], "handle": "", "link": c["post_link"]}
accounts = []
for b, m in brand_meta.items():
    cnt = sum(1 for c in contents if c["account"] == b)
    accounts.append({
        "account": b,
        "category": m["category"],
        "subcategory": "",
        "platform": m["platform"],
        "handle": "",
        "followers": 0,
        "following": 0,
        "total_posts": cnt,
        "data_date": "",
        "account_link": m["link"],
        "website": "",
    })

# ---------- 组装 ----------
dates = sorted([c["publish_date"] for c in contents if c["publish_date"]])
meta = {
    "updated_at": "2026-07-15T08:30:00",
    "source": "real",
    "source_note": "GTM社媒数据_打标全表_爆款版.xlsx（全量真实数据，含爆款内容指数/综合互动率/各分率）",
    "account_count": len(brand_meta),
    "content_count": len(contents),
    "voice_count": len(voices),
    "date_range": [dates[0], dates[-1]] if dates else ["", ""],
}
out = {"meta": meta, "contents": contents, "userVoices": voices, "accounts": accounts}
with open(f"{OUT_DIR}/content_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
with open(f"{OUT_DIR}/sample_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, separators=(",", ":"))

import os
sz = os.path.getsize(f"{OUT_DIR}/content_data.json")
top_n = sum(1 for c in contents if c["is_top"])
print(f"contents {len(contents)} (is_top={top_n}) / voices {len(voices)} / 覆盖品牌 {len(brand_meta)}")
print(f"写出 content_data.json ({sz/1024/1024:.2f} MB)")
