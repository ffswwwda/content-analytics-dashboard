# -*- coding: utf-8 -*-
"""
给 contents 回填 per-post 时序(D0/D1/D2/D7)，数据源为两个新 CSV 的 D0-View~D7-Bookmark。
- 不动打标、不动既有指标，只填充原本为 null 的 timeseries 字段。
- 适用于全部 contents（旧帖+新帖）：CSV 含 3719 条旧帖 id，可一并回填。
- 仅当 20 个时序值至少有一个 >0 才写入，避免空曲线。
"""
import csv, json, os, shutil

CSV1 = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X (2).csv"
CSV2 = "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X-续1.csv"
JSONP = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"

METRIC_MAP = {"View": "view", "Like": "like", "Reply": "reply", "Repost": "repost", "Bookmark": "bookmark"}
DAYS = ["D0", "D1", "D2", "D7"]

def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0

def norm(v):
    s = str(v or "").strip()
    return s if s and s.lower() != "none" else ""

def build_ts(row):
    ts = {}
    any_val = False
    for d in DAYS:
        bucket = {}
        for raw_m, key in METRIC_MAP.items():
            col = f"{d}-{raw_m}"
            # CSV 列名可能因为顺序不同而带空格，做容错
            val = None
            if col in row:
                val = row[col]
            else:
                for k in row:
                    if k and k.replace(" ", "") == col:
                        val = row[k]; break
            iv = to_int(val)
            bucket[key] = iv
            if iv > 0: any_val = True
        ts[d] = bucket
    return ts if any_val else None

# 1. 建 内容ID -> timeseries
ts_map = {}
for p in (CSV1, CSV2):
    with open(p, encoding="utf-8-sig", newline="") as f:
        for r in csv.DictReader(f):
            cid = norm(r.get("内容ID"))
            if not cid: continue
            ts = build_ts(r)
            if ts and cid not in ts_map:   # 先到先得，避免重复覆盖
                ts_map[cid] = ts

print(f"CSV 中可构建时序的帖子数: {len(ts_map)}")

# 2. 回填进 contents
data = json.load(open(JSONP, encoding="utf-8"))
cont = data["contents"]
filled_old = filled_new = 0
missed = 0
for c in cont:
    cid = c.get("id")
    if not cid:
        missed += 1; continue
    if cid in ts_map:
        was = c.get("timeseries")
        c["timeseries"] = ts_map[cid]
        if was: filled_new += 1
        else: filled_old += 1
    # 不在 map 里的保持原样(含原有 null 或 旧值)

print(f"回填: 旧帖(曾为null) {filled_old} / 已有 {filled_new} / 未命中(无时序数据) {missed}")
print(f"contents 总数 {len(cont)}，其中含 timeseries 的 = {sum(1 for c in cont if c.get('timeseries'))}")

# 3. 写出(先备份当前)
shutil.copy(JSONP, JSONP + ".bak_pre_timeseries")
with open(JSONP, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
print(f"写出完成，文件大小 {os.path.getsize(JSONP)/1048576:.1f}MB")
