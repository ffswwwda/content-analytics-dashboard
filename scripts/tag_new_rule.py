# -*- coding: utf-8 -*-
"""
规则粗打标（无模型）：给未打标新帖补语义标签。
- 内容来源: RT@ / 引用转发 → 转发，否则 原创（高置信）。
- 内容主题: 仅强规则明显命中才打（促销/直播/互动提问/产品发布/资讯转发/产品展示/种草），不命中留空。
- 情绪/营销目的/回帖意图/回帖关注点: 规则最佳猜 + 多数类兜底（低置信）。
- 凡本脚本动过的帖，打 needs_llm_tag=True，供后续真模型精修时直接定位。
用法: python3 scripts/tag_new_rule.py
"""
import json, re, shutil, collections, argparse

JSONP = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/content_data.json"

# ---------- 规则 ----------
RX = {
    "rt":        re.compile(r"\brt\s@|转自|转发自", re.I),
    "sale":      re.compile(r"\b(sale|discount|coupon|deal|promo|black ?friday|cyber ?monday|\d+%\s*off|on sale|off sale|clearance|save\b|降价|折扣|优惠|特价)\b", re.I),
    "live":      re.compile(r"\b(live|livestream|live ?show|going live|直播)\b", re.I),
    "q":         re.compile(r"\?|你们觉得|你怎么看|投票|poll", re.I),
    "launch":    re.compile(r"\b(new|launch|arrival|unveil|debut|release|premiere|new drop|product drop|新品|发布|上新|首发的|全新)\b", re.I),
    "review":    re.compile(r"\b(review|unboxing|unbox|showcase|demo|first ?look|测评|开箱|展示|实拍)\b", re.I),
    "recommend": re.compile(r"\b(must[- ]?have|recommend|worth|best|top|种草|安利|推荐)\b", re.I),
    "ucc":       re.compile(r"\b(my|our|i\s|we\s|got mine|finally got|received|order|mine|我的|入手|收到)\b", re.I),
    # 情绪
    "e_sexy":    re.compile(r"\b(sexy|hot|body|naked|nude|fuck|dick|pussy|cum|orgasm|sensual|erotic|性感|身材|诱惑)\b", re.I),
    "e_warm":    re.compile(r"\b(love|care|together|family|sweet|hug|relationship|heart|温暖|陪伴|爱|温馨)\b", re.I),
    "e_art":     re.compile(r"\b(art|aesthetic|beautiful|elegant|artistic|design|艺术|美学|唯美)\b", re.I),
    "e_tech":    re.compile(r"\b(tech|smart|app|bluetooth|innovation|device|engineering|科技|智能|黑科技)\b", re.I),
    "e_funny":   re.compile(r"\b(lol|lmao|funny|haha|joke|meme|搞笑|笑死|梗)\b", re.I),
    "e_lux":     re.compile(r"\b(luxury|premium|exclusive|sophisticated|high[- ]?end|高级|轻奢|奢华)\b", re.I),
    # 营销目的
    "m_conv":    re.compile(r"\b(shop|buy|order|store|link|discount|sale|% off|下单|购买|抢购|商城)\b", re.I),
    "m_inter":   re.compile(r"\?|poll|comment|tell us|what do you think|vote|投票|评论|聊聊|你觉得", re.I),
    "m_acq":     re.compile(r"\b(follow|subscribe|sign up|new|免费|关注|订阅|注册|加入)\b", re.I),
    "m_expo":    re.compile(r"\b(rt\s@|news|announcement|brand|品牌|官宣|资讯)\b", re.I),
    "m_retain":  re.compile(r"\b(thank|community|member|loyal|感谢|社群|会员|老粉)\b", re.I),
    # 回帖意图
    "i_chat":    re.compile(r"\b(thanks|lol|love|nice|cute|cool|amazing|🔥|❤|😍|thanks)\b", re.I),
    "i_ask":     re.compile(r"\?|how|what|where|can you|does it|wondering|how to|怎么|在哪|能|吗", re.I),
    "i_buy":     re.compile(r"\b(buy|purchase|where to|price|get one|order|多少钱|哪里买|入手|购买)", re.I),
    "i_feed":    re.compile(r"\b(tried|used|mine|experience|review|works|用了|体验|测评|上手)", re.I),
    "i_bad":     re.compile(r"\b(hate|worst|broken|disappointed|refund|scam|垃圾|差评|退货|坑)\b", re.I),
    # 回帖关注点
    "f_effect":  re.compile(r"\b(feel|experience|orgasm|sensation|感觉|体验|效果)\b", re.I),
    "f_size":    re.compile(r"\b(size|big|small|length|look|color|尺寸|大小|外观|颜色)\b", re.I),
    "f_material":re.compile(r"\b(material|quality|silicone|texture|durable|材质|质量|硅胶|手感)\b", re.I),
    "f_price":   re.compile(r"\b(price|cheap|expensive|cost|deal|价格|便宜|贵|划算)\b", re.I),
    "f_ship":    re.compile(r"\b(shipping|delivery|arrive|tracking|物流|发货|快递|到货)\b", re.I),
    "f_after":   re.compile(r"\b(return|refund|warranty|customer service|售后|退换|保修|客服)\b", re.I),
}

def has(item, key):
    t = (item.get("text") or "")
    return bool(RX[key].search(t))

def tag_content(c, maj):
    touched = False
    # 内容来源（高置信）
    if not c.get("content_source"):
        c["content_source"] = "转发" if (has(c, "rt") or str(c.get("content_type") or "") == "引用转发") else "原创"
        touched = True
    # 内容主题（仅强规则命中）
    if not c.get("topic_tags"):
        topics = []
        if has(c, "sale"): topics.append("促销活动")
        if has(c, "live"): topics.append("活动直播")
        if has(c, "q"): topics.append("互动提问")
        if has(c, "launch"): topics.append("产品发布")
        if has(c, "rt") or str(c.get("content_type") or "") == "引用转发": topics.append("资讯转发")
        if has(c, "review"): topics.append("产品展示")
        if has(c, "recommend"): topics.append("种草推荐")
        if has(c, "ucc"): topics.append("UGC")
        if topics:
            c["topic_tags"] = topics
            c["content_topic"] = "、".join(topics)
            touched = True
    # 情绪（规则+多数类兜底，低置信）
    if not c.get("emotion"):
        e = None
        for k, v in [("e_sexy","性感"),("e_warm","温暖"),("e_art","艺术感"),("e_tech","科技感"),("e_funny","搞笑"),("e_lux","高级感")]:
            if has(c, k): e = v; break
        c["emotion"] = e or maj["emotion"]
        c["emotion_style"] = c["emotion"]
        touched = True
    # 营销目的（规则+多数类兜底，低置信）
    if not c.get("marketing_goal"):
        m = None
        for k, v in [("m_conv","促进转化"),("m_inter","用户互动"),("m_acq","拉新获客"),("m_expo","品牌曝光"),("m_retain","用户维系")]:
            if has(c, k): m = v; break
        c["marketing_goal"] = m or maj["mkt"]
        touched = True
    if touched:
        c["needs_llm_tag"] = True
    return touched

def tag_voice(v, maj):
    touched = False
    if not v.get("reply_intent"):
        i = None
        for k, val in [("i_ask","咨询问题"),("i_buy","购买意向"),("i_feed","使用反馈"),("i_bad","吐槽不满"),("i_chat","简单互动")]:
            if has(v, k): i = val; break
        v["reply_intent"] = i or maj["intent"]
        touched = True
    if not v.get("reply_focus"):
        f = None
        for k, val in [("f_effect","效果体验"),("f_size","尺寸外观"),("f_material","材质质量"),("f_price","价格"),("f_ship","发货物流"),("f_after","售后")]:
            if has(v, k): f = val; break
        v["reply_focus"] = f or maj["focus"]
        touched = True
    if touched:
        v["needs_llm_tag"] = True
    return touched

def main():
    data = json.load(open(JSONP, encoding="utf-8"))
    cont = data["contents"]; voices = data["userVoices"]
    maj = {
        "emotion": collections.Counter(c["emotion"] for c in cont if c.get("emotion")).most_common(1)[0][0],
        "mkt": collections.Counter(c["marketing_goal"] for c in cont if c.get("marketing_goal")).most_common(1)[0][0],
        "intent": collections.Counter(v["reply_intent"] for v in voices if v.get("reply_intent")).most_common(1)[0][0],
        "focus": collections.Counter(v["reply_focus"] for v in voices if v.get("reply_focus")).most_common(1)[0][0],
    }
    print("多数类兜底:", maj)

    n_c = sum(1 for c in cont if tag_content(c, maj))
    n_v = sum(1 for v in voices if tag_voice(v, maj))

    # 统计覆盖率
    def cov(items, keys):
        return {k: sum(1 for it in items if it.get(k)) for k in keys}
    print("\n=== 打标后 发帖 覆盖 ===")
    for k, n in cov(cont, ["content_source","topic_tags","emotion","marketing_goal"]).items():
        print(f"  {k}: {n}/{len(cont)}")
    print("=== 打标后 回帖 覆盖 ===")
    for k, n in cov(voices, ["reply_intent","reply_focus"]).items():
        print(f"  {k}: {n}/{len(voices)}")
    print(f"\nneeds_llm_tag 标记: 发帖 {sum(1 for c in cont if c.get('needs_llm_tag'))} / 回帖 {sum(1 for v in voices if v.get('needs_llm_tag'))}")

    shutil.copy(JSONP, JSONP + ".bak_pre_rule_tag")
    with open(JSONP, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print("\n已回写。备份:", JSONP + ".bak_pre_rule_tag")

if __name__ == "__main__":
    main()
