# -*- coding: utf-8 -*-
"""
把真实 xlsx（已翻译、已打标 v2）转成前端 content_data.json 格式。
- 全部发帖(8672) -> contents（竞品内容，含品牌官方 + 用户发帖）
- 用户回帖(9780) -> userVoices（真实用户声音，带原帖关联）
- 账号表 -> accounts（从发帖去重派生，无粉丝数则用 0）
全量接入：不再抽样。新增字段承载打标成果：
  内容标签 / 内容主题 / 情绪风格 / 营销目的 / 内容来源 / 发布者类型 / 是否爆款真实标签 / 关联帖ID / 译文(text_zh)
"""
import json, re, random
from collections import defaultdict, Counter
import openpyxl

random.seed(20260714)
XLSX = "/Users/fsw/Downloads/GTM跨境社媒数据监控_已翻译_打标_v2.xlsx"
OUT_DIR = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data"

def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0

def norm_datetime(v):
    """把 openpyxl 可能返回的 datetime / 字符串统一成 'YYYY-MM-DDTHH:MM:SS' 字符串。"""
    if v is None:
        return ""
    if hasattr(v, "strftime"):  # datetime
        return v.strftime("%Y-%m-%dT%H:%M:%S")
    s = str(v).strip()
    # 去掉多余毫秒/时区尾缀，统一格式
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

def derive_emotion(text, form):
    t = text or ""
    if t.strip().startswith("RT @"):
        return "资讯转发"
    if form == "投票":
        return "互动投票"
    low = t.lower()
    promo = ["新品", "首发", "优惠", "折扣", "打折", "限时", "福利", "shop", "buy", "order", "% off", "deal", "sale", "promo", "促销", "活动"]
    if any(k in low for k in promo):
        return "促销推广"
    if "?" in t or "？" in t or "吗" in t or "how" in low or "what" in low:
        return "互动提问"
    return "种草内容"

def derive_sentiment(text):
    t = (text or "")
    low = t.lower()
    if "?" in t or "？" in t:
        return "提问"
    pos = ["love", "like", "great", "amazing", "interested", "thanks", "thank", "good", "nice", "cool", "awesome", "🔥", "❤", "赞", "好", "爱", "喜欢", "棒", "interest"]
    neg = ["hate", "bad", "worst", "terrible", "awful", "disappoint", "差", "烂", "失望", "broke", "broken", "scam", "fake", "refund"]
    if any(k in low for k in pos):
        return "正面"
    if any(k in low for k in neg):
        return "负面"
    return "中性"

SENT_MAP = {"正面": "pos", "负面": "neg", "中性": "neu", "pos": "pos", "neg": "neg", "neu": "neu"}
EMO_MAP = {"正面": "pos", "负面": "neg", "中性": "neu"}

def peak_view(row):
    cands = [to_int(row.get(f"D{i}-View", 0)) for i in (0, 1, 2, 7)]
    cands.append(to_int(row.get("View数", 0)))
    return max(cands)

def load_sheet(name):
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb[name]
    rows = list(ws.iter_rows(values_only=True))
    header = [str(h) if h is not None else "" for h in rows[0]]
    return header, rows[1:]

print("读取 xlsx ...")
ph, posts = load_sheet("全部发帖")
rh, replies = load_sheet("用户回帖")
print(f"  全部发帖: {len(posts)} 行 | 用户回帖: {len(replies)} 行")

def idx(header, col):
    return header.index(col)

PI, RI = idx(ph, "内容ID"), idx(rh, "内容ID")
PB, ACC = idx(ph, "品牌"), idx(ph, "账号")

# ---------- 帖子 -> contents ----------
contents = []
for r in posts:
    rec = dict(zip(ph, r))
    cid = rec.get("内容ID") or rec.get("ID") or ""
    text = rec.get("内容文本") or ""
    trans = rec.get("内容文本翻译") or ""
    emo_raw = rec.get("情绪风格") or ""
    emotion = (split_multi(emo_raw)[0] if emo_raw else derive_emotion(text, rec.get("发布内容形式")))
    is_viral = str(rec.get("是否爆款") or "").strip().lower() == "true"
    contents.append({
        "id": cid,
        "account": rec.get("品牌") or "",
        "platform": rec.get("社媒平台") or "",
        "content_type": rec.get("发布内容形式") or "",
        "topic_tags": [rec.get("类目")] if rec.get("类目") else [],
        "emotion": emotion,
        "emotion_style": emo_raw,           # 情绪风格（完整，可能多值）
        "activity_tag": "无",
        "is_activity": False,
        "campaign_name": None,
        "text": (text or "")[:1500],
        "text_zh": (trans or "")[:1500],
        "exposure": peak_view(rec),
        "likes": to_int(rec.get("Like数")),
        "shares": to_int(rec.get("Repost数")),
        "comments": to_int(rec.get("Reply数")),
        "collections": to_int(rec.get("Bookmark数")),
        "brand_replies": 0,
        "avg_reply_time_minutes": 0,
        "comment_quality": {},
        "publish_time": norm_datetime(rec.get("发布时间")),
        "image": None,
        "category": rec.get("类目") or "",
        "post_link": rec.get("主帖链接") or "",
        "is_reply": False,
        # —— 打标新增字段 ——
        "content_tags": split_tags(rec.get("内容标签")),
        "content_topic": rec.get("内容主题") or "",
        "marketing_goal": rec.get("营销目的") or "",
        "content_source": rec.get("内容来源") or "",
        "author_type": rec.get("发布者类型") or "",
        "is_viral": is_viral,
        "associated_id": rec.get("关联帖ID") or "",
        "timeseries": {
            "D0": {"view": to_int(rec.get("D0-View")), "like": to_int(rec.get("D0-Like")), "reply": to_int(rec.get("D0-Reply")), "repost": to_int(rec.get("D0-Repost")), "bookmark": to_int(rec.get("D0-Bookmark"))},
            "D1": {"view": to_int(rec.get("D1-View")), "like": to_int(rec.get("D1-Like")), "reply": to_int(rec.get("D1-Reply")), "repost": to_int(rec.get("D1-Repost")), "bookmark": to_int(rec.get("D1-Bookmark"))},
            "D2": {"view": to_int(rec.get("D2-View")), "like": to_int(rec.get("D2-Like")), "reply": to_int(rec.get("D2-Reply")), "repost": to_int(rec.get("D2-Repost")), "bookmark": to_int(rec.get("D2-Bookmark"))},
            "D7": {"view": to_int(rec.get("D7-View")), "like": to_int(rec.get("D7-Like")), "reply": to_int(rec.get("D7-Reply")), "repost": to_int(rec.get("D7-Repost")), "bookmark": to_int(rec.get("D7-Bookmark"))},
        },
    })

# ---------- 用户回帖 -> userVoices ----------
voices = []
for r in replies:
    rec = dict(zip(rh, r))
    re_raw = rec.get("回帖情绪") or ""
    sentiment = SENT_MAP.get((re_raw or "").strip(), derive_sentiment(rec.get("内容文本")))
    voices.append({
        "contentId": rec.get("内容ID") or "",
        "account": rec.get("品牌") or "",
        "platform": rec.get("社媒平台") or "",
        "text": (rec.get("内容文本") or "")[:1500],
        "text_zh": (rec.get("内容文本翻译") or "")[:1500],
        "likes": to_int(rec.get("Like数")),
        "sentiment": sentiment,
        "originalLink": rec.get("主帖链接") or rec.get("回帖链接") or "",
        "replyLink": rec.get("回帖链接") or "",
        "publishDate": (rec.get("发布日期") or "")[:10],
        "reply_emotion": re_raw,
        "reply_intent": rec.get("回帖意图") or "",
        "reply_focus": rec.get("回帖关注点") or "",
        "associated_id": rec.get("关联帖ID") or "",
    })

# ---------- 账号表（从发帖去重派生） ----------
brand_meta = {}
for c in contents:
    b = c["account"]
    if b not in brand_meta:
        brand_meta[b] = {"category": c["category"], "platform": c["platform"], "handle": "", "link": c["post_link"]}
    # handle 取账号 URL 末尾
    acc_url = ""
    # 账号列在 posts header
# 用全部发帖的账号列填充 handle
pi_acc = idx(ph, "账号")
for r in posts:
    rec = dict(zip(ph, r))
    b = rec.get("品牌") or ""
    if b and b in brand_meta and not brand_meta[b]["handle"]:
        brand_meta[b]["handle"] = rec.get("账号") or ""
accounts = []
for b, m in brand_meta.items():
    cnt = sum(1 for c in contents if c["account"] == b)
    accounts.append({
        "account": b,
        "category": m["category"],
        "subcategory": "",
        "platform": m["platform"],
        "handle": m["handle"],
        "followers": 0,
        "following": 0,
        "total_posts": cnt,
        "data_date": "",
        "account_link": m["link"],
        "website": "",
    })

# ---------- 组装 ----------
dates = sorted([c["publish_time"][:10] for c in contents if c["publish_time"]])
meta = {
    "updated_at": "2026-07-14T11:30:00",
    "source": "real",
    "source_note": "GTM跨境社媒数据监控 已翻译_打标_v2.xlsx（全量真实数据）",
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
print(f"contents {len(contents)} / voices {len(voices)} / 覆盖品牌 {len(brand_meta)}")
print(f"写出 content_data.json ({sz/1024/1024:.2f} MB)")
