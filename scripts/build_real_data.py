# -*- coding: utf-8 -*-
"""
把真实 CSV 转成前端 content_data.json 格式。
- 发帖 -> contents（竞品内容）
- 回帖 -> userVoices（用户对竞品的评价，带原帖链接）
- 账号表 -> accounts（品牌元数据：粉丝/类目/链接）
采样：覆盖全部 15 个品牌，每个品牌取高互动 + 随机发帖 + 高赞回帖，优先近期数据。
"""
import csv, json, random
csv.field_size_limit(10**7)
random.seed(20260713)

BASE = "/Users/fsw/Downloads"
CONTENT_CSV = f"{BASE}/GTM跨境社媒数据监控_内容数据记录-X.csv"
ACCOUNT_CSV = f"{BASE}/GTM跨境社媒数据监控_账号数据记录-X.csv"
OUT_DIR = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data"

def to_int(s):
    try: return int(float(s or 0))
    except: return 0

def derive_emotion(text, form):
    t = text or ""
    if t.strip().startswith("RT @") or t[:6].count("RT @"):
        return "资讯转发"
    if form == "投票":
        return "互动投票"
    low = t.lower()
    promo = ["新品","首发","优惠","折扣","打折","限时","福利","shop","buy","order","% off","deal","sale","promo","促销","活动"]
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
    pos = ["love","like","great","amazing","interested","thanks","thank","good","nice","cool","awesome","🔥","❤","赞","好","爱","喜欢","棒","interest"]
    neg = ["hate","bad","worst","terrible","awful","disappoint","差","烂","失望","broke","broken","scam","fake","refund"]
    if any(k in low for k in pos): return "正面"
    if any(k in low for k in neg): return "负面"
    return "中性"

def peak_view(row):
    cands = [to_int(row.get(f"D{i}-View", 0)) for i in (0,1,2,7)]
    cands.append(to_int(row.get("View数", 0)))
    return max(cands)

# ---------- 读取内容 ----------
posts, replies = [], []
with open(CONTENT_CSV, encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        if row["内容类型"] == "发帖": posts.append(row)
        elif row["内容类型"] == "回帖": replies.append(row)

print(f"读入：发帖 {len(posts)} / 回帖 {len(replies)}")

def eng_of(p):
    return to_int(p["Like数"]) + to_int(p["Reply数"]) + to_int(p["Repost数"]) + to_int(p["Bookmark数"]) + peak_view(p)

brands_post = sorted(set(p["品牌"] for p in posts))
brands_rep = sorted(set(r["品牌"] for r in replies))
print(f"品牌：发帖 {len(brands_post)} / 回帖 {len(brands_rep)}")

# 按品牌分组
posts_by = {}
for p in posts: posts_by.setdefault(p["品牌"], []).append(p)
reps_by = {}
for r in replies: reps_by.setdefault(r["品牌"], []).append(r)

RECENT = lambda d: (d or "") >= "2025-01-01"

def sample_posts(brand):
    arr = posts_by.get(brand, [])
    recent = [p for p in arr if RECENT(p["发布日期"])]
    pool = recent if len(recent) >= 3 else arr
    if not pool: return []
    pool_sorted = sorted(pool, key=eng_of, reverse=True)
    pick = pool_sorted[:3]  # 高互动
    rest = [p for p in pool if p not in pick]
    random.shuffle(rest)
    pick += rest[:3]  # 再加随机（制造高低差，让爆款识别有意义）
    # 去重保序
    seen=set(); out=[]
    for p in pick:
        k=p["内容ID"]; 
        if k not in seen: seen.add(k); out.append(p)
    return out

def sample_replies(brand):
    arr = reps_by.get(brand, [])
    recent = [r for r in arr if RECENT(r["发布日期"])]
    pool = recent if recent else arr
    pool_sorted = sorted(pool, key=lambda r: to_int(r["Like数"]), reverse=True)
    return pool_sorted[:3]

contents, voices = [], []
all_brands = sorted(set(brands_post) | set(brands_rep))
for brand in all_brands:
    for p in sample_posts(brand):
        contents.append({
            "id": p["内容ID"] or p["ID"],
            "account": p["品牌"],
            "platform": p["社媒平台"],
            "content_type": p["发布内容形式"],
            "topic_tags": [p["类目"]] if p["类目"] else [],
            "emotion": derive_emotion(p["内容文本"], p["发布内容形式"]),
            "activity_tag": "无",
            "is_activity": False,
            "campaign_name": None,
            "text": p["内容文本"],
            "exposure": peak_view(p),
            "likes": to_int(p["Like数"]),
            "shares": to_int(p["Repost数"]),
            "comments": to_int(p["Reply数"]),
            "collections": to_int(p["Bookmark数"]),
            "brand_replies": 0,
            "avg_reply_time_minutes": 0,
            "comment_quality": {},
            "publish_time": p["发布时间"],
            "image": None,
            "category": p["类目"],
            "post_link": p["主帖链接"],
            "is_reply": False,
        })
    for r in sample_replies(brand):
        voices.append({
            "contentId": r["内容ID"] or r["ID"],
            "account": r["品牌"],
            "platform": r["社媒平台"],
            "text": r["内容文本"],
            "likes": to_int(r["Like数"]),
            "sentiment": derive_sentiment(r["内容文本"]),
            "originalLink": r["主帖链接"] or r["回帖链接"],
            "replyLink": r["回帖链接"],
            "publishDate": r["发布日期"],
        })

print(f"采样：contents {len(contents)} / voices {len(voices)} / 覆盖品牌 {len(all_brands)}")

# ---------- 读取账号表 ----------
accounts = []
with open(ACCOUNT_CSV, encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        accounts.append({
            "account": row["品牌"],
            "category": row["类目"],
            "subcategory": row["子类目"],
            "platform": row["社媒平台"],
            "handle": row["账号名"],
            "followers": to_int(row["Followers"]),
            "following": to_int(row["Following"]),
            "total_posts": to_int(row["总帖数"]),
            "data_date": row["数据日期"],
            "account_link": row["账号链接"],
            "website": row["官网链接"],
        })
print(f"账号表：{len(accounts)} 个品牌")

# ---------- 组装 ----------
dates = sorted([c["publish_time"][:10] for c in contents if c["publish_time"]])
meta = {
    "updated_at": "2026-07-13T10:38:00",
    "source": "real",
    "source_note": "GTM跨境社媒数据监控 CSV（真实数据抽样）",
    "account_count": len(all_brands),
    "content_count": len(contents),
    "voice_count": len(voices),
    "date_range": [dates[0], dates[-1]] if dates else ["", ""],
}
out = {"meta": meta, "contents": contents, "userVoices": voices, "accounts": accounts}

with open(f"{OUT_DIR}/content_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
with open(f"{OUT_DIR}/sample_data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("已写出 content_data.json / sample_data.json")
