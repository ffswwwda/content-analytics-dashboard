#!/usr/bin/env python3
"""时序口径纯度守卫 —— 一个帖子只能属于一种口径，两类不得共存。

两种口径（互斥，来源完全不同）：

  口径 A · 源表实测
    key 落在 {D0, D1, D2, D7}。
    来源：源表（Grid View CSV）4 个固定观测窗，即帖子发布后第 0/1/2/7 天被真实抓取到的累计值。
    一个帖命中几个窗口就有几个点，实测分布 1 点 4269 / 2 点 415 / 3 点 41 / 4 点 1。

  口径 B · 推算单点
    key 落在 {D0, D1, D2, D7} 之外，且必然只有 1 个点。
    来源：源表 4 个窗口全空时，用「抓取日期 − 发布日期」推出的那一天，
    值是抓取当天的累计数据（彼时该帖已发布 n 天）。全库 978 条，全部单点。

规则：
  1. 同一帖不得同时出现 A 类点与 B 类点（用户明确要求：两类不同口径的数据不能同时出现在一个帖子里）。
  2. B 类只在 A 类全空时才允许补；A 类一旦出现，该帖的 B 类点必须整体让位。
     （build_refresh_gridview / build_continuation_csv 的「整体替换 + None 不覆盖」恰好满足此规则。）
  3. B 类必须是单点。多点 B 类意味着把不同抓取批次混算成一个序列，口径不成立。

展示层的落法（js/app.js，口径的唯一出口）：
  x 轴固定为 D0/D1/D2/D7 四档。A 类点落在各自窗口；B 类点（无论真实是第 3 天还是第 371 天）
  一律归入 D7 槽位，轴标签因此只出现 D0/D1/D2/D7。该点真实是发布后第几天、抓取于哪一天，
  只在悬停提示里照实显示（「末次观测 · 实为第 n 天 · MM-DD」），避免被读成真正的第 7 天成绩。

用法：
    python3 scripts/ts_purity.py                 # 审计当前 data/content_data.json，打印报告
    python3 scripts/ts_purity.py --strict        # 有违规则 exit 1（可挂 CI / pre-push）

在脚本中调用：
    from ts_purity import assert_pure
    assert_pure(contents, where="write")   # 违规直接 SystemExit(1)，阻断写盘
"""
import json
import os
import sys

SRC_DAYS = frozenset({0, 1, 2, 7})
AXIS_MAX_DAY = 7   # 展示层轴槽位上限：四档之外的推算点统一归入 D7

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "content_data.json")

SRC_LABEL = "口径A 源表实测(D0/D1/D2/D7)"
DER_LABEL = "口径B 推算单点(抓取日-发布日)"


def display_day(n):
    """展示层轴槽位：源表四档原样返回，其余一律归 D7（与 js/app.js 的 TS_AXIS_MAX 对齐）。"""
    return n if n in SRC_DAYS else AXIS_MAX_DAY


def _day(key):
    """'D32' -> 32；非 D{n} 形式返回 None。"""
    k = str(key).strip()
    if len(k) < 2 or k[0] not in ("D", "d"):
        return None
    try:
        return int(k[1:])
    except ValueError:
        return None


def split_ts(ts):
    """把一个帖的 timeseries 拆成两类口径的天数。返回 (src_days, der_days)，均已排序。

    非法 key 与空桶会被静默忽略（由 trendDayList 的前端侧另行处理）。
    """
    src, der = [], []
    for k, bucket in (ts or {}).items():
        n = _day(k)
        if n is None or n < 0:
            continue
        if not isinstance(bucket, dict):
            continue
        if not any((v or 0) > 0 for v in bucket.values()):
            continue
        (src if n in SRC_DAYS else der).append(n)
    return sorted(set(src)), sorted(set(der))


def violations(contents):
    """返回违规帖列表 [(id, src_days, der_days, reason)]。rules 1 与 3。"""
    bad = []
    for c in contents or []:
        ts = c.get("timeseries")
        if not ts:
            continue
        src, der = split_ts(ts)
        cid = str(c.get("id", "")).replace("ID:", "")
        if src and der:
            bad.append((cid, src, der, "两类口径共存"))
        elif len(der) > 1:
            bad.append((cid, src, der, "口径B 非单点"))
    return bad


def stats(contents):
    """返回全库口径统计字典。"""
    a_multi = {1: 0, 2: 0, 3: 0, 4: 0}   # 口径A 按点数
    b = {1: 0, 2: 0, 3: 0, 4: 0}          # 口径B 按点数
    none_n = 0
    hit = {}
    a_total = 0
    for c in contents or []:
        ts = c.get("timeseries")
        if not ts:
            none_n += 1
            continue
        src, der = split_ts(ts)
        if not src and not der:            # 全是空桶/非法 key -> 视作无时序
            none_n += 1
            continue
        if src:
            a_total += 1
            k = len(src)
            a_multi[k] = a_multi.get(k, 0) + 1
            for n in src:
                hit[n] = hit.get(n, 0) + 1
        else:
            k = len(der)
            b[k] = b.get(k, 0) + 1
    return {
        "total": len(contents or []),
        "a_total": a_total,
        "a_by_points": a_multi,
        "a_window_hits": hit,
        "b_total": sum(b.values()),
        "b_by_points": b,
        "none": none_n,
    }


def report(contents, verbose=True, stream=None):
    """打印口径报告；返回违规列表。"""
    out = stream or sys.stdout
    st = stats(contents)
    bad = violations(contents)
    if verbose:
        a = st["a_by_points"]
        b = st["b_by_points"]
        hit = st["a_window_hits"]
        out.write("── 时序口径报告 ──\n")
        out.write(f"{SRC_LABEL}: {st['a_total']} 帖"
                  f"（1点 {a.get(1,0)} / 2点 {a.get(2,0)} / 3点 {a.get(3,0)} / 4点 {a.get(4,0)}）\n")
        out.write(f"   各窗口命中: " + " ".join(f"D{n}={hit.get(n,0)}" for n in sorted(SRC_DAYS)) + "\n")
        out.write(f"{DER_LABEL}: {st['b_total']} 帖"
                  f"（点数分布 {dict(sorted(b.items()))}）\n")
        axis = {}
        for c in contents or []:
            src, der = split_ts(c.get("timeseries"))
            for n in (src or der):
                axis[display_day(n)] = axis.get(display_day(n), 0) + 1
        out.write("   展示层轴槽位(D0/D1/D2/D7): "
                  + " ".join(f"D{n}={axis.get(n, 0)}" for n in sorted(SRC_DAYS)) + "\n")
        out.write(f"无时序: {st['none']} | 合计 {st['total']}\n")
        if bad:
            out.write(f"口径违规: {len(bad)} 帖 —— 必须为 0\n")
            for cid, src, der, why in bad[:10]:
                out.write(f"    {cid}  A={src} B={der}  [{why}]\n")
        else:
            out.write("口径违规: 0 帖  ✓ 两类口径未共存\n")
        out.write("\n")
    return bad


def assert_pure(contents, where="", stream=None):
    """写盘前断言：全库零口径混用。违规 -> SystemExit(1)，调用方不得写盘。"""
    bad = violations(contents)
    if bad:
        out = stream or sys.stdout
        out.write(f"[口径守卫] 阻断写盘{f' ({where})' if where else ''}：发现 {len(bad)} 帖口径混用\n")
        for cid, src, der, why in bad[:20]:
            out.write(f"    {cid}  A={src} B={der}  [{why}]\n")
        if len(bad) > 20:
            out.write(f"    ...另有 {len(bad) - 20} 帖\n")
        raise SystemExit(1)
    return True


def main():
    strict = "--strict" in sys.argv
    data = json.load(open(DATA, encoding="utf-8"))
    contents = data.get("contents", [])
    bad = report(contents)
    if strict and bad:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
