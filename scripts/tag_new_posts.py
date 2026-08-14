# -*- coding: utf-8 -*-
"""
用已打标旧帖当"老师"，学出 标签权重，给新帖打语义标签。
- 学习方法：lift = P(词|标签) / P(词)，只保留正向加权词（log比>0）。
- 强规则叠加：RT@→资讯转发 / 内容来源=转发；?→互动提问；sale→促销；live→直播；
  new/launch→产品发布；howto→教育科普；review/unboxing→产品展示/种草。
- 维度：
    发帖: 内容主题(multi) / 情绪风格(single) / 营销目的(single) / 内容来源(rule)
    回帖: 回帖意图(single) / 回帖关注点(single)
- 流程：学权重 → (dry-run) 校验 80/20 切分准确率 → 给未打标新帖打标 → 备份并回写。
用法：
    python3 scripts/tag_new_posts.py --dry-run     # 只学+校验，不打标
    python3 scripts/tag_new_posts.py              # 学+校验+打标+回写
"""
import json, re, math, random, argparse, shutil, os, collections

JSONP = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"

# ---------------- 停用词（保留信号词：new/off/sale/live/review/launch/tips/guide/coupon/discount/deal 等）----------------
STOP = set("""the a an and or but to of in on for with is are was were be as from by will just have has
had can get got more all out up so if do does did what when who which why how this that these those at
you your our we i my me it its they them their he she his her not no yes about now here there then than
into over under between under also can't don't won't im i'm you're we're they're its youve you've weve
www http https co com t me too very really want need know feel make made find free got one two three
us am pm via amp via use using used see saw look looking like liked love loved go going going take
taking day days night today tonight week month year time times back just right good great best ever
every each any some much many lot lots way ways thing things something anything everything world
people person man woman girl boy guys gals friend friends family home life live lived living
""".split())

# ---------------- 强规则信号词 ----------------
RULES = {
    "is_rt":     [r"\brt\s@"],                       # 转发
    "has_q":     [r"\?"],                             # 提问
    "has_sale":  [r"\b(off|sale|discount|coupon|deal|black ?friday|cyber ?monday|\d+%\s*off|promo|save)\b"],
    "has_live":  [r"\b(live|livestream|live ?show|going live)\b", r"直播"],
    "has_launch":[r"\b(new|launch|arrival|arrive|unveil|debut|drop|release|premiere|新品|发布|上新)\b"],
    "has_howto": [r"\b(how[- ]?to|tips?|guide|tutorial|lesson|learn|科普|教程|教育|知识)\b"],
    "has_review":[r"\b(review|unboxing|unbox|showcase|demo|first ?look|测评|开箱|展示)\b"],
    "has_ucc":   [r"\b(my|our|i\s|we\s|got mine|finally got|received|order)\b"],
}

def detect_rules(text):
    feats = {}
    t = text or ""
    for name, pats in RULES.items():
        feats[name] = any(re.search(p, t, re.I) for p in pats)
    return feats

TOKEN_RE = re.compile(r"[a-z0-9#]+|[一-龥]+")

def tokenize(text):
    out = []
    for w in TOKEN_RE.findall((text or "").lower()):
        if len(w) < 2: continue
        if w in STOP: continue
        out.append(w)
    return out

def item_features(item, dim):
    """构造一个 item 的特征集合（词 + 结构化特征）。"""
    feats = set()
    text = item.get("text") or ""
    for w in tokenize(text):
        feats.add("w:" + w)
    for tg in (item.get("content_tags") or []):
        tg = str(tg).strip().lower()
        if tg: feats.add("tag:" + tg)
    if item.get("category"):
        feats.add("cat:" + str(item["category"]).lower())
    if item.get("content_type"):
        feats.add("ctype:" + str(item["content_type"]).lower())
    if item.get("platform"):
        feats.add("plat:" + str(item["platform"]).lower())
    # 规则布尔特征
    r = detect_rules(text)
    for k, v in r.items():
        if v: feats.add("rule:" + k)
    # 内容来源强规则
    if r.get("is_rt") or str(item.get("content_type") or "") == "引用转发":
        feats.add("rule:is_rt")
    return feats

# ---------------- 学习 ----------------
def learn(pairs, values):
    """pairs: list of (item, label_or_labels)。返回 {value: {feature: weight}}。"""
    # 统计
    n_items = len(pairs)
    label_count = {v: 0 for v in values}
    feat_in_label = {v: collections.Counter() for v in values}
    feat_total = collections.Counter()
    for item, label in pairs:
        fs = item_features(item, None)
        labs = label if isinstance(label, list) else [label]
        for v in labs:
            if v not in values: continue
            label_count[v] += 1
            for f in fs:
                feat_in_label[v][f] += 1
                feat_total[f] += 1
    weights = {v: {} for v in values}
    for v in values:
        nl = label_count[v]
        if nl == 0: continue
        for f, c in feat_in_label[v].items():
            p_cond = c / nl
            p_marg = feat_total[f] / n_items
            if p_marg <= 0: continue
            lift = math.log((p_cond + 1e-3) / (p_marg + 1e-3))
            if lift > 0:
                weights[v][f] = lift
    return weights, label_count

def score_item(feats, weights, values):
    s = {v: 0.0 for v in values}
    for v in values:
        for f in feats:
            if f in weights[v]:
                s[v] += weights[v][f]
    return s

# ---------------- 标注 ----------------
def tag_content(item, W, majority):
    feats = item_features(item, None)
    out = {}
    # 内容主题 multi-label
    vals_t = ["产品展示","促销活动","互动提问","教育科普","UGC","资讯转发","品牌调性","产品发布","活动直播","博客内容","生活方式","种草推荐"]
    sc = score_item(feats, W["topic"], vals_t)
    # 强规则叠加
    if "rule:is_rt" in feats: sc["资讯转发"] += 10
    if "rule:has_q" in feats: sc["互动提问"] += 10
    if "rule:has_sale" in feats: sc["促销活动"] += 10
    if "rule:has_live" in feats: sc["活动直播"] += 10
    if "rule:has_launch" in feats: sc["产品发布"] += 8
    if "rule:has_howto" in feats: sc["教育科普"] += 8
    if "rule:has_review" in feats: sc["产品展示"] += 8; sc["种草推荐"] += 6
    if "rule:has_ucc" in feats: sc["UGC"] += 6
    mx = max(sc.values())
    topic = [v for v in vals_t if sc[v] >= max(0.6 * mx, 1.5)] if mx > 0 else []
    if not topic and mx > 0:
        topic = [max(sc, key=sc.get)]
    out["topic_tags"] = topic
    out["content_topic"] = "、".join(topic)
    # 情绪 single
    vals_e = ["性感","温暖","艺术感","科技感","搞笑","高级感"]
    se = score_item(feats, W["emotion"], vals_e)
    out["emotion"] = max(se, key=se.get) if max(se.values()) > 0 else (majority["emotion"] or "性感")
    out["emotion_style"] = out["emotion"]
    # 营销目的 single
    vals_m = ["用户互动","促进转化","拉新获客","品牌曝光","用户维系"]
    sm = score_item(feats, W["mkt"], vals_m)
    out["marketing_goal"] = max(sm, key=sm.get) if max(sm.values()) > 0 else (majority["mkt"] or "用户互动")
    # 内容来源 rule
    out["content_source"] = "转发" if "rule:is_rt" in feats else "原创"
    return out

def tag_voice(item, W, majority):
    feats = item_features(item, None)
    out = {}
    vals_i = ["简单互动","咨询问题","购买意向","使用反馈","吐槽不满"]
    si = score_item(feats, W["intent"], vals_i)
    out["reply_intent"] = max(si, key=si.get) if max(si.values()) > 0 else (majority["intent"] or "简单互动")
    vals_f = ["效果体验","尺寸外观","材质质量","价格","发货物流","售后"]
    sf = score_item(feats, W["focus"], vals_f)
    out["reply_focus"] = max(sf, key=sf.get) if max(sf.values()) > 0 else (majority["focus"] or "效果体验")
    return out

# ---------------- 校验 ----------------
def evaluate(pairs, values, multilabel=False, seed=42):
    random.seed(seed)
    data = list(pairs); random.shuffle(data)
    k = max(1, int(len(data) * 0.2))
    train, test = data[:-k], data[-k:]
    if not train or not test: return None
    W, _ = learn(train, values)
    maj = max(train, key=lambda x: collections.Counter(l for _, l in train).get(x[1], 0))[1] if not multilabel else None
    correct = 0; tot = 0
    jac_sum = 0
    for item, label in test:
        feats = item_features(item, None)
        sc = score_item(feats, W, values)
        if multilabel:
            mx = max(sc.values())
            pred = set(v for v in values if sc[v] >= max(0.6*mx, 1.5)) if mx > 0 else set()
            if not pred and mx > 0: pred = {max(sc, key=sc.get)}
            truth = set(label)
            inter = len(pred & truth); uni = len(pred | truth)
            jac_sum += (inter/uni if uni else 0)
            tot += 1
        else:
            pred = max(sc, key=sc.get)
            if pred == label: correct += 1
            tot += 1
    if multilabel:
        return tot, jac_sum / tot
    return tot, correct / tot

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="只学+校验，不打标回写")
    args = ap.parse_args()

    data = json.load(open(JSONP, encoding="utf-8"))
    cont = data["contents"]; voices = data["userVoices"]

    # 构造训练对（用已打标旧帖）
    topic_pairs, emo_pairs, mkt_pairs, intent_pairs, focus_pairs = [], [], [], [], []
    for c in cont:
        if c.get("topic_tags"):
            topic_pairs.append((c, c["topic_tags"]))
        if c.get("emotion"):
            emo_pairs.append((c, c["emotion"]))
        if c.get("marketing_goal"):
            mkt_pairs.append((c, c["marketing_goal"]))
    for v in voices:
        if v.get("reply_intent"):
            intent_pairs.append((v, v["reply_intent"]))
        if v.get("reply_focus"):
            focus_pairs.append((v, v["reply_focus"]))

    vals_t = ["产品展示","促销活动","互动提问","教育科普","UGC","资讯转发","品牌调性","产品发布","活动直播","博客内容","生活方式","种草推荐"]
    vals_e = ["性感","温暖","艺术感","科技感","搞笑","高级感"]
    vals_m = ["用户互动","促进转化","拉新获客","品牌曝光","用户维系"]
    vals_i = ["简单互动","咨询问题","购买意向","使用反馈","吐槽不满"]
    vals_f = ["效果体验","尺寸外观","材质质量","价格","发货物流","售后"]

    W = {}
    W["topic"], _ = learn(topic_pairs, vals_t)
    W["emotion"], _ = learn(emo_pairs, vals_e)
    W["mkt"], _ = learn(mkt_pairs, vals_m)
    W["intent"], _ = learn(intent_pairs, vals_i)
    W["focus"], _ = learn(focus_pairs, vals_f)

    majority = {
        "emotion": collections.Counter(c["emotion"] for c in cont if c.get("emotion")).most_common(1)[0][0],
        "mkt": collections.Counter(c["marketing_goal"] for c in cont if c.get("marketing_goal")).most_common(1)[0][0],
        "intent": collections.Counter(v["reply_intent"] for v in voices if v.get("reply_intent")).most_common(1)[0][0],
        "focus": collections.Counter(v["reply_focus"] for v in voices if v.get("reply_focus")).most_common(1)[0][0],
    }

    print("=== 校验（80/20 切分，测试集准确率）===")
    for name, pairs, vals, ml in [
        ("内容主题(multi-F1)", topic_pairs, vals_t, True),
        ("情绪风格", emo_pairs, vals_e, False),
        ("营销目的", mkt_pairs, vals_m, False),
        ("回帖意图", intent_pairs, vals_i, False),
        ("回帖关注点", focus_pairs, vals_f, False),
    ]:
        if len(pairs) < 20:
            print(f"  {name}: 样本不足({len(pairs)})，跳过"); continue
        res = evaluate(pairs, vals, ml)
        if res is None:
            print(f"  {name}: 切分失败"); continue
        tot, metric = res
        if ml:
            print(f"  {name}: 测试 {tot} 条, F1(Jaccard)={metric:.3f}")
        else:
            print(f"  {name}: 测试 {tot} 条, 准确率={metric:.3f}")

    if args.dry_run:
        print("\n[dry-run] 不打标，结束。")
        return

    # ---------------- 打标未打标新帖 ----------------
    n_c = n_v = 0
    for c in cont:
        if (not c.get("topic_tags")) or (not c.get("emotion")) or (not c.get("marketing_goal")):
            t = tag_content(c, W, majority)
            c["topic_tags"] = c.get("topic_tags") or t["topic_tags"]
            c["content_topic"] = c.get("content_topic") or t["content_topic"]
            c["emotion"] = c.get("emotion") or t["emotion"]
            c["emotion_style"] = c.get("emotion_style") or t["emotion_style"]
            c["marketing_goal"] = c.get("marketing_goal") or t["marketing_goal"]
            c["content_source"] = c.get("content_source") or t["content_source"]
            n_c += 1
    for v in voices:
        if (not v.get("reply_intent")) or (not v.get("reply_focus")):
            t = tag_voice(v, W, majority)
            v["reply_intent"] = v.get("reply_intent") or t["reply_intent"]
            v["reply_focus"] = v.get("reply_focus") or t["reply_focus"]
            n_v += 1

    # 备份 + 回写
    shutil.copy(JSONP, JSONP + ".bak_pre_tag")
    with open(JSONP, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"\n=== 已回写：打标发帖 {n_c} 条 / 回帖 {n_v} 条 ===")
    print("备份:", JSONP + ".bak_pre_tag")

if __name__ == "__main__":
    main()
