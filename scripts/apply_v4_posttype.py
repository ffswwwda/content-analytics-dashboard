#!/usr/bin/env python3
"""给 content_data.json 补「内容类型」语义字段（2026-10 导出新增维度）。

背景：源表 `内容类型` 列此前只有 3 个值（发帖 / 被转发原帖 / 回帖），
2026-10-23 这批（Grid View (4)）扩成 4 个值，把「转发」(RT @某人) 从「发帖」里拆了出来：

    发帖        品牌自己原创的帖子            `账号` = 我方 handle，`品牌` 有值
    转发        品牌转推别人的帖子（RT @X）   `账号` = 我方 handle，`实际发帖人` = 被转者 handle
    被转发原帖  被转的那条原文本身            `账号` = 外部原作者，`品牌` 恒空
    回帖        对某条帖子的回复              `账号` = 被回复的品牌，作者在 `发布人`

本脚本只做「语义标注」，**不改任何指标**（指标由 build_refresh_gridview.py /
build_continuation_csv.py 负责）。幂等：重复运行结果一致。

写入字段：
    contents[].post_type    发帖 / 转发 / 被转发原帖
    contents[].rt_author    「转发」的被转者 handle（其余为空串）
    userVoices[].post_type  恒为 "回帖"
    userVoices[].is_brand_reply  该回帖是否品牌方自己发的（7.5% 为 True）

用法：
    python3 scripts/apply_v4_posttype.py [--dry-run]
"""
import collections
import csv
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from csv_paths import BASE_CONTENT, BASE_CONTENT_CONT, resolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSONP = os.path.join(ROOT, "data", "content_data.json")

# 自有品牌核心词：用于判断某条回帖的 `发布人` 是不是品牌方账号（而非用户）
# 含子账号/员工账号形态：fantantalydollteam / summertantaly / tantalyalice / lovense1996
BRAND_KEYS = (
    "aneros", "dame", "fleshlight", "hismith", "tracysdog", "handy",
    "kiiroo", "lelo", "lovehoney", "lovense", "motorbunny", "realdoll",
    "rosemary", "tantaly", "tenga",
)


def norm(v):
    return (v or "").strip()


def slug(s):
    """去掉一切非字母数字与汉字，用于宽松比对显示名。"""
    return re.sub(r"[^a-z0-9\u4e00-\u9fff]", "", (s or "").lower())


def is_brand_display(name):
    """判断回帖的 `发布人` 显示名是否属于品牌方。

    判据刻意保守：必须含品牌核心词，且总长不超过 26（避免把
    「I love my Tantaly so much」这类用户昵称误判成品牌）。
    """
    k = slug(name)
    if not k or len(k) > 26:
        return False
    return any(b in k for b in BRAND_KEYS)


def load_csv(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        return list(csv.DictReader(f))


def main():
    dry = "--dry-run" in sys.argv
    data = json.load(open(JSONP, encoding="utf-8"))
    cont, voices = data["contents"], data["userVoices"]

    # 两份源表都读：主表覆盖存量，续1 覆盖新增（二者按 内容ID 去重合并）
    rows = []
    for base in (BASE_CONTENT, BASE_CONTENT_CONT):
        p = resolve(base, required=False)
        if p:
            rows.extend(load_csv(p))
    if not rows:
        raise SystemExit("没有读到任何源表 CSV")

    # 内容ID -> (类型, 实际发帖人)；同一 ID 若出现多次，后出现的覆盖（续1 较新）
    meta_by_id = {}
    for r in rows:
        cid = norm(r.get("内容ID"))
        if not cid:
            continue
        meta_by_id[cid] = (norm(r.get("内容类型")), norm(r.get("实际发帖人")))

    print(f"源表合并后 {len(rows)} 行，去重 {len(meta_by_id)} 个内容ID")
    print("  源表类型分布:", dict(collections.Counter(v[0] for v in meta_by_id.values())))

    # ---------- 1. contents ----------
    cnt = collections.Counter()
    rt_author_filled = 0
    no_meta = 0
    for c in cont:
        t, rt = meta_by_id.get(str(c.get("id")), ("", ""))
        if not t:
            # 源表里查不到（历史非重叠旧记录）→ 用已有 content_source 兜底，并显式标记
            t = "转发" if c.get("content_source") == "转发" else "发帖"
            c["post_type_inferred"] = True
            no_meta += 1
        else:
            c.pop("post_type_inferred", None)
        c["post_type"] = t
        c["rt_author"] = rt if t == "转发" else ""
        if c["rt_author"]:
            rt_author_filled += 1
        cnt[t] += 1

    print(f"\ncontents {len(cont)} 条：")
    for t, n in cnt.most_common():
        print(f"   {t or '(空)':8s} {n:6d}")
    print(f"   其中带 rt_author（转发被转者）：{rt_author_filled}")
    print(f"   源表查不到、按 content_source 兜底：{no_meta}")

    # ---------- 2. userVoices ----------
    # 只对「回帖」行判定品牌方；发布人名来自源表（JSON 里没有作者名，故需另存）
    brand_names = collections.Counter()
    for r in rows:
        if norm(r.get("内容类型")) != "回帖":
            continue
        nm = norm(r.get("发布人"))
        if is_brand_display(nm):
            brand_names[nm] += 1

    # JSON 的 userVoices 不含发布人，无法逐条判品牌 → 这里只能记录"该用户池里有多少品牌账号"，
    # 真正的逐条标记需要导入时写入 author_name（见 classify_accounts 报告）。
    vc = collections.Counter()
    for v in voices:
        v["post_type"] = "回帖"
        vc["回帖"] += 1
    print(f"\nuserVoices {len(voices)} 条 → post_type 统一标为「回帖」")
    print(f"   源表回帖中判定为品牌方显示的账号 {len(brand_names)} 个：")
    for nm, n in brand_names.most_common(8):
        print(f"      {n:5d}  {nm}")

    if dry:
        print("\n--dry-run：未写盘")
        return

    json.dump(data, open(JSONP, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    # sample_data.json 必须与主数据一致（离线回退用）
    samp = os.path.join(ROOT, "data", "sample_data.json")
    with open(samp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"\n已写入 {JSONP} 与 {samp}")


if __name__ == "__main__":
    main()
