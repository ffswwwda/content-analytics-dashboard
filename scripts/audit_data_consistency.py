# -*- coding: utf-8 -*-
"""全站数据对账：源 xlsx 各列去重取值 vs 线上 content_data.json 各字段去重取值。"""
import json, re
from collections import Counter, defaultdict

XLSX = "/Users/fsw/Downloads/GTM社媒数据_打标全表_爆款版.xlsx"
JSON = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"


def norm(v):
    if v is None:
        return ""
    s = str(v).strip()
    if s.lower() == "none" or s == "":
        return ""
    return s


def split_multi(v):
    if not v:
        return []
    return [x.strip() for x in re.split(r"[、,，/]", str(v)) if x.strip()]


def load_xlsx():
    import openpyxl
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["Sheet1"]
    rows = list(ws.iter_rows(values_only=True))
    header = [str(h) if h is not None else "" for h in rows[0]]
    return header, rows[1:]


print("=" * 70)
print("读取源 xlsx ...")
header, rows = load_xlsx()
idx = {h: i for i, h in enumerate(header)}
print(f"  列: {header}")
print(f"  总行数: {len(rows)}")
posts = [r for r in rows if norm(r[idx["内容类型"]]) == "发帖"]
reps = [r for r in rows if norm(r[idx["内容类型"]]) == "回帖"]
print(f"  发帖: {len(posts)} | 回帖: {len(reps)}")

# 源表各列 去重取值（单值列：直接 norm；多值列：split）
src_single = {}
src_multi = {}
for col in ["品牌", "社媒平台", "发布内容形式", "类目", "情绪风格", "营销目的", "内容来源",
            "发布者类型", "关系类型", "内容主题"]:
    if col in idx:
        vals = [norm(r[idx[col]]) for r in rows]
        src_single[col] = set(v for v in vals if v)
        multi = set()
        for v in vals:
            for m in split_multi(v):
                multi.add(m)
        src_multi[col] = multi

# 检查源表是否真的有“直播”
print("\n--- 源表“直播”出现情况 ---")
src_has_live = False
for col in ["内容来源", "发布内容形式", "营销目的", "内容主题", "情绪风格", "内容文本", "内容文本翻译"]:
    if col in idx:
        hit = sum(1 for r in rows if "直播" in str(r[idx[col]] or ""))
        if hit:
            print(f"  列[{col}] 含“直播” {hit} 行")
            src_has_live = True
if not src_has_live:
    print("  源表全列均不含“直播”字样 ✅")

# 加载 JSON
print("\n" + "=" * 70)
print("读取 content_data.json ...")
with open(JSON, encoding="utf-8") as f:
    data = json.load(f)
contents = data["contents"]
voices = data["userVoices"]
print(f"  contents: {len(contents)} | voices: {len(voices)} | accounts: {len(data.get('accounts', []))}")

# JSON 字段去重（单值）
j_account = set(c["account"] for c in contents if c["account"])
j_platform = set(c["platform"] for c in contents if c["platform"])
j_ctype = set(c["content_type"] for c in contents if c["content_type"])
j_category = set(c["category"] for c in contents if c["category"])
j_emotion = set(c["emotion"] for c in contents if c["emotion"])
j_mgoal = set(c["marketing_goal"] for c in contents if c["marketing_goal"])
j_csource = set(c["content_source"] for c in contents if c["content_source"])
j_atype = set(c["author_type"] for c in contents if c["author_type"])
j_rel = set(c["relationship"] for c in contents if c["relationship"])
j_topic = set()
for c in contents:
    for t in (c.get("topic_tags") or []):
        if t:
            j_topic.add(t)

# 比对映射: (json字段名, json集合, 源列名, 源集合)
checks = [
    ("account(品牌)", j_account, "品牌", src_single["品牌"]),
    ("platform(社媒平台)", j_platform, "社媒平台", src_single["社媒平台"]),
    ("content_type(发布内容形式)", j_ctype, "发布内容形式", src_single["发布内容形式"]),
    ("category(类目)", j_category, "类目", src_single["类目"]),
    ("emotion(情绪风格)", j_emotion, "情绪风格", src_multi["情绪风格"]),
    ("marketing_goal(营销目的)", j_mgoal, "营销目的", src_single["营销目的"]),
    ("content_source(内容来源)", j_csource, "内容来源", src_single["内容来源"]),
    ("author_type(发布者类型)", j_atype, "发布者类型", src_single["发布者类型"]),
    ("relationship(关系类型)", j_rel, "关系类型", src_single["关系类型"]),
    ("topic_tags(内容主题)", j_topic, "内容主题", src_multi["内容主题"]),
]

print("\n" + "=" * 70)
print("逐字段对账（JSON 取值 ⊆ 源表取值 ?）")
print("=" * 70)
all_ok = True
for jname, jset, sname, sset in checks:
    extra = jset - sset          # JSON 有但源表没有
    missing = sset - jset        # 源表有但 JSON 没有
    status = "OK" if not extra else "⚠ 多出来"
    print(f"\n[{jname}]  ↔  源列[{sname}]")
    print(f"  JSON 去重 {len(jset)} 个 | 源表去重 {len(sset)} 个")
    if extra:
        all_ok = False
        print(f"  ⚠ JSON 存在但源表没有的取值（{len(extra)}）:")
        for e in sorted(extra):
            print(f"     - {e!r}")
    if missing:
        print(f"  · 源表有但 JSON 缺失的取值（{len(missing)}）:")
        for m in sorted(missing):
            print(f"     - {m!r}")

# 数量核对
print("\n" + "=" * 70)
print("数量核对")
print("=" * 70)
print(f"  发帖数: JSON={len(contents)} vs 源表={len(posts)} -> {'OK' if len(contents)==len(posts) else '⚠ 不一致'}")
print(f"  回帖数: JSON={len(voices)} vs 源表={len(reps)} -> {'OK' if len(voices)==len(reps) else '⚠ 不一致'}")
print(f"  账号数: JSON={len(j_account)} vs 源表={len(src_single['品牌'])} -> {'OK' if len(j_account)==len(src_single['品牌']) else '⚠ 不一致'}")

# 关键指标抽样核对（取前几条）
print("\n" + "=" * 70)
print("关键指标抽样（JSON vs 源表对应行）")
print("=" * 70)
id_idx = {norm(r[idx["内容ID"]]): r for r in rows}
mismatch = 0
checked = 0
for c in contents[:200]:
    src = id_idx.get(c["id"])
    if not src:
        continue
    checked += 1
    rec = dict(zip(header, src))
    def to_int(s):
        try: return int(float(s or 0))
        except: return 0
    exp = to_int(rec.get("View数"))
    lk = to_int(rec.get("Like数"))
    sh = to_int(rec.get("Repost数"))
    cm = to_int(rec.get("Reply数"))
    co = to_int(rec.get("Bookmark数"))
    eng = to_int(rec.get("互动总数"))
    if (c["exposure"], c["likes"], c["shares"], c["comments"], c["collections"], c["engagement"]) != (exp, lk, sh, cm, co, eng):
        mismatch += 1
        if mismatch <= 10:
            print(f"  不一致 id={c['id']}: JSON(exposure={c['exposure']},likes={c['likes']},shares={c['shares']},comments={c['comments']},col={c['collections']},eng={c['engagement']}) | 源(View={exp},Like={lk},Repost={sh},Reply={cm},BM={co},互动={eng})")
print(f"  抽样 {checked} 条，指标不一致 {mismatch} 条 -> {'OK' if mismatch==0 else '⚠ 有偏差'}")

print("\n" + "=" * 70)
print("总结:", "全部字段取值与源表一致 ✅" if all_ok else "存在 JSON 比源表多出/缺失的取值，见上 ⚠")
print("=" * 70)
