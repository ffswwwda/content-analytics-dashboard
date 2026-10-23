#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""区分「红人账号 / 品牌官方 / 行业媒体 / 普通用户」——基于现有源表可得的信号。

背景与限制（先说清楚，别指望这个脚本给出权威身份）
----------------------------------------------------
源表 42 列里**没有**账号类型、粉丝数、认证标记、简介这些字段。
`账号数据记录` CSV 虽有 Followers，但只覆盖我方 16 个自有账号，
对 318 个外部账号一个粉丝数都没有。

所以本脚本不做"身份判定"，只做**基于旁证的置信度分层**：
每个结果都带 tier 与 evidence，tier 低的那部分必须人工过一遍。

真正能定身份的只有三条硬证据：
  1) 出现专属折扣码（"12% Coupon code with Penelope12"、"codice sconto"）
  2) 明确合作表述（"@Kiiroo asked me to write an erotica piece for Halloween"）
  3) 账号本身在品牌/媒体名单里

用法：
    python3 scripts/classify_accounts.py
    # 产出 data/account_classification.csv + 终端汇总
"""
from __future__ import annotations

import collections
import csv
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import csv_paths  # noqa: E402

# ---------- 名单（可持续补充） ----------

# 行业媒体 / 公关机构 / 展会主办（B2B，不是红人也不是普通用户）
MEDIA_HANDLES = {
    "avnmedianetwork", "xbiz", "toniprnews", "therubpr", "starfactorypr",
    "pornvalleymedia", "meltsmedia", "tenga_pr", "adultnovelty", "sprotnews",
    "xbi", "animews", "flpromodels",
}
MEDIA_KEYWORDS = ("avnmedian", "xbiz", "prnews", "rubpr", "factorypr", "promodels")

# 竞品 / 其他品牌官方账号（人工确认过的，逐步扩充）
COMPETITOR_HANDLES = {
    "dolllabofficial",   # 玩偶品牌，92 次，明显是竞品官方
    "feelhubx",          # 20 次，带他人 @ 做推广，判为品牌/推广号
    "topcydoll",         # 玩偶品牌
    "lovense_gaming",    # Lovense 子账号（我方竞品）
}

# ---------- 信号正则 ----------

# 专属折扣码：红人带货最硬的证据
RE_COUPON = re.compile(
    r"use (my|code)|coupon code|discount code|promo code|use code|"
    r"codice sconto|sconto|code\s*[:：]\s*\w|% off with|my code",
    re.I,
)
# 明确合作表述
RE_COLLAB = re.compile(
    r"asked me to|partnered with|ambassador|#ad\b|#sponsored|#partner|"
    r"paid partnership|#affiliate|sent me|gifted",
    re.I,
)
# 内容形态：开箱 / 测评 / 种草合集
RE_CREATOR_FORM = re.compile(
    r"\bunboxing\b|\bhaul\b|\breview\b|\bfirst look\b|开箱|测评|合集|种草", re.I
)
# 品牌 @ 提及 + 行动号召
RE_CTA = re.compile(r"\b(rt|retweet|order|shop now|get yours|link in bio|swipe up|check it out)\b", re.I)
# 真实购买自述（偏向普通用户）
RE_BUYER = re.compile(
    r"\bordered\b|\bmy order\b|\barrived\b|\bjust got\b|\bwaiting for\b|下单|到货|买了",
    re.I,
)
# 互动/赠品型合作（"Win your own" + Follow @brand）
RE_GIVEAWAY = re.compile(r"\bwin your own\b|\bgiveaway\b|\bfollow\b.{0,30}@", re.I)

# ---------- 工具 ----------


def norm_handle(url: str) -> str:
    """https://x.com/@Foo_Bar -> foo_bar"""
    m = re.search(r"@([A-Za-z0-9_.\-]+)", url or "")
    return (m.group(1) if m else (url or "")).lower().strip()


def load_rows():
    path = csv_paths.resolve(csv_paths.BASE_CONTENT)
    with open(path, encoding="utf-8-sig", newline="") as fh:
        return list(csv.DictReader(fh))


def own_handles(rows) -> set[str]:
    """品牌列有值的账号 = 我方自有品牌 handle。"""
    return {norm_handle(r["账号"]) for r in rows if (r["品牌"] or "").strip()}


# ---------- 分类 ----------


def classify(handle: str, posts: list[dict], own: set[str]) -> tuple[str, str, int]:
    """返回 (tier, evidence, confidence)。confidence 0-100 是旁证强度，不是概率。

    重要前提：「被转发原帖」这个池子**不是全量随机抽样**，而是"我方品牌转发/引用过的
    外部内容"。品牌只会转有关系的账号（合作红人、竞品、行业媒体），所以池子里
    普通用户本就很少。这个先验在下面的规则里没有直接加分，因为品牌归属已丢失
    （品牌列全空、关联帖ID 全空、主帖链接指向原帖而非我方转发）。
    """
    n = len(posts)
    exposure = sum(float(p.get("View数") or 0) for p in posts)
    text = " ".join(p.get("内容文本") or "" for p in posts)
    hashtags = " ".join(p.get("内容标签") or "" for p in posts)
    blob = text + " " + hashtags

    # 正文是否 @ 了我方品牌（说明这条内容与品牌有明确关联）
    mentions_own = any(("@" + o) in blob.lower() for o in own)

    if handle in own:
        return "自有品牌官方", "在品牌名单内（账号表有粉丝数）", 100

    if handle in MEDIA_HANDLES or any(k in handle for k in MEDIA_KEYWORDS):
        return "行业媒体/PR", "命中媒体/公关名单", 95

    if handle in COMPETITOR_HANDLES:
        return "竞品/其他品牌", "命中竞品品牌名单", 90

    if RE_COUPON.search(blob):
        m = RE_COUPON.search(blob)
        return "红人·合作确认", f"含专属折扣码（{m.group(0)[:24]}）", 92

    if RE_COLLAB.search(blob):
        m = RE_COLLAB.search(blob)
        return "红人·合作确认", f"含合作表述（{m.group(0)[:24]}）", 88

    if RE_GIVEAWAY.search(blob):
        m = RE_GIVEAWAY.search(blob)
        return "红人·合作确认", f"含赠品/关注引导（{m.group(0)[:20]}）", 85

    # 以下靠旁证强度分层
    if n >= 3 and exposure >= 100_000:
        return "红人·高置信", f"出现 {n} 次、累计曝光 {exposure:,.0f}", 75

    if n >= 2 and (RE_CREATOR_FORM.search(blob) or exposure >= 200_000 or mentions_own):
        return "红人·高置信", f"出现 {n} 次、曝光 {exposure:,.0f}、有关联证据", 68

    if n == 1 and mentions_own and (exposure >= 100_000 or RE_CTA.search(blob)):
        return "红人·疑似", f"单条 @我方品牌、曝光 {exposure:,.0f}", 55

    if n == 1 and exposure >= 150_000:
        return "红人·疑似", f"仅 1 次但曝光 {exposure:,.0f}（爆量）", 45

    if n >= 2 and exposure >= 50_000:
        return "红人·疑似", f"出现 {n} 次、曝光 {exposure:,.0f}", 50

    if RE_BUYER.search(blob) and not mentions_own and n <= 2 and exposure < 20_000:
        return "普通用户", f"购买自述、未提品牌、曝光 {exposure:,.0f}", 55

    if not mentions_own and n <= 2 and exposure < 10_000:
        return "普通用户·疑似", f"未提品牌、低曝光 {exposure:,.0f}", 40

    return "未定", f"出现 {n} 次、曝光 {exposure:,.0f}，旁证不足", 0


def main() -> None:
    rows = load_rows()
    own = own_handles(rows)
    ext = [r for r in rows if r["内容类型"] == "被转发原帖"]

    by = collections.defaultdict(list)
    for r in ext:
        by[norm_handle(r["账号"])].append(r)

    out = []
    for h, posts in by.items():
        tier, ev, conf = classify(h, posts, own)
        out.append({
            "handle": h,
            "发布人": posts[0].get("发布人") or "",
            "tier": tier,
            "confidence": conf,
            "evidence": ev,
            "帖子数": len(posts),
            "累计曝光": int(sum(float(p.get("View数") or 0) for p in posts)),
            "示例文本": (posts[0].get("内容文本") or "").replace("\n", " ")[:80],
        })
    out.sort(key=lambda x: (-x["confidence"], -x["累计曝光"]))

    dest = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                        "data", "account_classification.csv")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8-sig", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(out[0].keys()))
        w.writeheader()
        w.writerows(out)

    total_rows = sum(x["帖子数"] for x in out)
    agg = collections.defaultdict(lambda: [0, 0])
    for x in out:
        agg[x["tier"]][0] += 1
        agg[x["tier"]][1] += x["帖子数"]

    print(f"外部账号 {len(out)} 个，覆盖 {total_rows} 行（被转发原帖）\n")
    print(f"{'分层':<14}{'账号数':>6}{'行数':>7}{'行占比':>9}")
    print("-" * 38)
    for tier, (nh, nr) in sorted(agg.items(), key=lambda kv: -kv[1][1]):
        print(f"{tier:<14}{nh:>6}{nr:>7}{nr/total_rows*100:>8.1f}%")
    print(f"\n清单已写入: {dest}")


if __name__ == "__main__":
    main()
