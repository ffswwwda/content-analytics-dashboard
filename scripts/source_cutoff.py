#!/usr/bin/env python3
"""源表日期工具：给构建脚本自动派生 meta 的 updated_at / data_cutoff，避免硬编码过期日期。

背景：侧边栏徽标此前显示「数据更新 <硬编码字符串>」，每次导入新 CSV 若忘了改那一行，
页面就会显示过期日期。两个字段含义不同，必须分开：

  updated_at   页面/数据最近一次维护日 = 构建当天（本脚本运行时自动取今天）
  data_cutoff  数据真实覆盖到哪天 = 源表里最大的「抓取日期」

data_cutoff 取「已有值」与「本次扫到的值」中的较大者：这样即使某次只跑了某个较早的
CSV 子集（如 X_GridView 只到 08-03），也不会把上次已经算出的 09-18 覆盖回去。
"""
import datetime

GRAB_KEYS = ("抓取日期", "采集日期", "抓取时间")


def max_grab_date(rows, keys=GRAB_KEYS):
    """从 CSV 行里取最大「抓取日期」，返回 'YYYY-MM-DD'；取不到返回 ''。"""
    best = ""
    for r in rows or []:
        for k in keys:
            v = (r.get(k) or "").strip()[:10].replace("/", "-")
            if len(v) == 10 and v[4] == "-" and v > best:
                best = v
    return best


def later(a, b):
    """返回两个 'YYYY-MM-DD' 里较晚的一个（空值不参与比较）。"""
    a, b = (a or "").strip()[:10], (b or "").strip()[:10]
    if not a:
        return b
    if not b:
        return a
    return a if a >= b else b


def build_meta_dates(rows, existing_cutoff="", now=None):
    """给构建脚本用：返回 (updated_at, data_cutoff)。

    updated_at  = 构建当天（T 时间用当前时刻），代表「页面最近一次更新」
    data_cutoff = max(已有截止日, 本次源表最大抓取日)
    """
    now = now or datetime.datetime.now()
    return now.strftime("%Y-%m-%dT%H:%M:%S"), later(existing_cutoff, max_grab_date(rows))


if __name__ == "__main__":
    _ts, _cut = build_meta_dates([{"抓取日期": "2026-09-18"}, {"抓取日期": "2026-08-03"}], "2026-09-18")
    print("updated_at =", _ts)
    print("data_cutoff =", _cut)
