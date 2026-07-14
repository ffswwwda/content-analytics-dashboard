# -*- coding: utf-8 -*-
"""
用户板块数据构建器（真实 CSV 全量抽取）
========================================
输入：
  - 内容数据记录 CSV（全量 8672 发帖 + 11317 回帖）
  - 账号数据记录 CSV（品牌官方账号识别）
输出：
  - data/users_data.json —— 供前端「了解用户 / 用户讨论与语言」板块使用

设计要点：
  1. 过滤「品牌官方账号」回复（如 @TantalyGlobal / LovenseOfficial / fleshlight …），
     只保留真实用户声音。
  2. 通过「关联帖ID」把每条回帖 join 到原帖，得到用户「参与的内容形式」。
  3. 按发布人(用户)聚合画像：回复数 / 字数 / 品牌归属 / 内容形式 / 语言 / 情绪 / 意图 / 代表语录。
  4. 语料统计：词频(词云) / 语言分布 / 情绪 / 意图 / 主题。
  5. 回复字数分层、分品牌评价、分内容形式评价。
  6. 透明的「LLM 语料分析框架」+ 真实样例标注（让用户看到分析逻辑）。
"""
import csv, json, re, math
from collections import Counter, defaultdict

csv.field_size_limit(10 ** 7)

BASE = "/Users/fsw/Downloads"
CONTENT_CSV = f"{BASE}/GTM跨境社媒数据监控_内容数据记录-X.csv"
ACCOUNT_CSV = f"{BASE}/GTM跨境社媒数据监控_账号数据记录-X.csv"
OUT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/data/users_data.json"

# ---------- 工具 ----------
def to_int(s):
    try:
        return int(float(s or 0))
    except Exception:
        return 0

def words(t):
    """英文/拉丁词数（用于回复字数分层）"""
    return len(re.findall(r"[A-Za-zÀ-ÿ'][A-Za-zÀ-ÿ']*", t or ""))

STOP = set("""a an the and or but if then else of to in on at for with from by as is are was were be been being
this that these those it its it's i you he she they we me my your his her their our us them
do does did done have has had having will would can could should may might must
not no nor so than too very just also only own same s t re ve ll m d
what when where who whom whose which how why about into over under again further once
here there all any both each few more most other some such out up down off above below
am pm rt via http https co com www t co x com https t co new get got like one two
im ive dont dont can't won't id he's she's you're we're they're i'm let""".split())

# 德语特征词（用于语言识别）
DE_MARK = ["ich", "der", "die", "das", "und", "für", "mit", "gerne", "würde", "meine", "sehr",
           "nicht", "sie", "ist", "auch", "ein", "eine", "haben", "bin", "möchte", "spielzeug",
           "gefällt", "warum", "wie", "was", "bitte", "danke", "schön", "toll", "gut", "mich"]

def detect_lang(t):
    low = (t or "").lower()
    toks = re.findall(r"[a-zäöüß]+", low)
    if not toks:
        return "other"
    de = sum(1 for w in toks if w in DE_MARK)
    if de >= 2 or (de >= 1 and len(toks) <= 4):
        return "de"
    # 含西里尔/中文/日文等
    if re.search(r"[а-яА-Я]", t or ""):
        return "ru"
    if re.search(r"[一-鿿]", t or ""):
        return "zh"
    if re.search(r"[぀-ヿ]", t or ""):
        return "ja"
    return "en"

POS = ["love", "like", "great", "amazing", "awesome", "best", "perfect", "beautiful", "nice",
       "cool", "good", "wow", "excellent", "fantastic", "interested", "thanks", "thank", "fire",
       "🔥", "❤", "😍", "🥰", "赞", "好", "爱", "喜欢", "棒", "interest", "adore", "obsessed"]
NEG = ["hate", "bad", "worst", "terrible", "awful", "disappoint", "broke", "broken", "scam",
       "fake", "refund", "sucks", "poor", "useless", "差", "烂", "失望", "垃圾"]

def detect_sentiment(t):
    low = (t or "").lower()
    if any(k in low for k in NEG):
        return "neg"
    if any(k in low for k in POS):
        return "pos"
    return "neu"

# 意图分类（优先级：吐槽 > 提问 > 求购/合作 > 赞美 > 玩梗互动 > 其他）
def detect_intent(t):
    low = (t or "").lower()
    if any(k in low for k in NEG):
        return "complaint"
    if "?" in (t or "") or "？" in (t or ""):
        return "question"
    req = ["buy", "order", "shop", "dm", "dm me", "check", "want", "need", "interested",
           "where", "link", "purchase", "collab", "sponsor", "promo", "offer", "message me", "pm"]
    if any(k in low for k in req):
        return "request"
    if any(k in low for k in POS):
        return "praise"
    banter = ["lol", "lmao", "haha", "😂", "🤣", "vote", "red", "blue", "yes", "no", "🔥", "❤", "😍"]
    if any(k in low for k in banter) or words(t) <= 3:
        return "banter"
    return "other"

# ---------- 1. 读取账号表，建立品牌官方身份集合 ----------
brand_ident = set()
with open(ACCOUNT_CSV, encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        for v in (row.get("品牌"), row.get("账号名"), row.get("账号链接")):
            if v:
                brand_ident.add(v.lower().replace("@", "").replace("https://x.com/", "").strip())
# 额外已知品牌词（兜底）
brand_ident |= {"tantaly", "lovense", "fleshlight", "kiiroo", "hismith", "tenga", "lelo",
                "lovehoney", "aneros", "hotpowers", "funfactory", "svakom", "satisfyer",
                "docjohnson", "maleedge", "tracy's dog", "the handy", "realdoll", "rosemarydoll",
                "motorbunny", "dame"}

def is_brand_reply(author, brand, account_url):
    a = (author or "").lower().strip()
    if not a:
        return False
    if any(b in a for b in brand_ident):
        return True
    # 账号链接里含品牌 handle
    if account_url:
        u = account_url.lower().replace("https://x.com/", "").replace("@", "").strip()
        if u and u in a:
            return True
    return False

# ---------- 2. 读取内容 CSV，建立原帖索引 + 收集回帖 ----------
posts_by_id = {}
replies = []
with open(CONTENT_CSV, encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        if row["内容类型"] == "发帖":
            pid = row.get("内容ID") or row.get("ID")
            posts_by_id[pid] = {
                "form": row.get("发布内容形式") or "未知",
                "brand": row.get("品牌") or "",
                "topic": row.get("类目") or "",
            }
        elif row["内容类型"] == "回帖":
            replies.append(row)

print(f"读入回帖 {len(replies)}，原帖索引 {len(posts_by_id)}")

# 品牌官方回复数（用于 meta 说明）
brand_reply_count = 0
genuine = []
for r in replies:
    author = r.get("发布人") or ""
    if is_brand_reply(author, r.get("品牌"), r.get("账号")):
        brand_reply_count += 1
        continue
    if not author.strip():
        continue
    genuine.append(r)

print(f"真实用户回帖 {len(genuine)}（已过滤品牌官方回复 {brand_reply_count} 条）")

# 时间窗口：最近 365 天（从最大日期起）
dates = sorted([r["发布日期"] for r in genuine if r.get("发布日期")])
max_date = dates[-1]
window_start = None
from datetime import datetime, timedelta
try:
    md = datetime.strptime(max_date, "%Y-%m-%d")
    window_start = (md - timedelta(days=365)).strftime("%Y-%m-%d")
    genuine_win = [r for r in genuine if r.get("发布日期", "") >= window_start]
except Exception:
    genuine_win = genuine
print(f"时间窗口 {window_start} → {max_date}：窗口内真实回帖 {len(genuine_win)}")

# ---------- 3. 语料统计（整体） ----------
def corpus_stats(items):
    wf = Counter()
    lang = Counter()
    sent = Counter()
    intent = Counter()
    topic = Counter()
    form = Counter()
    for r in items:
        t = r.get("内容文本") or ""
        toks = re.findall(r"[a-zà-ÿ]+", t.lower())
        for w in toks:
            if len(w) >= 3 and w not in STOP:
                wf[w] += 1
        lang[detect_lang(t)] += 1
        sent[detect_sentiment(t)] += 1
        intent[detect_intent(t)] += 1
        topic[r.get("类目") or "未分类"] += 1
        # 参与的内容形式 = 原帖形式
        pid = r.get("关联帖ID")
        pf = posts_by_id.get(pid, {}).get("form", "未知")
        form[pf] += 1
    return {
        "wordFreq": [{"w": w, "n": n} for w, n in wf.most_common(120)],
        "lang": dict(lang.most_common()),
        "sentiment": dict(sent),
        "intent": dict(intent.most_common()),
        "topic": dict(topic.most_common(15)),
        "form": dict(form.most_common()),
        "total": len(items),
    }

corpus = corpus_stats(genuine_win)

# ---------- 3b. 语料深度分析（用户语料库分析 · 聚焦美式英语本土表达） ----------
# 研究主体 = 美国英语用户。本段把真实英文回帖按多维度量化，并抽取「本土化表达库」，
# 供人类学习地道美式说法、供 AI 作为 native-US-English 表达的训练数据（可喂 skill）。
import re as _re
EMOJI_RE = _re.compile("[\U0001F000-\U0001FAFF\u2600-\u27BF\uFE0F\u200D]")
CONTRA_RE = _re.compile(r"\b(gonna|wanna|gotta|ain'?t|don'?t|can'?t|i'?m|you'?re|i'?ve|they'?re|we'?re|he'?s|she'?s|it'?s|that'?s|i'?d|wouldn'?t|shouldn'?t|couldn'?t)\b", _re.I)
SLANG_RE = _re.compile(r"\b(literally|tbh|\bff?r\b|lowkey|highkey|kinda|sorta|\bsuper\b|totally|heck|dang|y'?all|\bbro\b|\bdude\b|\bfam\b|legit|hype|\bfire\b|\blit\b|slaps|based|no\s+cap|deadass|vibe|vibes|chill|bruh|simp|\bsus\b|flex|savage|\bmood\b|stan|petty|salty|ghosted|whipped|cancelled|\bwoke\b|snatched|\btea\b|spill|ratio|\bmid\b|bussin|rent[\s-]?free|delulu|\bong\b|\bcap\b|\bbop\b|ate\b|served|bestie|gagged|shook|periodt|goated|valid|tweakin|\bnpc\b|iykyk|baddie|thicc|boujee|basic|shade|unhinged|unbothered|gatekeep|thirsty|\bextra\b|pressed|cracked|\btuff\b|obsessed|addicted|sheesh|chef'?s\s+kiss|absolute\s+unit|built\s+different|game\s+changer|life[\s-]?changing|worth\s+it|can'?t\s+wait|no\s+joke|real\s+talk|on\s+god|hits\s+different|goes\s+crazy|my\s+wife|my\s+girl|got\s+mine|ordered\s+mine|where\s+to\s+buy|dm\s+me|link\?|10/10|she'?s\s+fine|absolute\s+legend|certified)\b", _re.I)
FILLER_RE = _re.compile(r"\b(ngl|ok\s+so|okay\s+so|so\s+like|honestly|idk|imo|imho|btw|fyi|lowk|like\s+i)\b", _re.I)
CASUAL_RE = _re.compile(r"\b(lol|lmao|haha|lmfao|smh|istg|omg|omfg|wtf|wth)\b", _re.I)
INTENS_RE = _re.compile(r"\b(so|really|very|absolutely|dead|mad|super|lowkey)\b", _re.I)
CAPS_RE = _re.compile(r"\b[A-Z]{3,}\b")
FIRSTP_RE = _re.compile(r"\b(i|my|we|our|me|us)\b", _re.I)
MARKER_NAMES = {
    "slang": "俚语 / 网感词", "emoji": "表情符号", "contraction": "口语缩略",
    "emphasis": "强调语气", "filler": "口语填充词", "casual": "轻松玩梗",
}

# ---------- 2b. 分维度深分析明细（内容主题 / 营销目的 / 情绪风格） ----------
# 供「用户讨论与语言」板块三个独立 tab 做下钻：每个维度下的情感拆分、分品牌、代表语录。
_INTENT_NAME_PY = {"praise": "赞美", "request": "求购/合作", "question": "提问", "banter": "玩梗互动", "complaint": "吐槽", "other": "其他"}
_TOPIC_NAME_PY = {
    "vibrators": "震动棒 Vibrators", "sexdoll": "实体娃娃 Sex Doll",
    "Male Masturbators": "男用杯 Male Masturbators", "sexmachine": "性爱机器 Sex Machine",
    "Anal": "肛用 Anal", "未分类": "未分类",
}
_SENT_NAME_PY = {"pos": "正面", "neu": "中性", "neg": "负面"}


def _dim_sample(t, wc, b, f, link):
    return {"text": t[:240], "wc": wc, "brand": b, "form": f,
            "lang": detect_lang(t), "sent": detect_sentiment(t),
            "intent": detect_intent(t), "link": link or ""}


def dimension_breakdowns(items):
    topic_bd = defaultdict(lambda: {"count": 0, "sents": Counter(), "brands": Counter(), "intents": Counter(), "samples": []})
    intent_bd = defaultdict(lambda: {"count": 0, "sents": Counter(), "brands": Counter(), "topics": Counter(), "samples": []})
    sent_bd = defaultdict(lambda: {"count": 0, "intents": Counter(), "brands": Counter(), "style": Counter(), "samples": []})
    for r in items:
        t = r.get("内容文本") or ""
        wc = words(t)
        b = r.get("品牌") or "未知"
        tp = r.get("类目") or "未分类"
        it = detect_intent(t)
        s = detect_sentiment(t)
        pid = r.get("关联帖ID")
        f = posts_by_id.get(pid, {}).get("form", "未知")
        topic_bd[tp]["count"] += 1; topic_bd[tp]["sents"][s] += 1; topic_bd[tp]["brands"][b] += 1; topic_bd[tp]["intents"][it] += 1
        intent_bd[it]["count"] += 1; intent_bd[it]["sents"][s] += 1; intent_bd[it]["brands"][b] += 1; intent_bd[it]["topics"][tp] += 1
        sent_bd[s]["count"] += 1; sent_bd[s]["intents"][it] += 1; sent_bd[s]["brands"][b] += 1
        # 风格标记（情绪风格维度的「风格」角度）
        sent_bd[s]["style"]["emoji"] += 1 if EMOJI_RE.search(t) else 0
        sent_bd[s]["style"]["slang"] += 1 if SLANG_RE.search(t) else 0
        sent_bd[s]["style"]["caps"] += 1 if CAPS_RE.search(t) else 0
        if wc >= 3:
            smp = _dim_sample(t, wc, b, f, r.get("回帖链接"))
            for bd, key in ((topic_bd, tp), (intent_bd, it), (sent_bd, s)):
                if len(bd[key]["samples"]) < 8:
                    bd[key]["samples"].append(smp)

    def fin_topic(d):
        return [{"key": k, "name": _TOPIC_NAME_PY.get(k, k), "count": v["count"],
                 "sentiment": dict(v["sents"]),
                 "brands": [{"b": bb, "n": nn} for bb, nn in v["brands"].most_common(8)],
                 "intents": [{"k": kk, "n": nn} for kk, nn in v["intents"].most_common(5)],
                 "samples": v["samples"]} for k, v in sorted(d.items(), key=lambda x: -x[1]["count"])]

    def fin_intent(d):
        return [{"key": k, "name": _INTENT_NAME_PY.get(k, k), "count": v["count"],
                 "sentiment": dict(v["sents"]),
                 "brands": [{"b": bb, "n": nn} for bb, nn in v["brands"].most_common(8)],
                 "topics": [{"t": _TOPIC_NAME_PY.get(tt, tt), "n": nn} for tt, nn in v["topics"].most_common(5)],
                 "samples": v["samples"]} for k, v in sorted(d.items(), key=lambda x: -x[1]["count"])]

    def fin_sent(d):
        return [{"key": k, "name": _SENT_NAME_PY.get(k, k), "count": v["count"],
                 "intents": [{"k": kk, "n": nn} for kk, nn in v["intents"].most_common(6)],
                 "brands": [{"b": bb, "n": nn} for bb, nn in v["brands"].most_common(8)],
                 "style": dict(v["style"]),
                 "samples": v["samples"]} for k, v in sorted(d.items(), key=lambda x: -x[1]["count"])]

    return {"topicBreakdown": fin_topic(topic_bd), "intentBreakdown": fin_intent(intent_bd),
            "sentimentBreakdown": fin_sent(sent_bd)}


dim_bd = dimension_breakdowns(genuine_win)

def tag_markers(text):
    """给一段英文回帖打上本土化表达标记（可多标签）。"""
    low = (text or "").lower()
    marks = set()
    if SLANG_RE.search(text or ""):
        marks.add("slang")
    if CONTRA_RE.search(text or ""):
        marks.add("contraction")
    if FILLER_RE.search(text or ""):
        marks.add("filler")
    if CASUAL_RE.search(text or ""):
        marks.add("casual")
    if EMOJI_RE.search(text or ""):
        marks.add("emoji")
    if CAPS_RE.search(text or "") or "!!" in (text or "") or "??" in (text or "") or INTENS_RE.search(low):
        marks.add("emphasis")
    return sorted(marks, key=lambda m: list(MARKER_NAMES).index(m))

en_win = [r for r in genuine_win if detect_lang(r.get("内容文本") or "") == "en"]
n_en = len(en_win)

def _has(rx, t):
    return bool(rx.search(t or ""))

style = {
    "total": n_en,
    "emojiRate": round(sum(1 for r in en_win if _has(EMOJI_RE, r.get("内容文本"))) / max(n_en, 1) * 100, 1),
    "capsRate": round(sum(1 for r in en_win if _has(CAPS_RE, r.get("内容文本"))) / max(n_en, 1) * 100, 1),
    "exclaimRate": round(sum(1 for r in en_win if "!" in (r.get("内容文本") or "")) / max(n_en, 1) * 100, 1),
    "questionRate": round(sum(1 for r in en_win if "?" in (r.get("内容文本") or "")) / max(n_en, 1) * 100, 1),
    "firstPersonRate": round(sum(1 for r in en_win if _has(FIRSTP_RE, r.get("内容文本"))) / max(n_en, 1) * 100, 1),
    "contractionRate": round(sum(1 for r in en_win if _has(CONTRA_RE, r.get("内容文本"))) / max(n_en, 1) * 100, 1),
    "emphasisRate": round(sum(1 for r in en_win if CAPS_RE.search(r.get("内容文本") or "") or "!!" in (r.get("内容文本") or "") or "??" in (r.get("内容文本") or "") or INTENS_RE.search((r.get("内容文本") or "").lower())) / max(n_en, 1) * 100, 1),
    "slangRate": round(sum(1 for r in en_win if _has(SLANG_RE, r.get("内容文本"))) / max(n_en, 1) * 100, 1),
    "avgWords": round(sum(words(r.get("内容文本") or "") for r in en_win) / max(n_en, 1), 1),
}

def ngrams(items, n):
    c = Counter()
    for r in items:
        toks = [w for w in _re.findall(r"[a-z'][a-z']*", (r.get("内容文本") or "").lower())
                if w not in STOP and len(w) >= 2]
        for i in range(len(toks) - n + 1):
            c[" ".join(toks[i:i + n])] += 1
    return [{"w": w, "n": nn} for w, nn in c.most_common(22)]

bigrams = ngrams(en_win, 2)
trigrams = ngrams(en_win, 3)

def _intent_quotes(it, k=3):
    sel = [r for r in en_win if detect_intent(r.get("内容文本")) == it]
    sel.sort(key=lambda r: -to_int(r.get("Like数")))
    return [{"text": (r.get("内容文本") or "")[:200], "likes": to_int(r.get("Like数")),
             "brand": r.get("品牌") or "", "link": r.get("回帖链接") or ""} for r in sel[:k]]

phrases_by_intent = {it: _intent_quotes(it) for it in
                     ["praise", "request", "question", "complaint", "banter", "other"]}

def _emotion_quotes(s, k=4):
    sel = [r for r in en_win if detect_sentiment(r.get("内容文本")) == s]
    sel.sort(key=lambda r: -to_int(r.get("Like数")))
    return [{"text": (r.get("内容文本") or "")[:200], "likes": to_int(r.get("Like数")),
             "brand": r.get("品牌") or "", "link": r.get("回帖链接") or ""} for r in sel[:k]]

emotion_quotes = {s: _emotion_quotes(s) for s in ["pos", "neg", "neu"]}

# 本土化表达库：按点赞排序，抽取带标记的真实美式英文回帖（去重、限长）
# 要求：去掉 @提及 / 链接 / 表情后仍有 >=4 个实词，确保是「可学习的真实句子」而非纯符号
def _clean_text(t):
    t = _re.sub(r"https?://\S+", " ", t or "")
    t = _re.sub(r"@\w+", " ", t)
    t = EMOJI_RE.sub(" ", t)
    return t

seen_txt = set()
localized = []
for r in sorted(en_win, key=lambda r: -to_int(r.get("Like数"))):
    t = r.get("内容文本") or ""
    if len(t) < 12:
        continue
    if words(_clean_text(t)) < 4:
        continue
    mk = tag_markers(t)
    if not mk:
        continue
    key = t.strip().lower()[:120]
    if key in seen_txt:
        continue
    seen_txt.add(key)
    localized.append({
        "text": t[:240], "likes": to_int(r.get("Like数")),
        "brand": r.get("品牌") or "",
        "form": posts_by_id.get(r.get("关联帖ID"), {}).get("form", "未知"),
        "intent": detect_intent(t), "sent": detect_sentiment(t),
        "markers": mk, "link": r.get("回帖链接") or r.get("主帖链接") or "",
    })
    if len(localized) >= 60:
        break

localized_by_marker = {}
for cat in MARKER_NAMES:
    localized_by_marker[cat] = [
        {**x, "text": x["text"][:160]}
        for x in localized if cat in x["markers"]
    ][:8]

corpus_analysis = {
    "style": style,
    "bigrams": bigrams,
    "trigrams": trigrams,
    "phrasesByIntent": phrases_by_intent,
    "emotionQuotes": emotion_quotes,
    "localized": localized,
    "localizedByMarker": localized_by_marker,
    "markerNames": MARKER_NAMES,
}
print(f"美式语料分析：英文回帖 {n_en} · 本土化表达库 {len(localized)} 条 · 短语 bigrams {len(bigrams)}")

# ---------- 4. 按用户聚合 ----------
users = defaultdict(lambda: {
    "replies": [], "words": 0, "brands": Counter(), "forms": Counter(),
    "langs": Counter(), "sents": Counter(), "intents": Counter(),
    "first": "9999", "last": "0000",
})
for r in genuine_win:
    author = r["发布人"].strip()
    u = users[author]
    t = r.get("内容文本") or ""
    wc = words(t)
    pid = r.get("关联帖ID")
    pf = posts_by_id.get(pid, {}).get("form", "未知")
    lang = detect_lang(t)
    sent = detect_sentiment(t)
    intent = detect_intent(t)
    u["replies"].append({
        "text": t, "likes": to_int(r.get("Like数")), "brand": r.get("品牌") or "",
        "form": pf, "lang": lang, "sent": sent, "intent": intent, "wc": wc,
        "date": r.get("发布日期") or "", "link": r.get("回帖链接") or r.get("主帖链接") or "",
    })
    u["words"] += wc
    u["brands"][r.get("品牌") or "未知"] += 1
    u["forms"][pf] += 1
    u["langs"][lang] += 1
    u["sents"][sent] += 1
    u["intents"][intent] += 1
    if r.get("发布日期", "") < u["first"]:
        u["first"] = r.get("发布日期", "")
    if r.get("发布日期", "") > u["last"]:
        u["last"] = r.get("发布日期", "")

print(f"真实唯一用户 {len(users)}")

# 转成可序列化 + 排序
user_list = []
for name, u in users.items():
    cnt = len(u["replies"])
    if cnt < 1:
        continue
    # 代表语录：按点赞取前 4，且字数>=4 优先
    samples = sorted(u["replies"], key=lambda x: (-x["likes"], -x["wc"]))[:4]
    top_brand = u["brands"].most_common(1)[0][0] if u["brands"] else ""
    brand_break = u["brands"].most_common(6)
    form_break = u["forms"].most_common(6)
    user_list.append({
        "name": name,
        "replyCount": cnt,
        "totalWords": u["words"],
        "avgWords": round(u["words"] / cnt, 1),
        "brands": [{"b": b, "n": n} for b, n in brand_break],
        "topBrand": top_brand,
        "forms": [{"f": f, "n": n} for f, n in form_break],
        "langs": dict(u["langs"]),
        "sents": dict(u["sents"]),
        "intents": dict(u["intents"]),
        "first": u["first"], "last": u["last"],
        "samples": [{"text": s["text"], "likes": s["likes"], "brand": s["brand"],
                     "form": s["form"], "lang": s["lang"], "sent": s["sent"],
                     "intent": s["intent"], "date": s["date"], "link": s["link"]} for s in samples],
    })

user_list.sort(key=lambda x: -x["replyCount"])
print(f"多帖用户（>=2）: {sum(1 for u in user_list if u['replyCount']>=2)}，取 Top {min(100, len(user_list))} 进前端")
top_users = user_list[:100]

# ---------- 5. 回复字数分层 ----------
def layer(wc):
    if wc <= 5: return "l1"      # 极短：一句话/玩梗/单选项
    if wc <= 20: return "l2"     # 短：一句完整表达
    if wc <= 50: return "l3"     # 中：一段说明
    return "l4"                   # 长：详细评价/故事

LAYER_META = {
    "l1": {"name": "极短回复 (≤5词)", "desc": "多为玩梗、单选项投票、表情、简短互动——低承诺、高频率的社区氛围信号。"},
    "l2": {"name": "短回复 (6–20词)", "desc": "一句完整表达：提问、赞美、求购意向——最具行动/意图价值的层。"},
    "l3": {"name": "中回复 (21–50词)", "desc": "一段说明或建议，含具体场景与诉求，适合做需求洞察。"},
    "l4": {"name": "长回复 (>50词)", "desc": "详细评价或使用故事，信息密度高，是深度用户与口碑来源。"},
}
layers = {k: {"meta": v, "count": 0, "sents": Counter(), "intents": Counter(),
              "brands": Counter(), "forms": Counter(), "samples": []}
          for k, v in LAYER_META.items()}
brand_layer = defaultdict(Counter)   # 品牌 -> 各层计数
form_layer = defaultdict(Counter)    # 内容形式 -> 各层计数
for r in genuine_win:
    t = r.get("内容文本") or ""
    wc = words(t)
    lk = layer(wc)
    L = layers[lk]
    L["count"] += 1
    L["sents"][detect_sentiment(t)] += 1
    L["intents"][detect_intent(t)] += 1
    b = r.get("品牌") or "未知"
    pid = r.get("关联帖ID")
    f = posts_by_id.get(pid, {}).get("form", "未知")
    L["brands"][b] += 1
    L["forms"][f] += 1
    brand_layer[b][lk] += 1
    form_layer[f][lk] += 1
    if len(L["samples"]) < 8 and wc >= 3:
        L["samples"].append({
            "text": t[:240], "wc": wc, "brand": b, "form": f,
            "lang": detect_lang(t), "sent": detect_sentiment(t),
            "intent": detect_intent(t), "link": r.get("回帖链接") or "",
        })
layered = {k: {"meta": v["meta"], "count": v["count"],
               "sentiment": dict(v["sents"]), "intent": dict(v["intents"].most_common()),
               "brands": [{"b": bb, "n": nn} for bb, nn in v["brands"].most_common(10)],
               "forms": [{"f": ff, "n": nn} for ff, nn in v["forms"].most_common(10)],
               "samples": v["samples"]} for k, v in layers.items()}

# 反向矩阵：每个品牌 / 内容形式 在各字数分层中的分布（用于总结「谁的用户爱说 / 不爱说」）
def _layer_mat(d):
    return {k: {"l1": c.get("l1", 0), "l2": c.get("l2", 0), "l3": c.get("l3", 0),
                "l4": c.get("l4", 0), "total": sum(c.values())}
            for k, c in d.items()}
layerMatrix = {"byBrand": _layer_mat(brand_layer), "byForm": _layer_mat(form_layer)}

# ---------- 6. 分品牌评价 ----------
brand_eval = defaultdict(lambda: {"replies": [], "wf": Counter(), "topic": Counter(),
                                   "lang": Counter(), "sents": Counter(), "users": Counter(),
                                   "forms": Counter(), "intents": Counter()})
for r in genuine_win:
    b = r.get("品牌") or "未知"
    be = brand_eval[b]
    t = r.get("内容文本") or ""
    be["replies"].append(r)
    be["sents"][detect_sentiment(t)] += 1
    be["lang"][detect_lang(t)] += 1
    be["topic"][r.get("类目") or "未分类"] += 1
    be["users"][r.get("发布人").strip()] += 1
    pid = r.get("关联帖ID")
    pf = posts_by_id.get(pid, {}).get("form", "未知") if pid else "未知"
    be["forms"][pf] += 1
    be["intents"][detect_intent(t)] += 1
    for w in re.findall(r"[a-zà-ÿ]+", t.lower()):
        if len(w) >= 3 and w not in STOP:
            be["wf"][w] += 1

brand_out = []
for b, be in brand_eval.items():
    rs = be["replies"]
    quotes = sorted(rs, key=lambda x: -to_int(x.get("Like数")))[:5]
    brand_out.append({
        "brand": b,
        "replyCount": len(rs),
        "sentiment": dict(be["sents"]),
        "lang": dict(be["lang"].most_common()),
        "topics": [{"t": t, "n": n} for t, n in be["topic"].most_common(6)],
        "keywords": [{"w": w, "n": n} for w, n in be["wf"].most_common(20)],
        "forms": [{"f": f, "n": n} for f, n in be["forms"].most_common(6)],
        "intents": dict(be["intents"].most_common()),
        "topUsers": [{"u": u, "n": n} for u, n in be["users"].most_common(5)],
        "quotes": [{"text": (q.get("内容文本") or "")[:240], "likes": to_int(q.get("Like数")),
                     "lang": detect_lang(q.get("内容文本")), "sent": detect_sentiment(q.get("内容文本")),
                     "link": q.get("回帖链接") or ""} for q in quotes],
    })
brand_out.sort(key=lambda x: -x["replyCount"])

# ---------- 6b. 分品牌·用户深度分析（品牌互动用户画像 + 分层 + 集中度） ----------
# 目标：品牌卡片点进去，看这个品牌下「真实用户」的一整套维度：
#   情感倾向 / 意图倾向 / 参与度(人均回复) / 互动率(人均点赞) / 字数分层 / 参与度分层 /
#   高互动用户分布(集中度) / Top 高互动用户明细 —— 并支持跨品牌对比。
def eng_layer(n):
    if n >= 10: return "heavy"    # 重度：品牌铁粉/KOC 候选
    if n >= 4:  return "active"   # 活跃：稳定参与
    if n >= 2:  return "light"    # 轻度：偶尔回来
    return "once"                 # 一次性：路人
ENG_META = {
    "heavy":  {"name": "重度用户 (≥10 次)", "desc": "对该品牌反复发声，是铁粉 / KOC 候选，最值得单独运营。"},
    "active": {"name": "活跃用户 (4–9 次)", "desc": "稳定参与者，已建立品牌认知，可培养为深度用户。"},
    "light":  {"name": "轻度用户 (2–3 次)", "desc": "偶尔回来互动，处在观望期，需内容持续触达。"},
    "once":   {"name": "一次性用户 (1 次)", "desc": "路人 / 首次接触，规模最大，是拉新与转化的入口。"},
}

def extract_keywords(text):
    """从文本提取有意义的英文关键词（>=4 字母，过滤停用词）"""
    import re
    stop = {"this", "that", "with", "from", "have", "been", "were", "they", "them",
            "their", "what", "when", "will", "would", "could", "about", "which",
            "there", "only", "also", "just", "very", "like", "really", "much",
            "more", "than", "some", "such", "does", "every", "other", "over",
            "into", "after", "your", "than"}
    ws = re.findall(r'[a-zA-Z]{4,}', text.lower())
    return [w for w in ws if w not in stop]

brand_users_agg = defaultdict(lambda: defaultdict(lambda: {
    "replies": 0, "words": 0, "likes": 0,
    "sents": Counter(), "intents": Counter(), "forms": Counter(),
    "first": "9999", "last": "0000", "samples": [],
}))
brand_wc_layers = defaultdict(Counter)   # 每品牌·回复字数分层
brand_likes = defaultdict(int)           # 每品牌·总点赞
brand_keywords = defaultdict(Counter)     # 每品牌·用户高频词
brand_topics = defaultdict(Counter)       # 每品牌·关联主题
brand_forms = defaultdict(Counter)        # 每品牌·内容形式参与
for r in genuine_win:
    b = r.get("品牌") or "未知"
    author = (r.get("发布人") or "").strip()
    if not author:
        continue
    t = r.get("内容文本") or ""
    wc = words(t)
    likes = to_int(r.get("Like数"))
    pid = r.get("关联帖ID")
    pf = posts_by_id.get(pid, {}).get("form", "未知") if pid else "未知"
    pt = posts_by_id.get(pid, {}).get("topic_tags", []) if pid else []
    brand_wc_layers[b][layer(wc)] += 1
    brand_likes[b] += likes
    brand_forms[b][pf] += 1
    for kw in extract_keywords(t): brand_keywords[b][kw] += 1
    for tg in pt: brand_topics[b][tg] += 1
    uu = brand_users_agg[b][author]
    uu["replies"] += 1
    uu["words"] += wc
    uu["likes"] += likes
    uu["sents"][detect_sentiment(t)] += 1
    uu["intents"][detect_intent(t)] += 1
    uu["forms"][pf] += 1
    d = r.get("发布日期", "")
    if d and d < uu["first"]: uu["first"] = d
    if d and d > uu["last"]:  uu["last"] = d
    if len(uu["samples"]) < 3 and wc >= 3:
        uu["samples"].append({
            "text": t[:200], "likes": likes, "lang": detect_lang(t),
            "sent": detect_sentiment(t), "intent": detect_intent(t),
            "link": r.get("回帖链接") or r.get("主帖链接") or "",
        })

brand_users_out = []
for b, umap in brand_users_agg.items():
    ulist = []
    for name, uu in umap.items():
        cnt = uu["replies"]
        ulist.append({
            "name": name, "replyCount": cnt, "totalWords": uu["words"],
            "avgWords": round(uu["words"] / cnt, 1),
            "totalLikes": uu["likes"], "avgLikes": round(uu["likes"] / cnt, 1),
            "sents": dict(uu["sents"]), "intents": dict(uu["intents"].most_common()),
            "topForm": uu["forms"].most_common(1)[0][0] if uu["forms"] else "—",
            "first": uu["first"], "last": uu["last"],
            "samples": sorted(uu["samples"], key=lambda x: -x["likes"])[:2],
        })
    ulist.sort(key=lambda x: (-x["replyCount"], -x["totalLikes"]))
    n_users = len(ulist)
    total_replies_b = sum(u["replyCount"] for u in ulist)
    multi_users = sum(1 for u in ulist if u["replyCount"] >= 2)
    eng = Counter(eng_layer(u["replyCount"]) for u in ulist)
    # 高互动用户集中度：Top10 / Top1% 用户贡献了多少比例的声量
    top10_replies = sum(u["replyCount"] for u in ulist[:10])
    k1 = max(1, round(n_users * 0.01))
    top1pct_replies = sum(u["replyCount"] for u in ulist[:k1])
    # 品牌整体情感/意图（复用 brand_out 里已算，但这里独立再给一份便于前端一处取数）
    sent_b = Counter(); intent_b = Counter()
    for u in umap.values():
        sent_b.update(u["sents"]); intent_b.update(u["intents"])
    brand_users_out.append({
        "brand": b,
        "replyCount": total_replies_b,
        "userCount": n_users,
        "multiReplyUsers": multi_users,
        "multiReplyShare": round(multi_users / max(n_users, 1) * 100, 1),
        "avgRepliesPerUser": round(total_replies_b / max(n_users, 1), 2),
        "totalLikes": brand_likes[b],
        "avgLikes": round(brand_likes[b] / max(total_replies_b, 1), 1),
        "sentiment": dict(sent_b),
        "intents": dict(intent_b.most_common()),
        "wcLayers": dict(brand_wc_layers[b]),
        "wcLayerPct": {k: round(v / max(total_replies_b, 1) * 100, 1) for k, v in brand_wc_layers[b].items()},
        "engLayers": dict(eng),
        "engLayerPct": {k: round(v / max(n_users, 1) * 100, 1) for k, v in eng.items()},
        "concentration": {
            "top10Replies": top10_replies,
            "top10Share": round(top10_replies / max(total_replies_b, 1) * 100, 1),
            "top1pctUsers": k1,
            "top1pctReplies": top1pct_replies,
            "top1pctShare": round(top1pct_replies / max(total_replies_b, 1) * 100, 1),
        },
        "topUsers": ulist[:20],
        "keywords": [{"w": w, "n": n} for w, n in brand_keywords[b].most_common(20)],
        "topics": [{"t": t, "n": n} for t, n in brand_topics[b].most_common(10)],
        "forms": [{"f": f, "n": n} for f, n in brand_forms[b].most_common(8)],
    })
brand_users_out.sort(key=lambda x: -x["replyCount"])
print(f"品牌用户深度分析：{len(brand_users_out)} 个品牌，Top 品牌 {brand_users_out[0]['brand']} "
      f"用户 {brand_users_out[0]['userCount']} 人 / 集中度Top10 {brand_users_out[0]['concentration']['top10Share']}%")

# ---------- 7. 分内容形式评价（用户参与了什么形式） ----------
form_eval = defaultdict(lambda: {"replies": [], "wf": Counter(), "sents": Counter(), "lang": Counter()})
for r in genuine_win:
    pid = r.get("关联帖ID")
    pf = posts_by_id.get(pid, {}).get("form", "未知")
    fe = form_eval[pf]
    t = r.get("内容文本") or ""
    fe["replies"].append(r)
    fe["sents"][detect_sentiment(t)] += 1
    fe["lang"][detect_lang(t)] += 1
    for w in re.findall(r"[a-zà-ÿ]+", t.lower()):
        if len(w) >= 3 and w not in STOP:
            fe["wf"][w] += 1
form_out = []
for f, fe in form_eval.items():
    rs = fe["replies"]
    quotes = sorted(rs, key=lambda x: -to_int(x.get("Like数")))[:4]
    form_out.append({
        "form": f,
        "replyCount": len(rs),
        "sentiment": dict(fe["sents"]),
        "lang": dict(fe["lang"].most_common()),
        "keywords": [{"w": w, "n": n} for w, n in fe["wf"].most_common(15)],
        "quotes": [{"text": (q.get("内容文本") or "")[:200], "likes": to_int(q.get("Like数")),
                    "brand": q.get("品牌") or "", "link": q.get("回帖链接") or ""} for q in quotes],
    })
form_out.sort(key=lambda x: -x["replyCount"])

# ---------- 8. LLM 语料分析框架（透明化）+ 真实样例 ----------
# 选 6 条覆盖多语言/多意图的真实样例做「逻辑演示」
sample_pool = sorted(genuine_win, key=lambda r: -words(r.get("内容文本") or ""))
seen_lang = set(); seen_intent = set(); demo = []
for r in sample_pool:
    t = r.get("内容文本") or ""
    if words(t) < 4:
        continue
    lg, it = detect_lang(t), detect_intent(t)
    if (lg in seen_lang and it in seen_intent):
        continue
    demo.append({
        "text": t[:220], "brand": r.get("品牌") or "",
        "lang": lg, "intent": it, "sentiment": detect_sentiment(t),
        "tokens": words(t), "likes": to_int(r.get("Like数")),
        "link": r.get("回帖链接") or "",
    })
    seen_lang.add(lg); seen_intent.add(it)
    if len(demo) >= 6:
        break

FRAMEWORK = {
    "title": "LLM 用户语料分析框架（可解释）",
    "desc": "当大模型分析一段用户语料时，并非「凭感觉」，而是沿以下 6 个维度依次打标。下面用真实回帖演示每一步的判断结果，让分析逻辑可见、可追溯。",
    "dims": [
        {"id": "lang", "name": "① 语言识别 (Language ID)",
         "logic": "正则 + 特征词判定：含德语特征词(ich/der/würde…)→de；含西里尔/中文/日文→对应语种；其余含拉丁字母→en。用于本土化与多语种运营判断。"},
        {"id": "intent", "name": "② 意图分类 (Intent)",
         "logic": "优先级链：含负面词→吐槽；含?→提问；含 buy/order/dm/collab/offer→求购合作；含正面词→赞美；含玩梗词或≤3词→互动玩梗；否则→其他。识别用户的真实诉求。"},
        {"id": "sentiment", "name": "③ 情感极性 (Sentiment)",
         "logic": "正面词表(love/great/🔥/❤/赞…)→pos；负面词表(hate/scam/broke/差…)→neg；其余→neu。量化口碑倾向。"},
        {"id": "topic", "name": "④ 主题/实体抽取 (Topic & Entity)",
         "logic": "从原帖类目与回帖提及的品牌/产品名抽取主题与实体，回答「用户在讨论哪个品牌/什么话题」。"},
        {"id": "engage", "name": "⑤ 互动信号 (Engagement)",
         "logic": "结合点赞数、回复字数、参与度，判断该声音的传播力与用户投入度。"},
        {"id": "form", "name": "⑥ 内容形式关联 (Content-form linkage)",
         "logic": "通过关联帖ID join 原帖，得到用户「参与的是视频/图片/纯文本/投票」，回答「什么形式更能撬动用户表达」。"},
    ],
    "demo": demo,
}

# ---------- 9. 可浏览语料样本（按点赞取 Top 250 真实回帖） ----------
corpus_samples = sorted(genuine_win, key=lambda r: -to_int(r.get("Like数")))[:250]
corpus_samples = [{
    "text": (r.get("内容文本") or "")[:260],
    "likes": to_int(r.get("Like数")),
    "brand": r.get("品牌") or "",
    "form": posts_by_id.get(r.get("关联帖ID"), {}).get("form", "未知"),
    "lang": detect_lang(r.get("内容文本")),
    "sent": detect_sentiment(r.get("内容文本")),
    "intent": detect_intent(r.get("内容文本")),
    "markers": tag_markers(r.get("内容文本")),
    "date": r.get("发布日期") or "",
    "link": r.get("回帖链接") or r.get("主帖链接") or "",
} for r in corpus_samples]

# ---------- 10. 组装输出 ----------
out = {
    "meta": {
        "built_at": max_date + "T00:00:00",
        "window": [window_start, max_date],
        "total_replies": len(replies),
        "brand_reply_filtered": brand_reply_count,
        "genuine_replies": len(genuine),
        "genuine_replies_in_window": len(genuine_win),
        "genuine_users": len(users),
        "multi_reply_users": sum(1 for u in user_list if u["replyCount"] >= 2),
        "eng_meta": ENG_META,
        "source": "real",
    },
    "corpus": corpus,
    "topUsers": top_users,
    "layers": layered,
    "layerMatrix": layerMatrix,
    "brandEval": brand_out,
    "brandUsers": brand_users_out,
    "formEval": form_out,
    "framework": FRAMEWORK,
    "corpusAnalysis": corpus_analysis,
    "corpusSamples": corpus_samples,
    "dimBreakdown": dim_bd,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"已写出 {OUT}  ({OUT})")
print("语料语言分布:", corpus["lang"])
print("语料意图分布:", corpus["intent"])
print("字数分层:", {k: v["count"] for k, v in layered.items()})
