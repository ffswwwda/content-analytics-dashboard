#!/usr/bin/env python3
"""为源表 4 个观测窗全空但总量>0 的帖子补「真实抓取日快照」时序点。

背景：Grid View CSV 里，部分帖子的 D0/D1/D2/D7 列全零（发布时点在逐日观测窗口外），
但 View数/Like数/... 是抓取日的真实累计值，且 CSV 带「发布日期」与「抓取日期」。
二者之差 = 该快照对应的真实第 N 天。据此给这些帖子补一条单点时序 {D{n}: {...}}，
让前端时序图显示在真实时间轴上（而非整帖无时序）。

口径（重要，见 scripts/ts_purity.py）：
- 源表只有 D0/D1/D2/D7 四个观测窗，属于「口径A 源表实测」。
- 本脚本补的推算单点属于「口径B」，**只允许 A 类全空时才补**，两类绝不同时出现在一个帖里。
- B 类必然是单点；展示层（js/app.js）把 B 类一律归入 D7 槽位，轴标签只出现 D0/D1/D2/D7。

规则（幂等）：
- 只处理 timeseries 为空( null/{} )的发帖/被转发原帖；
- 要求 CSV 中 View数>0 且 D 列全零；gap = 抓取日期 - 发布日期（天，负值钳为 0）；
- 已有时序的帖子一律不动（已验证：有 D 列数据的帖子抓取总量与 D 列 max 一致，无第二点可加）。

用法: python3 scripts/build_snapshot_ts.py [--dry-run]
"""
import csv
import json
import os
import shutil
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ts_purity import assert_pure, report  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "content_data.json")
CSV_PATHS = [
    "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X_Grid View.csv",
    "/Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X-续1_Grid View.csv",
]

DAY_COLS = ["D0", "D1", "D2", "D7"]
SRC_COLS = {"view": "View数", "like": "Like数", "reply": "Reply数", "repost": "Repost数", "bookmark": "Bookmark数"}


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0


def parse_d(s):
    s = (s or "").strip()[:10].replace("/", "-")
    return date.fromisoformat(s) if s else None


def main():
    dry = "--dry-run" in sys.argv
    bak = DATA + ".bak-20260918-snap"
    if not dry and not os.path.exists(bak):
        shutil.copy2(DATA, bak)
        print("备份:", bak)

    info = {}
    for p in CSV_PATHS:
        if not os.path.exists(p):
            print("跳过(不存在):", p)
            continue
        with open(p, newline="", encoding="utf-8-sig") as f:
            rows = list(csv.DictReader(f))
        n = 0
        for r in rows:
            if r.get("内容类型") not in ("发帖", "被转发原帖"):
                continue
            cid = (r.get("内容ID") or "").replace("ID:", "")
            if cid:
                info[cid] = r
                n += 1
        print(f"载入 {os.path.basename(p)}: 发帖类 {n}")

    data = json.load(open(DATA, encoding="utf-8"))
    contents = data["contents"]
    fixed = 0
    skipped_have_ts = 0
    skipped_src_days = 0
    no_source = 0
    zero_view = 0
    gaps = {}
    for c in contents:
        cid = str(c.get("id", "")).replace("ID:", "")
        ts = c.get("timeseries")
        if ts:  # 已有时序，不动（幂等关键）
            skipped_have_ts += 1
            continue
        r = info.get(cid)
        if not r:
            no_source += 1
            continue
        view_total = num(r.get("View数"))
        if view_total <= 0:
            zero_view += 1
            continue
        if any(num(r.get(f"{d}-{k}")) > 0 for d in DAY_COLS for k in ("View", "Like", "Reply", "Repost", "Bookmark")):
            # 源表有实测窗口 -> 属于口径A，不得再补口径B（两类不同口径不能同时出现在一个帖里）
            skipped_src_days += 1
            continue
        p, s = parse_d(r.get("发布日期")), parse_d(r.get("抓取日期"))
        if not p or not s:
            no_source += 1
            continue
        gap = max((s - p).days, 0)
        snap = {k: int(num(r.get(col))) for k, col in SRC_COLS.items()}
        if not any(v > 0 for v in snap.values()):
            continue
        c["timeseries"] = {f"D{gap}": snap}
        gaps[gap] = gaps.get(gap, 0) + 1
        fixed += 1

    print(f"已有 ts 保留: {skipped_have_ts} | 补快照: {fixed} | 源表有实测窗口无需补: {skipped_src_days} "
          f"| 无 CSV 源: {no_source} | View=0 跳过: {zero_view}")
    if gaps:
        ks = sorted(gaps)
        print("快照 gap 分布: min", ks[0], "max", ks[-1], "| 样本:", {k: gaps[k] for k in ks[:6]}, "...")
    total_ts = sum(1 for c in contents if c.get("timeseries"))
    print("补后有时序帖数:", total_ts, "/", len(contents))
    report(contents)
    if dry:
        print("[dry-run] 未写盘")
        return
    assert_pure(contents, where="build_snapshot_ts")   # 写盘前口径断言：混用即中止
    json.dump(data, open(DATA, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    # sample_data.json 是离线全量回退副本，必须同步，否则线上会用到旧那份
    sample = os.path.join(ROOT, "data", "sample_data.json")
    if os.path.exists(sample):
        shutil.copy2(DATA, sample)
        print("已同步:", sample)
    print("已写盘:", DATA)


if __name__ == "__main__":
    main()
