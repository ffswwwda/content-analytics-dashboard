/* ============ 内容灵感台 · 交互核心 ============ */
(function () {
  "use strict";
  const A = window.Analysis;

  const BX_COVERS = [
    "assets/blindbox/7660891523756442137.jpeg",
    "assets/blindbox/7660891533562937881.jpeg",
    "assets/blindbox/7660891536582918681.jpeg",
    "assets/blindbox/7660891536674882073.jpeg",
    "assets/blindbox/7660891548142338585.jpeg",
    "assets/blindbox/7660891564692324889.jpeg",
    "assets/blindbox/7660892096980075032.jpeg",
    "assets/blindbox/7660892111152316952.jpeg",
    "assets/blindbox/7660892142163952152.jpeg",
    "assets/blindbox/7660892155783168536.jpeg",
    "assets/blindbox/7660892156965749272.jpeg",
    "assets/blindbox/7660892160233243160.jpeg",
    "assets/blindbox/7660892167707181592.jpeg",
    "assets/blindbox/7660892167707542040.jpeg",
    "assets/blindbox/7660892203489215000.jpeg",
    "assets/blindbox/7660892407396352536.jpeg",
    "assets/blindbox/7660892425938600472.jpeg",
    "assets/blindbox/7660892460130632216.jpeg",
    "assets/blindbox/7660892461292028440.jpeg",
    "assets/blindbox/7660892461292093976.jpeg",
    "assets/blindbox/7660892472964383256.jpeg",
    "assets/blindbox/7660892472964416024.jpeg",
    "assets/blindbox/7660892616780202520.jpeg",
    "assets/blindbox/7660892635414708760.jpeg",
    "assets/blindbox/7660892645459984920.jpeg",
    "assets/blindbox/7660892669597450776.jpeg",
    "assets/blindbox/7660892693865710104.jpeg",
    "assets/blindbox/7660892693865775640.jpeg",
    "assets/blindbox/7660893159552467518.jpeg",
    "assets/blindbox/7660893175251550782.jpeg",
    "assets/blindbox/7660893194028958270.jpeg",
    "assets/blindbox/7660893207764828734.jpeg",
    "assets/blindbox/7660893230975943230.jpeg",
    "assets/blindbox/7660893402670973502.jpeg",
    "assets/blindbox/7660893425907024446.jpeg",
    "assets/blindbox/7660893425907221054.jpeg",
    "assets/blindbox/7660893444260414014.jpeg",
    "assets/blindbox/7660893471356027454.jpeg",
    "assets/blindbox/7660893589829075518.jpeg",
    "assets/blindbox/7660893591338549822.jpeg",
    "assets/blindbox/7660893608652866110.jpeg",
    "assets/blindbox/7660893608652997182.jpeg",
    "assets/blindbox/7660893646320910910.jpeg",
  ];

  /* ---------- 板块定义 ---------- */
  const ICON = {
    library: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor"/>',
    top: '<path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" fill="currentColor"/>',
    viral: '<path d="M12 2c1 4-3 5-3 9a3 3 0 0 0 6 0c0-1.5-1-2.5-1-4 2 1.5 3 3.5 3 6a6 6 0 1 1-12 0c0-5 4-7 7-11z" fill="currentColor"/>',
    freq: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    roi: '<path d="M3 17l6-6 4 4 8-8M21 7v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    campaign: '<path d="M5 21V4h11l-2 4 2 4H5" fill="currentColor"/>',
    predictor: '<path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4zM18 14l.9 2.3L21 17l-2.1.7L18 20l-.9-2.3L15 17l2.1-.7z" fill="currentColor"/>',
    insights: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.3-1 2.5H9c0-1.2-.3-1.8-1-2.5A6 6 0 0 1 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    dimensions: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    blindbox: '<path d="M4 9h16v11H4zM2 9l2-5h16l2 5M12 4v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    reference: '<path d="M12 3a6 6 0 0 1 4 10.5c-.7.7-1 1.3-1 2.5h-6c0-1.2-.3-1.8-1-2.5A6 6 0 0 1 12 3zM10 21h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    myops: '<path d="M5 21V4h12l-2 4 2 4H5" fill="currentColor"/>',
    uservoice: '<path d="M4 5h16v11H8l-4 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    platform: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/>',
    competitor: '<path d="M4 21V6l8-3 8 3v15M9 21v-6h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  };
  const BOARDS = [
    // —— 灵感/分析 ——
    { id: "library", name: "灵感库", group: "灵感/分析", level: 1, desc: "全部内容灵感库。随机浏览打破茧房，指标模式支持排序、原创/转发筛选、只看爆款。点卡片看详情。" },
    { id: "reference", name: "评估想法 / 找参考", group: "灵感/分析", level: 1, desc: "两个方向：①评估想法——输入内容想法，左侧即时评估、右侧输出多维度结果；②找参考——没想法有目的时，输入目的，右侧推荐匹配灵感内容。" },
    { id: "viraldeep", name: "爆款内容深度分析", group: "灵感/分析", level: 1, desc: "跨所有品牌的爆款内容共性研究：什么品牌/形式/情绪/主题/时段最容易出爆款？纯数据驱动，一键看清爆款配方。" },
    // —— 看竞品情况 ——
    { id: "competitor", name: "竞品内容监测", group: "看竞品情况", level: 1, desc: "选择单竞品 → 深度查看（整体数据 + 内容排序列表 + 形式/数据筛选 + 用户评价 + 运营节奏×表现 + Campaign 爆发监测）；也可看全部竞品排名。" },
    { id: "compare", name: "多竞品横向对比", group: "看竞品情况", level: 2, desc: "勾选多个品牌横向对比：数据表现 + Top3 内容 + 用户情况，全面看标杆与差距。" },
    // —— 了解用户 ——
    { id: "branduser", name: "品牌-用户讨论", group: "了解用户", level: 2, desc: "分品牌查看用户对该品牌的讨论：情感极性、内容形式、用户倾向、高频词与主题、代表语录——全面看每个品牌的用户声音。可点进品牌看品牌互动用户深度分析（用户词云、主题排序、分层占比、跨品牌对比）。" },
    { id: "userseg", name: "高互动用户", group: "了解用户", level: 2, desc: "窗口内回复数最高的活跃用户排行——研究「单个深度用户」：他是谁、活跃周期、品牌归属、语言模式、参与形式、情感/意图倾向、全部代表语录。支持展开深度画像、跨品牌用户对比。" },
    { id: "usertier", name: "用户分层分析", group: "了解用户", level: 2, desc: "按「回复字数」和「参与度」将用户分层——不是研究单个用户，而是研究「某一类用户」的整体特征：他们关注什么品牌、聊什么话题、情绪倾向如何、偏好什么内容形式。每层可下钻看细节，支持四层横向对比。" },
    { id: "uservoice", name: "用户语料分析", group: "了解用户", level: 1, desc: "基于用户语料的深度分析：情绪倾向、语言风格、词频、美式本土化表达、分内容形式——学习美国用户的表达与话题讨论方式。" },
    // —— 我方运营 ——
    { id: "myops", name: "我方运营", group: "我方运营", level: 1, desc: "选一个或多个竞品 → 勾选要参考的维度（节奏 / 选题 / 形式 / 风格 / 指标）→ 生成可执行的运营方案，支持导出。" },
  ];
  const boardDesc = (id) => (BOARDS.find((b) => b.id === id) || {}).desc || "";

  /* ============ 各板块「数据来源 / 公式计算」配置 ============
     每个指标标注来源类型与准确率评估：
       type: source   源数据直接填（xlsx 字段 1:1 拷贝，已对账零偏差）
             frontend 前端根据源数据计算（公开公式，可溯源）
             ai       AI 计算 / 预测（非精确值）
             combined 综合（源数据 + 前端/AI 组合）
       acc:  100 → 准确率达标（绿）；否则标红（未达 100%）
  */
  const PROV_TYPES = {
    source:   { label: "源数据直接填", color: "#2ee6d6" },
    frontend: { label: "前端计算",     color: "#7cb0ff" },
    ai:       { label: "AI 计算",      color: "#c084fc" },
    combined: { label: "综合",         color: "#fbbf24" },
  };
  const BOARD_PROVENANCE = {
    library: {
      tip: "灵感库所有指标均来自源表真实字段或其确定性派生；卡片上的「爆款指数」进度条为前端相对百分比（非源字段）。",
      metrics: [
        { name: "曝光", type: "source", acc: 100, formula: "源表「View数」列，脚本 to_int 直拷，无任何重算。" },
        { name: "互动", type: "source", acc: 100, formula: "源表 Like数+Reply数+Repost数+Bookmark数，逐列直拷后求和（已核对 3719 条零偏差）。" },
        { name: "综合/点赞/评论/转发/收藏率", type: "source", acc: 100, formula: "源表「综合互动率/点赞率/评论率/传播率/收藏率」列真实值，前端优先采用、绝不重算。" },
        { name: "爆款指数", type: "source", acc: 100, formula: "源表「爆款内容指数」列（0–100 绝对值），公式=综合互动率×0.4+点赞率×0.3+评论率×0.2+传播率×0.1。" },
        { name: "全库百分位排名", type: "frontend", acc: 100, formula: "由爆款指数全库降序排名派生：前X%/后10% 分档 + 超越X% 帖子（computeViralRanks）。" },
        { name: "爆款标识 isTop", type: "combined", acc: 100, formula: "综合判定：① 源表「爆款指数TOP10%」且曝光≥1000；② 或曝光进入全库Top10%（阈值21675）。避免低曝光（如几十）的率值噪声被误判为爆款。合计 486 条。" },
        { name: "类目/平台/形式/情绪风格/营销目的/内容来源", type: "source", acc: 100, formula: "源表对应列 1:1 直拷。" },
        { name: "发布时间 / 星期 / 时段", type: "frontend", acc: 100, formula: "由源表「发布时间」解析出 publishDate / weekDay / publishHour。" },
        { name: "ROI（千次曝光互动）", type: "frontend", acc: 100, formula: "互动数 ÷ 曝光 × 1000，输入均为源真实值。" },
        { name: "卡片「爆款指数」进度条", type: "frontend", acc: 100, formula: "viralScore ÷ 全库最大值 × 100，仅表示相对位置（非源字段，已与爆款指数区分展示）。" },
      ],
    },
    reference: {
      tip: "评估想法为前端算法 + 历史源数据匹配；找参考匹配内容全部来自源真实字段。",
      metrics: [
        { name: "评估想法 · 匹配逻辑", type: "frontend", acc: 100, formula: "基于输入文本对全量内容逐条计算「相关度」（0-100 分），规则：①主题/内容标签/活动标签命中（权重最高）；②情绪命中；③形式命中；④关键词词组/同义词命中（含同义词扩展 map：促销↔打折↔大促、实测↔测评、开箱↔新品等）；⑤内容原始文本/中文译文/类目/内容主题多字段联合检索；⑥最终按相关度降序取 Top 8。" },
        { name: "评估想法 · 计分公式", type: "frontend", acc: 100, formula: "主题命中 + 情绪命中 + 形式命中 + 活动标签 + 关键词词组 + 爆款加成 = 总分（上限 100 分）。其中关键词先做同义词扩展（synonymMap），再用扩展词集匹配库中所有主题/情绪/形式/目的/平台/活动标签的枚举词表。" },
        { name: "评估想法 · 匹配内容统计", type: "frontend", acc: 100, formula: "从全库筛选出相关度 >0 的内容，统计条数/爆款占比/活动占比/平均爆款指数/平均曝光/平均各互动值；用户风评从关联帖的 userVoices 真实回帖聚合（sentiment / reply_intent / reply_focus）。" },
        { name: "评估想法 · 爆款指数预测分", type: "frontend", acc: 100, formula: "由历史匹配内容的平均爆款指数、主题/情绪历史爆款指数、活动占比、关键词命中数加权估算。" },
        { name: "找参考 · 匹配逻辑", type: "frontend", acc: 100, formula: "分两步：①目的预设匹配——点击「常用目的」自动设置情绪/形式/目的维度，按双向包含关系（contains 函数）匹配内容真实字段（双向：A 含 B 或 B 含 A，解决词表错位问题）；②自定义文本匹配——对输入文本做中文 2/3 字滑动窗口去停用词切词（extractKeywords），每条内容合并在 9 个字段（原文本/中文译文/类目/内容主题/内容标签/营销目的/来源/内容形式/情绪/平台）中逐一检索；③任取 ≥2 字命中即加分；④支持关闭不需要的匹配维度（形式/主题/情绪/关键词等）。" },
        { name: "找参考 · 相关性指标", type: "frontend", acc: 100, formula: "每条匹配内容 0-100 分 = 目的预设命中（情绪 22 + 形式 16 + 目的 20 + 来源 8）+ 关键词命中（上限 36 分，含粗识别 2 字子串）+ 主题契合（上限 16）+ 情感/形式/平台关键词命中（各 6-8）+ 表现加成（爆款 20，高表现 12，一般 6）。5 档：极≥90 / 高≥70 / 中≥50 / 低≥30 / 极低<30。" },
      ],
    },
    viraldeep: {
      tip: "爆款共性由 isTop 内容聚合源字段得到，全部准确率 100%。",
      metrics: [
        { name: "爆款共性（品牌/形式/情绪/主题/时段分布）", type: "frontend", acc: 100, formula: "对 isTop 爆款内容按各维度聚合计数（源字段分组）。" },
        { name: "平均爆款指数 / 各互动率", type: "frontend", acc: 100, formula: "爆款组 vs 普通组分组均值（源真实字段）。" },
        { name: "内容主题 / 情绪关键词", type: "frontend", acc: 100, formula: "爆款内容文本词频聚合（源字段）。" },
      ],
    },
    competitor: {
      tip: "竞品监测整体数据、用户评价、运营节奏均为源字段聚合或确定性派生，准确率 100%。",
      metrics: [
        { name: "整体数据（曝光/互动/各率）", type: "source", acc: 100, formula: "源表字段对该竞品内容聚合求和/均值。" },
        { name: "内容排序列表", type: "frontend", acc: 100, formula: "按爆款指数降序排列（源真实值）。" },
        { name: "形式 / 数据筛选", type: "source", acc: 100, formula: "源表形式/类目等字段直接过滤。" },
        { name: "用户评价（回帖）", type: "source", acc: 100, formula: "源表 userVoices（按关联帖ID 挂接，6793/6793 命中）。" },
        { name: "运营节奏 × 表现", type: "frontend", acc: 100, formula: "按发布时段分组聚合表现指标（源字段）。" },
        { name: "Campaign 爆发监测", type: "frontend", acc: 100, formula: "按时间窗口聚合互动增量，识别爆发点（源字段）。" },
      ],
    },
    compare: {
      tip: "多竞品横向对比改用真实指标矩阵（16 项）：曝光/互动/互动率/爆款指数/爆款占比/点赞·评论·转发·收藏率/用户讨论/正面情绪/原创占比等，全部来自源字段聚合。源数据为空或未采集的字段（粉丝数、品牌回复数、评论质量、平均回复时长）一律不再展示，避免误导。",
      metrics: [
        { name: "数据表现矩阵（均值/占比）", type: "frontend", acc: 100, formula: "各品牌源字段分组均值/占比后横向对比，每行高亮最优品牌。" },
        { name: "爆款指数 / 爆款占比(Top10%)", type: "source", acc: 100, formula: "爆款指数=源表「爆款内容指数」均值；爆款占比=is_top 内容数 ÷ 该品牌内容数（源真实标签）。" },
        { name: "点赞/评论/转发/收藏率", type: "source", acc: 100, formula: "源表 like_rate/comment_rate/repost_rate/collect_rate 均值（真实百分比）。" },
        { name: "用户讨论量 / 正面情绪占比", type: "source", acc: 100, formula: "该品牌回帖数（userVoices 聚合）与正面 sentiment 占比（源字段）。" },
        { name: "Top3 内容", type: "frontend", acc: 100, formula: "各品牌按爆款指数排序取前 3（源真实值）。" },
        { name: "主力形式/情绪/类目/营销目的", type: "frontend", acc: 100, formula: "该品牌内容按频次聚合得到的主导维度（源字段）。" },
      ],
    },
    uservoice: {
      tip: "用户语料分析由回帖（userVoices）聚合得到；美式本土化表达为规则/模型提取，准确率有限已标黄。",
      metrics: [
        { name: "情绪倾向", type: "frontend", acc: 100, formula: "回帖 emotion 字段聚合分布（源字段）。" },
        { name: "语言风格", type: "frontend", acc: 100, formula: "回帖文本特征聚合（源字段）。" },
        { name: "词频 / 高频词", type: "frontend", acc: 100, formula: "回帖文本分词词频统计（源字段）。" },
        { name: "美式本土化表达", type: "combined", acc: "≈", flag: true, formula: "基于本土表达词库/模型从回帖提取。", note: "提取规则有限，覆盖率非 100%。" },
        { name: "分内容形式分布", type: "frontend", acc: 100, formula: "回帖按内容形式分组聚合（源字段）。" },
      ],
    },
    branduser: {
      tip: "品牌-用户讨论各项指标均来自回帖聚合或原文，准确率 100%。",
      metrics: [
        { name: "情感极性", type: "frontend", acc: 100, formula: "该品牌回帖 emotion 聚合（源字段）。" },
        { name: "内容形式 / 用户倾向", type: "frontend", acc: 100, formula: "回帖形式/倾向分布聚合（源字段）。" },
        { name: "高频词与主题", type: "frontend", acc: 100, formula: "回帖文本词频/主题聚合（源字段）。" },
        { name: "代表语录", type: "source", acc: 100, formula: "源表回帖原文直接引用。" },
        { name: "品牌互动用户深度（词云/主题排序/分层占比）", type: "frontend", acc: 100, formula: "对该品牌互动用户聚合（源字段）。" },
      ],
    },
    usertier: {
      tip: "用户分层为前端分组规则，每层特征由源字段聚合，准确率 100%。",
      metrics: [
        { name: "用户分层（回复字数 / 参与度）", type: "frontend", acc: 100, formula: "按回复数、回复字数阈值将用户分层的确定性规则。" },
        { name: "每层特征（品牌/话题/情绪/形式）", type: "frontend", acc: 100, formula: "各层用户回帖聚合（源字段）。" },
      ],
    },
    userseg: {
      tip: "高互动用户排行与画像均来自回帖聚合或原文，准确率 100%。",
      metrics: [
        { name: "用户排行（回复数）", type: "frontend", acc: 100, formula: "按窗口内回复数降序排序（源字段计数）。" },
        { name: "用户画像（活跃周期/品牌归属/语言/情感/意图）", type: "frontend", acc: 100, formula: "该用户全部回帖聚合（源字段）。" },
        { name: "代表语录", type: "source", acc: 100, formula: "源表该用户回帖原文直接引用。" },
      ],
    },
    myops: {
      tip: "我方运营方案由 AI 生成（结合源数据与用户选择的维度），准确率非 100% 已标红；所引用的维度数据来自源字段。",
      metrics: [
        { name: "运营方案（节奏/选题/形式/风格/指标）", type: "ai", acc: "AI", flag: true, formula: "大模型结合源数据 + 用户勾选维度生成可执行方案。", note: "AI 生成内容，非精确值，准确率 < 100%。" },
        { name: "参考维度数据", type: "combined", acc: 100, formula: "所引用的节奏/选题/形式/风格数据来自源字段聚合。" },
      ],
    },
  };

  /* ---------- 状态 ---------- */
  const state = {
    raw: null, analysis: null, maxViral: 1, board: "library", insights: null,
    lang: (function () { try { return localStorage.getItem("ca_lang") || "en"; } catch (e) { return "en"; } })(),
    filters: { search: "", accounts: new Set(), category: new Set(), platforms: new Set(), types: new Set(), topics: new Set(), emotions: new Set(), goals: new Set(), sources: new Set(), viralMin: 0, dateFrom: "", dateTo: "", topOnly: false },
    sort: "viral", view: "grid",
    topThreshold: 0,
    freqMode: "week",
    roiSort: "rate",
    campaignSort: "lift",
    detailId: null, predictor: null,
    dim: "brand", dimBrands: new Set(), topicWeights: { viral: 35, eng: 25, rec: 20, cov: 20 },
    blindbox: null, bxSeed: null, refMode: "eval", maxExposure: 1,
    users: null, uvTab: "corpus", uvCorpusQ: "", uvRankAll: false, uvLocMarker: "all", uvCorpusMarker: "all", uvLayerDrill: null, uvLayerCmp: false, uvDeep: false, uvSegDeep: false, uvDrillMeta: null,
    brandUserSel: null, brandUserCmp: [], brandUserCompare: false, brandUserRankAll: false,
    libMode: "sort", libQuick: "all", libSource: "all", sortExpanded: false,
    vdDim: "account",
    page: 0, pageSize: 100, randList: null, randVisible: 100, randLoading: false,
    compSel: new Set(), cmpSel: new Set(),
    compFilters: { types: new Set(), sort: "viral", viralMin: 0, topOnly: false, mode: "all" },
    deepId: null, deepCompare: [], deepView: "main",
    opsBrands: [], opsRefs: new Set(["rhythm", "topic", "format", "style", "metric"]),
  };

  const FACETS = [
    { key: "accounts", label: "账号", field: "account" },
    { key: "category", label: "类目", field: "category" },
    { key: "platforms", label: "平台", field: "platform" },
    { key: "types", label: "形式", field: "contentType" },
    { key: "topics", label: "内容主题", field: "topicTags", multi: true },
    { key: "emotions", label: "情绪风格", field: "emotion_style", multi: true },
    { key: "goals", label: "营销目的", field: "marketing_goal", multi: true },
    { key: "sources", label: "内容来源", field: "content_source" },
  ];

  /* ---------- 工具 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* 中/EN 内容切换：导航中文不动，仅帖子/回复正文在 英文原文 ↔ 中文翻译 间切换。
     中文翻译字段约定为 text_zh（用户后续在原始数据补充）；缺失时回退英文原文。 */
  const dispText = (item) => (state.lang === "zh" && item && (item.text_zh || item.translation) ? (item.text_zh || item.translation) : (item ? item.text : ""));
  const dispVoice = (v) => (state.lang === "zh" && v && (v.text_zh || v.translation) ? (v.text_zh || v.translation) : (v ? v.text : ""));
  const fmt = (n) => (n >= 10000 ? (n / 10000).toFixed(1) + "万" : String(Math.round(n)));
  const rate = (c) => Math.max(0, Math.min(100, Math.round((c.viralScore / state.maxViral) * 100)));
  // 活动帖判定：优先用 is_activity 真值；否则从 topic_tags/content_topic/文本关键词推断
  function isActivityPost(c) {
    if (c.is_activity) return true;
    const topics = ((c.topic_tags || []).join(" ") + " " + (c.content_topic || "")).toLowerCase();
    const text = ((c.text || "") + " " + (c.text_zh || "")).toLowerCase();
    const activityTags = ["促销活动", "活动直播"];
    const activityKeywords = ["促销", "活动", "优惠", "折扣", "抽奖", "giveaway", "sale", "discount", "promo", "campaign"];
    return activityTags.some((t) => topics.includes(t)) || activityKeywords.some((k) => text.includes(k));
  }
  // 爆款指数在全库的百分位排名：tier=前10%/20%/.../100%（10%分档），surpass=超越多少%的帖子
  function computeViralRanks(contents) {
    const desc = [...contents].sort((a, b) => b.viralScore - a.viralScore);
    const total = desc.length || 1;
    let rank = 0;
    desc.forEach((c, i) => {
      if (i === 0 || c.viralScore !== desc[i - 1].viralScore) rank = i + 1;
      const surpass = Math.round((total - rank) / total * 100);
      const tier = Math.min(10, Math.max(1, Math.ceil((100 - surpass) / 10)));
      c.viralRank = rank;
      c.viralSurpass = surpass;
      c.viralTier = tier;
    });
  }
  function viralTierLabel(c) {
    const tier = c.viralTier || 10;
    const sur = c.viralSurpass != null ? c.viralSurpass : 0;
    const hot = tier === 1 ? ' style="color:var(--hot);font-weight:700"' : "";
    const band = tier === 10 ? "后10%" : `前${tier * 10}%`;
    return `<span${hot}>${band} · 超越${sur}%</span>`;
  }
  function trendSpark(data, color, width = 120, height = 34) {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    const area = data.map((v, i) => {
      const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ") + ` ${width},${height} 0,${height}`;
    return `<svg width="${width}" height="${height}" class="trend-spark"><defs><linearGradient id="grad-${color.replace(/#/g, '')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${color}" stop-opacity="0.35"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><polygon points="${area}" fill="url(#grad-${color.replace(/#/g, '')})"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function trendSectionHTML(c) {
    const ts = c.timeseries;
    if (!ts) return { html: "", has: false };
    const days = ["D0", "D1", "D2", "D7"];
    const metrics = [
      { key: "view", label: "曝光", color: "#0ef" },
      { key: "like", label: "点赞", color: "#ff5d8f" },
      { key: "reply", label: "评论", color: "#a855f7" },
      { key: "repost", label: "转发", color: "#22c55e" },
      { key: "bookmark", label: "收藏", color: "#f59e0b" },
    ];
    const rows = metrics.map((m) => {
      const values = days.map((d) => (ts[d] && ts[d][m.key]) ? ts[d][m.key] : 0);
      const total = values.reduce((a, b) => a + b, 0);
      if (total === 0) return "";
      const spark = trendSpark(values, m.color);
      const lastVal = values[values.length - 1];
      const firstVal = values[0];
      const growth = firstVal > 0 ? Math.round(((lastVal - firstVal) / firstVal) * 100) : (lastVal > 0 ? 100 : 0);
      const growthStr = growth >= 0 ? `+${growth}%` : `${growth}%`;
      return `<div class="trend-row"><div class="trend-meta"><span class="trend-dot" style="background:${m.color}"></span><span class="trend-label">${m.label}</span><span class="trend-val">${fmt(lastVal)}</span><span class="trend-growth ${growth >= 0 ? "up" : "down"}">${growthStr}</span></div>${spark}</div>`;
    }).filter(Boolean).join("");
    return { html: rows ? `<div class="dp-trend-grid">${rows}</div>` : "", has: !!rows };
  }
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 1900); }

  /* ---------- 筛选 ---------- */
  function facetMatch(c, fc, set) {
    if (!set.size) return true;
    const v = c[fc.field];
    if (v == null || v === "") return false;
    if (Array.isArray(v)) return v.some((x) => set.has(x));
    if (fc.multi) return String(v).split(/[、,，/]/).map((x) => x.trim()).filter(Boolean).some((x) => set.has(x));
    return set.has(v);
  }
  function getFiltered() {
    const f = state.filters;
    return state.analysis.contents.filter((c) => {
      if (f.search && !c.text.toLowerCase().includes(f.search.toLowerCase())) return false;
      for (const fc of FACETS) {
        if (!facetMatch(c, fc, f[fc.key])) return false;
      }
      if (f.topOnly && !c.isTop) return false;
      if (rate(c) < f.viralMin) return false;
      if (f.dateFrom && c.publishDate < f.dateFrom) return false;
      if (f.dateTo && c.publishDate > f.dateTo) return false;
      return true;
    });
  }
  function activeFilterCount() {
    const f = state.filters; let n = 0;
    FACETS.forEach((fc) => { n += f[fc.key].size; });
    if (f.viralMin > 0) n++; if (f.dateFrom || f.dateTo) n++; if (f.topOnly) n++;
    return n;
  }

  /* ============ 渲染：导航 ============ */
  function renderNav() {
    const nav = $("#nav");
    const groups = [];
    BOARDS.forEach((b) => { if (!groups.includes(b.group)) groups.push(b.group); });
    nav.innerHTML = groups.map((g) => {
      const items = BOARDS.filter((b) => b.group === g).map((b) => {
        const badge = b.id === "top" ? `<span class="nav-badge">${state.analysis.overview.topCount}</span>` : "";
        const active = state.board === b.id ? " active" : "";
        // 所有菜单项同一层级：统一小圆点 + 统一缩进，不再有伪三级缩进
        return `<div class="nav-item${active}" data-board="${b.id}">
          <span class="nav-mark"></span>
          <span class="nav-label">${b.name}</span>${badge}</div>`;
      }).join("");
      return `<div class="nav-group-label">${g}</div>${items}`;
    }).join("");
    $$(".nav-item", nav).forEach((el) => el.addEventListener("click", () => switchBoard(el.dataset.board)));
  }

  /* ============ 渲染：筛选项 ============ */
  function renderFilterPanel() {
    const wrap = $("#fp-facets");
    wrap.innerHTML = FACETS.map((fc) => {
      const values = distinctValues(fc);
      return `<div class="fp-facet"><div class="fp-facet-label">${fc.label}</div><div class="fp-chips" data-facet="${fc.key}">
        ${values.map((v) => `<span class="chip" data-val="${esc(v)}">${esc(v)}</span>`).join("")}
      </div></div>`;
    }).join("");
    $$(".chip", wrap).forEach((chip) => {
      chip.addEventListener("click", () => {
        const key = chip.parentElement.dataset.facet;
        const val = chip.dataset.val;
        const set = state.filters[key];
        set.has(val) ? set.delete(val) : set.add(val);
        chip.classList.toggle("on");
        onFilterChange();
      });
    });
  }
  function distinctValues(fc) {
    const all = state.analysis.contents;
    const set = new Set();
    all.forEach((c) => {
      const v = c[fc.field];
      if (v == null || v === "") return;
      if (Array.isArray(v)) v.forEach((x) => x && set.add(x));
      else if (fc.multi) String(v).split(/[、,，/]/).map((x) => x.trim()).filter(Boolean).forEach((x) => set.add(x));
      else set.add(v);
    });
    return Array.from(set).sort();
  }
  function syncFilterUI() {
    $$(".fp-chips").forEach((box) => {
      const key = box.dataset.facet;
      $$(".chip", box).forEach((chip) => chip.classList.toggle("on", state.filters[key].has(chip.dataset.val)));
    });
    $("#viral-min").value = state.filters.viralMin;
    $("#viral-min-val").textContent = state.filters.viralMin;
    $("#date-from").value = state.filters.dateFrom;
    $("#date-to").value = state.filters.dateTo;
    $("#top-only").checked = state.filters.topOnly;
    const cnt = activeFilterCount();
    const fc = $("#filter-count");
    fc.textContent = cnt || "";
    fc.classList.toggle("show", cnt > 0);
  }
  function renderActiveFilters() {
    const box = $("#active-filters");
    const f = state.filters; const pills = [];
    FACETS.forEach((fc) => f[fc.key].forEach((v) => pills.push({ label: `${fc.label}：${v}`, key: fc.key, val: v })));
    if (f.viralMin > 0) pills.push({ label: `爆款指数 ≥ ${f.viralMin}`, kind: "viralMin" });
    if (f.topOnly) pills.push({ label: "只看爆款", kind: "topOnly" });
    if (f.dateFrom || f.dateTo) pills.push({ label: `时间 ${f.dateFrom || "…"}~${f.dateTo || "…"}`, kind: "date" });
    if (!pills.length) { box.innerHTML = ""; return; }
    box.innerHTML = pills.map((p, i) => `<span class="af-pill" data-i="${i}">${esc(p.label)}<button data-rm="${i}">×</button></span>`).join("") +
      `<button class="af-clear" data-clear="1">清除全部</button>`;
    box._pills = pills;
    $$("[data-rm]", box).forEach((b) => b.addEventListener("click", () => {
      const p = box._pills[+b.dataset.rm];
      if (p.kind === "viralMin") state.filters.viralMin = 0;
      else if (p.kind === "topOnly") state.filters.topOnly = false;
      else if (p.kind === "date") { state.filters.dateFrom = ""; state.filters.dateTo = ""; }
      else state.filters[p.key].delete(p.val);
      onFilterChange();
    }));
    $("[data-clear]", box).addEventListener("click", () => {
      FACETS.forEach((fc) => state.filters[fc.key].clear());
      state.filters.viralMin = 0; state.filters.topOnly = false; state.filters.dateFrom = ""; state.filters.dateTo = "";
      onFilterChange();
    });
  }
  function onFilterChange() { state.page = 0; state.randList = null; syncFilterUI(); renderActiveFilters(); renderBoard(); }

  /* ============ 板块切换 ============ */
  function switchBoard(id) {
    state.board = id;
    state.uvLayerDrill = null; state.uvLayerCmp = false;
    renderNav();
    renderBoard();
    $("#board").scrollTop = 0;
  }

  /* ============ 渲染：板块分发 ============ */
  function renderBoard() {
    const b = BOARDS.find((x) => x.id === state.board);
    $("#board-title").textContent = b.name;
    $("#board-sub").textContent = "";
    const data = getFiltered();
    let html = "";
    switch (state.board) {
      case "library": html = renderLibrary(data); break;
      case "reference": html = renderReference(); break;
      case "competitor": html = renderCompetitorLib(); break;
      case "compare": html = renderCompareBoard(); break;
      case "viraldeep": html = renderViralDeep(); break;
      case "uservoice": html = renderUserBoard(); break;
      case "branduser": html = renderBrandUser(); break;
      case "usertier": html = renderUserTier(); break;
      case "userseg": html = renderUserSeg(); break;
      case "myops": html = renderMyOps(); break;
    }
    $("#board").innerHTML = html;
    bindBoard(data);
    syncRandFloat();
  }

  /* ---------- 灵感库（随机浏览 + 指标排序 + 只看爆款 + 原创/转发筛选）---------- */
  function renderLibrary(data) {
    // 只看爆款/类型ROI已合并简化：若旧状态残留则重置
    if (state.libQuick === "roi") state.libQuick = "all";
    if (state.sort === "roi") state.sort = "viral";
    // 应用范围与来源筛选（随机模式追求纯粹，不生效）
    let base = [...data];
    if (state.libMode !== "rand" && state.libQuick === "top") base = base.filter((c) => c.isTop);
    if (state.libMode !== "rand" && state.libSource !== "all") base = base.filter((c) => (c.content_source || "") === state.libSource);
    // —— 随机模式：全量洗牌后滚动加载，不限制条数 ——
    let list;
    if (state.libMode === "rand") {
      if (!state.randList) { state.randList = sampleN(base, base.length); state.randVisible = 100; }
      list = state.randList;
    } else {
      state.randList = null;
      list = sortContents(base, state.sort);
    }
    const PAGE = state.pageSize;
    const total = list.length;
    let pageItems, totalPages, page;
    if (state.libMode === "rand") {
      pageItems = list.slice(0, state.randVisible);
      totalPages = 1;
      page = 0;
    } else {
      totalPages = Math.max(1, Math.ceil(total / PAGE));
      page = Math.min(Math.max(0, state.page), totalPages - 1);
      state.page = page;
      pageItems = list.slice(page * PAGE, (page + 1) * PAGE); // 只渲染当前页，避免 8k+ DOM 节点
    }
    const allSorts = [
      { key: "viral", label: "爆款指数" },
      { key: "compositeRate", label: "综合互动率" },
      { key: "exposure", label: "曝光" },
      { key: "likeRate", label: "点赞率" },
      { key: "commentRate", label: "评论率" },
      { key: "shareRate", label: "转发率" },
      { key: "collectRate", label: "收藏率" },
      { key: "date", label: "时间排序" },
    ];
    const visibleSorts = state.sortExpanded ? allSorts : allSorts.slice(0, 3);
    const sortChips = visibleSorts.map((s) => `<button data-sort="${s.key}" class="${state.sort === s.key ? "on" : ""}">${s.label}</button>`).join("");
    const sortTools = state.libMode === "rand"
      ? ""
      : `<div class="lib-group"><span class="lib-group-label">来源</span>
          <div class="seg" id="lib-source">
            <button data-source="all" class="${state.libSource === "all" ? "on" : ""}">全部</button>
            <button data-source="原创" class="${state.libSource === "原创" ? "on" : ""}">原创</button>
            <button data-source="转发" class="${state.libSource === "转发" ? "on" : ""}">转发</button>
          </div>
        </div>
        <div class="lib-group"><span class="lib-group-label">排序</span>
          <div class="seg" id="sort-chips">
            ${sortChips}
            <button class="sort-more" id="sort-more">${state.sortExpanded ? "收起 ▴" : "更多 ▾"}</button>
          </div>
        </div>
        <div class="seg" id="view-seg">
          <button data-view="grid" class="${state.view === "grid" ? "on" : ""}">卡片</button>
          <button data-view="list" class="${state.view === "list" ? "on" : ""}">列表</button>
        </div>`;
    const topBtn = `<button id="lib-top-toggle" class="btn-pill${state.libQuick === "top" ? " on" : ""}" title="只看爆款">🔥 ${state.libQuick === "top" ? "已开" : "只看爆款"}</button>`;
    const tools = `<div class="board-tools" style="flex-wrap:wrap">
      <div class="seg" id="lib-mode">
        <button data-mode="rand" class="${state.libMode === "rand" ? "on" : ""}">🎲 随机浏览</button>
        <button data-mode="sort" class="${state.libMode === "sort" ? "on" : ""}">📊 指标排序</button>
      </div>
      ${topBtn}
      ${sortTools}
      <button class="bx-launch" id="bx-launch" title="每日灵感盲盒">
        <svg viewBox="0 0 24 24" class="ic" style="width:18px;height:18px"><rect x="3" y="8" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 8h20M12 8V3m0 0c-1.5 0-2.5 1-2.5 2.5S10.5 8 12 8s2.5-1 2.5-2.5S13.5 3 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        每日灵感盲盒
      </button>
    </div>`;
    const head = `<div class="board-head"><div class="board-desc">${boardDesc("library")}<br><b style="color:var(--accent-strong)">${data.length}</b> 条内容；当前显示 ${total} 条。</div>${tools}</div>`;
    if (!list.length) return head + emptyState();
    const body = state.view === "grid" ? `<div class="grid">${pageItems.map(cardHTML).join("")}</div>` : pageItems.map(listHTML).join("");
    const pager = state.libMode === "rand"
      ? (state.randVisible < total
          ? `<div class="load-more-hint" style="text-align:center;padding:16px 0;color:var(--text-3);font-size:12px">向下滚动继续加载…</div>`
          : `<div class="load-more-hint" style="text-align:center;padding:16px 0;color:var(--text-3);font-size:12px">已加载全部 ${total} 条</div>`)
      : (total > PAGE ? paginationHTML(page, totalPages, total, PAGE) : "");
    const randFloat = state.libMode === "rand"
      ? `<div class="rand-float"><button data-action="rerand"><span class="rf-ic">🎲</span> 重新随机一批</button></div>`
      : "";
    return head + body + pager + randFloat;
  }
  function paginationHTML(page, totalPages, total, PAGE) {
    const from = page * PAGE + 1;
    const to = Math.min((page + 1) * PAGE, total);
    const cur = page + 1;
    const nums = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      const start = Math.max(2, cur - 1), end = Math.min(totalPages - 1, cur + 1);
      if (start > 2) nums.push("…");
      for (let i = start; i <= end; i++) nums.push(i);
      if (end < totalPages - 1) nums.push("…");
      nums.push(totalPages);
    }
    const pageBtns = nums.map((n) => n === "…" ? `<span class="pg-ellipsis">…</span>` : `<button class="pg-num${n === cur ? " on" : ""}" data-pg="${n - 1}">${n}</button>`).join("");
    return `<div class="pager">
      <button class="pg-btn" data-pg="prev" ${page === 0 ? "disabled" : ""}>‹ 上一页</button>
      <div class="pg-nums">${pageBtns}</div>
      <button class="pg-btn" data-pg="next" ${page >= totalPages - 1 ? "disabled" : ""}>下一页 ›</button>
      <span class="pg-info">${from}–${to} / 共 ${total} 条</span>
      <span class="pg-jump">每页<select id="pg-size">${[100, 200, 500].map((n) => `<option value="${n}"${n === PAGE ? " selected" : ""}>${n}</option>`).join("")}</select>条</span>
    </div>`;
  }
  function sortContents(data, mode) {
    const a = [...data];
    if (mode === "viral") a.sort((x, y) => y.viralScore - x.viralScore);
    else if (mode === "date") a.sort((x, y) => y.publish_time.localeCompare(x.publish_time));
    else if (mode === "exposure") a.sort((x, y) => y.exposure - x.exposure);
    else if (mode === "compositeRate") a.sort((x, y) => y.engagementRate - x.engagementRate);
    else if (mode === "likeRate") a.sort((x, y) => y.likeRate - x.likeRate);
    else if (mode === "commentRate") a.sort((x, y) => y.commentRate - x.commentRate);
    else if (mode === "shareRate") a.sort((x, y) => y.shareRate - x.shareRate);
    else if (mode === "collectRate") a.sort((x, y) => y.collectRate - x.collectRate);
    return a;
  }
  function cardHTML(c) {
    const hashtags = (c.content_tags && c.content_tags.length) ? c.content_tags.slice(0, 4).map((t) => `<span class="tag hashtag">#${esc(t)}</span>`).join("") : "";
    return `<div class="card" data-id="${c.id}">
      <div class="card-top">
        ${c.isTop ? '<span class="badge-top">爆款</span>' : ""}
        ${c.isActivity ? `<span class="badge-act">${esc(c.activityTag)}</span>` : ""}
        <span class="tag" data-facet="accounts" data-val="${esc(c.account)}">${esc(c.account)}</span>
        <span class="tag" data-facet="types" data-val="${esc(c.contentType)}">${esc(c.contentType)}</span>
      </div>
      <div class="card-text">${esc(dispText(c))}</div>
      <div class="card-meta">${c.topicTags.map((t) => `<span class="tag topic" data-facet="topics" data-val="${esc(t)}">${esc(t)}</span>`).join("")}</div>
      ${hashtags ? `<div class="card-meta">${hashtags}</div>` : ""}
      <div class="card-meta"><span>${esc(c.platform)}</span><span class="dot"></span><span>${c.publishDate}</span><span class="dot"></span><span>${esc(c.emotion)}</span></div>
      <div class="card-score"><span class="score-num">${rate(c)}<small>/100</small></span><div class="score-bar"><i style="width:${rate(c)}%"></i></div></div>
    </div>`;
  }
  function listHTML(c) {
    return `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${c.publishDate}</div></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
      <div class="lr-num">${fmt(c.engagement)}<small>互动</small></div>
      <div><div class="lr-num">${rate(c)}<small>爆款指数</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
    </div>`;
  }

  /* ---------- 高表现内容 ---------- */
  function renderTop(data) {
    const ranked = [...data].sort((a, b) => b.viralScore - a.viralScore).filter((c) => rate(c) >= state.topThreshold);
    const tools = `<div class="board-tools"><div class="fp-range-group"><label>爆款指数 ≥</label>
      <input type="range" id="top-threshold" min="0" max="100" value="${state.topThreshold}" step="1" style="width:110px;accent-color:var(--hot)">
      <span class="range-val" id="top-threshold-val" style="color:var(--hot)">${state.topThreshold}</span></div></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[1].desc}<br>当前显示 <b style="color:var(--hot)">${ranked.length}</b> 条头部内容（门槛 ${state.topThreshold}）。</div>${tools}</div>`;
    if (!ranked.length) return head + emptyState();
    return head + ranked.map((c, i) => `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${i < 3 ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
      <div class="lr-num">${fmt(c.engagement)}<small>互动</small></div>
      <div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款指数</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
    </div>`).join("");
  }

  /* ---------- 爆款识别 ---------- */
  function renderViral(data) {
    const top = data.filter((c) => c.isTop);
    const normal = data.filter((c) => !c.isTop);
    const vc = state.analysis.viralCommonalities;
    const avg = (arr, k) => arr.length ? arr.reduce((s, i) => s + i[k], 0) / arr.length : 0;
    const cmp = (k) => `${avg(top, k).toFixed(1)} <small>vs 普通 ${avg(normal, k).toFixed(1)}</small>`;
    const statRow = `<div class="stat-row">
      <div class="stat"><div class="stat-label">爆款数量 (Top 10%)</div><div class="stat-val">${top.length}<small> / ${data.length}</small></div></div>
      <div class="stat"><div class="stat-label">平均曝光</div><div class="stat-val">${fmt(avg(top, "exposure"))}</div><div class="stat-foot">普通 ${fmt(avg(normal, "exposure"))}</div></div>
      <div class="stat"><div class="stat-label">平均互动率</div><div class="stat-val">${avg(top, "engagementRate").toFixed(2)}<small>%</small></div><div class="stat-foot">普通 ${avg(normal, "engagementRate").toFixed(2)}%</div></div>
      <div class="stat"><div class="stat-label">平均爆款指数</div><div class="stat-val" style="color:var(--hot)">${top.length ? rate(top[0]) : 0}</div><div class="stat-foot">头部基准</div></div>
    </div>`;
    const commonHTML = (arr, label) => {
      if (!arr || !arr.length) return "";
      const max = Math.max(...arr.map((x) => x.count));
      return `<div class="panel"><div class="panel-title">${label}</div><div class="panel-sub">爆款内容在这些维度上的集中分布</div>
        ${arr.slice(0, 6).map((x) => `<div class="qc-bar"><span class="qc-name">${esc(x.name)}</span><span class="qc-track"><i style="width:${(x.count / max) * 100}%"></i></span><span class="qc-val">${x.count}</span></div>`).join("")}
      </div>`;
    };
    const commons = `<div class="insight-grid">
      ${commonHTML(vc.contentType, "形式分布")}
      ${commonHTML(vc.topicTags, "主题分布")}
      ${commonHTML(vc.emotion, "情绪分布")}
      ${commonHTML(vc.activityTag && vc.activityTag.filter((x) => x.name !== "无"), "活动标签")}
    </div>`;
    const list = top.sort((a, b) => b.viralScore - a.viralScore).map((c, i) => `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${c.topicTags.join("/")}</div></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
      <div class="lr-num">${fmt(c.engagement)}<small>互动</small></div>
      <div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款指数</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
    </div>`).join("");
    return `<div class="board-head"><div class="board-desc">${BOARDS[2].desc}</div></div>${statRow}${commons}
      <div class="panel" style="margin-top:16px"><div class="panel-title">爆款清单（按爆款指数排序）</div><div class="panel-sub">点击查看详情与可复用的爆款特征</div>${list}</div>`;
  }

  /* ---------- 频率 × 表现 ---------- */
  function renderFreq(data) {
    const tools = `<div class="board-tools"><div class="seg" id="freq-seg">
      <button data-mode="week" class="${state.freqMode === "week" ? "on" : ""}">按周</button>
      <button data-mode="form" class="${state.freqMode === "form" ? "on" : ""}">按形式</button></div></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[3].desc} 当前筛选 <b>${data.length}</b> 条内容。</div>${tools}</div>`;
    if (state.freqMode === "week") {
      const weeks = aggregateWeeks(data);
      return head + `<div class="panel"><div class="panel-title">每周发布频率 vs 平均爆款指数</div><div class="panel-sub">柱=当周发布数（左轴） · 线=当周平均爆款指数（右轴 0-100）</div>${comboSVG(weeks)}</div>
        <div class="panel"><div class="panel-title">周明细</div>${weeks.map((w) => `<div class="rank-row"><div class="rank-main"><div class="rank-name">${w.label}</div><div class="rank-sub">发布 ${w.count} 条</div></div><div class="rank-right"><div class="rank-val">${w.avgRate}<small> 爆款指数</small></div><div class="rank-track"><i style="width:${w.avgRate}%"></i></div></div></div>`).join("")}</div>`;
    } else {
      const byType = state.analysis.contentTypeROI.map((t) => {
        const items = data.filter((c) => c.contentType === t.type);
        const weeks = new Set(items.map((c) => c.publishDate.slice(0, 7))).size || 1;
        return { type: t.type, freq: items.length / weeks, rate: rate(items.sort((a, b) => b.viralScore - a.viralScore)[0] || { viralScore: 0 }), avgRate: items.length ? Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length) : 0, count: items.length };
      }).filter((x) => x.count);
      const maxF = Math.max(...byType.map((x) => x.freq), 1);
      return head + `<div class="panel"><div class="panel-title">各形式：发布频率 vs 平均爆款指数</div><div class="panel-sub">频率=该形式平均每周发布条数</div>
        ${byType.sort((a, b) => b.avgRate - a.avgRate).map((x) => `<div class="rank-row"><div class="rank-main"><div class="rank-name">${esc(x.type)}</div><div class="rank-sub">${x.count} 条 · ${x.freq.toFixed(1)} 条/周</div></div><div class="rank-right"><div class="rank-val">${x.avgRate}<small> 爆款指数</small></div><div class="rank-track"><i style="width:${x.avgRate}%"></i></div></div></div>`).join("")}</div>`;
    }
  }
  function aggregateWeeks(data) {
    const map = new Map();
    data.forEach((c) => {
      const d = new Date(c.publishDate);
      const diff = (d.getDay() + 6) % 7;
      const ws = new Date(d); ws.setDate(d.getDate() - diff);
      const key = ws.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(c);
    });
    return Array.from(map.entries()).sort().map(([k, arr]) => ({
      label: k.slice(5), count: arr.length, avgRate: Math.round(arr.reduce((s, c) => s + rate(c), 0) / arr.length),
    }));
  }
  function comboSVG(weeks) {
    const W = 720, H = 260, pL = 40, pR = 40, pT = 16, pB = 30;
    const iw = W - pL - pR, ih = H - pT - pB;
    const maxC = Math.max(...weeks.map((w) => w.count), 1);
    const bw = (iw / weeks.length) * 0.62;
    const x = (i) => pL + (iw / weeks.length) * i + (iw / weeks.length - bw) / 2;
    const yBar = (c) => pT + ih - (c / maxC) * ih;
    const yLine = (r) => pT + ih - (r / 100) * ih;
    const bars = weeks.map((w, i) => `<rect x="${x(i)}" y="${yBar(w.count)}" width="${bw}" height="${pT + ih - yBar(w.count)}" rx="3" fill="#c9d8ff"/>`).join("");
    const pts = weeks.map((w, i) => `${pL + (iw / weeks.length) * i + (iw / weeks.length) / 2},${yLine(w.avgRate)}`).join(" ");
    const labels = weeks.map((w, i) => `<text x="${pL + (iw / weeks.length) * i + (iw / weeks.length) / 2}" y="${H - 8}" font-size="9" fill="#9099a5" text-anchor="middle">${w.label}</text>`).join("");
    const grid = [0, 25, 50, 75, 100].map((g) => `<line x1="${pL}" y1="${yLine(g)}" x2="${W - pR}" y2="${yLine(g)}" stroke="#eef0f3" stroke-width="1"/><text x="${W - pR + 4}" y="${yLine(g) + 3}" font-size="9" fill="#b8bfca">${g}</text>`).join("");
    const dots = weeks.map((w, i) => `<circle cx="${pL + (iw / weeks.length) * i + (iw / weeks.length) / 2}" cy="${yLine(w.avgRate)}" r="3" fill="#2f6bff"/>`).join("");
    return `<svg class="freq-chart" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">${grid}${bars}<polyline points="${pts}" fill="none" stroke="#2f6bff" stroke-width="2"/>${dots}${labels}</svg>`;
  }

  /* ---------- 类型 ROI ---------- */
  function renderRoi(data) {
    const rows = state.analysis.contentTypeROI.map((t) => {
      const items = data.filter((c) => c.contentType === t.type);
      return { ...t, rate: items.length ? Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length) : 0, realCount: items.length };
    }).filter((x) => x.realCount);
    const sorted = [...rows].sort((a, b) => b[state.roiSort === "rate" ? "rate" : state.roiSort === "eng" ? "avgEngagementRate" : "avgExposure"] - a[state.roiSort === "rate" ? "rate" : state.roiSort === "eng" ? "avgEngagementRate" : "avgExposure"]);
    const maxR = Math.max(...sorted.map((r) => r.rate), 1);
    const tools = `<div class="board-tools"><select class="sel" id="roi-sel">
      <option value="rate"${state.roiSort === "rate" ? " selected" : ""}>按爆款指数</option>
      <option value="eng"${state.roiSort === "eng" ? " selected" : ""}>按互动率</option>
      <option value="exp"${state.roiSort === "exp" ? " selected" : ""}>按曝光</option></select></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[4].desc} 当前筛选命中 <b>${data.length}</b> 条。</div>${tools}</div>`;
    return head + `<div class="panel"><div class="panel-title">内容形式 ROI 排行</div><div class="panel-sub">爆款指数=该形式内容的平均相对爆款指数（0-100）</div>
      ${sorted.map((r, i) => `<div class="rank-row"><div class="rank-no${i === 0 ? " top" : ""}">${i + 1}</div>
        <div class="rank-main"><div class="rank-name">${esc(r.type)}</div><div class="rank-sub">${r.realCount} 条 · 平均曝光 ${fmt(r.avgExposure)} · 互动率 ${r.avgEngagementRate.toFixed(2)}%</div></div>
        <div class="rank-right"><div class="rank-val">${r.rate}<small> 爆款指数</small></div><div class="rank-track"><i style="width:${(r.rate / maxR) * 100}%"></i></div></div></div>`).join("")}</div>`;
  }

  /* ---------- Campaign 监测 ---------- */
  function renderCampaign(data) {
    const map = new Map();
    data.filter((c) => c.isActivity && c.campaignName).forEach((c) => { if (!map.has(c.campaignName)) map.set(c.campaignName, []); map.get(c.campaignName).push(c); });
    let rows = Array.from(map.entries()).map(([name, items]) => {
      const dates = items.map((c) => c.publishDate).sort();
      const dur = Math.max(1, (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 86400000 + 1);
      const allNon = data.filter((c) => !c.isActivity).length || 1;
      const normalDaily = allNon / Math.max(1, new Set(data.filter((c) => !c.isActivity).map((c) => c.publishDate)).size || 1);
      const freq = items.length / dur;
      return { name, count: items.length, dur, freq, lift: normalDaily > 0 ? freq / normalDaily : 0, avgRate: Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length), start: dates[0], end: dates[dates.length - 1], tags: [...new Set(items.map((c) => c.activityTag).filter((x) => x && x !== "无"))] };
    });
    rows.sort((a, b) => (state.campaignSort === "lift" ? b.lift - a.lift : state.campaignSort === "date" ? b.start.localeCompare(a.start) : b.avgRate - a.avgRate));
    const tools = `<div class="board-tools"><select class="sel" id="camp-sel">
      <option value="lift"${state.campaignSort === "lift" ? " selected" : ""}>按爆发倍数</option>
      <option value="date"${state.campaignSort === "date" ? " selected" : ""}>按时间</option>
      <option value="rate"${state.campaignSort === "rate" ? " selected" : ""}>按爆款指数</option></select></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[5].desc} 「爆发倍数」= 活动期日均发布频次 ÷ 日常日均频次，越高说明越「集中爆发」。</div>${tools}</div>`;
    if (!rows.length) return head + emptyState("无活动期间内容");
    return head + rows.map((r, i) => `<div class="panel" style="${i ? "margin-top:14px" : ""}">
      <div class="panel-title">${esc(r.name)} ${r.lift >= 2 ? '<span class="badge-top">集中爆发</span>' : ""}</div>
      <div class="panel-sub">${r.start} ~ ${r.end} · 持续 ${r.dur} 天 · 标签：${r.tags.join("、") || "—"}</div>
      <div class="stat-row" style="margin-bottom:0">
        <div class="stat"><div class="stat-label">发布条数</div><div class="stat-val">${r.count}</div></div>
        <div class="stat"><div class="stat-label">爆发倍数</div><div class="stat-val" style="color:${r.lift >= 2 ? "var(--hot)" : "var(--text)"}">${r.lift.toFixed(1)}×</div></div>
        <div class="stat"><div class="stat-label">日均频次</div><div class="stat-val">${r.freq.toFixed(1)}</div></div>
        <div class="stat"><div class="stat-label">平均爆款指数</div><div class="stat-val" style="color:var(--hot)">${r.avgRate}</div></div>
      </div></div>`).join("");
  }

  /* ---------- 选题预测 ---------- */
  const EXAMPLE_IDEAS = [
    { label: "Anal 玩具实测对比", text: "Anal toy 实测对比：哪款体验更上头？" },
    { label: "Lovense 新品开箱", text: "Lovense 新品首发开箱，演示远程互动玩法" },
    { label: "黑五促销转化", text: "黑五 5 折促销，推 Male Masturbators 转化" },
    { label: "Prostate 选购科普", text: "男性健康科普：Prostate 按摩器怎么选？" },
  ];

  function renderPredictor() {
    return `<div class="ref-split">
      <div class="ref-left">
        <div class="ref-sec-title"><span class="ref-sec-dot"></span>输入内容想法</div>
        <div class="ref-sec-sub">描述你想做的内容，前端会基于历史爆款特征即时给出评估。</div>
        <div class="example-chips" style="margin:12px 0 10px">
          <span class="ec-label">内置示例：</span>
          ${EXAMPLE_IDEAS.map((e) => `<button class="chip ec-chip" data-example="${esc(e.text)}">${esc(e.label)}</button>`).join("")}
        </div>
        <div class="predictor-input" style="margin-bottom:10px">
          <textarea id="idea-input" rows="7" placeholder="描述你的内容想法，例如：Anal toy 实测对比，哪款体验更上头？"></textarea>
        </div>
        <div class="ref-actions">
          <button class="btn-primary" id="predict-btn">🚀 生成评估结果</button>
          <span class="ref-hint">Ctrl / ⌘ + Enter 快捷生成</span>
        </div>
        <details class="ref-rules" style="margin-top:12px">
          <summary>🎯 评估规则说明</summary>
          <div class="ref-rules-body">
            <p><b>步骤 1：关键词提取与扩展</b><br/>
            • 输入文本拆词后做<b>同义词扩展</b>（如 促销↔打折↔大促、实测↔测评、开箱↔新品）<br/>
            • 用扩展词集匹配库中所有主题/情绪/形式/目的/活动标签/平台等枚举值<br/>
            • 同时读取内容原始文本 + 中文译文 + 类目 + 标签多字段做全文检索</p>
            <p><b>步骤 2：逐条计算相关度（0-100 分）</b><br/>
            • 主题/内容标签匹配：+20/个（上限 50）<br/>
            • 活动标签匹配：+22（检测输入是否含黑五/大促/折扣等促销意图）<br/>
            • 情绪匹配：+14<br/>
            • 形式匹配：+8<br/>
            • 关键词词组匹配：+10/组（上限 20）<br/>
            • 爆款加成：Top10% 爆款额外 +15</p>
            <p><b>步骤 3：统计特征</b><br/>
            从相关度 >0 的内容中统计：匹配条数、爆款占比、活动占比、平均数据指标（曝光/互动/点赞/评论/转发/收藏/互动率）</p>
            <p><b>步骤 4：用户风评</b><br/>
            找到匹配内容后，按 <code>associated_id</code> 关联该帖的真实回帖（userVoices），聚合回帖的情绪（正/中/负）、回帖意图（购买意向/咨询问题/简单互动/使用反馈/吐槽不满）、关注焦点（效果/尺寸/材质/价格/物流/售后）</p>
          </div>
        </details>
      </div>
      <div class="ref-right" id="predict-result">
        <div class="ref-empty">
          <div class="ref-empty-icon">✨</div>
          <div class="ref-empty-title">右侧将展示评估结果</div>
          <div class="ref-empty-sub">输入左侧内容想法并点击「生成」后，这里会显示多维度评分、匹配内容与优化建议。</div>
        </div>
      </div>
    </div>`;
  }
  function runPredict() {
    const idea = $("#idea-input").value.trim();
    if (!idea) { toast("先输入你的内容想法"); return; }
    const r = A.predictIdea(state.analysis.contents, idea, (state.raw && state.raw.userVoices) || []);
    if (!r) { toast("数据不足，无法预测"); return; }
    state.predictor = { idea, r };
    const box = $("#predict-result");
    const ms = r.matchedStats;
    const maxV = state.maxViral;
    const rateOf = (c) => Math.max(0, Math.min(100, Math.round((c.viralScore / maxV) * 100)));
    const matchedCards = r.matches.items.slice(0, 6).map((c) => {
      const topBadge = c.isTop ? `<span class="badge-top">爆款</span>` : "";
      return `<div class="match-card" data-id="${c.id}">
        <div class="match-card-top">${topBadge}<span class="match-score">相关度 ${c.matchScore}</span></div>
        <div class="match-text">${esc(dispText(c))}</div>
        <div class="match-meta">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div>
        <div class="match-reason"><span>匹配原因：</span>${esc(c.matchReason)}</div>
        <div class="match-mini-metrics">
          <span>爆款指数 <b>${rateOf(c)}</b></span>
          <span>曝光 <b>${fmt(c.exposure)}</b></span>
          <span>互动 <b>${fmt(c.engagement)}</b></span>
        </div>
      </div>`;
    }).join("");

    const matchStatsHTML = ms.count ? `<div class="stat-row" style="margin-bottom:14px">
      <div class="stat"><div class="stat-label">匹配历史内容</div><div class="stat-val">${ms.count}<small>条</small></div></div>
      <div class="stat"><div class="stat-label">其中爆款占比</div><div class="stat-val" style="color:var(--hot)">${(ms.topRate * 100).toFixed(0)}<small>%</small></div></div>
      <div class="stat"><div class="stat-label">来自活动/Campaign</div><div class="stat-val">${(ms.activityRatio * 100).toFixed(0)}<small>%</small></div></div>
      <div class="stat"><div class="stat-label">平均爆款指数</div><div class="stat-val">${ms.avgViralRate}</div></div>
    </div>
    <div class="stat-row" style="margin-bottom:14px">
      <div class="stat"><div class="stat-label">平均曝光</div><div class="stat-val">${fmt(ms.avgExposure)}</div></div>
      <div class="stat"><div class="stat-label">平均互动</div><div class="stat-val">${fmt(ms.avgEngagement)}</div></div>
      <div class="stat"><div class="stat-label">平均点赞</div><div class="stat-val">${fmt(ms.avgLikes)}</div></div>
      <div class="stat"><div class="stat-label">平均评论</div><div class="stat-val">${fmt(ms.avgComments)}</div></div>
      <div class="stat"><div class="stat-label">平均转发</div><div class="stat-val">${fmt(ms.avgShares)}</div></div>
      <div class="stat"><div class="stat-label">平均收藏</div><div class="stat-val">${fmt(ms.avgCollections)}</div></div>
      <div class="stat"><div class="stat-label">平均互动率</div><div class="stat-val">${ms.avgEngagementRate ? ms.avgEngagementRate.toFixed(2) : "0"}<small>%</small></div></div>
    </div>` : "";

    const um = r.userMetrics;
    const voiceSent = um.voiceSent || {};
    const vsTotal = (voiceSent["正面"] || 0) + (voiceSent["中性"] || 0) + (voiceSent["负面"] || 0) || 1;
    const posPct = Math.round((voiceSent["正面"] || 0) / vsTotal * 100);
    const negPct = Math.round((voiceSent["负面"] || 0) / vsTotal * 100);
    const neuPct = 100 - posPct - negPct;
    const userHTML = `<div class="panel" style="margin-bottom:16px"><div class="panel-title">用户指标与风评</div><div class="panel-sub">基于匹配到的历史内容 + 真实回帖（${um.voiceCount || 0} 条）提炼用户侧表现</div>
      <div class="stat-row" style="margin-bottom:10px">
        <div class="stat"><div class="stat-label">平均曝光</div><div class="stat-val">${fmt(um.avgExposure)}</div></div>
        <div class="stat"><div class="stat-label">平均互动</div><div class="stat-val">${fmt(um.avgEngagement)}</div></div>
        <div class="stat"><div class="stat-label">平均点赞</div><div class="stat-val">${fmt(um.avgLikes)}</div></div>
        <div class="stat"><div class="stat-label">平均评论</div><div class="stat-val">${fmt(um.avgComments)}</div></div>
        <div class="stat"><div class="stat-label">平均转发</div><div class="stat-val">${fmt(um.avgShares)}</div></div>
        <div class="stat"><div class="stat-label">平均收藏</div><div class="stat-val">${fmt(um.avgCollections)}</div></div>
      </div>
      <div class="stat-row" style="margin-bottom:10px">
        <div class="stat"><div class="stat-label">评价倾向</div><div class="stat-val" style="color:var(--accent-2)">${esc(um.reviewTone)}</div></div>
        <div class="stat"><div class="stat-label">正面占比</div><div class="stat-val" style="color:#22c55e">${posPct}<small>%</small></div></div>
        <div class="stat"><div class="stat-label">中性占比</div><div class="stat-val" style="color:#94a3b8">${neuPct}<small>%</small></div></div>
        <div class="stat"><div class="stat-label">负面占比</div><div class="stat-val" style="color:#ff5d8f">${negPct}<small>%</small></div></div>
        <div class="stat"><div class="stat-label">回帖样本</div><div class="stat-val">${um.voiceCount || 0}<small>条</small></div></div>
      </div>
      <div class="hit-tags" style="margin-top:6px"><span class="hit-label">用户高频关键词：</span>${(um.topKeywords || []).map((t) => `<span class="tag topic">${esc(t)}</span>`).join("") || "<span style='color:var(--text-3)'>—</span>"}</div>
      ${(um.topIntents && um.topIntents.length) ? `<div class="hit-tags" style="margin-top:4px"><span class="hit-label">回帖意图：</span>${um.topIntents.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
      ${(um.topFocuses && um.topFocuses.length) ? `<div class="hit-tags" style="margin-top:4px"><span class="hit-label">关注焦点：</span>${um.topFocuses.map((t) => `<span class="tag hashtag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>`;

    const keyFeaturesHTML = r.keyTakeaways.length ? `<div class="panel" style="margin-bottom:16px"><div class="panel-title">这类内容的关键特征</div><div class="panel-sub">基于匹配到的历史内容提炼，非空泛结论</div><ul class="sugg-list">${r.keyTakeaways.map((k) => `<li>${esc(k)}</li>`).join("")}</ul></div>` : "";

    const matchedPanelHTML = ms.count ? `<div class="panel" style="margin-bottom:16px"><div class="panel-title">匹配到的参考内容（按相关度）</div><div class="panel-sub">点击查看详情，可作为选题对标或灵感来源</div><div class="match-grid">${matchedCards}</div></div>` : "";

    const hitTags = [];
    if (r.matchedTopics.length) hitTags.push(...r.matchedTopics.slice(0, 3));
    if (r.matchedEmotions.length) hitTags.push(...r.matchedEmotions.slice(0, 2));
    if (r.matchedActivityTags.length) hitTags.push(...r.matchedActivityTags.slice(0, 2));
    if (r.hitKeywords.length) hitTags.push(...r.hitKeywords.slice(0, 3));
    const hitTagsHTML = hitTags.length ? `<div class="hit-tags"><span class="hit-label">匹配维度：</span>${hitTags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : "";

    box.innerHTML = `<div class="score-hero">
        <div class="score-ring" style="--p:${r.score}"><div><b>${r.score}</b><small>/100</small></div></div>
        <div class="score-meta">
          <div class="sm-row">
            <div class="sm-item"><div class="sm-k">同主题历史爆款占比</div><div class="sm-v hot">${r.topicViralRate}%</div></div>
            <div class="sm-item"><div class="sm-k">同情绪历史爆款占比</div><div class="sm-v hot">${r.emotionViralRate}%</div></div>
            <div class="sm-item"><div class="sm-k">命中关键词</div><div class="sm-v">${r.keywordHits}</div></div>
          </div>
          ${hitTagsHTML}
          <div class="sm-row" style="margin-top:10px"><div class="sm-item" style="font-size:12px;color:var(--text-3)">即时快评由前端脚本基于历史爆款特征计算，供秒级参考；深度分析请点下方按钮由我（大模型）完成。</div></div>
        </div>
      </div>
      ${matchStatsHTML}
      ${userHTML}
      ${keyFeaturesHTML}
      ${matchedPanelHTML}
      <div class="sugg-box"><h4>优化方向建议（脚本快评）</h4><ul class="sugg-list">${r.suggestions.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      <div class="handoff">
        <div class="handoff-text"><b>要让分析更准、更深入？</b><br>点右侧按钮，把你的想法 + 即时评估 + 匹配到的历史内容复制下来，发给我（大模型），我结合真实爆款特征给你详细报告与修改建议。</div>
        <button class="btn-primary" id="copy-ai">复制给 AI 做深度分析</button>
      </div>`;
    box.classList.add("ref-has-result");
    $("#copy-ai").addEventListener("click", copyToAI);
    // 匹配卡片点击直接打开单帖深度分析
    $$(".match-card", box).forEach((el) => el.addEventListener("click", () => openDeepAnalysis(el.dataset.id)));
  }
  function copyToAI() {
    if (!state.predictor) return;
    const { idea, r } = state.predictor;
    const topMatches = r.matches.items.slice(0, 4).map((c) => {
      const maxV = Math.max(...state.analysis.contents.map((x) => x.viralScore), 0.0001);
      const viralRate = Math.round((c.viralScore / maxV) * 100);
      return `- ${dispText(c)}（${c.account} · ${c.contentType} · 爆款指数 ${viralRate} · 匹配原因：${c.matchReason}）`;
    }).join("\n");
    const ctx = `【内容选题深度分析请求】
我的内容想法：${idea}

—— 前端即时快评 ——
爆款指数：${r.score}/100
同主题历史爆款占比：${r.topicViralRate}% | 同情绪历史爆款占比：${r.emotionViralRate}%
命中关键词数：${r.keywordHits}
匹配历史内容：${r.matches.total} 条，其中 ${(r.matchedStats.topRate * 100).toFixed(0)}% 为爆款 · 来自活动 ${(r.matchedStats.activityRatio * 100).toFixed(0)}% · 平均爆款指数 ${r.matchedStats.avgViralRate}
匹配内容数据：平均曝光 ${fmt(r.matchedStats.avgExposure)} · 平均互动 ${fmt(r.matchedStats.avgEngagement)} · 平均点赞 ${fmt(r.matchedStats.avgLikes)} · 平均评论 ${fmt(r.matchedStats.avgComments)} · 平均转发 ${fmt(r.matchedStats.avgShares)} · 平均收藏 ${fmt(r.matchedStats.avgCollections)} · 平均互动率 ${(r.matchedStats.avgEngagementRate || 0).toFixed(2)}%
用户侧：平均曝光 ${fmt(r.userMetrics.avgExposure)} · 平均互动 ${fmt(r.userMetrics.avgEngagement)} · 平均点赞 ${fmt(r.userMetrics.avgLikes)} · 平均评论 ${fmt(r.userMetrics.avgComments)} · 评价倾向「${r.userMetrics.reviewTone}」（回帖样本 ${r.userMetrics.voiceCount} 条） · 用户高频关键词：${r.userMetrics.topKeywords.join("、")} · 回帖意图：${(r.userMetrics.topIntents || []).join("、")}

—— 匹配到的关键历史内容 ——
${topMatches || "（无强匹配）"}

—— 请基于以上历史爆款特征，给出 ——
1) 该方向的爆款概率判断与理由；
2) 具体优化方向（标题钩子 / 内容形式 / 情绪设计 / 发布时间 / 互动机制）；
3) 可落地的选题延展 2-3 个。`;
    navigator.clipboard.writeText(ctx).then(() => toast("已复制，去对话框粘贴给我即可"), () => toast("复制失败，请手动选择"));
  }

  function bindExampleChips() {
    $$(".ec-chip").forEach((btn) => btn.addEventListener("click", () => {
      $("#idea-input").value = btn.dataset.example;
      runPredict();
    }));
  }

  /* ============ 每日盲盒 ============ */
  function rollRarity() {
    const r = Math.random();
    if (r < 0.10) return { label: "金色传说", cls: "rar-legend" };
    if (r < 0.40) return { label: "稀有", cls: "rar-rare" };
    return { label: "普通", cls: "rar-normal" };
  }
  function sampleN(arr, n) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  }
  function borrowTip(c) {
    if (c.isTop) return "已进入 Top10% 爆款，可借鉴其形式结构与钩子设计，复用到同类选题。";
    const t = (c.topicTags || [])[0];
    return t ? `围绕「${t}」主题，可借鉴其「${c.contentType}」形式与「${c.emotion}」调性做延展。` : `可借鉴其「${c.contentType}」形式与「${c.emotion}」调性。`;
  }
  function topVoiceFor(c) {
    const voices = (state.raw && state.raw.userVoices) || [];
    if (!voices.length) return null;
    const mine = voices.find((v) => v.contentId === c.id);
    if (mine) return mine;
    const sameAcc = voices.filter((v) => v.account === c.account).sort((a, b) => b.likes - a.likes);
    if (sameAcc.length) return sameAcc[0];
    return voices.slice().sort((a, b) => b.likes - a.likes)[0];
  }
  /* ============ 每日盲盒（浮窗：可拖动 + 翻牌 + 分享生图）============ */
  // 每日随机抽：以「日期」为种子 → 同一天稳定、跨天不同。一个月每天都是新一轮随机。
  function dateSeed() {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function todayStr() {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // 从封面池按 rng 不重复抽 n 张
  function dailyCovers(n, rng) {
    const pool = BX_COVERS.slice();
    const out = [];
    for (let i = 0; i < n && pool.length; i++) {
      const k = Math.floor(rng() * pool.length);
      out.push(pool.splice(k, 1)[0]);
    }
    while (out.length < n) out.push(BX_COVERS[Math.floor(rng() * BX_COVERS.length)]);
    return out;
  }
  // 按 rng 从内容池不重复抽 n 条
  function seededSample(pool, n, rng) {
    const arr = pool.slice();
    const out = [];
    for (let i = 0; i < n && arr.length; i++) {
      const k = Math.floor(rng() * arr.length);
      out.push(arr.splice(k, 1)[0]);
    }
    return out;
  }

  function bxCardsHTML() {
    const pool = state.analysis.contents;
    const seeded = (state.bxSeed != null);
    const rng = seeded ? mulberry32(state.bxSeed) : Math.random;
    const picks = seeded ? seededSample(pool, 3, rng) : sampleN(pool, 3);
    state.blindbox = picks.map((c) => ({ c, rarity: rollRarity(), flipped: false }));
    const covers = dailyCovers(state.blindbox.length, rng);
    return state.blindbox.map((p, i) => {
      const c = p.c;
      const v = topVoiceFor(c);
      const coverImg = covers[i];
      const cover = `<div class="bx-cover-wrap">
        <img class="bx-cover-img" src="${esc(coverImg)}" alt="盲盒卡片" crossorigin="anonymous">
        <div class="bx-cover-mask"></div>
        <div class="bx-front-foot"><div class="bx-q">?</div><div class="bx-hint">点击翻牌</div></div>
      </div>`;
      const voiceHTML = v
        ? `<div class="bx-voice"><div class="bx-voice-head">最高赞用户评价 · <span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span> <span class="uv-likes">♥ ${fmt(v.likes)}</span></div><div class="bx-voice-text">${esc(dispVoice(v))}</div><a class="uv-link" href="${esc(v.originalLink || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>`
        : `<div class="bx-voice bx-muted">暂无该内容的用户评价数据</div>`;
      return `<div class="bx-card face-down" data-bx="${i}" data-id="${esc(c.id)}">
        <div class="bx-face bx-front">${cover}</div>
        <div class="bx-face bx-back">
          <div class="bx-rarity ${p.rarity.cls}">${p.rarity.label}</div>
          <div class="bx-reveal">
            <div class="bx-row"><span class="bx-k">品牌</span><span class="bx-v">${esc(c.account)}</span></div>
            <div class="bx-row"><span class="bx-k">内容形式</span><span class="bx-v">${esc(c.contentType)}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">内容</span><span class="bx-v">${esc(dispText(c))}</span></div>
            <div class="bx-row"><span class="bx-k">数据情况</span><span class="bx-v">曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 爆款指数 ${c.viralScore.toFixed(1)}（${viralTierLabel(c)}）${c.isTop ? " · 🔥爆款" : ""}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">可借鉴</span><span class="bx-v">${esc(borrowTip(c))}</span></div>
            ${voiceHTML}
          </div>
          <div class="bx-actions"><button class="mini-btn" data-use="${c.id}">点开详情</button><button class="mini-btn ghost" data-share="${i}">下载图片</button><button class="mini-btn ghost" data-copy="${i}">复制图片</button></div>
        </div></div>`;
    }).join("");
  }

  function openBlindboxModal() {
    state.bxSeed = state.bxSeed || dateSeed();
    const dateEl = $("#bx-modal-date");
    if (dateEl) dateEl.textContent = todayStr();
    const grid = $("#bx-grid");
    if (grid) grid.innerHTML = bxCardsHTML();
    bindBlindboxModal();
    $("#bx-modal").classList.add("show");
    $("#bx-overlay").classList.add("show");
    const reopen = $("#bx-reopen");
    if (reopen) reopen.style.display = "none";
  }
  function closeBlindboxModal() {
    $("#bx-modal").classList.remove("show");
    $("#bx-overlay").classList.remove("show");
    const reopen = $("#bx-reopen");
    if (reopen) reopen.style.display = "";
  }
  function bindBlindboxModal() {
    const modal = $("#bx-modal");
    // 重抽：清空每日种子 → 立即换新一组（真随机）
    const rd = $("#bx-redraw"); if (rd) rd.onclick = (e) => { e.stopPropagation(); state.bxSeed = null; $("#bx-grid").innerHTML = bxCardsHTML(); bindBlindboxModal(); };
    // 关闭
    const cl = $("#bx-close"); if (cl) cl.onclick = (e) => { e.stopPropagation(); closeBlindboxModal(); };
    // 点击遮罩关闭
    const ov = $("#bx-overlay"); if (ov) ov.onclick = closeBlindboxModal;
    // 翻牌（第一次点）；翻开后再点卡的任何位置 → 直接打开单帖深度分析
    $$(".bx-card", modal).forEach((el) => el.onclick = () => {
      if (el.classList.contains("face-down")) {
        el.classList.remove("face-down");
        el.classList.add("flipped");
      } else if (el.classList.contains("flipped")) {
        openDeepAnalysis(el.dataset.id);
        closeBlindboxModal();
      }
    });
    // 点开详情 → 直接打开单帖深度分析（关闭盲盒弹层）
    $$("[data-use]", modal).forEach((b) => b.onclick = (e) => { e.stopPropagation(); openDeepAnalysis(b.dataset.use); closeBlindboxModal(); });
    // 分享生图
    $$("[data-share]", modal).forEach((b) => b.onclick = (e) => { e.stopPropagation(); blindboxShareImage(state.blindbox[+b.dataset.share]); });
    // 复制图片
    $$("[data-copy]", modal).forEach((b) => b.onclick = (e) => { e.stopPropagation(); blindboxCopyImage(state.blindbox[+b.dataset.copy]); });
  }

  // 把一张盲盒卡牌内容绘制成霓虹 PNG canvas
  function blindboxCardCanvas(p) {
    if (!p) return null;
    const c = p.c, r = p.rarity;
    const W = 480, H = 640;
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    let x = null;
    try { x = cv.getContext("2d"); } catch (e) { x = null; }
    if (!x) return null;
    const g = x.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#0a0e1a"); g.addColorStop(1, "#16203a");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // 霓虹边框
    const border = r.cls === "legend" ? "#ffd166" : r.cls === "rare" ? "#a06bff" : "#00f0ff";
    x.strokeStyle = border; x.lineWidth = 3; x.shadowColor = border; x.shadowBlur = 18;
    x.strokeRect(14, 14, W - 28, H - 28); x.shadowBlur = 0;
    // 稀有度
    x.fillStyle = border; x.font = "700 16px system-ui,sans-serif"; x.textAlign = "center";
    x.fillText(r.label, W / 2, 48);
    // 品牌 / 形式
    x.fillStyle = "#e7eefc"; x.font = "700 26px system-ui,sans-serif"; x.fillText(c.account, W / 2, 92);
    x.fillStyle = "#8fa3c8"; x.font = "15px system-ui,sans-serif"; x.fillText("内容形式 · " + c.contentType, W / 2, 120);
    // 内容（自动换行）
    x.fillStyle = "#cdd9f0"; x.font = "16px system-ui,sans-serif"; x.textAlign = "left";
    const text = dispText(c); const maxW = W - 60; let y = 160; const lineH = 24;
    const words = text.split(/(\s+)/); let line = "";
    for (const w of words) {
      const test = line + w;
      if (x.measureText(test).width > maxW && line) { x.fillText(line, 30, y); y += lineH; line = w; if (y > 420) break; }
      else line = test;
    }
    if (y <= 420) x.fillText(line, 30, y);
    // 数据条
    const tierBand = c.viralTier === 10 ? "后10%" : `前${c.viralTier * 10}%`;
    const stats = [`曝光 ${fmt(c.exposure)}`, `互动 ${fmt(c.engagement)}`, `爆款指数 ${c.viralScore.toFixed(1)}（${tierBand}）`];
    x.textAlign = "center"; x.fillStyle = "#00f0ff"; x.font = "700 15px system-ui,sans-serif";
    stats.forEach((s, i) => x.fillText(s, 30 + (W - 60) * (i + 0.5) / 3, 500));
    // 可借鉴
    x.fillStyle = "#9fb2d6"; x.font = "13px system-ui,sans-serif"; x.textAlign = "left";
    let by = 536; const tip = borrowTip(c); const tw = tip.split(/(\s+)/); let tl = "";
    for (const w of tw) { const t = tl + w; if (x.measureText(t).width > maxW && tl) { x.fillText(tl, 30, by); by += 20; tl = w; if (by > 590) break; } else tl = t; }
    x.fillText(tl, 30, by);
    // 页脚
    x.fillStyle = "#5f7099"; x.font = "12px system-ui,sans-serif"; x.textAlign = "center";
    x.fillText("内容监测分析 · 每日盲盒", W / 2, H - 22);
    return cv;
  }

  function blindboxShareImage(p) {
    const cv = blindboxCardCanvas(p);
    if (!cv) { toast("当前环境不支持生成图片"); return; }
    try {
      const url = cv.toDataURL("image/png");
      const a = document.createElement("a"); a.href = url; a.download = `盲盒_${p.c.account}_${p.c.id}.png`; a.click();
      toast("已生成图片，开始下载");
    } catch (e) { toast("下载失败：" + e.message); }
  }

  async function blindboxCopyImage(p) {
    const cv = blindboxCardCanvas(p);
    if (!cv) { toast("当前环境不支持生成图片"); return; }
    try {
      cv.toBlob(async (blob) => {
        if (!blob) { toast("复制失败：无法生成图片"); return; }
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          toast("图片已复制到剪贴板");
        } else { toast("当前浏览器不支持复制图片"); }
      }, "image/png");
    } catch (e) { toast("复制失败：" + e.message); }
  }

  /* ============ 参考建议中枢（评估想法 / 找参考 / 回测）============ */
  const GOAL_PRESETS = [
    { id: "sell", name: "卖货转化", emotion: ["促销推广", "种草内容"], type: ["图片", "视频"], goal: ["促进转化"], w: { engagement: 1.5, exposure: 1 } },
    { id: "review", name: "获取测评/讨论", emotion: ["互动提问", "科技感"], type: ["视频", "图片"], goal: ["用户互动"], w: { engagement: 2, exposure: 0.6 } },
    { id: "growth", name: "拉新涨粉", emotion: ["搞笑", "温暖"], type: ["视频", "图片"], goal: ["拉新获客"], w: { exposure: 2, shares: 1.2, engagement: 0.8 } },
    { id: "brand", name: "品牌曝光", emotion: ["高级感", "艺术感", "科技感"], type: ["图片", "视频"], goal: ["品牌曝光"], w: { exposure: 1.5, shares: 1.2, collections: 1 } },
  ];
  function renderReference() {
    const body = state.refMode === "eval" ? renderPredictor() : renderFind();
    return `<div class="board-head"><div class="board-desc">${BOARDS.find((b) => b.id === "reference").desc}</div></div>
      <div class="ref-tabs">
        <button class="ref-tab${state.refMode === "eval" ? " on" : ""}" data-rm="eval">评估想法</button>
        <button class="ref-tab${state.refMode === "find" ? " on" : ""}" data-rm="find">找参考</button>
      </div>
      <div id="ref-body">${body}</div>`;
  }
  function bindReference() {
    $$(".ref-tab").forEach((b) => b.addEventListener("click", () => { state.refMode = b.dataset.rm; renderBoard(); }));
    if (state.refMode === "eval") bindPredictorBoard();
    else bindFind();
  }
  function bindPredictorBoard() {
    const pb = $("#predict-btn"); if (pb) pb.addEventListener("click", runPredict);
    const ta = $("#idea-input"); if (ta) ta.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runPredict(); });
    bindExampleChips();
  }
  function findPurposeChips() {
    const all = state.analysis.contents;
    const cnt = (g) => all.filter((c) => {
      if (g.emotion && g.emotion.some((e) => contains(c.emotion, e))) return true;
      if (g.type && g.type.some((t) => contains(c.contentType, t))) return true;
      if (g.goal && g.goal.some((m) => contains(c.marketing_goal, m))) return true;
      return false;
    }).length;
    return GOAL_PRESETS.map((g) => `<button class="chip ec-chip find-preset" data-goal="${g.id}">${g.name}<span class="ec-cnt">${cnt(g)}</span></button>`).join("");
  }
  function renderFind() {
    const presets = findPurposeChips();
    const dims = [["type", "形式"], ["topic", "主题"], ["emotion", "情绪"], ["goal", "营销目的"], ["source", "来源"], ["platform", "平台"], ["keyword", "关键词"], ["perf", "表现"]];
    const dimHTML = dims.map(([k, l]) => `<label class="dim-toggle on" data-dim="${k}"><input type="checkbox" checked> ${l}</label>`).join("");
    return `<div class="ref-split">
      <div class="ref-left">
        <div class="ref-sec-title"><span class="ref-sec-dot"></span>输入参考目的</div>
        <div class="ref-sec-sub">没想法有目的时，输入你的营销目的，右侧推荐匹配的历史灵感内容。</div>
        <div class="ref-presets">
          <div class="ref-presets-label">📋 常用目的（点击自动填入输入框）</div>
          <div class="example-chips" id="find-presets">${presets}</div>
        </div>
        <div class="predictor-input" style="margin-bottom:10px">
          <textarea id="goal-detail" class="goal-textarea" rows="5" placeholder="输入你的目的…例如：想给美国男性用户推一款高端 Anal 玩具，主打成分安全与体验升级，希望引发讨论和测评，而不是硬广"></textarea>
        </div>
        <div class="find-block" style="margin-bottom:14px">
          <div class="find-label">匹配维度（可关掉不相关的）</div>
          <div class="find-dims" id="find-dims">${dimHTML}</div>
        </div>
        <div class="ref-actions">
          <button class="btn-primary" id="find-btn">🔍 推荐参考内容</button>
          <span class="ref-hint">Ctrl / ⌘ + Enter 快捷生成</span>
        </div>
        <details class="ref-rules">
          <summary>🎯 匹配规则说明</summary>
          <div class="ref-rules-body">
            <p><b>步骤 1：目的预设</b> — 点击「常用目的」可自动设置情绪/形式/营销目的匹配维度。每条内容只要命中其中任一维度即可加分。<br/>
            例：选择「卖货转化」→ 自动匹配情绪=促销推广/种草内容、形式=图片/视频、目的=促进转化的内容。</p>
            <p><b>步骤 2：自定义文本匹配</b> — 无预设时由输入文本驱动：<br/>
            • 中文做 2/3 字滑动窗口切词（去除停用词如「的、了、是」）<br/>
            • 英文/数字原样保留（如 anal、prostate、15cm）<br/>
            • 在内容的 <b>9 个字段</b>中同时检索：原文本 + 中文译文 + 类目 + 内容主题 + 内容标签 + 营销目的 + 来源 + 形式 + 情绪 + 平台</p>
            <p><b>步骤 3：粗略识别</b> — 即使中文 ≥3 字词未完全命中，只要其中任 2 字连续子串命中也算（覆盖错位/同义），但仅计 2 分。</p>
            <p><b>计分规则</b>（满分 100）：<br/>
            • 目的预设命中：情绪 22 + 形式 16 + 目的 20 + 来源 8<br/>
            • 关键词命中：中文词组直接命中计 2-4 分/个（上限 36，含粗识别）<br/>
            • 主题契合：内容主题/标签与输入重叠计 8 分/个（上限 16）<br/>
            • 情绪/形式/平台关键词命中：各 6-8 分<br/>
            • 表现加成：爆款(Top10%)+20 / 高表现+12 / 一般+6<br/>
            • 文本短语精确命中：+14/次</p>
            <p><b>相关性分级</b>：极高度相关≥90 / 高度相关≥70 / 中度相关≥50 / 低度相关≥30 / 极低&lt;30</p>
          </div>
        </details>
      </div>
      <div class="ref-right" id="find-result">
        <div class="ref-empty">
          <div class="ref-empty-icon">🔍</div>
          <div class="ref-empty-title">右侧将展示推荐内容</div>
          <div class="ref-empty-sub">输入左侧目的并点击「推荐」后，这里会显示匹配度可视化看板与参考内容列表。</div>
        </div>
      </div>
    </div>`;
  }
  // 双向包含：a 含 b 或 b 含 a（应对「种草」⊂「种草内容」这类词表错位）
  function contains(a, b) {
    if (!a || !b) return false;
    a = String(a).toLowerCase(); b = String(b).toLowerCase();
    return a.includes(b) || b.includes(a);
  }
  // 中文感知的关键词提取：拉丁词（品牌/品类/英文术语）原样保留；
  // 中文去停用词后生成 2/3 字滑动窗口（无分词器下的 CJK 模糊匹配），并保留去停用词整段供短语精确匹配。
  const FIND_STOP = new Set("的 了 是 在 我 你 他 她 它 我们 你们 想 要 给 推 一款 一个 主打 希望 引发 讨论 测评 而不是 硬广 等 和 与 及 通过 利用 进行 以及 可以 能够 如何 怎么 什么 这个 那个 些 上 下 中 内 外 前 后 从 到 把 被 让 使 为 对 于 以 之 其 该 各 每 多 少 大 小 高 低 新 旧 用 做 出 来 去 有 没有 不 也 都 就 还 很 更 最 会 能 这类 这样 那样 一种 一种 他们 她们 它们".split(" "));
  function extractKeywords(text) {
    const t = (text || "").toLowerCase();
    const out = new Set();
    (t.match(/[a-z0-9]+/g) || []).forEach((w) => { if (w.length >= 2) out.add(w); });
    const cn = t.replace(/[a-z0-9\s\p{P}]/gu, "");
    const cleaned = cn.split("").filter((ch) => !FIND_STOP.has(ch)).join("");
    for (let n = 2; n <= 3; n++) {
      for (let i = 0; i + n <= cleaned.length; i++) out.add(cleaned.slice(i, i + n));
    }
    if (cleaned.length >= 2) out.add("PHRASE:" + cleaned);
    return [...out];
  }
  function matchScoreMulti(c, ctx) {
    const { g, detail, dims } = ctx;
    let score = 0; const reasons = []; const dimHits = [];
    // 合并可搜索文本：原文 + 中文译文 + 结构化字段，关键词维度在此检索
    const kwField = `${c.text || ""} ${c.text_zh || ""} ${c.category || ""} ${c.content_topic || ""} ${(c.content_tags || []).join(" ")} ${c.marketing_goal || ""} ${c.content_source || ""} ${(c.topicTags || []).join(" ")} ${c.contentType || ""} ${c.platform || ""} ${c.emotion || ""}`.toLowerCase();
    // 结构化意图（来自目的预设）：双向包含匹配真实取值
    if (g) {
      if (g.emotion && dims.has("emotion") && g.emotion.some((e) => contains(c.emotion, e))) { score += 22; reasons.push(`情绪「${c.emotion}」契合目的`); dimHits.push("emotion"); }
      if (g.type && dims.has("type") && g.type.some((t) => contains(c.contentType, t))) { score += 16; reasons.push(`形式「${c.contentType}」契合目的`); dimHits.push("type"); }
      if (g.goal && dims.has("goal") && g.goal.some((m) => contains(c.marketing_goal, m))) { score += 20; reasons.push(`营销目的「${c.marketing_goal}」契合`); dimHits.push("goal"); }
      if (g.source && dims.has("source") && g.source.some((s) => contains(c.content_source, s))) { score += 8; reasons.push(`内容来源「${c.content_source}」`); dimHits.push("source"); }
    }
    if (detail) {
      const kws = extractKeywords(detail);
      const latinish = (k) => /^[a-z0-9]+$/.test(k);
      let kwScore = 0; const kwEx = [];
      kws.forEach((k) => {
        if (k.startsWith("PHRASE:")) {
          const ph = k.slice(7);
          if (ph.length >= 2 && kwField.includes(ph)) { kwScore += 14; if (kwEx.length < 3) kwEx.push(ph); }
        } else if (kwField.includes(k)) {
          // 直接命中：拉丁词按长度加分，中文 2/3 字 3 分
          kwScore += latinish(k) ? (k.length >= 4 ? 6 : 3) : (k.length >= 3 ? 4 : 2);
          if (kwEx.length < 4) kwEx.push(k);
        } else if (!latinish(k) && k.length >= 3) {
          // 粗略识别：中文 ≥3 字，任取其中 2 字连续子串命中也算（覆盖错位/同义）
          const chars = k.split("");
          let looseHit = false;
          for (let i = 0; i + 2 <= chars.length; i++) {
            if (kwField.includes(chars.slice(i, i + 2).join(""))) { looseHit = true; break; }
          }
          if (looseHit) { kwScore += 2; if (kwEx.length < 4) kwEx.push(k + "(粗)"); }
        }
      });
      if (kwScore && dims.has("keyword")) { score += Math.min(36, kwScore); reasons.push(`关键词命中（${kwEx.join("、")}）`); dimHits.push("keyword"); }
      if (dims.has("topic")) {
        const topicTokens = (c.topicTags || []).concat(String(c.content_topic || "").split(/[、，,]/)).map((s) => String(s).trim()).filter(Boolean);
        const goalKws = kws.filter((k) => !k.startsWith("PHRASE:"));
        const tOverlap = topicTokens.filter((t) => goalKws.some((tk) => t.toLowerCase().includes(tk) || tk.includes(t.toLowerCase()) || tk === t.toLowerCase()));
        if (tOverlap.length) { score += Math.min(16, 8 * tOverlap.length); reasons.push(`主题契合「${tOverlap.slice(0, 2).join("、")}」`); dimHits.push("topic"); }
      }
      if (dims.has("emotion") && kws.some((tk) => !tk.startsWith("PHRASE:") && c.emotion.toLowerCase().includes(tk))) { score += 8; reasons.push(`情绪契合「${c.emotion}」`); dimHits.push("emotion"); }
      if (dims.has("type") && kws.some((tk) => !tk.startsWith("PHRASE:") && c.contentType.toLowerCase().includes(tk))) { score += 8; reasons.push(`形式契合「${c.contentType}」`); dimHits.push("type"); }
      if (dims.has("platform") && kws.some((tk) => !tk.startsWith("PHRASE:") && c.platform.toLowerCase().includes(tk))) { score += 6; reasons.push(`平台契合「${c.platform}」`); dimHits.push("platform"); }
    }
    if (dims.has("perf")) {
      const vr = rate(c);
      if (vr >= 70) { score += 20; reasons.push(`爆款内容（爆款指数 ${vr}%）`); }
      else if (vr >= 50) { score += 12; reasons.push(`高表现（爆款指数 ${vr}%）`); }
      else if (vr >= 30) { score += 6; }
      dimHits.push("perf");
    }
    // 保底：仅在完全无命中时按整体爆款指数给分，避免看板空白
    if (score < 1) {
      const vr = rate(c);
      score = Math.max(1, Math.round(vr / 5));
    }
    return { score: Math.round(Math.min(100, score)), reasons, dimHits: [...new Set(dimHits)] };
  }
  function postSummary(c, reasons) {
    const vr = rate(c);
    const eng = (c.engagementRate || 0).toFixed(2);
    const topics = (c.topicTags || []).join("、") || "未标注";
    const hit = c.isTop ? "属于爆款(Top10%)内容" : `爆款指数 ${vr}%`;
    const tail = (reasons && reasons.length)
      ? `结合你的目的，它在「${reasons.slice(0, 2).join("、")}」等维度上高度契合，可作为同类内容的参考范本。`
      : "在当前筛选下表现居前，适合作为参考样本。";
    return `该帖由 <b>${esc(c.account)}</b> 在 <b>${esc(c.platform)}</b> 发布，形式为${esc(c.contentType)}、情绪${esc(c.emotion)}、主题${esc(topics)}，发布于 ${esc(c.publishDate)}；${hit}，互动率 ${eng}%，曝光 ${fmt(c.exposure)}。${tail}`;
  }
  function matchCardHTML(c, score, reasons, dimHits) {
    const img = (c.image && c.image !== "None" && c.image !== "nan") ? `<img class="match-img" src="${esc(c.image)}" alt="" onerror="this.style.display='none'">` : "";
    const link = (c.post_link && c.post_link !== "None") ? `<a class="match-link" href="${esc(c.post_link)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">查看原帖 ↗</a>` : "";
    return `<div class="match-card" data-id="${c.id}">
      <div class="match-card-top"><span class="badge-top">匹配 ${score}</span><span class="match-acc">${esc(c.account)} · ${esc(c.platform)} · ${esc(c.contentType)} · ${esc(c.emotion)}</span></div>
      <div class="match-origin">
        <div class="match-tag">原贴</div>
        ${img}
        <div class="match-text-full">${esc(dispText(c))}</div>
        <div class="match-meta">${esc(c.publishDate)} · 曝光 ${fmt(c.exposure)} · 赞 ${fmt(c.likes)} · 转发 ${fmt(c.shares)} · 收藏 ${fmt(c.collections)} ${link}</div>
      </div>
      <div class="match-desc">
        <div class="match-tag alt">整体说明</div>
        <div class="match-why">${postSummary(c, reasons)}</div>
        <div class="match-reason"><span>推荐理由：</span>${esc(reasons.join("；"))}</div>
      </div>
    </div>`;
  }
  function bindFind() {
    const fstate = { goalId: null, dims: new Set(["type", "topic", "emotion", "goal", "source", "platform", "keyword", "perf"]) };
    // 常用目的点击 → 填入输入框（不立即搜索）
    $$("#find-presets .ec-chip").forEach((b) => b.addEventListener("click", () => {
      const g = GOAL_PRESETS.find((x) => x.id === b.dataset.goal);
      const ta = $("#goal-detail");
      if (ta && g) ta.value = g.name + ": " + (g.desc || "");
      fstate.goalId = b.dataset.goal;
    }));
    $$("#find-dims .dim-toggle").forEach((el) => el.addEventListener("change", () => {
      const k = el.dataset.dim; const on = el.querySelector("input").checked;
      if (on) fstate.dims.add(k); else fstate.dims.delete(k);
      el.classList.toggle("on", on);
    }));
    const fb = $("#find-btn"); if (fb) fb.addEventListener("click", () => runFind(fstate));
  }
  function runFind(fstate) {
    const data = getFiltered();
    const g = fstate.goalId ? GOAL_PRESETS.find((x) => x.id === fstate.goalId) : null;
    const detail = (($("#goal-detail") ? $("#goal-detail").value : "") || "").trim();
    const scored = [];
    for (const c of data) {
      const r = matchScoreMulti(c, { g, topic: null, detail, dims: fstate.dims });
      if (r.score > 0) scored.push({ c, ...r });
    }
    // 无任何严格匹配时回退：按爆款指数/表现排序，让看板永远有输出
    const isFallback = scored.length === 0;
    const fallback = data.slice().sort((a, b) => (rate(b) - rate(a)) || ((b.engagement || 0) - (a.engagement || 0))).slice(0, 15).map((c) => ({
      c, score: rate(c),
      reasons: [isFallback ? "无严格匹配 · 按整体爆款指数排序" : "整体表现优异"],
      dimHits: ["perf"],
    }));
    const list = isFallback ? fallback : scored.sort((a, b) => b.score - a.score);
    const top = list.slice(0, 15);
    const box = $("#find-result");
    if (!box) return;
    const label = g ? g.name : (detail ? "自定义目的" : "全部内容（按表现排序）");

    // ===== 可视化看板：匹配度 + 内容数据 + 用户情绪 =====
    const avgScore = top.length ? Math.round(top.reduce((s, x) => s + x.score, 0) / top.length) : 0;
    const topAvgRate = top.length ? Math.round(top.reduce((s, {c}) => s + rate(c), 0) / top.length) : 0;
    const topCount = top.filter(({c}) => c.isTop).length;
    const topEngAvg = top.length ? Math.round(top.reduce((s, {c}) => s + (c.engagement || 0), 0) / top.length) : 0;
    const avgExp = top.length ? Math.round(top.reduce((s, {c}) => s + (c.exposure || 0), 0) / top.length) : 0;
    const avgLikes = top.length ? Math.round(top.reduce((s, {c}) => s + (c.likes || 0), 0) / top.length) : 0;
    const avgComments = top.length ? Math.round(top.reduce((s, {c}) => s + (c.comments || 0), 0) / top.length) : 0;
    const avgShares = top.length ? Math.round(top.reduce((s, {c}) => s + (c.shares || 0), 0) / top.length) : 0;
    const avgCollections = top.length ? Math.round(top.reduce((s, {c}) => s + (c.collections || 0), 0) / top.length) : 0;
    const avgEngRate = top.length ? (top.reduce((s, {c}) => s + (c.engagementRate || 0), 0) / top.length) : 0;
    const relevancePct = avgScore; // 相关性指标：基于匹配分（已是 0-100）
    const relevanceLabel = relevancePct >= 80 ? "高度契合" : relevancePct >= 60 ? "比较契合" : relevancePct >= 40 ? "一般契合" : "低度契合";

    // 匹配度分布
    const scoreBuckets = [["90-100", 90, 100], ["80-89", 80, 89], ["70-79", 70, 79], ["60-69", 60, 69], ["<60", 0, 59]];
    const scoreDist = scoreBuckets.map(([label, lo, hi]) => [label, top.filter((x) => x.score >= lo && x.score <= hi).length, PAL[scoreBuckets.indexOf([label, lo, hi]) % PAL.length]]);
    const scoreBars = uvBars(scoreDist.filter((x) => x[1] > 0));

    // 匹配维度命中（type, topic, emotion, platform, keyword, perf）
    const dimLabels = { type: "形式", topic: "主题", emotion: "情绪", goal: "营销目的", source: "来源", platform: "平台", keyword: "关键词", perf: "表现", author: "发布者" };
    const dimCounts = {};
    top.forEach(({dimHits}) => { (dimHits || []).forEach((h) => { dimCounts[h] = (dimCounts[h] || 0) + 1; }); });
    const dimPairs = Object.entries(dimCounts).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [dimLabels[k] || k, v, PAL[i % PAL.length]]);
    const dimBars = uvBars(dimPairs);

    // 内容数据分布
    const formDist = {};
    const emoDist = {};
    const accDist = {};
    top.forEach(({c}) => {
      formDist[c.contentType] = (formDist[c.contentType] || 0) + 1;
      emoDist[c.emotion] = (emoDist[c.emotion] || 0) + 1;
      accDist[c.account] = (accDist[c.account] || 0) + 1;
    });
    const formBars = uvBars(Object.entries(formDist).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [k, v, PAL[i % PAL.length]]));
    const emoBars = uvBars(Object.entries(emoDist).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [k, v, PAL[(i + 2) % PAL.length]]));

    // 用户情绪（从匹配账号的用户语料中聚合）
    const matchedAccounts = new Set(top.map(({c}) => c.account));
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => matchedAccounts.has(v.account));
    const sentMap = { "正面": "正面", "中性": "中性", "负面": "负面", "提问": "提问" };
    const sentDist = {};
    voices.forEach((v) => {
      const key = sentMap[v.sentiment] || "其他";
      sentDist[key] = (sentDist[key] || 0) + 1;
    });
    const sentColors = { "正面": "#22c55e", "中性": "#94a3b8", "负面": "#ff5d8f", "提问": "#0ef", "其他": "#a855f7" };
    const sentBars = uvBars(Object.entries(sentDist).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, sentColors[k] || "#94a3b8"]));

    const dashHTML = `<div class="find-dash">
      <div class="find-dash-title">📊 匹配度可视化看板 · 「${esc(label)}」</div>
      ${isFallback ? `<div class="uv-insight" style="margin-bottom:10px;font-size:12.5px">⚠️ 当前目的下未找到严格匹配的内容。已自动回退为<b>整体爆款指数排序</b>的 Top 内容。在输入框补充更多具体词（如品牌、形式、风格）可获得更精准匹配。</div>` : ""}
      <div class="find-rel-bar">
        <div class="find-rel-label">📈 相关性指标</div>
        <div class="find-rel-track"><div class="find-rel-fill" style="width:${relevancePct}%"></div></div>
        <div class="find-rel-meta"><b>${relevancePct}</b><small>/100</small> · <span class="find-rel-tag">${relevanceLabel}</span></div>
      </div>
      <div class="bud-stats" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">
        <div class="bud-stat"><div class="bud-stat-val">${top.length}</div><div class="bud-stat-lab">匹配内容</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${avgScore}</div><div class="bud-stat-lab">平均匹配分</div></div>
        <div class="bud-stat"><div class="bud-stat-val" style="color:var(--hot)">${topAvgRate}%</div><div class="bud-stat-lab">平均爆款指数</div></div>
        <div class="bud-stat"><div class="bud-stat-val" style="color:var(--hot)">${topCount}</div><div class="bud-stat-lab">已爆款数</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${fmt(topEngAvg)}</div><div class="bud-stat-lab">平均互动</div></div>
      </div>
      <div class="bud-stats" style="grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:8px">
        <div class="bud-stat"><div class="bud-stat-val">${fmt(avgExp)}</div><div class="bud-stat-lab">平均曝光</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${fmt(avgLikes)}</div><div class="bud-stat-lab">平均点赞</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${fmt(avgComments)}</div><div class="bud-stat-lab">平均评论</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${fmt(avgShares)}</div><div class="bud-stat-lab">平均转发</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${fmt(avgCollections)}</div><div class="bud-stat-lab">平均收藏</div></div>
        <div class="bud-stat"><div class="bud-stat-val">${avgEngRate.toFixed(2)}<small>%</small></div><div class="bud-stat-lab">平均互动率</div></div>
      </div>
      <div class="find-dash-row">
        <div class="vd-col"><div class="vd-title">匹配度分布</div>${scoreBars}</div>
        <div class="vd-col"><div class="vd-title">匹配维度命中</div>${dimBars}</div>
      </div>
      <div class="find-dash-row">
        <div class="vd-col"><div class="vd-title">内容形式分布</div>${formBars}</div>
        <div class="vd-col"><div class="vd-title">情绪风格分布</div>${emoBars}</div>
      </div>
      <div class="find-dash-row">
        <div class="vd-col"><div class="vd-title">用户情绪分布（匹配账号的用户语料）</div>${sentBars}</div>
      </div>
    </div>`;

    box.innerHTML = `${dashHTML}
      <div class="find-cards-title" style="margin-top:16px">匹配内容列表（点击卡片进入单帖深度分析）</div>
      <div class="match-grid">${top.slice(0, 10).map(({ c, score, reasons, dimHits }) => matchCardHTML(c, score, reasons, dimHits)).join("")}</div>`;
    box.classList.add("ref-has-result");
    $$(".match-card", box).forEach((el) => el.addEventListener("click", () => openDeepAnalysis(el.dataset.id)));
  }

  /* ============ 我方运营 ============ */
  function opsSec(title, lis) { return `<div class="ops-section"><div class="ops-sec-title">${title}</div><ul>${lis}</ul></div>`; }
  function downloadText(filename, text) {
    try {
      const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; document.body.appendChild(a); a.click();
      setTimeout(() => { try { document.body.removeChild(a); URL.revokeObjectURL(url); } catch (e) {} }, 100);
    } catch (e) { toast("导出失败：" + e.message); }
  }
  function downloadFile(filename, content, mime) {
    try {
      const blob = new Blob([content], { type: (mime || "text/plain") + ";charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; document.body.appendChild(a); a.click();
      setTimeout(() => { try { document.body.removeChild(a); URL.revokeObjectURL(url); } catch (e) {} }, 100);
    } catch (e) { toast("导出失败：" + e.message); }
  }
  function csvCell(s) { s = String(s == null ? "" : s); if (/[",\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"'; return s; }

  // 爆款深度分析通用聚合工具（需放在 renderViralDeep 外部，供深度钻取卡片复用）
  const sum = (arr, k) => arr.reduce((s, c) => s + (c[k] || 0), 0);
  const avg = (arr, k) => arr.length ? sum(arr, k) / arr.length : 0;

  /* ---------- 爆款内容深度分析：跨所有品牌的爆款共性 ---------- */
  function renderViralDeep() {
    const data = getFiltered();
    const tops = data.filter((c) => c.isTop);
    const normal = data.filter((c) => !c.isTop);
    const desc = boardDesc("viraldeep");
    if (!tops.length) return `<div class="board-head"><div class="board-desc">${desc}</div></div>` + `<div class="empty-state">当前筛选下暂无爆款内容（爆款 = 曝光Top10% 或 爆款指数Top10%且曝光≥1000）。</div>`;
    const allLen = data.length;
    const topPct = Math.round(tops.length / Math.max(allLen, 1) * 100);

    // 堆叠条：深色=爆款 浅色=普通
    const compBar = (label, key, color) => {
      const tv = avg(tops, key), nv = avg(normal, key);
      const mult = nv > 0 ? (tv / nv).toFixed(1) : "∞";
      const maxV = Math.max(tv, nv, 0.001);
      return `<div class="qc-bar"><span class="qc-name" style="width:80px">${label}</span>
        <span class="qc-comp"><i style="width:${(tv/maxV)*65}%;background:${color};opacity:.9" title="爆款"></i><i style="width:${(nv/maxV)*65}%;background:${color};opacity:.2" title="普通"></i><span class="qc-comp-fill" style="background:${color};opacity:${(tv/maxV)*0.6}"></span></span>
        <span class="qc-val-wide">爆款 <b>${(tv*100).toFixed(2)}%</b> · 普通 <b>${(nv*100).toFixed(2)}%</b> · <b style="color:var(--hot)">${mult}x</b></span></div>`;
    };

    // 爆款占比条
    const dimRate = (field, maxItems) => {
      const g = {}; data.forEach((c) => { const v = c[field] || "(空)"; if (!g[v]) g[v] = { t: 0, p: 0 }; g[v].t++; if (c.isTop) g[v].p++; });
      const rows = Object.entries(g).map(([k, v]) => ({ n: k, t: v.t, p: v.p, r: Math.round(v.p / Math.max(v.t, 1) * 100) })).sort((a, b) => b.r - a.r);
      const maxR = Math.max(...rows.map((r) => r.r), 1);
      return rows.slice(0, maxItems || rows.length).map((r, i) => `<div class="qc-bar"><span class="qc-name" style="width:84px">${esc(r.n)}</span><span class="qc-track"><i style="width:${(r.r/maxR)*100}%;background:${PAL[i%PAL.length]}"></i></span><span class="qc-val">${r.r}%<small>${r.p}/${r.t}</small></span></div>`).join("");
    };

    // ★ 1. 概览
    const avgExp = Math.round(avg(tops, "exposure"));
    const avgEng = Math.round(avg(tops, "engagement"));
    const avgER = (avg(tops, "engagementRate") * 100).toFixed(1);
    const overview = `<div class="bud-stats" style="margin-bottom:16px">
      <div class="bud-stat"><div class="bud-stat-num">${fmt(tops.length)}</div><div class="bud-stat-lab">爆款 / 共 ${fmt(allLen)}（${topPct}%）</div></div>
      <div class="bud-stat"><div class="bud-stat-num">${fmt(avgExp)}</div><div class="bud-stat-lab">爆款均曝光</div></div>
      <div class="bud-stat"><div class="bud-stat-num">${fmt(avgEng)}</div><div class="bud-stat-lab">爆款均互动</div></div>
      <div class="bud-stat"><div class="bud-stat-num">${avgER}%</div><div class="bud-stat-lab">爆款均互动率</div></div>
    </div>`;

    // ★ 2. 爆款vs普通对比
    const comps = [
      compBar("综合互动率", "engagementRate", "#00b8e6"),
      compBar("点赞率", "likeRate", "#10b981"),
      compBar("评论率", "commentRate", "#f97316"),
      compBar("传播率", "shareRate", "#8b5cf6"),
      compBar("收藏率", "collectRate", "#ec4899"),
      compBar("爆款指数", "viralScore", "#ff5d8f"),
    ].join("");

    // ★ 3. 爆款指数分布
    const buckets = [[0,5],[5,10],[10,20],[20,999]];
    const distRows = buckets.map(([lo, hi]) => {
      const cnt = tops.filter((c) => c.viralScore >= lo && c.viralScore < hi).length;
      const pct = Math.round(cnt / tops.length * 100);
      return `<div class="qc-bar"><span class="qc-name" style="width:80px">${lo}-${hi === 999 ? "50+" : hi}</span><span class="qc-track"><i style="width:${pct}%;background:${PAL[buckets.indexOf([lo, hi]) % PAL.length]}"></i></span><span class="qc-val">${pct}%<small>${cnt}条</small></span></div>`;
    }).join("");

    // ★ 4. 内容模式识别（对标爆款分析报告 4.1 节）
    const patternData = [
      ["转发媒体", 89, "转发媒体报道、KOL 内容、用户晒单等转载型内容，天然带动二次传播"],
      ["促销活动", 8, "折扣、优惠券、限时优惠内容，直接激发互动"],
      ["权威背书", 2, "媒体报道、获奖信息、行业认证提升可信度"],
      ["互动邀请", 1, "投票、tag朋友、评论邀请降低参与门槛"],
      ["UGC/种草", 1, "真实用户反馈比官方宣传更具说服力"],
    ];
    const patternRows = patternData.map(([name, pct, desc], i) => `<div class="qc-bar"><span class="qc-name" style="width:80px">${name}</span><span class="qc-track"><i style="width:${pct}%;background:${PAL[i%PAL.length]}"></i></span><span class="qc-val">${pct}%<small>TOP100</small></span><span style="font-size:11px;color:var(--text-3);margin-left:6px;flex:1">${desc}</span></div>`).join("");

    // ★ 5. 各维度
    const brandBars = dimRate("account", 10);
    const formBars = dimRate("contentType", 6);
    const emoBars = dimRate("emotion", 8);
    const goalBars = dimRate("marketing_goal", 6);
    // 内容来源
    const srcCnt = {}; tops.forEach((c) => { const s = c.content_source || "其他"; srcCnt[s] = (srcCnt[s] || 0) + 1; });
    const srcMax = Math.max(...Object.values(srcCnt), 1);
    const srcBars = Object.entries(srcCnt).sort((a, b) => b[1] - a[1]).map(([k, v], i) => `<div class="qc-bar"><span class="qc-name" style="width:84px">${esc(k)}</span><span class="qc-track"><i style="width:${(v/srcMax)*100}%;background:${PAL[i%PAL.length]}"></i></span><span class="qc-val">${Math.round(v/tops.length*100)}%<small>${v}/${tops.length}</small></span></div>`).join("");
    // 主题 chips
    const topTopics = {}; tops.forEach((c) => (c.topicTags || []).forEach((t) => topTopics[t] = (topTopics[t] || 0) + 1));
    const topicChips = Object.entries(topTopics).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t, n]) => `<span class="uv-chip">${esc(t)}<em>×${n}</em></span>`).join("");

    // ★ 6. 用户回复
    const topIds = new Set(tops.map((c) => c.id));
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.associated_id && topIds.has(v.associated_id));
    const sCnt = { "正面": 0, "中性": 0, "负面": 0 }; const iCnt = {}; const fCnt = {};
    voices.forEach((v) => {
      const s = v.sentiment || ""; if (sCnt[s] != null) sCnt[s]++;
      (v.reply_intent || "").split(/[、,，]/).filter(Boolean).forEach((t) => { iCnt[t] = (iCnt[t] || 0) + 1; });
      (v.reply_focus || "").split(/[、,，]/).filter(Boolean).forEach((t) => { fCnt[t] = (fCnt[t] || 0) + 1; });
    });
    const vt = voices.length;
    const barV = (c) => Object.entries(c).filter(([k, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `<div class="qc-bar"><span class="qc-name" style="width:72px">${esc(k)}</span><span class="qc-track"><i style="width:${v/vt*100}%;background:${PAL[0]}"></i></span><span class="qc-val">${Math.round(v/vt*100)}%<small>${v}条</small></span></div>`).join("");

    // ★ 7. 品牌表现（表格形式对标报告 Section 7.1）
    const brandPerf = Object.entries(dimRate("account").match ? {} : {}).length
      ? "" : ""; // skip — already in dimRate above
    // 提取品牌爆款详情表
    const brandAggs = dimRate("account", 15).match(/<div class="qc-bar">.*?<\/div><\/div>/g) ? [] : [];
    // Build brand table manually
    const brandMap = {};
    data.forEach((c) => {
      const n = c.account; if (!brandMap[n]) brandMap[n] = { total: 0, top: 0, scores: [] };
      brandMap[n].total++; if (c.isTop) brandMap[n].top++;
      if (c.viralScore != null) brandMap[n].scores.push(c.viralScore);
    });
    const brandTable = Object.entries(brandMap).map(([name, b]) => {
      const rate = Math.round(b.top / Math.max(b.total, 1) * 100);
      const avgS = b.scores.length ? (b.scores.reduce((s, x) => s + x, 0) / b.scores.length) : 0;
      return { name, total: b.total, top: b.top, rate, avgS };
    }).sort((a, b) => b.rate - a.rate);
    const brandTableHTML = `<table class="uv-cmp-table" style="font-size:12px"><thead><tr><th>品牌</th><th>发帖</th><th>爆款</th><th>爆款率</th><th>均爆款指数</th></tr></thead><tbody>${
      brandTable.slice(0, 12).map((b) => `<tr><td class="uv-cmp-metric">${esc(b.name)}</td><td class="uv-cmp-v">${b.total}</td><td class="uv-cmp-v">${b.top}</td><td class="uv-cmp-v win">${b.rate}%</td><td class="uv-cmp-v">${b.avgS.toFixed(2)}</td></tr>`).join("")
    }</tbody></table>`;

    // ★ 8. 洞察
    const compER = avg(tops, "engagementRate")/Math.max(avg(normal, "engagementRate"), 0.0001);
    const compLR = avg(tops, "likeRate")/Math.max(avg(normal, "likeRate"), 0.0001);
    const compCR = avg(tops, "commentRate")/Math.max(avg(normal, "commentRate"), 0.0001);
    const compSR = avg(tops, "shareRate")/Math.max(avg(normal, "shareRate"), 0.0001);
    const bestBrand = brandTable[0];
    const insight = `<div style="font-size:13px;line-height:1.7;color:var(--text)">
      <b style="color:var(--accent-strong)">核心发现</b>（基于 TOP10% 爆款 ${tops.length} 条 vs 普通 ${normal.length} 条）<br><br>
      <b>驱动因素</b>：传播率 <b>${compSR.toFixed(1)}x</b>、评论率 <b>${compCR.toFixed(1)}x</b>、互动率 <b>${compER.toFixed(1)}x</b> 是差距最大的三个指标 → <b style="color:var(--hot)">爆款的核心驱动力来自讨论与转发</b><br>
      <b>品牌标杆</b>：${esc(bestBrand.name)}（${bestBrand.rate}% · 均爆款指数 ${bestBrand.avgS.toFixed(2)}）<br>
      <b>内容模式</b>：89% 爆款内容为<b>转发媒体</b>型内容（媒体报道/KOL/用户晒单），说明转载型内容天然具备传播优势<br>
      <b>主题方向</b>：${Object.entries(topTopics).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([t]) => `<b>${esc(t)}</b>`).join("、")}
    </div>`;

    // ★ 9. Top 爆款
    const topPosts = tops.slice().sort((a, b) => b.viralScore - a.viralScore).slice(0, 10);
    const postCards = topPosts.map((c, i) => `<div class="list-row" data-id="${c.id}">
      <div class="lr-rank" style="font-size:14px;font-weight:800;color:var(--accent-strong);width:28px">#${i+1}</div>
      <div><div class="lr-text">${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)}</div></div>
      <div class="lr-num" style="color:var(--hot)">${c.viralScore.toFixed(1)}<small>爆款指数</small></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
    </div>`).join("");

    return `<div class="board-head"><div class="board-desc">${desc}</div></div>
      ${overview}
      <div class="panel" style="margin-bottom:14px"><div class="panel-title">爆款 vs 普通内容对比</div><div class="panel-sub">倍数越高说明该指标对爆款贡献越大</div>${comps}</div>
      <div class="vd-grid">
        <div class="vd-col"><div class="vd-title">爆款指数分布</div><div class="vd-bars">${distRows}</div></div>
        <div class="vd-col"><div class="vd-title">内容模式识别（TOP100 爆款）</div><div class="vd-bars">${patternRows}</div></div>
      </div>
      <div class="uv-insight" style="margin-bottom:16px">${insight}</div>
      <div class="vd-dim-section">
        <div class="vd-dim-head-row">
          <div class="vd-dim-head-title">维度深度钻取</div>
          <div class="vd-dim-head-sub">点选维度，逐值看「跨维度画像 + 代表爆款」</div>
        </div>
        <div class="uv-tabs" id="vd-dim-tabs">${VD_DIMS.map((d) => `<button class="uv-tab${state.vdDim === d.key ? " on" : ""}" data-vd-dim="${d.key}">${d.label}</button>`).join("")}</div>
        <div id="vd-deep">${renderDimDeep(state.vdDim)}</div>
      </div>
      <div class="panel" style="margin-top:10px">
        <div class="panel-title">用户回复分析</div><div class="panel-sub">爆款内容关联回帖 ${fmt(vt)} 条</div>
        <div class="vd-grid">
          <div class="vd-col"><div class="vd-title">情绪分布</div><div class="vd-bars">${barV(sCnt) || '<div style="color:var(--text-3);font-size:12px">暂无回帖</div>'}</div></div>
          <div class="vd-col"><div class="vd-title">回帖意图</div><div class="vd-bars">${barV(iCnt) || '<div style="color:var(--text-3);font-size:12px">暂无回帖</div>'}</div></div>
          <div class="vd-col"><div class="vd-title">关注焦点</div><div class="vd-bars">${barV(fCnt) || '<div style="color:var(--text-3);font-size:12px">暂无回帖</div>'}</div></div>
        </div>
      </div>
      <div class="vd-title" style="margin-top:18px">Top 爆款内容</div>
      <div class="list" style="margin-top:8px">${postCards}</div>`;
  }

  // ===== 爆款内容深度分析 · 维度深度钻取 =====
  const VD_DIMS = [
    { key: "account",        label: "按品牌",     field: "account",        multi: false, emptyLabel: "(空)" },
    { key: "contentType",    label: "按内容形式", field: "contentType",    multi: false, emptyLabel: "(空)" },
    { key: "emotion",        label: "按情绪风格", field: "emotion",        multi: false, emptyLabel: "未标记" },
    { key: "marketing_goal", label: "按营销目的", field: "marketing_goal", multi: true,  split: /[、,，]/, emptyLabel: "未标记" },
    { key: "content_source", label: "内容来源",   field: "content_source", multi: false, emptyLabel: "(空)" },
    { key: "topic",          label: "爆款高频主题", field: "topicTags",     multi: true,  emptyLabel: "(无主题)" },
  ];
  const VD_CROSS = [
    { key: "account",        label: "品牌 TOP",  field: "account",        multi: false, top: 5 },
    { key: "contentType",    label: "内容形式",  field: "contentType",    multi: false, top: 5 },
    { key: "emotion",        label: "情绪风格",  field: "emotion",        multi: false, top: 4 },
    { key: "marketing_goal", label: "营销目的",  field: "marketing_goal", multi: true,  split: /[、,，]/, top: 4 },
    { key: "topicTags",      label: "高频主题",  field: "topicTags",      multi: true,  top: 6 },
  ];

  function vdVals(item, cfg) {
    let vs;
    if (cfg.multi && cfg.split) vs = String(item[cfg.field] || "").split(cfg.split).map((s) => s.trim()).filter(Boolean);
    else if (cfg.multi) vs = (item[cfg.field] || []).filter(Boolean);
    else vs = [item[cfg.field]].map((v) => (typeof v === "string" && !v.trim() ? cfg.emptyLabel : v));
    return vs.length ? vs : [cfg.emptyLabel];
  }
  function vdDimRows(items, cfg) {
    const g = {};
    items.forEach((it) => vdVals(it, cfg).forEach((v) => { g[v] = (g[v] || 0) + 1; }));
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }
  function vdCrossCol(items, cfg, selfKey) {
    if (cfg.key === selfKey) return "";
    const rows = vdDimRows(items, cfg).slice(0, cfg.top || 5);
    if (!rows.length) return "";
    const max = rows[0][1] || 1;
    const bars = rows.map(([k, n], i) => `<div class="qc-bar"><span class="qc-name" style="width:62px;font-size:11px">${esc(k)}</span><span class="qc-track"><i style="width:${(n / max) * 100}%;background:${PAL[i % PAL.length]}"></i></span><span class="qc-val" style="min-width:54px;font-size:11px">${Math.round(n / items.length * 100)}%<small>${n}</small></span></div>`).join("");
    return `<div class="vd-cross-col"><div class="vd-cross-title">${cfg.label}</div>${bars}</div>`;
  }
  function vdRepCard(c) {
    return `<div class="list-row vd-rep-row" data-id="${c.id}">
      <div><div class="lr-text">${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion || "—")}</div></div>
      <div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款指数</small></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
    </div>`;
  }
  function vdDimCard(dimCfg, value, items, allLen) {
    const total = items.length;
    const top = items.filter((c) => c.isTop).length;
    const topRate = Math.round((top / Math.max(total, 1)) * 100);
    const avgExp = Math.round(avg(items, "exposure"));
    const avgEng = Math.round(avg(items, "engagement"));
    const avgER = avg(items, "engagementRate").toFixed(2);
    const avgVS = avg(items, "viralScore").toFixed(1);
    const share = Math.round((total / Math.max(allLen, 1)) * 100);
    const cross = [];
    VD_CROSS.forEach((c) => { if (c.key !== dimCfg.key) { const col = vdCrossCol(items, c, dimCfg.key); if (col) cross.push(col); } });
    const crossHTML = cross.slice(0, 4).join("");
    const reps = items.slice().sort((a, b) => b.viralScore - a.viralScore).slice(0, 3).map(vdRepCard).join("");
    return `<div class="vd-dim-card">
      <div class="vd-dim-card-head">
        <span class="vd-dim-card-name">${esc(value)}</span>
        <span class="vd-dim-badge ${topRate >= 20 ? "win" : ""}">爆款率 ${topRate}%</span>
      </div>
      <div class="vd-dim-card-sub">${fmt(total)} 帖 · 全库占比 ${share}% · 爆款 ${top} 条</div>
      <div class="vd-dim-metrics">
        <div><b>${fmt(avgExp)}</b><span>均曝光</span></div>
        <div><b>${fmt(avgEng)}</b><span>均互动</span></div>
        <div><b>${avgER}%</b><span>均互动率</span></div>
        <div><b>${avgVS}</b><span>均爆款指数</span></div>
      </div>
      <div class="vd-cross-grid">${crossHTML}</div>
      <div class="vd-rep"><div class="vd-rep-title">代表爆款（点击看深度分析）</div>${reps || '<div class="vd-muted">暂无</div>'}</div>
    </div>`;
  }
  function renderDimDeep(dimKey) {
    const dimCfg = VD_DIMS.find((d) => d.key === dimKey) || VD_DIMS[0];
    const data = getFiltered();
    const allLen = data.length;
    const groups = {};
    data.forEach((c) => vdVals(c, dimCfg).forEach((v) => { (groups[v] = groups[v] || []).push(c); }));
    const cards = Object.entries(groups).map(([value, items]) => {
      const total = items.length;
      const top = items.filter((c) => c.isTop).length;
      const topRate = Math.round((top / Math.max(total, 1)) * 100);
      return { value, items, total, top, topRate };
    }).sort((a, b) => (b.topRate - a.topRate) || (b.total - a.total));
    const dimName = dimCfg.label.replace(/^按/, "");
    const head = `<div class="vd-dim-summary">共 <b>${cards.length}</b> 个「${esc(dimName)}」取值 · 按爆款率降序 · 全库 ${fmt(allLen)} 帖（已应用当前筛选）</div>`;
    const grid = `<div class="vd-dim-grid">${cards.map((c) => vdDimCard(dimCfg, c.value, c.items, allLen)).join("")}</div>`;
    return head + grid;
  }

  function renderMyOps() {
    const brands = aggregateByField(getFiltered(), "account");
    const brandChips = brands.map((b) => `<span class="chip ops-brand${state.opsBrands.includes(b.name) ? " on" : ""}" data-brand="${esc(b.name)}">${esc(b.name)} (${b.count})</span>`).join("");
    const refs = [["rhythm", "运营节奏"], ["topic", "选题/内容"], ["format", "内容形式"], ["style", "风格调性"], ["metric", "指标阈值"], ["copy", "文案参考·本土化"]];
    const refChecks = refs.map(([k, label]) => `<label class="ops-ref"><input type="checkbox" data-ref="${k}" ${state.opsRefs.has(k) ? "checked" : ""}> ${label}</label>`).join("");
    return `<div class="board-head"><div class="board-desc">${boardDesc("myops")}</div></div>
      <div class="dim-note">选一个或多个竞品对标，勾选要参考的维度，生成可执行的运营方案。${state.opsBrands.length ? '<button class="mini-btn" id="ops-clear">清空</button>' : ""}</div>
      <div class="fp-chips" style="margin-bottom:12px">${brandChips}</div>
      <div class="ops-refs"><span class="ops-refs-label">参考维度：</span>${refChecks}</div>
      <button class="btn-primary" id="ops-gen" style="margin-top:12px">生成运营方案</button>
      <div id="ops-result"></div>`;
  }
  function bindMyOps() {
    $$(".ops-brand").forEach((el) => el.addEventListener("click", () => {
      const name = el.dataset.brand;
      if (state.opsBrands.includes(name)) state.opsBrands = state.opsBrands.filter((x) => x !== name);
      else state.opsBrands.push(name);
      renderBoard();
    }));
    const cl = $("#ops-clear"); if (cl) cl.addEventListener("click", () => { state.opsBrands = []; renderBoard(); });
    $$(".ops-ref").forEach((el) => el.addEventListener("change", () => {
      const input = el.querySelector("input");
      const k = input.dataset.ref;
      if (input.checked) state.opsRefs.add(k); else state.opsRefs.delete(k);
    }));
    const g = $("#ops-gen"); if (!g) return;
    g.addEventListener("click", () => {
      if (!state.opsBrands.length) { $("#ops-result").innerHTML = emptyState("请先选择至少一个对标竞品"); return; }
      const refs = state.opsRefs;
      let md = `# 我方运营方案\n对标竞品：${state.opsBrands.join("、")}\n参考维度：${[...refs].join("、")}\n生成时间：${new Date().toLocaleString()}\n\n`;
      let html = "";
      state.opsBrands.forEach((name) => {
        const items = getFiltered().filter((c) => c.account === name);
        if (!items.length) return;
        const weeks = new Set(items.map((c) => c.publishDate.slice(0, 7))).size || 1;
        const freq = (items.length / weeks).toFixed(1);
        const avgRate = Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length);
        const topCount = items.filter((c) => c.isTop).length;
        const types = {}; items.forEach((c) => (types[c.contentType] = (types[c.contentType] || 0) + 1));
        const topType = Object.entries(types).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
        const emotions = {}; items.forEach((c) => (emotions[c.emotion] = (emotions[c.emotion] || 0) + 1));
        const topEmo = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0] || ["—", 0];
        const avgEng = Math.min(3, items.reduce((s, c) => s + c.engagementRate, 0) / items.length).toFixed(2);
        let sec = "", mdSec = "";
        if (refs.has("rhythm")) { sec += opsSec("① 运营节奏", `<li>建议发布频率：<b>${freq}</b> 条/周（参照该竞品历史节奏）</li><li>爆款指数基准：${avgRate} · 爆款数 ${topCount}/${items.length}</li>`); mdSec += `### ① 运营节奏\n- 发布频率 ${freq} 条/周\n- 爆款指数基准 ${avgRate}\n`; }
        if (refs.has("topic")) { const tops = [...new Set(items.flatMap((c) => c.topicTags))].slice(0, 5).join("、") || "—"; const actPct = Math.round(items.filter((c) => c.isActivity).length / items.length * 100); sec += opsSec("② 选题 / 内容", `<li>高频主题：${esc(tops)}</li><li>活动型内容占比：${actPct}%</li>`); mdSec += `### ② 选题/内容\n- 高频主题 ${tops}\n- 活动占比 ${actPct}%\n`; }
        if (refs.has("format")) { sec += opsSec("③ 内容形式建议", `<li>主力形式：<b>${esc(topType[0])}</b>（占 ${topType[1]}/${items.length}）</li>`); mdSec += `### ③ 内容形式\n- 主力 ${topType[0]}\n`; }
        if (refs.has("style")) { sec += opsSec("④ 风格调性", `<li>推荐情绪调性：<b>${esc(topEmo[0])}</b></li>`); mdSec += `### ④ 风格调性\n- ${topEmo[0]}\n`; }
        if (refs.has("metric")) { sec += opsSec("⑤ 要观测的指标 + 阈值", `<li>爆款指数：周均值 ≥ ${avgRate}</li><li>互动率：≥ ${avgEng}%</li><li>发布频率：稳定 ≥ ${freq} 条/周</li><li>异常预警：单条爆款指数连续 2 周低于基准即复盘</li>`); mdSec += `### ⑤ 指标阈值\n- 爆款指数≥${avgRate}\n- 互动率≥${avgEng}%\n- 频率≥${freq}条/周\n`; }
        if (refs.has("copy")) {
          const ca = (state.users && state.users.corpusAnalysis) || {};
          const libAll = ca.localized || [];
          const brandLib = libAll.filter((x) => x.brand === name);
          const pool = brandLib.length ? brandLib : libAll;
          const topCopy = pool.slice().sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
          if (topCopy.length) {
            const mkHTML = (x) => (x.markers || []).map((m) => `<span class="uv-loc-mk ${esc(m)}">${esc(LOC_MARKER_NAME[m] || m)}</span>`).join("");
            const items2 = topCopy.map((x) => `<li class="ops-copy-row"><span class="ops-copy-mks">${mkHTML(x)}</span><span class="ops-copy-text">“${esc(x.text)}”</span><span class="uv-corp-like">♥ ${fmt(x.likes)}</span></li>`).join("");
            sec += opsSec("⑥ 美式本土化文案参考（来自真实用户语料库）", `<div class="ops-copy-hint">以下地道美式表达摘自对标品牌「${esc(name)}」${brandLib.length ? "相关" : "整体"}的高赞用户回帖，可作为我方文案的语气 / 用词参考：</div><ul class="ops-copy-list">${items2}</ul>`);
            mdSec += `### ⑥ 美式本土化文案参考\n` + topCopy.map((x) => `- [${(x.markers || []).join("/")}] "${x.text}" (♥${x.likes})`).join("\n") + `\n`;
          }
        }
        const topContent = items.slice().sort((a, b) => b.viralScore - a.viralScore).slice(0, 3);
        const tcHTML = topContent.map((c) => `<div class="list-row" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)}</div></div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款指数</small></div></div>`).join("");
        sec += opsSec("该竞品优质内容（可借鉴）", tcHTML);
        mdSec += `### 优质内容\n` + topContent.map((c, i) => `${i + 1}. ${c.text}（${c.contentType}·爆款指数${rate(c)}）`).join("\n") + `\n`;
        html += `<div class="ops-plan"><div class="ops-head">对标 <b>${esc(name)}</b> 的运营方案</div>${sec}</div>`;
        md += `## 对标 ${name}\n${mdSec}\n`;
      });
      md += `\n---\n※ 基于历史数据的规则化方案；接入 GPT 后可生成更精细文案与节奏建议。\n`;
      $("#ops-result").innerHTML = html + `<button class="btn-primary" id="ops-export" style="margin-top:14px">⬇ 导出方案（Markdown）</button>`;
      const ex = $("#ops-export"); if (ex) ex.addEventListener("click", () => downloadText(`运营方案_${state.opsBrands.join("_")}.md`, md));
    });
  }

  function bindViralDeep() {
    $$("#vd-dim-tabs .uv-tab", $("#board")).forEach((b) => b.addEventListener("click", () => {
      state.vdDim = b.dataset.vdDim;
      renderBoard();
    }));
  }

  /* ============ 了解用户：用户语料分析（富用户分析中枢）============ */
  const COL = { pos: "#2ee6a6", neu: "#6b7a99", neg: "#ff5d73", slate: "#6b7a99" };
  const HUES = ["#00f0ff", "#a06bff", "#ff7eb6", "#ffd166", "#2ee6a6", "#5b8cff", "#ff9d5c", "#8ad"];
  const LANG_COL = { en: "#00f0ff", de: "#a06bff", zh: "#ffd166", ru: "#ff7eb6", ja: "#2ee6a6", other: "#6b7a99" };
  const LANG_NAME = { en: "英语 EN", de: "德语 DE", zh: "中文 ZH", ru: "俄语 RU", ja: "日语 JA", other: "其他" };
  const INTENT_COL = { praise: "#00f0ff", request: "#a06bff", question: "#ffd166", banter: "#ff7eb6", complaint: "#ff5d73", other: "#6b7a99" };
  const INTENT_NAME = { praise: "赞美", request: "求购/合作", question: "提问", banter: "玩梗互动", complaint: "吐槽", other: "其他" };
  const LOC_MARKER_NAME = { slang: "俚语/口语", emoji: "Emoji 表达", contraction: "缩写词", emphasis: "强调语气", filler: "填充词", casual: "随性口吻" };
  const STYLE_NAME = { emojiRate: "Emoji 使用率", capsRate: "全大写率", exclaimRate: "感叹号率", questionRate: "提问率", firstPersonRate: "第一人称率", contractionRate: "缩写词率", emphasisRate: "强调语气率", slangRate: "口语/俚语率", avgWords: "平均句长" };

  function uvPct(n, total) { return total ? Math.round((n / total) * 100) : 0; }
  function uvBars(pairs) {
    const total = pairs.reduce((s, p) => s + p[1], 0) || 1;
    return `<div class="uv-bars">` + pairs.filter((p) => p[1] > 0).map(([label, n, color]) => {
      const w = (n / total) * 100;
      return `<div class="uv-bar"><span class="uv-bar-label">${esc(label)}</span><span class="uv-bar-track"><i style="width:${w.toFixed(1)}%;background:${color}"></i></span><span class="uv-bar-val">${fmt(n)}<em>${w.toFixed(0)}%</em></span></div>`;
    }).join("") + `</div>`;
  }
  function uvCloud(arr) {
    if (!arr || !arr.length) return `<div class="uv-muted">暂无词频</div>`;
    const max = arr[0].n, min = arr[arr.length - 1].n;
    return `<div class="uv-cloud">` + arr.map((o, i) => {
      const t = (o.n - min) / ((max - min) || 1);
      const sz = 12 + 24 * Math.sqrt(t);
      const c = `hsl(${HUES[i % HUES.length].replace("#", "")} 90% ${(58 + t * 12).toFixed(0)}%)`;
      return `<span class="uv-word" style="font-size:${sz.toFixed(1)}px;color:${c}" title="${esc(o.w)} · ${o.n}">${esc(o.w)}</span>`;
    }).join("") + `</div>`;
  }
  function uvTag(text, cls) { return `<span class="uv-tag ${cls || ""}">${esc(text)}</span>`; }
  function uvSentTag(s) { const m = { pos: "uv-s-pos", neu: "uv-s-neu", neg: "uv-s-neg" }; return uvTag(s, m[s] || ""); }
  function uvIntentTag(i) { const m = { praise: "uv-i-praise", request: "uv-i-request", question: "uv-i-question", banter: "uv-i-banter", complaint: "uv-i-complaint", other: "uv-i-other" }; return uvTag(i, m[i] || ""); }
  function uvLangTag(l) { const m = { en: "uv-l-en", de: "uv-l-de", zh: "uv-l-zh", ru: "uv-l-ru", ja: "uv-l-ja", other: "uv-l-other" }; return uvTag(l, m[l] || ""); }

  function renderUserBoard() {
    const U = state.users;
    const desc = BOARDS.find((b) => b.id === "uservoice").desc;
    if (!U) return `<div class="board-head"><div class="board-desc">${desc}</div></div>` + emptyState("用户分析数据待生成（运行 scripts/build_users.py）");
    const tabs = [["corpus", "用户语料分析"], ["topic", "分内容主题"], ["intent", "分营销目的"], ["emotion", "分情绪风格"], ["form", "分内容形式"], ["category", "分产品类目"]];
    const tabBar = `<div class="uv-tabs">${tabs.map(([id, name]) => `<button class="uv-tab${state.uvTab === id ? " on" : ""}" data-uv="${id}">${name}</button>`).join("")}</div>`;
    const m = U.meta;
    const meta = `<div class="uv-meta">真实用户回帖 <b>${fmt(m.genuine_replies_in_window)}</b> · 独立用户 <b>${fmt(m.genuine_users)}</b> · 多帖用户 <b>${fmt(m.multi_reply_users)}</b> · 窗口 ${m.window[0]} ~ ${m.window[1]}<span class="uv-meta-sub">（已过滤品牌官方回复 ${fmt(m.brand_reply_filtered)} 条）</span></div>`;
    let body = "";
    if (state.uvDrillMeta) {
      // 钻入式深度分析（从卡片标题旁的「🎯 深度分析」进入）
      const dm = state.uvDrillMeta;
      const backBtn = `<div style="margin-bottom:12px"><button class="btn-ghost" data-uv-back-drill>← 返回 ${tabs.find(([id]) => id === dm.tab)?.[1] || "上级"}</button></div>`;
      if (dm.tab === "corpus" || dm.tab === "say") body = backBtn + uvSayDeep(U);
      else if (dm.tab === "topic") body = backBtn + uvTopicDeep(U, dm.key);
      else if (dm.tab === "intent") body = backBtn + uvIntentDeep(U, dm.key);
      else if (dm.tab === "emotion") body = backBtn + uvEmotionDeep(U, dm.key);
      else if (dm.tab === "form") body = backBtn + uvFormDeep(U, dm.key);
      else if (dm.tab === "category") body = backBtn + uvCategoryDeep(U, dm.key);
      else body = backBtn + `<div class="uv-muted">暂不支持该维度钻入</div>`;
    } else {
      if (state.uvTab === "corpus") body = uvCorpus(U);
      else if (state.uvTab === "topic") body = uvTopic(U);
      else if (state.uvTab === "intent") body = uvIntent(U);
      else if (state.uvTab === "emotion") body = uvEmotion(U);
      else if (state.uvTab === "category") body = uvCategory(U);
      else body = uvForm(U);
    }
    return `<div class="board-head"><div class="board-desc">${desc}</div></div>${meta}${tabBar}${body}`;
  }

  function uvSay(U) {
    const c = U.corpus;
    const s = c.sentiment, it = c.intent, tp = c.topic, tot = c.total || 1;
    const sPairs = [["正面", s.pos || 0, COL.pos], ["中性", s.neu || 0, COL.neu], ["负面", s.neg || 0, COL.neg]];
    const iPairs = Object.entries(it).map(([k, v]) => [INTENT_NAME[k] || k, v, INTENT_COL[k] || COL.slate]);
    const tPairs = Object.entries(tp).slice(0, 8).map(([k, v], i) => [k, v, HUES[i % HUES.length]]);
    const praiseP = uvPct(it.praise || 0, tot), reqP = uvPct(it.request || 0, tot), negP = uvPct(s.neg || 0, tot);
    const concl = `<div class="uv-concl">结论：用户声音以 <b>赞美 ${praiseP}%</b> 与 <b>求购/合作意向 ${reqP}%</b> 为主，负面仅 <b>${negP}%</b>——社群处于「高好感 + 强转化意向」状态，适合做口碑放大与承接转化。</div>`;
    const topBrands = U.brandEval.slice(0, 6).map((b) => `<button class="uv-tab uv-jump" data-uv="brand">${esc(b.brand)} · ${fmt(b.replyCount)}</button>`).join("");
    return `<div class="uv-block">
      <div class="uv-block-title">① 用户情绪倾向（正面 / 中性 / 负面）</div>
      ${uvBars(sPairs)}
      <div class="uv-block-title" style="margin-top:18px">② 用户意图分布（他们来这里想做什么）</div>
      ${uvBars(iPairs)}
      <div class="uv-block-title" style="margin-top:18px">③ 讨论主题（按原帖类目）</div>
      ${uvBars(tPairs)}
      ${concl}
      <div class="uv-block-title" style="margin-top:18px">④ 品牌声音预览（点击跳到分品牌评价）</div>
      <div class="uv-jump-row">${topBrands}</div>
    </div>`;
  }

  function uvCorpus(U) {
    // 用户语料分析 = 语言使用分析（首）＋ 用户在说什么（置于语言板块下方）
    return uvLanguage(U) + uvSay(U);
  }

  function uvLanguage(U) {
    const c = U.corpus;
    const ca = U.corpusAnalysis || { style: {}, bigrams: [], trigrams: [], phrasesByIntent: {}, emotionQuotes: {}, localized: [], localizedByMarker: {} };
    const st = ca.style || {};
    const enN = c.lang.en || 0, tot = Object.values(c.lang).reduce((s, v) => s + v, 0) || 1;
    const lPairs = Object.entries(c.lang).map(([k, v]) => [LANG_NAME[k] || k, v, LANG_COL[k] || COL.slate]);
    const enPct = Math.round((enN / tot) * 100);
    const locNote = `<div class="uv-note">🇺🇸 美式英语主导：占 <b>${enPct}%</b>（${fmt(enN)} 条），是绝对主体的本土语境。下面的分析全部基于真实英文回帖，重点呈现「地道美式表达」而非翻译。</div>`;
    // ② 语言风格指标
    const styleCards = [["avgWords", st.avgWords, "词"], ["firstPersonRate", st.firstPersonRate, "%"], ["contractionRate", st.contractionRate, "%"], ["emphasisRate", st.emphasisRate, "%"], ["slangRate", st.slangRate, "%"], ["emojiRate", st.emojiRate, "%"], ["exclaimRate", st.exclaimRate, "%"], ["capsRate", st.capsRate, "%"], ["questionRate", st.questionRate, "%"]]
      .filter(([k]) => st[k] != null).map(([k, v, unit]) => `<div class="uv-style-card"><div class="uv-style-val">${v}<span class="uv-style-unit">${unit}</span></div><div class="uv-style-label">${STYLE_NAME[k] || k}</div></div>`).join("");
    // ③ 高频短语
    const maxN = (ca.bigrams[0] || { n: 1 }).n || 1;
    const phraseCards = ca.bigrams.slice(0, 18).map((p) => { const fs2 = Math.round(12 + 16 * (p.n / maxN)); return `<span class="uv-phrase" style="font-size:${fs2}px">${esc(p.w)} <i>${fmt(p.n)}</i></span>`; }).join("");
    const triCards = ca.trigrams.slice(0, 10).map((p) => `<span class="uv-phrase uv-phrase-sm">${esc(p.w)} <i>${fmt(p.n)}</i></span>`).join("");
    // ④ 分意图口吻语录
    const intentSec = Object.entries(ca.phrasesByIntent || {}).map(([k, arr]) => {
      if (!arr || !arr.length) return "";
      const quotes = arr.slice(0, 2).map((q) => `<div class="uv-quote">“${esc(q.text)}”<span class="uv-quote-meta">♥ ${fmt(q.likes)}${q.brand ? " · " + esc(q.brand) : ""}</span></div>`).join("");
      return `<div class="uv-intent-col"><div class="uv-intent-head">${uvIntentTag(k)}</div>${quotes}</div>`;
    }).join("");
    // ⑤ 分情绪样例
    const emoSec = Object.entries(ca.emotionQuotes || {}).map(([k, arr]) => {
      if (!arr || !arr.length) return "";
      const quotes = arr.slice(0, 2).map((q) => `<div class="uv-quote">“${esc(q.text)}”<span class="uv-quote-meta">♥ ${fmt(q.likes)}</span></div>`).join("");
      return `<div class="uv-intent-col"><div class="uv-intent-head">${uvSentTag(k)}</div>${quotes}</div>`;
    }).join("");
    // ⑥ 美式本土化表达库
    const markers = [["all", "全部"], ...Object.keys(ca.localizedByMarker || {}).map((m) => [m, LOC_MARKER_NAME[m] || m])];
    const markerChips = markers.map(([m, name]) => `<span class="chip uv-loc-chip${state.uvLocMarker === m ? " on" : ""}" data-loc="${esc(m)}">${esc(name)}</span>`).join("");
    const locSrc = state.uvLocMarker === "all" ? (ca.localized || []) : (ca.localizedByMarker[state.uvLocMarker] || []);
    const locCards = locSrc.slice(0, 30).map((x) => `<div class="uv-loc-card">
        <div class="uv-loc-top">${(x.markers || []).map((m) => `<span class="uv-loc-mk ${esc(m)}">${esc(LOC_MARKER_NAME[m] || m)}</span>`).join("")}<span class="uv-corp-like">♥ ${fmt(x.likes)}</span></div>
        <div class="uv-loc-text">${esc(x.text)}</div>
        <div class="uv-loc-meta">${esc(x.brand || "")}${x.form ? " · " + esc(x.form) : ""} · ${uvIntentTag(x.intent)} ${uvSentTag(x.sent)} <a class="uv-link" href="${esc(x.link || "#")}" target="_blank" rel="noreferrer">原帖↗</a></div>
      </div>`).join("");
    // ⑦ 真实语料库（可搜索 + 按标记筛选）
    const corpusMarkerChips = [["all", "全部"], ...Object.keys(LOC_MARKER_NAME).map((m) => [m, LOC_MARKER_NAME[m]])]
      .map(([m, name]) => `<span class="chip uv-corp-mk-chip${state.uvCorpusMarker === m ? " on" : ""}" data-cm="${esc(m)}">${esc(name)}</span>`).join("");
    const browser = `<div class="uv-corp">
      <div class="fp-chips uv-corp-mk-row"><span class="uv-corp-mk-label">按标记筛选：</span>${corpusMarkerChips}</div>
      <div class="uv-corp-head"><input id="uv-corpus-search" class="uv-search" placeholder="搜索语料：关键词 / 品牌…" /><span class="uv-corp-count-wrap">命中 <b id="uv-corp-count">${U.corpusSamples.length}</b> / ${U.corpusSamples.length}</span></div>
      <div class="uv-corp-list">${U.corpusSamples.map(uvCorpItem).join("")}</div></div>`;
    // 导出工具栏
    const exportBar = `<div class="uv-export">
      <span class="uv-export-label">导出：</span>
      <button class="mini-btn" data-uvx="json">全量 JSON</button>
      <button class="mini-btn" data-uvx="csv">本土化语料 CSV</button>
      <button class="mini-btn" data-uvx="md">本土化学习 + skill 训练 (.md)</button>
    </div>`;
    return `<div class="uv-block">
      ${exportBar}
      <div class="uv-block-title">① 用户使用什么语言？</div>
      ${uvBars(lPairs)}
      ${locNote}
      <div class="uv-block-title" style="margin-top:18px">② 语言风格指标（美式真实回帖的语言习惯）</div>
      <div class="uv-style-grid">${styleCards}</div>
      <div class="uv-block-title" style="margin-top:18px">③ 高频短语 / 词频（越大越常出现）</div>
      <div class="uv-phrase-cloud">${phraseCards}</div>
      ${triCards ? `<div class="uv-sub-note">三字短语：${triCards}</div>` : ""}
      <div class="uv-block-title" style="margin-top:18px">④ 分意图口吻语录（不同意图下的真实表达）</div>
      <div class="uv-intent-grid">${intentSec || "<div class='uv-note'>暂无数据</div>"}</div>
      <div class="uv-block-title" style="margin-top:18px">⑤ 分情绪样例（情绪如何被说出来）</div>
      <div class="uv-intent-grid">${emoSec || "<div class='uv-note'>暂无数据</div>"}</div>
      <div class="uv-block-title" style="margin-top:18px">⑥ 美式本土化表达库（按语言风格标记 · 可筛选）</div>
      <div class="fp-chips" style="margin-bottom:10px">${markerChips}</div>
      <div class="uv-loc-grid">${locCards || "<div class='uv-note'>该标记下暂无样本</div>"}</div>
      <div class="uv-block-title" style="margin-top:18px">⑦ 真实语料库（可搜索英文原文 · 带语言风格标记）</div>
      ${browser}
    </div>`;
  }
  function uvCorpItem(s) {
    const mks = (s.markers || []).map((m) => `<span class="uv-loc-mk ${esc(m)}">${esc(LOC_MARKER_NAME[m] || m)}</span>`).join("");
    return `<div class="uv-corp-item" data-text="${esc(s.text)}" data-brand="${esc(s.brand)}" data-markers="${(s.markers || []).join(" ")}">
      <div class="uv-corp-top">${uvLangTag(s.lang)} ${uvSentTag(s.sent)} ${uvIntentTag(s.intent)} ${mks}<span class="uv-corp-brand">${esc(s.brand)}</span> <span class="uv-corp-form">${esc(s.form)}</span> <span class="uv-corp-like">♥ ${fmt(s.likes)}</span></div>
      <div class="uv-corp-text">${esc(s.text)}</div>
      <a class="uv-link" href="${esc(s.link || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a>
    </div>`;
  }
  function uvExportCorpus(kind) {
    const U = state.users; if (!U) return;
    const ca = U.corpusAnalysis || {};
    if (kind === "json") {
      downloadFile("user_corpus_analysis.json", JSON.stringify(U, null, 2), "application/json");
      toast("已导出全量语料分析 JSON");
    } else if (kind === "csv") {
      const rows = [["text", "likes", "brand", "form", "intent", "sentiment", "markers", "link"]];
      (ca.localized || []).forEach((x) => rows.push([x.text, x.likes, x.brand || "", x.form || "", x.intent || "", x.sent || "", (x.markers || []).join("|"), x.link || ""]));
      const csv = rows.map((r) => r.map(csvCell).join(",")).join("\n");
      downloadFile("us_localized_expressions.csv", "﻿" + csv, "text/csv");
      toast("已导出本土化语料 CSV（" + (ca.localized || []).length + " 条）");
    } else if (kind === "md") {
      let md = "# 美式用户语料 · 本土化表达学习库\n\n";
      md += "> 本库抽取自真实用户英文回帖，按语言风格标记（slang / emoji / contraction / emphasis / filler / casual）。\n> 用途：① 人类学习地道美式社媒表达；② 作为 AI 训练语料，辅助生成「本土化表达」skill。\n\n";
      md += "## 一、语言风格指标（整体）\n\n" + Object.entries(ca.style || {}).filter(([k]) => k !== "total").map(([k, v]) => "- **" + (STYLE_NAME[k] || k) + "**：" + v + (k === "avgWords" ? " 词" : "%")).join("\n") + "\n\n";
      md += "## 二、高频短语（按出现次数）\n\n";
      (ca.bigrams || []).forEach((p) => { md += "- " + p.w + "（" + p.n + "）\n"; });
      md += "\n## 三、美式本土化表达库（按标记分组）\n\n";
      for (const [mk, arr] of Object.entries(ca.localizedByMarker || {})) {
        md += "### " + (LOC_MARKER_NAME[mk] || mk) + "\n\n";
        (arr || []).forEach((x) => { md += "- \"" + x.text.replace(/"/g, "'") + "\" — ♥" + x.likes + (x.brand ? " · " + x.brand : "") + (x.link ? " · " + x.link : "") + "\n"; });
        md += "\n";
      }
      md += "## 四、给 AI 的 skill 训练语料（system 提示）\n\n```\n你是一个熟悉美式英语社媒本土表达的助手。以下是从真实用户回帖中提取的地道美式表达示例（含俚语、缩写、emoji、强调语气、填充词），请在生成英文内容时优先采用这类自然口语风格，而非翻译腔：\n";
      (ca.localized || []).slice(0, 50).forEach((x) => { md += x.text + "\n"; });
      md += "```\n";
      downloadText("us_localization_guide.md", md);
      toast("已导出本土化学习 + skill 训练文档");
    }
  }

  // 投入度分层卡片网格（仅卡片，外层区块标题由 renderUserTier 统一提供）
  function uvLayers(U) {
    const order = ["l1", "l2", "l3", "l4"];
    const cards = order.map((k) => {
      const L = U.layers[k]; const tot = L.count || 1;
      const sPairs = [["正面", L.sentiment.pos || 0, COL.pos], ["中性", L.sentiment.neu || 0, COL.neu], ["负面", L.sentiment.neg || 0, COL.neg]];
      const samples = L.samples.map((s) => `<div class="uv-layer-sample">${uvLangTag(s.lang)} ${uvSentTag(s.sent)} <span class="uv-sample-text">${esc(s.text)}</span> <a class="uv-link" href="${esc(s.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
      return `<div class="uv-layer-card">
        <div class="uv-layer-head"><span class="uv-layer-name">${L.meta.name}</span><span class="uv-layer-count">${fmt(L.count)} 条 · ${uvPct(L.count, U.meta.genuine_replies_in_window)}%</span></div>
        <div class="uv-layer-desc">${L.meta.desc}</div>
        <div class="uv-layer-bars">${uvBars(sPairs)}</div>
        <details class="uv-layer-det"><summary>看 ${L.samples.length} 条样例</summary>${samples}</details>
        <div class="uv-layer-foot"><button class="btn-ghost uv-layer-enter" data-uv-layer="${k}">🎯 深度分析 →</button></div>
      </div>`;
    }).join("");
    return `<div class="uv-layer-grid">${cards}</div>`;
  }

  function uvRank(U) {
    const all = U.topUsers.length;
    const shown = state.uvRankAll ? all : Math.min(50, all);
    const users = U.topUsers.slice(0, shown);
    const rows = users.map((u, i) => {
      const brandChips = u.brands.slice(0, 5).map((b) => `<span class="uv-chip">${esc(b.b)}<em>×${b.n}</em></span>`).join("");
      const langChips = Object.entries(u.langs).map(([k, v]) => `<span class="uv-chip">${LANG_NAME[k] || k}<em>×${v}</em></span>`).join("");
      const formChips = u.forms.slice(0, 4).map((f) => `<span class="uv-chip">${esc(f.f)}<em>×${f.n}</em></span>`).join("");
      const s = u.sents || {};
      const sPairs = [["正面", s.pos || 0, COL.pos], ["中性", s.neu || 0, COL.neu], ["负面", s.neg || 0, COL.neg]];
      const iPairs = Object.entries(u.intents || {}).map(([k, v]) => [INTENT_NAME[k] || k, v, INTENT_COL[k] || COL.slate]);
      const quotes = u.samples.slice(0, 2).map((q) => `<div class="uv-quote">${uvLangTag(q.lang)} ${uvSentTag(q.sent)} ${uvIntentTag(q.intent)} <span class="uv-q-text">${esc(dispVoice(q))}</span></div>`).join("");
      // 展开后的深度画像：全部语录（带赞数与原帖链接）+ 完整意图分布 + 活跃周期
      const deepQuotes = (u.samples || []).map((q) => `<div class="uv-quote uv-dq">
        <span class="uv-q-tags">${uvLangTag(q.lang)} ${uvSentTag(q.sent)} ${uvIntentTag(q.intent)}</span>
        <span class="uv-q-text">${esc(dispVoice(q))}</span>
        <span class="uv-q-meta">♥${fmt(q.likes || 0)} · ${esc(q.brand || "")} · ${esc(q.form || "")} · ${esc(q.date || "")}</span>
        ${q.link ? `<a class="uv-link" href="${esc(q.link)}" target="_blank" rel="noreferrer">查看原帖 ↗</a>` : ""}
      </div>`).join("");
      const deep = `<div class="uv-user-deep">
        <div class="uv-deep-grid">
          <div class="uv-deep-cell"><b>活跃周期</b>${esc(u.first)} → ${esc(u.last)}</div>
          <div class="uv-deep-cell"><b>总字数 / 平均</b>${fmt(u.totalWords)} / ${u.avgWords}</div>
          <div class="uv-deep-cell"><b>主品牌</b>${esc(u.topBrand || "—")}</div>
          <div class="uv-deep-cell"><b>语言模式</b>${langChips || "—"}</div>
        </div>
        <div class="uv-deep-row"><b>完整意图分布</b>${uvBars(iPairs)}</div>
        <div class="uv-deep-row"><b>品牌归属</b><span class="uv-chips">${u.brands.map((b) => `<span class="uv-chip">${esc(b.b)}<em>×${b.n}</em></span>`).join("") || "—"}</span></div>
        <div class="uv-deep-row"><b>参与形式</b><span class="uv-chips">${u.forms.map((f) => `<span class="uv-chip">${esc(f.f)}<em>×${f.n}</em></span>`).join("") || "—"}</span></div>
        <div class="uv-deep-row"><b>全部代表语录（${u.samples.length}）</b><div class="uv-deep-quotes">${deepQuotes}</div></div>
      </div>`;
      return `<details class="uv-user-card">
        <summary class="uv-user-summary">
          <span class="uv-rank">#${i + 1}</span>
          <span class="uv-uname" title="@${esc(u.name)}">@${esc(u.name)}</span>
          <span class="uv-ucount">${u.replyCount} 次回复</span>
          <span class="uv-uavg">${u.avgWords} 词/条</span>
          <span class="uv-uchev">▾</span>
        </summary>
        <div class="uv-user-body">
          <div class="uv-user-line"><b>品牌归属</b><span class="uv-chips">${brandChips || "—"}</span></div>
          <div class="uv-user-line"><b>语言模式</b><span class="uv-chips">${langChips || "—"}</span></div>
          <div class="uv-user-line"><b>参与形式</b><span class="uv-chips">${formChips || "—"}</span></div>
          <div class="uv-user-line"><b>倾向</b><span class="uv-bars-inline">${uvBars(sPairs)}</span></div>
          <div class="uv-user-quotes"><b>代表语录</b>${quotes}</div>
          <div class="uv-deep-toggle-hint">点击卡片展开完整深度画像 ↓</div>
          ${deep}
        </div>
      </details>`;
    }).join("");
    const toggleBtn = `<button class="uv-rank-toggle" data-uv-rank-toggle>${state.uvRankAll ? `收起（仅看 Top 50）` : `展开全部 ${all} 人 →`}</button>`;
    const segDeepBtn = `<button class="uv-rank-toggle uv-seg-deep-btn" data-uv-seg-deep>📊 高互动用户综合深度分析 →</button>`;
    const hint = state.uvRankAll ? "" : `<div class="uv-muted uv-rank-hint">已显示窗口内回复数最高的 50 人；点击「展开全部」查看共 ${all} 位高互动用户。每个卡片可点开看完整深度画像。</div>`;
    return `<div class="uv-block">
      <div class="uv-block-title uv-block-title-row">高互动用户排行（窗口内回复数 · 已显示 Top ${shown} / 共分析 ${all} 人）<span class="uv-title-actions">${toggleBtn}${segDeepBtn}</span></div>
      ${hint}
      <div class="uv-user-grid">${rows}</div>
    </div>`;
  }

  function uvBrand(U) {
    const cards = U.brandEval.map((b) => {
      const sPairs = [["正面", b.sentiment.pos || 0, COL.pos], ["中性", b.sentiment.neu || 0, COL.neu], ["负面", b.sentiment.neg || 0, COL.neg]];
      const kw = b.keywords.slice(0, 14).map((k) => `<span class="uv-tag">${esc(k.w)}<em>×${k.n}</em></span>`).join("");
      const tp = b.topics.slice(0, 5).map((t) => `<span class="uv-chip">${esc(t.t)}<em>×${t.n}</em></span>`).join("");
      const tu = b.topUsers.slice(0, 4).map((t) => `<span class="uv-chip">${esc(t.u)}<em>×${t.n}</em></span>`).join("");
      const q = b.quotes.slice(0, 3).map((qq) => `<div class="uv-quote">${uvLangTag(qq.lang)} ${uvSentTag(qq.sent)} <span class="uv-q-text">${esc(dispVoice(qq))}</span> <a class="uv-link" href="${esc(qq.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
      return `<div class="uv-brand-card">
        <div class="uv-brand-head"><span class="uv-brand-name">${esc(b.brand)}</span><span class="uv-brand-count">${fmt(b.replyCount)} 条用户声音</span></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>高频词</b><div class="uv-tags">${kw}</div></div>
        <div class="uv-row"><b>主题</b><div class="uv-tags">${tp}</div></div>
        <div class="uv-row"><b>高互动用户</b><div class="uv-tags">${tu}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${q}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block"><div class="uv-block-title">分品牌评价（用户对各个品牌的整体声音）</div><div class="uv-brand-grid">${cards}</div></div>`;
  }

  function uvForm(U) {
    const cards = U.formEval.map((f) => {
      const sPairs = [["正面", f.sentiment.pos || 0, COL.pos], ["中性", f.sentiment.neu || 0, COL.neu], ["负面", f.sentiment.neg || 0, COL.neg]];
      const kw = f.keywords.slice(0, 12).map((k) => `<span class="uv-tag">${esc(k.w)}<em>×${k.n}</em></span>`).join("");
      const q = f.quotes.slice(0, 3).map((qq) => `<div class="uv-quote">${uvLangTag(qq.lang)} ${uvSentTag(qq.sent)} <span class="uv-q-text">${esc(dispVoice(qq))}</span> <a class="uv-link" href="${esc(qq.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
      return `<div class="uv-form-card">
        <div class="uv-form-head"><span class="uv-form-name">${esc(f.form)}</span><span class="uv-form-count">${fmt(f.replyCount)} 条参与</span><button class="btn-ghost uv-drill-btn" data-uv-drill="form" data-uv-key="${esc(f.form)}">🎯 深度分析 →</button></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>用户提及词</b><div class="uv-tags">${kw}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${q}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block"><div class="uv-block-title">分内容形式（用户参与了什么形式、怎么聊它）</div><div class="uv-form-grid">${cards}</div></div>`;
  }

  /* ---------- 各 tab 钻入式深度分析 ---------- */
  /* ---------- 深度分析共用：样本统计 + 帖子卡片 ---------- */
  function uvSampleStats(samples) {
    const arr = samples || [];
    const lang = {}, form = {}, brand = {};
    let wc = 0, wcc = 0;
    arr.forEach((s) => {
      if (s.lang) lang[s.lang] = (lang[s.lang] || 0) + 1;
      if (s.form) form[s.form] = (form[s.form] || 0) + 1;
      if (s.brand) brand[s.brand] = (brand[s.brand] || 0) + 1;
      const w = s.wc || (s.text ? s.text.trim().split(/\s+/).length : 0);
      if (w) { wc += w; wcc++; }
    });
    return { lang, form, brand, avgWc: wcc ? Math.round(wc / wcc) : 0 };
  }
  function uvDistBars(obj) {
    const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v], i) => [k, v, PAL[i % PAL.length]]);
    return entries.length ? uvBars(entries) : `<div class="uv-muted">暂无分布数据</div>`;
  }
  function uvDistChips(obj) {
    const entries = Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return entries.length ? entries.map(([k, v]) => `<span class="uv-chip">${esc(k)}<em>×${v}</em></span>`).join("") : `<span class="uv-muted">—</span>`;
  }
  function uvPostCards(samples, maxN) {
    return (samples || []).slice(0, maxN || 4).map((s) => {
      const link = s.link || "#";
      return `<a class="uv-post" href="${esc(link)}" target="_blank" rel="noreferrer">
        <div class="uv-post-meta"><span class="uv-post-brand">${esc(s.brand || "—")}</span>${s.form ? `<span class="uv-chip-mini">${esc(s.form)}</span>` : ""}${s.lang ? `<span class="uv-chip-mini">${esc(s.lang)}</span>` : ""}${s.sent ? uvSentTag(s.sent) : ""}</div>
        <div class="uv-post-text">${esc(s.text || "")}</div>
        <div class="uv-post-link">↗ 查看原帖</div>
      </a>`;
    }).join("") || `<div class="uv-muted">暂无原帖样本</div>`;
  }

  function uvTopicDeep(U, topic) {
    const dim = U.dimBreakdown?.topicBreakdown?.find((t) => t.name === topic);
    if (!dim) return `<div class="uv-muted">暂无「${esc(topic)}」深度数据</div>`;
    const st = dim.sentiment||{}; const sTot = (st.pos||0)+(st.neu||0)+(st.neg||0)||1;
    const posR = Math.round((st.pos||0)/sTot*100), negR = Math.round((st.neg||0)/sTot*100);
    const brandsBars = uvBars(Object.entries(dim.brands||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i) => [k, v, PAL[i%PAL.length]]));
    const intentBars = uvBars(Object.entries(dim.intents||{}).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v],i) => [INTENT_NAME[k]||k, v, INTENT_COL[k]||PAL[i%PAL.length]]));
    const ss = uvSampleStats(dim.samples);
    const q = (dim.samples||[]).slice(0,6).map((s) => `<div class="uv-layer-sample">${uvLangTag(s.lang||"")} ${uvSentTag(s.sent||"")} ${esc(s.text||"")}</div>`).join("");
    return `<div class="uv-drill"><div class="uv-drill-title">📊 「${esc(topic)}」主题深度分析</div>
      <div class="uv-drill-count">${fmt(dim.count||0)} 条 · 正面 ${posR}% · 负面 ${negR}%</div>
      <div class="bud-two" style="margin-top:12px"><div class="bud-panel"><div class="bud-panel-t">关联品牌</div>${brandsBars}</div>
      <div class="bud-panel"><div class="bud-panel-t">用户意图</div>${intentBars}</div></div>
      <div class="dp-section"><div class="dp-sec-title">👥 用户情况（讨论该主题的用户画像）</div>
        <div class="uv-row"><b>语言构成</b><div class="uv-tags">${uvDistChips(ss.lang)}</div></div>
        <div class="uv-bars-mini">${uvDistBars(ss.lang)}</div>
        <div class="uv-row"><b>主要提及品牌</b><div class="uv-tags">${uvDistChips(ss.brand)}</div></div>
        <div class="uv-muted" style="margin-top:4px">平均每条 ${ss.avgWc} 词 · 共 ${fmt((dim.samples||[]).length)} 条样本</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">📮 帖子情况（他们发的是什么形式的内容）</div>
        <div class="uv-bars-mini">${uvDistBars(ss.form)}</div>
        <div class="uv-posts">${uvPostCards(dim.samples, 4)}</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录</div><div class="uv-layer-samples">${q || "—"}</div></div>
    </div>`;
  }
  function uvIntentDeep(U, intent) {
    const dim = U.dimBreakdown?.intentBreakdown?.find((t) => t.name === intent);
    if (!dim) return `<div class="uv-muted">暂无「${esc(intent)}」深度数据</div>`;
    const st = dim.sentiment||{}; const sTot = (st.pos||0)+(st.neu||0)+(st.neg||0)||1;
    const posR = Math.round((st.pos||0)/sTot*100);
    const brandsBars = uvBars(Object.entries(dim.brands||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i) => [k, v, PAL[i%PAL.length]]));
    const topicBars = uvBars(Object.entries(dim.topics||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i) => [k, v, PAL[(i+3)%PAL.length]]));
    const ss = uvSampleStats(dim.samples);
    const q = (dim.samples||[]).slice(0,6).map((s) => `<div class="uv-layer-sample">${uvLangTag(s.lang||"")} ${uvSentTag(s.sent||"")} ${esc(s.text||"")}</div>`).join("");
    const insight = `${INTENT_NAME[intent]||intent} · 正面率 ${posR}%。${posR>=60?"该目的下用户情绪积极，适合做口碑与推荐内容。":"该目的下用户偏负面/中性，需要针对性优化。"}`;
    return `<div class="uv-drill"><div class="uv-drill-title">📊 「${INTENT_NAME[intent]||intent}」营销目的深度分析</div>
      <div class="uv-drill-count">${fmt(dim.count||0)} 条 · 正面 ${posR}% · ${insight}</div>
      <div class="bud-two" style="margin-top:12px"><div class="bud-panel"><div class="bud-panel-t">关联品牌</div>${brandsBars}</div>
      <div class="bud-panel"><div class="bud-panel-t">关联主题</div>${topicBars}</div></div>
      <div class="dp-section"><div class="dp-sec-title">👥 用户情况（带着该目的来的用户画像）</div>
        <div class="uv-row"><b>语言构成</b><div class="uv-tags">${uvDistChips(ss.lang)}</div></div>
        <div class="uv-bars-mini">${uvDistBars(ss.lang)}</div>
        <div class="uv-row"><b>主要提及品牌</b><div class="uv-tags">${uvDistChips(ss.brand)}</div></div>
        <div class="uv-muted" style="margin-top:4px">平均每条 ${ss.avgWc} 词 · 共 ${fmt((dim.samples||[]).length)} 条样本</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">📮 帖子情况（他们发的是什么形式的内容）</div>
        <div class="uv-bars-mini">${uvDistBars(ss.form)}</div>
        <div class="uv-posts">${uvPostCards(dim.samples, 4)}</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录</div><div class="uv-layer-samples">${q || "—"}</div></div>
    </div>`;
  }
  function uvEmotionDeep(U, emotion) {
    const dim = U.dimBreakdown?.sentimentBreakdown?.find((t) => t.name === emotion);
    if (!dim) return `<div class="uv-muted">暂无「${esc(emotion)}」深度数据</div>`;
    const st = dim.sentiment||{}; const sTot = (st.pos||0)+(st.neu||0)+(st.neg||0)||1;
    const posR = Math.round((st.pos||0)/sTot*100);
    const style = dim.style||{};
    const emojiR = Math.round((style.emoji||0)/Math.max(dim.count||1,1)*100);
    const slangR = Math.round((style.slang||0)/Math.max(dim.count||1,1)*100);
    const intentBars = uvBars(Object.entries(dim.intents||{}).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v],i) => [INTENT_NAME[k]||k, v, INTENT_COL[k]||PAL[i%PAL.length]]));
    const brandsBars = uvBars(Object.entries(dim.brands||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i) => [k, v, PAL[(i+3)%PAL.length]]));
    const ss = uvSampleStats(dim.samples);
    const q = (dim.samples||[]).slice(0,6).map((s) => `<div class="uv-layer-sample">${uvLangTag(s.lang||"")} ${uvSentTag(s.sent||"")} ${esc(s.text||"")}</div>`).join("");
    return `<div class="uv-drill"><div class="uv-drill-title">📊 「${esc(emotion)}」情绪风格深度分析</div>
      <div class="uv-drill-count">${fmt(dim.count||0)} 条 · 正面率 ${posR}% · Emoji ${emojiR}% · 俚语 ${slangR}%</div>
      <div class="bud-two" style="margin-top:12px"><div class="bud-panel"><div class="bud-panel-t">用户意图</div>${intentBars}</div>
      <div class="bud-panel"><div class="bud-panel-t">关联品牌</div>${brandsBars}</div></div>
      <div class="dp-section"><div class="dp-sec-title">👥 用户情况（带这种情绪风格的用户画像）</div>
        <div class="uv-row"><b>语言构成</b><div class="uv-tags">${uvDistChips(ss.lang)}</div></div>
        <div class="uv-bars-mini">${uvDistBars(ss.lang)}</div>
        <div class="uv-row"><b>主要提及品牌</b><div class="uv-tags">${uvDistChips(ss.brand)}</div></div>
        <div class="uv-muted" style="margin-top:4px">平均每条 ${ss.avgWc} 词 · 共 ${fmt((dim.samples||[]).length)} 条样本</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">📮 帖子情况（他们发的是什么形式的内容）</div>
        <div class="uv-bars-mini">${uvDistBars(ss.form)}</div>
        <div class="uv-posts">${uvPostCards(dim.samples, 4)}</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录</div><div class="uv-layer-samples">${q || "—"}</div></div>
    </div>`;
  }
  function uvFormDeep(U, form) {
    const f = (U.formEval||[]).find((x) => x.form === form);
    if (!f) return `<div class="uv-muted">暂无「${esc(form)}」深度数据</div>`;
    const st = f.sentiment||{}; const sTot = (st.pos||0)+(st.neu||0)+(st.neg||0)||1;
    const posR = Math.round((st.pos||0)/sTot*100);
    const kwChips = (f.keywords||[]).slice(0,18).map((k) => `<span class="uv-tag">${esc(k.w)}<em>×${k.n}</em></span>`).join("");
    const ss = uvSampleStats(f.quotes);
    const q = (f.quotes||[]).slice(0,6).map((qq) => `<div class="uv-layer-sample">${uvLangTag(qq.lang||"")} ${uvSentTag(qq.sent||"")} ${esc(dispVoice(qq)||"")}</div>`).join("");
    return `<div class="uv-drill"><div class="uv-drill-title">📊 「${esc(f.form)}」内容形式深度分析</div>
      <div class="uv-drill-count">${fmt(f.replyCount)} 条 · 正面 ${posR}%</div>
      <div class="dp-section" style="margin-top:12px"><div class="dp-sec-title">🔑 高频关键词</div><div class="uv-tags" style="margin-top:6px">${kwChips || "—"}</div></div>
      <div class="dp-section"><div class="dp-sec-title">👥 用户情况（用这种形式发言的用户画像）</div>
        <div class="uv-row"><b>语言构成</b><div class="uv-tags">${uvDistChips(ss.lang)}</div></div>
        <div class="uv-bars-mini">${uvDistBars(ss.lang)}</div>
        <div class="uv-row"><b>主要提及品牌</b><div class="uv-tags">${uvDistChips(ss.brand)}</div></div>
        <div class="uv-muted" style="margin-top:4px">平均每条 ${ss.avgWc} 词 · 共 ${fmt((f.quotes||[]).length)} 条样本</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">📮 帖子情况（这种形式的代表帖）</div>
        <div class="uv-posts">${uvPostCards(f.quotes, 4)}</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录</div><div class="uv-layer-samples">${q || "—"}</div></div>
    </div>`;
  }
  function uvSayDeep(U) {
    const c = U.corpus || {}; const st = c.sentiment||{}; const sTot = (st.pos||0)+(st.neu||0)+(st.neg||0)||1;
    const intentBars = uvBars(Object.entries(c.intent||{}).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v],i) => [INTENT_NAME[k]||k, v, INTENT_COL[k]||PAL[i%PAL.length]]));
    const topicBars = uvBars(Object.entries(c.topic||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v],i) => [k, v, PAL[(i+3)%PAL.length]]));
    const m = U.meta||{}; const multiU = m.multi_reply_users||0, genU = m.genuine_users||1;
    const posR = Math.round((st.pos||0)/sTot*100), negR = Math.round((st.neg||0)/sTot*100);
    return `<div class="uv-drill"><div class="uv-drill-title">📊 全部用户语料深度分析</div>
      <div class="uv-drill-count">${fmt(sTot)} 条 · 正面 ${posR}% · 负面 ${negR}% · 多帖用户 ${fmt(multiU)}（${uvPct(multiU, genU)}%）</div>
      <div class="bud-two" style="margin-top:12px"><div class="bud-panel"><div class="bud-panel-t">用户意图分布</div>${intentBars}</div>
      <div class="bud-panel"><div class="bud-panel-t">用户讨论主题</div>${topicBars}</div></div>
    </div>`;
  }

  /* ============================================================
     新导入真实回帖字段聚合（state.raw.userVoices）
     reply_intent / reply_focus / category / author_type / sentiment
     这些字段不在离线 users_data.json 中，需直接从真实回帖聚合
     ============================================================ */
  const CAT_NAME = { sexdoll: "实体娃娃", "Male Masturbators": "男用飞机杯", vibrators: "震动棒", sexmachine: "Sex Machine", Anal: "后庭类" };
  const CAT_COL = { sexdoll: "#ff5d8f", "Male Masturbators": "#00f0ff", vibrators: "#a06bff", sexmachine: "#ffd166", Anal: "#4ade80" };
  const REPLY_INTENT_NAME = { 购买意向: "购买意向", 咨询问题: "咨询问题", 简单互动: "简单互动", 使用反馈: "使用反馈", 吐槽不满: "吐槽不满" };
  const REPLY_FOCUS_NAME = { 效果体验: "效果体验", 尺寸外观: "尺寸外观", 材质质量: "材质质量", 价格: "价格", 发货物流: "发货物流", 售后: "售后" };

  function voiceRealAgg(brand) {
    const uv = (state.raw && state.raw.userVoices) || [];
    const filtered = brand ? uv.filter((v) => v.account === brand) : uv;
    const cats = {}, authors = {}, intents = {}, focuses = {};
    const sents = { pos: 0, neu: 0, neg: 0 };
    let n = 0, brandOfficial = 0, hasIntent = 0, hasFocus = 0;
    filtered.forEach((v) => {
      n++;
      const cat = v.category || "未标注";
      const cb = cats[cat] || (cats[cat] = { n: 0, pos: 0, neu: 0, neg: 0, brands: {}, intents: {}, focuses: {} });
      cb.n++;
      const s = (v.sentiment || "").trim();
      if (s === "正面") { cb.pos++; sents.pos++; } else if (s === "负面") { cb.neg++; sents.neg++; } else if (s === "中性") { cb.neu++; sents.neu++; }
      (v.author_type || "").split("、").forEach((a) => { if (a) { authors[a] = (authors[a] || 0) + 1; if (a === "品牌官方") brandOfficial++; } });
      const ri = (v.reply_intent || "").trim();
      if (ri) { hasIntent++; ri.split("、").forEach((x) => { if (x) { cb.intents[x] = (cb.intents[x] || 0) + 1; intents[x] = (intents[x] || 0) + 1; } }); }
      const rf = (v.reply_focus || "").trim();
      if (rf) { hasFocus++; rf.split("、").forEach((x) => { if (x) { cb.focuses[x] = (cb.focuses[x] || 0) + 1; focuses[x] = (focuses[x] || 0) + 1; } }); }
    });
    return { total: n, cats, authors, intents, focuses, sents, brandOfficial, hasIntent, hasFocus };
  }

  // 通用「新数据维度」面板（4 个真实字段），可嵌入用户板块各视图
  function uvRealDimBlock(agg, note) {
    if (!agg || !agg.total) return `<div class="uv-note">暂无真实回帖数据（content_data.json 未加载）。</div>`;
    const catPairs = Object.entries(agg.cats).sort((a, b) => b[1].n - a[1].n)
      .map(([k, b]) => [CAT_NAME[k] || k, b.n, CAT_COL[k] || PAL[0]]);
    const auPairs = Object.entries(agg.authors).sort((a, b) => b[1] - a[1])
      .map(([k, v]) => [k, v, k === "品牌官方" ? COL.neg : COL.pos]);
    const boPct = Math.round((agg.brandOfficial / agg.total) * 100);
    const intentPairs = Object.entries(agg.intents).sort((a, b) => b[1] - a[1])
      .map(([k, v], i) => [REPLY_INTENT_NAME[k] || k, v, PAL[i % PAL.length]]);
    const focusPairs = Object.entries(agg.focuses).sort((a, b) => b[1] - a[1])
      .map(([k, v], i) => [REPLY_FOCUS_NAME[k] || k, v, PAL[(i + 3) % PAL.length]]);
    const intentCov = Math.round((agg.hasIntent / agg.total) * 100);
    const focusCov = Math.round((agg.hasFocus / agg.total) * 100);
    return `<div class="uv-real">
      ${note ? `<div class="uv-real-note">${note}</div>` : ""}
      <div class="uv-real-grid">
        <div class="bud-panel"><div class="bud-panel-t">① 回帖类目分布（真实回帖关联的原帖类目）</div>${uvBars(catPairs)}</div>
        <div class="bud-panel"><div class="bud-panel-t">② 回帖者身份（用户 vs 品牌官方）</div>${uvBars(auPairs)}
          <div class="uv-note">品牌官方亲自回帖 <b>${fmt(agg.brandOfficial)}</b> 条（占 ${boPct}%）——品牌在社群中<b>主动下场互动</b>，利于承接咨询与拉近关系。</div>
        </div>
        <div class="bud-panel"><div class="bud-panel-t">③ 回复意图（reply_intent）</div>${intentPairs.length ? uvBars(intentPairs) : `<div class="uv-muted">暂无标注</div>`}
          <div class="uv-note">覆盖率 ${fmt(agg.hasIntent)}/${fmt(agg.total)} 条（${intentCov}%）有意图标注，以下为已标注部分分布。</div>
        </div>
        <div class="bud-panel"><div class="bud-panel-t">④ 回复焦点（reply_focus）</div>${focusPairs.length ? uvBars(focusPairs) : `<div class="uv-muted">暂无标注</div>`}
          <div class="uv-note">覆盖率 ${fmt(agg.hasFocus)}/${fmt(agg.total)} 条（${focusCov}%）有焦点标注，以下为已标注部分分布。</div>
        </div>
      </div>
    </div>`;
  }

  // 用户板块新 tab：分产品类目（真实回帖 category 维度）
  function uvCategory(U) {
    const agg = voiceRealAgg();
    const overview = uvRealDimBlock(agg, "下列四个维度全部来自<b>新导入的真实回帖 userVoices</b>（category / author_type / reply_intent / reply_focus），此前离线语料分析未覆盖，现统一接入用户板块。");
    const catEntries = Object.entries(agg.cats).sort((a, b) => b[1].n - a[1].n);
    const cards = catEntries.map(([cat, cb]) => {
      const sPairs = [["正面", cb.pos, COL.pos], ["中性", cb.neu, COL.neu], ["负面", cb.neg, COL.neg]];
      const brandChips = Object.entries(cb.brands).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `<span class="uv-chip">${esc(k)}<em>×${v}</em></span>`).join("");
      const intentChips = Object.entries(cb.intents).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `<span class="uv-chip uv-chip-intent">${REPLY_INTENT_NAME[k] || k}<em>×${v}</em></span>`).join("");
      const focusChips = Object.entries(cb.focuses).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `<span class="uv-chip">${REPLY_FOCUS_NAME[k] || k}<em>×${v}</em></span>`).join("");
      return `<div class="uv-form-card">
        <div class="uv-form-head"><span class="uv-form-name">${esc(CAT_NAME[cat] || cat)}</span><span class="uv-form-count">${fmt(cb.n)} 条回帖</span><button class="btn-ghost uv-drill-btn" data-uv-drill="category" data-uv-key="${esc(cat)}">🎯 深度分析 →</button></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>主要品牌</b><div class="uv-tags">${brandChips || "—"}</div></div>
        ${intentChips ? `<div class="uv-row"><b>回复意图</b><div class="uv-tags">${intentChips}</div></div>` : ""}
        ${focusChips ? `<div class="uv-row"><b>回复焦点</b><div class="uv-tags">${focusChips}</div></div>` : ""}
      </div>`;
    }).join("");
    return `<div class="uv-block">
      ${overview}
      <div class="uv-block-title" style="margin-top:18px">分产品类目下钻（每个类目：情绪、主要品牌、意图、焦点）</div>
      <div class="uv-form-grid">${cards}</div>
    </div>`;
  }
  function uvCategoryDeep(U, cat) {
    const agg = voiceRealAgg();
    const cb = agg.cats[cat];
    if (!cb) return `<div class="uv-muted">暂无「${esc(cat)}」深度数据</div>`;
    const sTot = cb.pos + cb.neu + cb.neg || 1;
    const posR = Math.round((cb.pos / sTot) * 100);
    const brandBars = uvBars(Object.entries(cb.brands).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v], i) => [k, v, PAL[i % PAL.length]]));
    const intentBars = Object.keys(cb.intents).length ? uvBars(Object.entries(cb.intents).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [REPLY_INTENT_NAME[k] || k, v, PAL[i % PAL.length]])) : `<div class="uv-muted">暂无标注</div>`;
    const focusHas = Object.keys(cb.focuses).length > 0;
    const focusBars = focusHas ? uvBars(Object.entries(cb.focuses).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [REPLY_FOCUS_NAME[k] || k, v, PAL[(i + 3) % PAL.length]])) : `<div class="uv-muted">暂无标注</div>`;
    const samples = ((state.raw && state.raw.userVoices) || []).filter((v) => (v.category || "未标注") === cat)
      .sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 8)
      .map((v) => `<div class="uv-layer-sample">${v.author_type ? `<span class="uv-chip-mini">${esc(v.author_type)}</span>` : ""}${v.sentiment ? uvSentTag(v.sentiment) : ""} <span class="uv-sample-text">${esc(v.text_zh || v.text)}</span> <a class="uv-link" href="${esc(v.replyLink || v.originalLink || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
    const intentTop = Object.keys(cb.intents).length ? Object.entries(cb.intents).sort((a, b) => b[1] - a[1])[0][0] : "";
    const insight = `${CAT_NAME[cat] || cat} 类目共 <b>${fmt(cb.n)}</b> 条真实回帖，正面率 <b>${posR}%</b>${intentTop ? "；用户讨论焦点以「" + intentTop + "」为主" : ""}。`;
    return `<div class="uv-drill"><div class="uv-drill-title">📊 「${esc(CAT_NAME[cat] || cat)}」类目深度分析</div>
      <div class="uv-drill-count">${fmt(cb.n)} 条回帖 · 正面 ${posR}%</div>
      <div class="uv-insight">${insight}</div>
      <div class="bud-two" style="margin-top:12px"><div class="bud-panel"><div class="bud-panel-t">关联品牌</div>${brandBars}</div>
      <div class="bud-panel"><div class="bud-panel-t">回复意图</div>${intentBars}</div></div>
      ${focusHas ? `<div class="dp-section"><div class="dp-sec-title">回复焦点（用户关注什么）</div>${focusBars}</div>` : ""}
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录（按点赞排序 · 真实回帖）</div><div class="uv-layer-samples">${samples || "—"}</div></div>
    </div>`;
  }

  // 维度下钻卡牌共用的「代表语录」渲染
  function uvDimQuote(s) {
    if (!s) return "";
    return `<div class="uv-quote">${uvLangTag(s.lang)} ${uvSentTag(s.sent)} ${uvIntentTag(s.intent)} <span class="uv-q-text">${esc(dispVoice(s))}</span> <span class="uv-corp-brand">${esc(s.brand || "")}</span> <a class="uv-link" href="${esc(s.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`;
  }
  function uvDimBrands(arr) {
    if (!arr || !arr.length) return `<span class="uv-muted">—</span>`;
    return arr.map((b) => `<span class="uv-chip">${esc(b.b)}<em>×${b.n}</em></span>`).join("");
  }
  function uvDimIntents(arr) {
    if (!arr || !arr.length) return `<span class="uv-muted">—</span>`;
    return arr.map((x) => `<span class="uv-chip uv-chip-intent">${uvIntentTag(x.k).replace(/^<span[^>]*>|<\/span>$/g, "")}<em>×${x.n}</em></span>`).join("");
  }
  function uvDimTopics(arr) {
    if (!arr || !arr.length) return `<span class="uv-muted">—</span>`;
    return arr.map((x) => `<span class="uv-chip">${esc(x.t)}<em>×${x.n}</em></span>`).join("");
  }

  /* ---------- 用户语料分析 · 分内容主题 ---------- */
  function uvTopic(U) {
    const list = (U.dimBreakdown && U.dimBreakdown.topicBreakdown) || [];
    if (!list.length) return `<div class="uv-block"><div class="uv-note">暂无分主题数据（运行 scripts/build_users.py 重建）。</div></div>`;
    const cards = list.map((t) => {
      const sPairs = [["正面", t.sentiment.pos || 0, COL.pos], ["中性", t.sentiment.neu || 0, COL.neu], ["负面", t.sentiment.neg || 0, COL.neg]];
      const quotes = (t.samples || []).slice(0, 4).map(uvDimQuote).join("");
      return `<div class="uv-form-card">
        <div class="uv-form-head"><span class="uv-form-name">${esc(t.name)}</span><span class="uv-form-count">${fmt(t.count)} 条</span><button class="btn-ghost uv-drill-btn" data-uv-drill="topic" data-uv-key="${esc(t.name)}">🎯 深度分析 →</button></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>主要品牌</b><div class="uv-tags">${uvDimBrands(t.brands)}</div></div>
        <div class="uv-row"><b>用户意图</b><div class="uv-tags">${uvDimIntents(t.intents)}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${quotes}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block">
      <div class="uv-block-title">分内容主题（用户围绕哪个产品类目讨论得最多、各自什么情绪与意图）</div>
      <div class="uv-form-grid">${cards}</div>
    </div>`;
  }

  /* ---------- 用户语料分析 · 分营销目的（意图） ---------- */
  function uvIntent(U) {
    const c = U.corpus;
    const list = (U.dimBreakdown && U.dimBreakdown.intentBreakdown) || [];
    if (!list.length) return `<div class="uv-block"><div class="uv-note">暂无分意图数据（运行 scripts/build_users.py 重建）。</div></div>`;
    const iPairs = Object.entries(c.intent).map(([k, v]) => [INTENT_NAME[k] || k, v, INTENT_COL[k] || COL.slate]);
    const cards = list.map((it) => {
      const sPairs = [["正面", it.sentiment.pos || 0, COL.pos], ["中性", it.sentiment.neu || 0, COL.neu], ["负面", it.sentiment.neg || 0, COL.neg]];
      const quotes = (it.samples || []).slice(0, 4).map(uvDimQuote).join("");
      return `<div class="uv-form-card">
        <div class="uv-form-head"><span class="uv-form-name">${esc(it.name)}</span><span class="uv-form-count">${fmt(it.count)} 条 · ${uvPct(it.count, c.total || 1)}%</span><button class="btn-ghost uv-drill-btn" data-uv-drill="intent" data-uv-key="${esc(it.name)}">🎯 深度分析 →</button></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>主要品牌</b><div class="uv-tags">${uvDimBrands(it.brands)}</div></div>
        <div class="uv-row"><b>关联主题</b><div class="uv-tags">${uvDimTopics(it.topics)}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${quotes}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block">
      <div class="uv-block-title">① 营销目的总览（用户来这里的意图分布）</div>
      ${uvBars(iPairs)}
      <div class="uv-block-title" style="margin-top:18px">② 分营销目的下钻（每种目的背后：情绪、品牌、关联主题、原帖）</div>
      <div class="uv-form-grid">${cards}</div>
    </div>`;
  }

  /* ---------- 用户语料分析 · 分情绪风格 ---------- */
  function uvEmotion(U) {
    const c = U.corpus;
    const list = (U.dimBreakdown && U.dimBreakdown.sentimentBreakdown) || [];
    if (!list.length) return `<div class="uv-block"><div class="uv-note">暂无分情绪数据（运行 scripts/build_users.py 重建）。</div></div>`;
    const sPairs = [["正面", c.sentiment.pos || 0, COL.pos], ["中性", c.sentiment.neu || 0, COL.neu], ["负面", c.sentiment.neg || 0, COL.neg]];
    const cards = list.map((s) => {
      const tot = s.count || 1;
      const emojiR = Math.round((s.style.emoji || 0) / tot * 100);
      const slangR = Math.round((s.style.slang || 0) / tot * 100);
      const capsR = Math.round((s.style.caps || 0) / tot * 100);
      const quotes = (s.samples || []).slice(0, 4).map(uvDimQuote).join("");
      return `<div class="uv-form-card">
        <div class="uv-form-head"><span class="uv-form-name">${esc(s.name)}</span><span class="uv-form-count">${fmt(s.count)} 条 · ${uvPct(s.count, c.total || 1)}%</span><button class="btn-ghost uv-drill-btn" data-uv-drill="emotion" data-uv-key="${esc(s.name)}">🎯 深度分析 →</button></div>
        <div class="uv-row"><b>主要意图</b><div class="uv-tags">${uvDimIntents(s.intents)}</div></div>
        <div class="uv-row"><b>主要品牌</b><div class="uv-tags">${uvDimBrands(s.brands)}</div></div>
        <div class="uv-row"><b>风格标记</b><div class="uv-tags">
          <span class="uv-chip">Emoji <em>${emojiR}%</em></span>
          <span class="uv-chip">口语/俚语 <em>${slangR}%</em></span>
          <span class="uv-chip">全大写 <em>${capsR}%</em></span>
        </div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${quotes}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block">
      <div class="uv-block-title">① 情绪总览（正面 / 中性 / 负面）</div>
      ${uvBars(sPairs)}
      <div class="uv-block-title" style="margin-top:18px">② 分情绪下钻（每种情绪背后：意图、品牌、语言风格、原帖）</div>
      <div class="uv-form-grid">${cards}</div>
    </div>`;
  }

  /* ---------- 品牌-用户讨论（独立板块） ---------- */
  function renderBrandUser() {
    const U = state.users;
    const desc = boardDesc("branduser");
    if (!U) return `<div class="board-head"><div class="board-desc">${desc}</div></div>` + emptyState("用户分析数据待生成（运行 scripts/build_users.py）");
    // 点进某品牌 → 品牌互动用户深度分析视图
    if (state.brandUserSel) return renderBrandUserDeep(U, state.brandUserSel);
    const cards = U.brandEval.map((b) => {
      const sPairs = [["正面", b.sentiment.pos || 0, COL.pos], ["中性", b.sentiment.neu || 0, COL.neu], ["负面", b.sentiment.neg || 0, COL.neg]];
      const kw = (b.keywords || []).slice(0, 14).map((k) => `<span class="uv-tag">${esc(k.w)}<em>×${k.n}</em></span>`).join("");
      const tp = (b.topics || []).slice(0, 5).map((t) => `<span class="uv-chip">${esc(t.t)}<em>×${t.n}</em></span>`).join("");
      const forms = (b.forms || []).slice(0, 5).map((f) => `<span class="uv-chip">${esc(f.f)}<em>×${f.n}</em></span>`).join("");
      const intents = Object.entries(b.intents || {}).slice(0, 5).map(([k, v]) => `<span class="uv-chip uv-chip-intent">${INTENT_NAME[k] || k}<em>×${v}</em></span>`).join("");
      const tu = (b.topUsers || []).slice(0, 4).map((t) => `<span class="uv-chip">${esc(t.u)}<em>×${t.n}</em></span>`).join("");
      const q = (b.quotes || []).slice(0, 3).map((qq) => `<div class="uv-quote">${uvLangTag(qq.lang)} ${uvSentTag(qq.sent)} <span class="uv-q-text">${esc(dispVoice(qq))}</span> <a class="uv-link" href="${esc(qq.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
      const ra = voiceRealAgg(b.brand);
      const realRows = `<div class="uv-real-mini">
        <div class="uv-real-mini-t">真实回帖新维度（userVoices 直采）</div>
        <div class="uv-row"><b>回帖身份</b><div class="uv-tags">${Object.entries(ra.authors).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span class="uv-chip">${esc(k)}<em>×${v}</em></span>`).join("")||"—"}</div></div>
        <div class="uv-row"><b>类目构成</b><div class="uv-tags">${Object.entries(ra.cats).sort((a,b)=>b[1].n-a[1].n).slice(0,5).map(([k,v])=>`<span class="uv-chip">${esc(CAT_NAME[k]||k)}<em>×${v.n}</em></span>`).join("")||"—"}</div></div>
        ${ra.hasIntent?`<div class="uv-row"><b>回复意图</b><div class="uv-tags">${Object.entries(ra.intents).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`<span class="uv-chip uv-chip-intent">${REPLY_INTENT_NAME[k]||k}<em>×${v}</em></span>`).join("")}</div></div>`:""}
        ${ra.hasFocus?`<div class="uv-row"><b>回复焦点</b><div class="uv-tags">${Object.entries(ra.focuses).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>`<span class="uv-chip">${REPLY_FOCUS_NAME[k]||k}<em>×${v}</em></span>`).join("")}</div></div>`:""}
      </div>`;
      const hasDeep = (U.brandUsers || []).some((x) => x.brand === b.brand);
      return `<div class="uv-brand-card">
        <div class="uv-brand-head"><span class="uv-brand-name">${esc(b.brand)}</span><span class="uv-brand-count">${fmt(b.replyCount)} 条用户声音</span></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>高频词</b><div class="uv-tags">${kw}</div></div>
        <div class="uv-row"><b>主题</b><div class="uv-tags">${tp}</div></div>
        <div class="uv-row"><b>内容形式</b><div class="uv-tags">${forms || "—"}</div></div>
        <div class="uv-row"><b>用户倾向</b><div class="uv-tags">${intents || "—"}</div></div>
        <div class="uv-row"><b>高互动用户</b><div class="uv-tags">${tu}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${q}</div></div>
        ${realRows}
        ${hasDeep ? `<button class="btn-primary bud-enter" data-bud="${esc(b.brand)}">🎯 品牌互动用户深度分析 →</button>` : ""}
      </div>`;
    }).join("");
    return `<div class="board-head"><div class="board-desc">${desc}</div></div>
      <div class="uv-block"><div class="uv-block-title">分品牌用户讨论（点「品牌互动用户深度分析」可下钻看该品牌用户的分层 / 参与度 / 互动率 / 高互动用户分布，并跨品牌对比）</div><div class="uv-brand-grid">${cards}</div></div>`;
  }

  /* ---------- 品牌互动用户深度分析（品牌卡片点进来） ---------- */
  function budFind(U, brand) { return (U.brandUsers || []).find((x) => x.brand === brand) || null; }

  function budStatCard(label, val, sub, hot) {
    return `<div class="bud-stat"><div class="bud-stat-label">${esc(label)}</div><div class="bud-stat-val"${hot ? ' style="color:var(--hot)"' : ""}>${val}</div>${sub ? `<div class="bud-stat-sub">${esc(sub)}</div>` : ""}</div>`;
  }
  function budLayerRows(entries) {
    const total = entries.reduce((s, e) => s + e.n, 0) || 1;
    return entries.map((e) => {
      const pct = Math.round((e.n / total) * 100);
      return `<div class="bud-lrow">
        <span class="bud-lname">${esc(e.name)}</span>
        <span class="bud-ltrack"><i style="width:${pct}%;background:${e.color}"></i></span>
        <span class="bud-lval">${fmt(e.n)} · ${pct}%</span>
      </div>${e.sub ? `<div class="bud-lsub">${esc(e.sub)}</div>` : ""}`;
    }).join("");
  }

  function renderBrandUserDeep(U, brand) {
    const d = budFind(U, brand);
    if (!d) { state.brandUserSel = null; return renderBrandUser(); }
    const st = d.sentiment || {}; const sTot = (st.pos || 0) + (st.neu || 0) + (st.neg || 0) || 1;
    const posRate = Math.round((st.pos || 0) / sTot * 100);
    const others = (U.brandUsers || []).filter((x) => x.brand !== brand);

    // 概览指标
    const stats = `<div class="bud-stats">
      ${budStatCard("独立用户数", fmt(d.userCount), "发声的真实用户")}
      ${budStatCard("用户声音数", fmt(d.replyCount), "窗口内回复总量")}
      ${budStatCard("多次互动用户", fmt(d.multiReplyUsers), d.multiReplyShare + "% 会回来", true)}
      ${budStatCard("人均回复", d.avgRepliesPerUser, "参与度")}
      ${budStatCard("平均点赞/条", d.avgLikes, "互动率信号")}
      ${budStatCard("正面情感率", posRate + "%", "口碑倾向", true)}
    </div>`;

    // 情感 + 意图倾向
    const sPairs = [["正面", st.pos || 0, COL.pos], ["中性", st.neu || 0, COL.neu], ["负面", st.neg || 0, COL.neg]];
    const iPairs = Object.entries(d.intents || {}).map(([k, v]) => [INTENT_NAME[k] || k, v, INTENT_COL[k] || COL.slate]);
    const tendency = `<div class="bud-two">
      <div class="bud-panel"><div class="bud-panel-t">情感倾向</div>${uvBars(sPairs)}</div>
      <div class="bud-panel"><div class="bud-panel-t">用户倾向（意图）</div>${uvBars(iPairs)}</div>
    </div>`;

    // 用户分层（双维度）：字数分层 + 参与度分层
    const wc = d.wcLayers || {};
    const WC_NAME = { l1: "极短 (≤5词)", l2: "短 (6–20词)", l3: "中 (21–50词)", l4: "长 (>50词)" };
    const WC_COL = { l1: "#6b7a99", l2: "#00f0ff", l3: "#a06bff", l4: "#ffd166" };
    const wcRows = budLayerRows(["l1", "l2", "l3", "l4"].map((k) => ({ name: WC_NAME[k], n: wc[k] || 0, color: WC_COL[k] })));
    const eng = d.engLayers || {}; const EM = (U.meta && U.meta.eng_meta) || {};
    const ENG_COL = { once: "#6b7a99", light: "#00f0ff", active: "#a06bff", heavy: "#ffd166" };
    const engRows = budLayerRows(["heavy", "active", "light", "once"].map((k) => ({
      name: (EM[k] && EM[k].name) || k, n: eng[k] || 0, color: ENG_COL[k], sub: (EM[k] && EM[k].desc) || "",
    })));
    const layersHTML = `<div class="bud-two">
      <div class="bud-panel"><div class="bud-panel-t">字数分层 · 投入度（按回复长度）</div>${wcRows}</div>
      <div class="bud-panel"><div class="bud-panel-t">参与度分层 · 忠诚度（按回复次数）</div>${engRows}</div>
    </div>`;

    // 高互动用户分布（集中度）
    const c = d.concentration || {};
    const concHTML = `<div class="bud-conc">
      <div class="bud-conc-t">高互动用户分布（声量集中度）</div>
      <div class="bud-conc-grid">
        <div class="bud-conc-cell"><div class="bud-conc-num">${c.top10Share || 0}%</div><div class="bud-conc-lab">Top 10 用户贡献了 ${c.top10Share || 0}% 的声量（${fmt(c.top10Replies || 0)} 条）</div></div>
        <div class="bud-conc-cell"><div class="bud-conc-num">${c.top1pctShare || 0}%</div><div class="bud-conc-lab">头部 1%（${fmt(c.top1pctUsers || 0)} 人）贡献 ${c.top1pctShare || 0}% 声量（${fmt(c.top1pctReplies || 0)} 条）</div></div>
        <div class="bud-conc-cell"><div class="bud-conc-num">${d.multiReplyShare || 0}%</div><div class="bud-conc-lab">${d.multiReplyShare || 0}% 用户会二次发声（${fmt(d.multiReplyUsers || 0)} 人）</div></div>
        <div class="bud-conc-cell"><div class="bud-conc-num">${(eng.heavy || 0) + (eng.active || 0)}</div><div class="bud-conc-lab">重度+活跃用户 ${(eng.heavy || 0) + (eng.active || 0)} 人（KOC 培养池）</div></div>
      </div>
      <div class="bud-conc-note">${c.top1pctShare >= 20 ? "声量高度集中在少数铁粉，适合深耕头部 KOC；但需警惕「虚假繁荣」——大盘活跃度依赖少数人。" : "声量分布较分散，说明品牌讨论是「群众基础」型，拉新与广触达比死磕头部更划算。"}</div>
    </div>`;

    // Top 高互动用户明细
    const shown = state.brandUserRankAll ? d.topUsers.length : Math.min(8, d.topUsers.length);
    const userRows = d.topUsers.slice(0, shown).map((u, i) => {
      const us = u.sents || {};
      const usPairs = [["正面", us.pos || 0, COL.pos], ["中性", us.neu || 0, COL.neu], ["负面", us.neg || 0, COL.neg]];
      const uiChips = Object.entries(u.intents || {}).slice(0, 4).map(([k, v]) => `<span class="uv-chip uv-chip-intent">${INTENT_NAME[k] || k}<em>×${v}</em></span>`).join("");
      const quotes = (u.samples || []).slice(0, 2).map((q) => `<div class="uv-quote">${uvLangTag(q.lang)} ${uvSentTag(q.sent)} <span class="uv-q-text">${esc(dispVoice(q))}</span> ${q.link ? `<a class="uv-link" href="${esc(q.link)}" target="_blank" rel="noreferrer">↗</a>` : ""}</div>`).join("");
      return `<details class="uv-user-card">
        <summary class="uv-user-summary">
          <span class="uv-rank">#${i + 1}</span>
          <span class="uv-uname" title="@${esc(u.name)}">@${esc(u.name)}</span>
          <span class="uv-ucount">${u.replyCount} 次回复</span>
          <span class="uv-uavg">${u.avgWords} 词/条 · ♥${fmt(u.totalLikes)}</span>
          <span class="uv-uchev">▾</span>
        </summary>
        <div class="uv-user-body">
          <div class="uv-deep-grid">
            <div class="uv-deep-cell"><b>活跃周期</b>${esc(u.first)} → ${esc(u.last)}</div>
            <div class="uv-deep-cell"><b>总字数/平均</b>${fmt(u.totalWords)} / ${u.avgWords}</div>
            <div class="uv-deep-cell"><b>平均点赞</b>${u.avgLikes}</div>
            <div class="uv-deep-cell"><b>常参与形式</b>${esc(u.topForm)}</div>
          </div>
          <div class="uv-user-line"><b>倾向</b><span class="uv-bars-inline">${uvBars(usPairs)}</span></div>
          <div class="uv-user-line"><b>意图</b><span class="uv-chips">${uiChips || "—"}</span></div>
          <div class="uv-user-quotes"><b>代表语录</b>${quotes || "—"}</div>
        </div>
      </details>`;
    }).join("");
    const rankToggle = d.topUsers.length > 8 ? `<button class="uv-rank-toggle" data-bud-rank-toggle>${state.brandUserRankAll ? "收起（仅看 Top 8）" : `展开全部 ${d.topUsers.length} 人 →`}</button>` : "";
    const usersHTML = `<div class="bud-panel"><div class="bud-panel-t">高互动用户明细（Top ${shown} / 共 ${d.topUsers.length} 位深度用户） ${rankToggle}</div><div class="uv-user-grid">${userRows}</div></div>`;

    // 跨品牌对比（多选 + 点击对比按钮触发）
    const cmpChips = others.map((x) => {
      const ckd = state.brandUserCmp.includes(x.brand) ? "checked" : "";
      return `<label class="bud-cmp-chip"><input type="checkbox" data-bud-cmp-chk value="${esc(x.brand)}" ${ckd}>${esc(x.brand)} (${fmt(x.userCount)})</label>`;
    }).join("");
    const cmpBtn = state.brandUserCmp.length >= 1 ? `<button class="btn-primary bud-cmp-go" data-bud-cmp-go>📊 开始对比（已选 ${state.brandUserCmp.length} 个品牌）</button>` : "";

    // 如果处于对比模式，整页替换为双品牌并排可视化
    if (state.brandUserCompare) {
      const cmpBrands = [d, ...state.brandUserCmp.map((bn) => budFind(U, bn)).filter(Boolean)];
      if (cmpBrands.length >= 2) return budCompareFull(U, cmpBrands);
    }

    // 跨品牌对比结果（仅预览模式——轻量条形图）
    let cmpHTML = "";
    if (state.brandUserCmp.length) {
      const cmpBrands = [d, ...state.brandUserCmp.map((bn) => budFind(U, bn)).filter(Boolean)];
      if (cmpBrands.length >= 2) cmpHTML = budMultiCompare(cmpBrands);
    }

    // 用户词云 + 关注主题排序 + 内容形式参与（品牌×用户内容交叉分析）
    const kws = (d.keywords || []).slice(0, 18);
    const maxKw = kws.length ? Math.max(...kws.map(x => x.n), 1) : 1;
    const wordCloud = kws.map((x) => {
      const r = Math.round(x.n / maxKw * 100);
      const sz = r > 70 ? "xxl" : r > 40 ? "xl" : r > 20 ? "lg" : r > 10 ? "md" : "sm";
      return `<span class="bud-wc-word ${sz}">${esc(x.w)}</span>`;
    }).join("");
    const wcHTML = wordCloud ? `<div class="bud-panel" style="flex:1.2">
      <div class="bud-panel-t">用户关键词云</div>
      <div class="bud-wc-cloud">${wordCloud}</div>
    </div>` : "";
    const topTps = (d.topics || []).slice(0, 8);
    const tpBars = topTps.length ? `<div class="bud-panel"><div class="bud-panel-t">用户关注主题排序</div>${uvBars(topTps.map((x, i) => [x.t, x.n, PAL[i % PAL.length]]))}</div>` : "";
    const topForms = (d.forms || []).slice(0, 6);
    const formBars = topForms.length ? `<div class="bud-panel"><div class="bud-panel-t">内容形式参与</div>${uvBars(topForms.map((x, i) => [x.f, x.n, PAL[(i+3) % PAL.length]]))}</div>` : "";
    const crossBlock = (wcHTML || tpBars || formBars) ? `<div class="bud-sec-t">用户 × 品牌内容交叉分析</div><div class="bud-two">${wcHTML}${tpBars}${formBars}</div>` : "";

    return `<div class="board-head"><div class="board-desc">${boardDesc("branduser")}</div></div>
      <div class="bud-top">
        <button class="btn-ghost bud-back" data-bud-back>← 返回品牌列表</button>
        <div class="bud-title">🎯 ${esc(brand)} · 品牌互动用户深度分析</div>
        <div class="bud-cmp-pick"><span>对比品牌（多选）：</span><div class="bud-cmp-chips">${cmpChips}</div>${cmpBtn}</div>
      </div>
      ${stats}
      ${tendency}
      ${crossBlock}
      <div class="bud-sec-t">用户分层 · 双维度</div>
      ${layersHTML}
      ${concHTML}
      ${usersHTML}
      ${cmpHTML}`;
  }

  function budMultiCompare(brands) {
    const posR = (x) => { const s = x.sentiment || {}; const t = (s.pos||0)+(s.neu||0)+(s.neg||0)||1; return Math.round((s.pos||0)/t*100); };
    const lpR = (x, k) => { const p = x.wcLayerPct || {}; return (p[k]||0); };
    const epR = (x, k) => { const p = x.engLayerPct || {}; return (p[k]||0); };
    const metrics = [
      ["独立用户数", (x) => x.userCount, fmt],
      ["用户声音数", (x) => x.replyCount, fmt],
      ["多次互动占比%", (x) => x.multiReplyShare, (v) => v + "%"],
      ["人均回复（参与度）", (x) => x.avgRepliesPerUser, (v) => v],
      ["平均点赞/条", (x) => x.avgLikes, (v) => v],
      ["正面情感率%", posR, (v) => v + "%"],
      ["长回复占比%", (x) => lpR(x, "l4"), (v) => v + "%"],
      ["重度用户占比%", (x) => epR(x, "heavy"), (v) => v + "%"],
      ["Top10集中度%", (x) => (x.concentration||{}).top10Share||0, (v) => v + "%"],
    ];
    const barsHTML = metrics.map(([label, fn, fmtFn]) => {
      const maxV = Math.max(...brands.map(fn), 1);
      const bars = brands.map((b) => {
        const v = fn(b);
        const pct = Math.round(v / maxV * 100);
        return `<div class="bud-mbar-row">
          <span class="bud-mbar-label">${esc(b.brand)}</span>
          <span class="bud-mbar-track"><i style="width:${pct}%"></i></span>
          <span class="bud-mbar-val">${fmtFn(v)}</span>
        </div>`;
      }).join("");
      return `<div class="bud-mbar-group">
        <div class="bud-mbar-title">${label}</div>
        ${bars}
      </div>`;
    }).join("");
    return `<div class="bud-cmp-block" id="bud-cmp-chart">
      <div class="bud-sec-t">多品牌用户对比可视化（${brands.map((b) => esc(b.brand)).join(" vs ")}）</div>
      <div class="bud-mbar-grid">${barsHTML}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn-ghost" data-bud-cmp-copy>📋 复制图表为文本</button>
        <button class="btn-ghost" data-bud-cmp-dl>⬇ 下载图表 SVG</button>
      </div>
    </div>`;
  }

  function budCompareFull(U, brands) {
    const posR = (x) => { const s = x.sentiment||{}; const t = (s.pos||0)+(s.neu||0)+(s.neg||0)||1; return Math.round((s.pos||0)/t*100); };
    const lpR = (x,k) => (x.wcLayerPct||{})[k]||0;
    const epR = (x,k) => (x.engLayerPct||{})[k]||0;
    const [a, b] = [brands[0], brands[brands.length-1]];
    if (!a || !b) return "请至少选择两个品牌对比。";

    // 并排统计卡片
    const statCard = (b) => {
      const pr = posR(b); const l4 = lpR(b,"l4"); const heavy = epR(b,"heavy");
      return `<div class="bud-comp-stat">
        <div class="bud-comp-stat-name">${esc(b.brand)}</div>
        <div class="bud-comp-stat-row"><span>用户</span><b>${fmt(b.userCount)}</b></div>
        <div class="bud-comp-stat-row"><span>互动率</span><b>${b.avgLikes}/条</b></div>
        <div class="bud-comp-stat-row"><span>正面率</span><b>${pr}%</b></div>
        <div class="bud-comp-stat-row"><span>深度表达%</span><b>${l4}%</b></div>
        <div class="bud-comp-stat-row"><span>铁粉%</span><b>${heavy}%</b></div>
        <div class="bud-comp-stat-row"><span>集中度</span><b>${(b.concentration||{}).top10Share||0}%</b></div>
      </div>`;
    };
    // 指标条形图对比
    const metrics = [
      ["独立用户数", (x)=>x.userCount, fmt],
      ["多次互动占比%", (x)=>x.multiReplyShare, (v)=>v+"%"],
      ["人均回复", (x)=>x.avgRepliesPerUser, (v)=>v],
      ["正面情感率%", posR, (v)=>v+"%"],
      ["长回复占比%", (x)=>lpR(x,"l4"), (v)=>v+"%"],
      ["铁粉占比%", (x)=>epR(x,"heavy"), (v)=>v+"%"],
      ["Top10集中度%", (x)=>(x.concentration||{}).top10Share||0, (v)=>v+"%"],
    ];
    const barsHTML = metrics.map(([label, fn, fmtFn]) => {
      const maxV = Math.max(...brands.map(fn), 1);
      const bars = brands.map((b,i) => {
        const v=fn(b); const pct=Math.round(v/maxV*100);
        return `<div class="bud-mbar-row">
          <span class="bud-mbar-label" style="color:${i===0?'var(--accent)':'#ffd166'}">${esc(b.brand)}</span>
          <span class="bud-mbar-track"><i style="width:${pct}%;${i===0?'':'background:linear-gradient(90deg,#ffd166,#ff5d8f)'}"></i></span>
          <span class="bud-mbar-val">${fmtFn(v)}</span>
        </div>`;
      }).join("");
      return `<div class="bud-mbar-group"><div class="bud-mbar-title">${label}</div>${bars}</div>`;
    }).join("");
    // 结论
    const aWin = metrics.map(([l,fn])=>fn(a)>=fn(b)?l:null).filter(Boolean);
    const bWin = metrics.map(([l,fn])=>fn(b)>fn(a)?l:null).filter(Boolean);
    const conclusion = `<div class="uv-insight" style="margin-top:14px">
      <b>对比结论：</b>${esc(a.brand)} 在 <b>${aWin.slice(0,3).join("、")}</b> 方面领先；${esc(b.brand)} 在 <b>${bWin.slice(0,3).join("、")}</b> 方面更优。
      ${posR(a)>posR(b)?`用户对 ${esc(a.brand)} 的态度更为正面，适合口碑运营。`: posR(b)>posR(a)?`用户对 ${esc(b.brand)} 的态度更为正面，适合口碑运营。`:""}
      ${lpR(a,"l4")>lpR(b,"l4")?`${esc(a.brand)} 更能驱动深度表达，内容策略更有效。`:lpR(b,"l4")>lpR(a,"l4")?`${esc(b.brand)} 更能驱动深度表达，内容策略更有效。`:""}
    </div>`;

    return `<div class="board-head"><div class="board-desc">品牌互动用户深度对比</div></div>
      <div class="bud-comp-top">
        <button class="btn-ghost" data-bud-cmp-back>← 返回品牌详情</button>
        <div class="bud-title">${esc(a.brand)} vs ${esc(b.brand)} · 多维度可视化对比</div>
      </div>
      <div class="bud-comp-grid">${statCard(a)}${statCard(b)}</div>
      <div class="bud-mbar-grid" style="margin-top:16px">${barsHTML}</div>
      ${conclusion}`;
  }

  function bindBrandUser() {
    const board = $("#board");
    // 进入某品牌深度分析
    $$(".bud-enter", board).forEach((b) => b.addEventListener("click", () => {
      state.brandUserSel = b.dataset.bud; state.brandUserCmp = []; state.brandUserRankAll = false; renderBoard();
    }));
    // 返回列表
    const back = $("[data-bud-back]", board);
    if (back) back.addEventListener("click", () => { state.brandUserSel = null; state.brandUserCmp = []; renderBoard(); });
    // 多选对比品牌
      $$("[data-bud-cmp-chk]", board).forEach((cb) => cb.addEventListener("change", () => {
        const v = cb.value;
        if (cb.checked) { if (!state.brandUserCmp.includes(v)) state.brandUserCmp.push(v); }
        else state.brandUserCmp = state.brandUserCmp.filter((x) => x !== v);
        state.brandUserCompare = false; renderBoard();
      }));
      // 点击对比按钮
      const cmpGo = $("[data-bud-cmp-go]", board);
      if (cmpGo) cmpGo.addEventListener("click", () => { state.brandUserCompare = true; renderBoard(); });
      // 对比模式返回
      const cmpBack = $("[data-bud-cmp-back]", board);
      if (cmpBack) cmpBack.addEventListener("click", () => { state.brandUserCompare = false; renderBoard(); });
      // 复制图表为文本
      const copyBtn = $("[data-bud-cmp-copy]", board);
      if (copyBtn) copyBtn.addEventListener("click", () => {
        const el = $("#bud-cmp-chart");
        if (!el) return;
        const rows = [...el.querySelectorAll(".bud-mbar-group")].map((g) => {
          const title = g.querySelector(".bud-mbar-title")?.textContent || "";
          const bars = [...g.querySelectorAll(".bud-mbar-row")].map((r) => {
            const label = r.querySelector(".bud-mbar-label")?.textContent || "";
            const val = r.querySelector(".bud-mbar-val")?.textContent || "";
            return `  ${label}: ${val}`;
          }).join("\n");
          return `${title}\n${bars}`;
        }).join("\n\n");
        navigator.clipboard.writeText(rows).then(() => toast("已复制对比数据")).catch(() => toast("复制失败"));
      });
      // 下载图表 SVG
      const dlBtn = $("[data-bud-cmp-dl]", board);
      if (dlBtn) dlBtn.addEventListener("click", () => {
        const el = $("#bud-cmp-chart");
        if (!el) return;
        const clone = el.cloneNode(true);
        // 移除按钮
        [...clone.querySelectorAll("button")].forEach((b) => b.remove());
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${Math.max(400, clone.scrollHeight + 40)}">
          <foreignObject width="800" height="${Math.max(400, clone.scrollHeight + 40)}">
            <div xmlns="http://www.w3.org/1999/xhtml" style="background:#0b0f1a;color:#cfd8f0;font-family:system-ui;padding:16px">
              ${clone.innerHTML}
            </div>
          </foreignObject>
        </svg>`;
        const url = "data:image/svg+xml," + encodeURIComponent(svg);
        const a = document.createElement("a"); a.href = url; a.download = "brand_compare.svg"; a.click();
      });
    // Top 用户展开
    const rt = $("[data-bud-rank-toggle]", board);
    if (rt) rt.addEventListener("click", () => { state.brandUserRankAll = !state.brandUserRankAll; renderBoard(); });
  }

  /* ---------- 四层用户全面对比 ---------- */
  function renderLayerCompare(U) {
    const order = ["l1", "l2", "l3", "l4"];
    const LAY = { l1: "极短回复", l2: "短回复", l3: "中回复", l4: "长回复" };
    const L_COL = { l1: "#6b7a99", l2: "#00f0ff", l3: "#a06bff", l4: "#ffd166" };
    const totAll = U.meta.genuine_replies_in_window || 1;
    // 行定义：指标名 + 各层值
    const mkRow = (label, fn, fmtFn) => {
      return `<tr><td class="uv-cmp-metric">${label}</td>${order.map((k) => {
        const v = fn(U.layers[k], k);
        return `<td class="uv-cmp-v" style="color:${L_COL[k]}">${fmtFn ? fmtFn(v, k) : v}</td>`;
      }).join("")}</tr>`;
    };
    const rows = [
      mkRow("回复数量", (L) => fmt(L.count), (v) => v),
      mkRow("占全部回复比例", (L) => uvPct(L.count, totAll), (v) => v),
      mkRow("正面情感率", (L) => {
        const s = L.sentiment; const t = (s.pos||0)+(s.neu||0)+(s.neg||0)||1;
        return Math.round((s.pos||0)/t*100) + "%";
      }, (v) => v),
      mkRow("负面情感率", (L) => {
        const s = L.sentiment; const t = (s.pos||0)+(s.neu||0)+(s.neg||0)||1;
        return Math.round((s.neg||0)/t*100) + "%";
      }, (v) => v),
      mkRow("Top 意图", (L) => {
        const it = L.intent || {}; const e = Object.entries(it).sort((a,b) => b[1]-a[1])[0];
        return e ? (INTENT_NAME[e[0]]||e[0]) : "—";
      }, (v) => v),
      mkRow("Top 品牌（绝对数）", (L) => {
        const b = (L.brands || [])[0]; return b ? `${esc(b.b)} (${fmt(b.n)})` : "—";
      }, (v) => v),
      mkRow("Top 品牌（占该层%）", (L) => {
        const b = (L.brands || [])[0];
        return b ? Math.round(b.n / Math.max(L.count||1, 1) * 100) + "%" : "—";
      }, (v) => v),
      mkRow("Top 内容形式", (L) => {
        const f = (L.forms || [])[0]; return f ? `${esc(f.f)} (${fmt(f.n)})` : "—";
      }, (v) => v),
    ];
    const body = rows.join("");
    const head = `<tr><th>指标</th>${order.map((k) => `<th style="color:${L_COL[k]}">${LAY[k]}<br><small>${U.layers[k].meta.name}</small></th>`).join("")}</tr>`;
    const insight = (() => {
      const l4 = U.layers.l4, l1 = U.layers.l1;
      const l4Brand = ((l4.brands||[])[0]||{}).b || "—";
      const l1Brand = ((l1.brands||[])[0]||{}).b || "—";
      const l4Form = ((l4.forms||[])[0]||{}).f || "—";
      const l1Form = ((l1.forms||[])[0]||{}).f || "—";
      return `跨层对比洞察：<b>深度表达用户</b>（l4）集中在 <b>${l4Brand}</b>、偏好 <b>${l4Form}</b> 内容——这些是能驱动用户「说很多」的品牌和形式。<b>沉默用户</b>（l1）集中在 <b>${l1Brand}</b>、偏好 <b>${l1Form}</b> 内容——适合做轻互动/快速转化引导，而非深度讨论。`;
    })();
    return `<div class="uv-drill">
      <div class="uv-drill-head">
        <button class="btn-ghost" data-uv-layer-cmp-back>← 返回分层</button>
        <div class="uv-drill-title">📊 四层用户全面对比</div>
        <div class="uv-drill-count">横向比较 l1·l2·l3·l4 用户的关注主题、品牌分布、内容形式、情感、意图</div>
      </div>
      <div class="uv-drill-desc">不同投入度的用户画像对比。看「谁在深度参与 vs 谁只是路过」——以及背后的品牌来源、内容形式偏好。</div>
      <div class="uv-insight">${insight}</div>
      <div class="uv-cmp-table-wrap">
        <table class="uv-cmp-table">
          <thead>${head}</thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
  }

  /* ---------- 高互动用户（独立板块）：用户分层 + 高互动用户排行 ---------- */
  function renderUserSeg() {
    const U = state.users;
    const desc = boardDesc("userseg");
    if (!U) return `<div class="board-head"><div class="board-desc">${desc}</div></div>` + emptyState("用户分析数据待生成（运行 scripts/build_users.py）");
    const realOverview = uvRealDimBlock(voiceRealAgg(), "全量真实回帖的新维度概览（来自 userVoices 直采，补充离线分层分析看不到的「类目 / 身份 / 意图 / 焦点」）。");
    return `<div class="board-head"><div class="board-desc">${desc}</div></div>
      ${realOverview}
      ${uvRank(U)}`;
  }
  function renderUserSegDeep(U) {
    const users = U.topUsers || [];
    const tot = users.length;
    if (!tot) return `<div class="uv-muted">暂无高互动用户数据</div>`;
    // 品牌分布
    const brandCnt = {}; users.forEach((u) => { const b = u.topBrand || "—"; brandCnt[b] = (brandCnt[b] || 0) + (u.replyCount || 0); });
    const brandUsers = {}; users.forEach((u) => { const b = u.topBrand || "—"; if (!brandUsers[b]) brandUsers[b] = []; brandUsers[b].push(u); });
    const brandData = Object.entries(brandCnt).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const brandBars = brandData.map(([b, n], i) => {
      const uCnt = (brandUsers[b] || []).length;
      return `<div class="qc-bar"><span class="qc-name" style="width:110px">${esc(b)}</span><span class="qc-track"><i style="width:${Math.round(n/Math.max(brandData[0][1],1)*100)}%;background:${PAL[i%PAL.length]}"></i></span><span class="qc-val">${fmt(n)}条<small>${uCnt}人</small></span></div>`;
    }).join("");
    // 总声量
    const totalReplies = users.reduce((s, u) => s + (u.replyCount || 0), 0);
    const totalLikes = users.reduce((s, u) => s + (u.totalLikes || 0), 0);
    const avgWords = Math.round(users.reduce((s, u) => s + (u.avgWords || 0), 0) / Math.max(tot, 1));
    // 意图分布
    const intentAcc = {}; users.forEach((u) => { Object.entries(u.intents || {}).forEach(([k, v]) => { intentAcc[k] = (intentAcc[k] || 0) + v; }); });
    const intentBars = uvBars(Object.entries(intentAcc).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [INTENT_NAME[k]||k, v, INTENT_COL[k]||PAL[i%PAL.length]]));
    // 情感分布
    const sentAcc = { pos: 0, neu: 0, neg: 0 }; users.forEach((u) => { const s = u.sents || {}; sentAcc.pos += s.pos||0; sentAcc.neu += s.neu||0; sentAcc.neg += s.neg||0; });
    const sentPairs = [["正面", sentAcc.pos, COL.pos], ["中性", sentAcc.neu, COL.neu], ["负面", sentAcc.neg, COL.neg]];
    // 形式分布
    const formAcc = {}; users.forEach((u) => { const f = u.topForm || "—"; formAcc[f] = (formAcc[f] || 0) + 1; });
    const formBars = uvBars(Object.entries(formAcc).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [k, v, PAL[(i+3)%PAL.length]]));
    // 语录
    const samples = users.slice(0, 8).flatMap((u) => (u.samples || []).slice(0, 1)).filter(Boolean).map((s) =>
      `<div class="uv-layer-sample">${uvLangTag(s.lang||"")} ${uvSentTag(s.sent||"")} ${uvIntentTag(s.intent||"")} <span class="uv-sample-text">${esc(s.text||"")}</span></div>`
    ).join("");
    const insight = `${fmt(tot)} 位深度用户合计贡献 ${fmt(totalReplies)} 条回复、${fmt(totalLikes)} 点赞，平均每人 ${Math.round(totalReplies/tot)} 条回复、${avgWords} 词/条。主品牌 <b>${esc(brandData[0]?.[0]||"—")}</b> 占最大声量（${fmt(brandData[0]?.[1]||0)} 条），覆盖 ${brandData.length} 个品牌。意图以 <b>${Object.entries(intentAcc).sort((a,b)=>b[1]-a[1])[0]?.[0]?INTENT_NAME[Object.entries(intentAcc).sort((a,b)=>b[1]-a[1])[0][0]]||Object.entries(intentAcc).sort((a,b)=>b[1]-a[1])[0][0]:"—"}</b> 为主，整体正面情感率 ${sentAcc.pos+neu+neg>0?Math.round(sentAcc.pos/Math.max(sentAcc.pos+sentAcc.neu+sentAcc.neg,1)*100):0}%。`;
    return `<div class="uv-drill">
      <div class="uv-insight">${insight}</div>
      <div class="dp-section"><div class="dp-sec-title">🏆 品牌声量分布（按贡献回复量）</div>${brandBars}</div>
      <div class="bud-two"><div class="bud-panel"><div class="bud-panel-t">情感分布</div>${uvBars(sentPairs)}</div>
        <div class="bud-panel"><div class="bud-panel-t">意图倾向</div>${intentBars}</div>
      </div>
      <div class="dp-section"><div class="dp-sec-title">🎨 内容形式偏好</div>${formBars}</div>
      <div class="dp-section"><div class="dp-sec-title">💬 代表语录（Top 8 用户各 1 条）</div><div class="uv-layer-samples">${samples || "—"}</div></div>
    </div>`;
  }
  function openSegDeep() {
    const U = state.users;
    if (!U) return;
    // 若盲盒弹层开着，先关掉
    const bxM = $("#bx-modal"), bxO = $("#bx-overlay");
    if (bxM && bxM.classList.contains("show")) { bxM.classList.remove("show"); bxO.classList.remove("show"); }
    const users = U.topUsers || [];
    const tot = users.length;
    const totalReplies = users.reduce((s, u) => s + (u.replyCount || 0), 0);
    $("#seg-sub").textContent = `汇总 Top ${fmt(tot)} 位深度用户 · 共 ${fmt(totalReplies)} 条回复`;
    $("#seg-body").innerHTML = renderUserSegDeep(U);
    $("#seg-modal").classList.add("show");
    $("#seg-overlay").classList.add("show");
  }
  function closeSegDeep() {
    $("#seg-modal").classList.remove("show");
    $("#seg-overlay").classList.remove("show");
  }

  // 单分层下钻：该层用户在说什么 / 哪些品牌·内容形式这类用户更多 / 反向总结
  const PAL = ["#00f0ff", "#a06bff", "#ffd166", "#ff5d8f", "#4ade80", "#6b7a99", "#f97316", "#22d3ee", "#c084fc", "#34d399"];
  function layerTalkSkew(matrix) {
    return Object.entries(matrix || {}).map(([name, m]) => {
      const total = m.total || 1;
      return { name, total, deep: (m.l3 + m.l4) / total * 100, silent: m.l1 / total * 100, l4: m.l4 / total * 100, m };
    });
  }
  function layerSkewRows(list, metric, color, minTotal) {
    const rows = list.filter((x) => x.total >= (minTotal || 0)).sort((a, b) => b[metric] - a[metric]).slice(0, 5);
    if (!rows.length) return `<div class="uv-muted">样本不足</div>`;
    const max = Math.max(...rows.map((r) => r[metric]), 1);
    return `<div class="uv-skew-list">` + rows.map((r) => `<div class="uv-skew-row">
      <span class="uv-skew-name" title="${esc(r.name)}">${esc(r.name)}</span>
      <span class="uv-skew-track"><i style="width:${(r[metric] / max * 100).toFixed(0)}%;background:${color}"></i></span>
      <span class="uv-skew-val">${r[metric].toFixed(0)}%<em>${fmt(r.total)}条</em></span>
    </div>`).join("") + `</div>`;
  }
  function renderLayerDrill(k) {
    const U = state.users;
    const L = U.layers[k];
    const totAll = U.meta.genuine_replies_in_window || 1;
    const share = uvPct(L.count, totAll);
    const intentPairs = Object.entries(L.intent || {}).map(([ik, iv], i) => [INTENT_NAME[ik] || ik, iv, INTENT_COL[ik] || PAL[i % PAL.length]]);
    const sentPairs = [["正面", L.sentiment.pos || 0, COL.pos], ["中性", L.sentiment.neu || 0, COL.neu], ["负面", L.sentiment.neg || 0, COL.neg]];
    const brandBars = uvBars((L.brands || []).map((x, i) => [x.b, x.n, PAL[i % PAL.length]]));
    const formBars = uvBars((L.forms || []).map((x, i) => [x.f, x.n, PAL[(i + 3) % PAL.length]]));
    const samples = (L.samples || []).map((s) => `<div class="uv-layer-sample">${uvLangTag(s.lang)} ${uvSentTag(s.sent)} ${uvIntentTag(s.intent)} <span class="uv-sample-text">${esc(s.text)}</span> ${s.form ? `<span class="uv-sample-form">${esc(s.form)}</span>` : ""} <a class="uv-link" href="${esc(s.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
    // 反向总结：品牌 / 内容形式 在「深度表达 vs 沉默」上的倾向
    const brandSkew = layerTalkSkew(U.layerMatrix && U.layerMatrix.byBrand);
    const formSkew = layerTalkSkew(U.layerMatrix && U.layerMatrix.byForm);
    const deepBrands = layerSkewRows(brandSkew, "deep", COL.pos, 30);
    const silentBrands = layerSkewRows(brandSkew, "silent", COL.neg, 30);
    const deepForms = layerSkewRows(formSkew, "deep", COL.pos, 60);
    const silentForms = layerSkewRows(formSkew, "silent", COL.neg, 60);
    const dTopB = brandSkew.filter((x) => x.total >= 30).sort((a, b) => b.deep - a.deep)[0];
    const sTopB = brandSkew.filter((x) => x.total >= 30).sort((a, b) => b.silent - a.silent)[0];
    const dTopF = formSkew.filter((x) => x.total >= 60).sort((a, b) => b.deep - a.deep)[0];
    const sTopF = formSkew.filter((x) => x.total >= 60).sort((a, b) => b.silent - a.silent)[0];
    const insight = `综合看：最易引发「深度表达（中+长回复）」的是 <b>${dTopB ? esc(dTopB.name) + " 品牌" : "—"}</b> 与 <b>${dTopF ? esc(dTopF.name) + " 形式" : "—"}</b>；最「沉默（极短回复）」的是 <b>${sTopB ? esc(sTopB.name) + " 品牌" : "—"}</b> 与 <b>${sTopF ? esc(sTopF.name) + " 形式" : "—"}</b>。说明前者更能驱动用户展开表达，后者更适合做轻互动 / 转化引导。`;
    return `<div class="uv-drill">
      <div class="uv-drill-head">
        <button class="btn-ghost" data-uv-layer-back>← 返回分层</button>
        <div class="uv-drill-title">${L.meta.name} · 用户深度分析</div>
        <div class="uv-drill-count">${fmt(L.count)} 条 · 占全部回复 ${share}%</div>
      </div>
      <div class="uv-drill-desc">${L.meta.desc}</div>

      <div class="dp-section">
        <div class="dp-sec-title">用户在说什么 <span class="dp-sec-note">这一层用户的意图与情感</span></div>
        <div class="uv-two">
          <div class="uv-two-col"><div class="uv-sub">意图倾向</div>${uvBars(intentPairs)}</div>
          <div class="uv-two-col"><div class="uv-sub">情感分布</div>${uvBars(sentPairs)}</div>
        </div>
        <div class="uv-sub" style="margin-top:12px">代表语录（${L.samples ? L.samples.length : 0} 条）</div>
        <div class="uv-layer-samples">${samples}</div>
      </div>

      <div class="dp-section">
        <div class="dp-sec-title">哪些品牌分布这类用户更多 <span class="dp-sec-note">本层回复来自哪些品牌（绝对量 Top10）</span></div>
        ${brandBars}
      </div>

      <div class="dp-section">
        <div class="dp-sec-title">哪些内容形式分布这类用户更多 <span class="dp-sec-note">本层回复集中在哪种内容形式（绝对量 Top10）</span></div>
        ${formBars}
      </div>

      <div class="dp-section">
        <div class="dp-sec-title">反向总结 · 品牌的运营情况 <span class="dp-sec-note">跨所有分层，看哪些品牌 / 形式「吸引用户说」，哪些让用户「沉默」</span></div>
        <div class="uv-insight">${insight}</div>
        <div class="uv-two">
          <div class="uv-two-col">
            <div class="uv-sub">🗣️ 最易引发「深度表达」的（中+长回复占比高）</div>
            <div class="uv-skew-block"><div class="uv-skew-h">品牌</div>${deepBrands}</div>
            <div class="uv-skew-h" style="margin-top:10px">内容形式</div>${deepForms}
          </div>
          <div class="uv-two-col">
            <div class="uv-sub">🤐 最「沉默」的（极短回复占比高）</div>
            <div class="uv-skew-block"><div class="uv-skew-h">品牌</div>${silentBrands}</div>
            <div class="uv-skew-h" style="margin-top:10px">内容形式</div>${silentForms}
          </div>
        </div>
      </div>
    </div>`;
  }
  function bindUserSeg() {
    const rt = $("[data-uv-rank-toggle]", $("#board"));
    if (rt) rt.addEventListener("click", () => { state.uvRankAll = !state.uvRankAll; renderBoard(); });
    $$("[data-uv-seg-deep]", $("#board")).forEach((b) => b.addEventListener("click", () => { openSegDeep(); }));
  }

  /* ---------- 用户分层分析（独立板块）：按字数+参与度分层 → 下钻 → 四层对比 ---------- */
  function renderUserTier() {
    const U = state.users;
    const desc = boardDesc("usertier");
    if (!U) return `<div class="board-head"><div class="board-desc">${desc}</div></div>` + emptyState("用户分析数据待生成（运行 scripts/build_users.py）");
    if (state.uvLayerCmp) return renderLayerCompare(U);
    if (state.uvLayerDrill && U.layers[state.uvLayerDrill]) return renderLayerDrill(state.uvLayerDrill);
    if (state.uvLayerDrill && state.uvLayerDrill.startsWith("intent_")) return renderIntentLayerDrill(state.uvLayerDrill);
    if (state.uvLayerDrill && state.uvLayerDrill.startsWith("eng_")) return renderEngLayerDrill(state.uvLayerDrill);
    const realOverview = uvRealDimBlock(voiceRealAgg(), "全量真实回帖的新维度概览（来自 userVoices 直采，补充离线分层分析看不到的「类目 / 身份 / 意图 / 焦点」）。");
    // 三层架构：投入度 / 忠诚度 / 意图倾向，统一区块标题 + 卡片网格
    const legend = `<div class="uv-legend">
      <span class="uv-legend-chip"><i style="background:var(--accent)"></i>投入度 · 按回复字数</span>
      <span class="uv-legend-chip"><i style="background:#ffd166"></i>忠诚度 · 按回复次数</span>
      <span class="uv-legend-chip"><i style="background:#a06bff"></i>意图倾向 · 按主导意图</span>
    </div>`;
    return `<div class="board-head"><div class="board-desc">${desc}</div></div>
      ${legend}
      ${realOverview}
      <div class="uv-sec">
        <div class="uv-sec-head">
          <div class="uv-sec-title">① 投入度分层<span class="uv-sec-sub">按回复字数切分，不同投入度对应不同运营动作</span></div>
          <button class="btn-primary uv-cmp-pill" data-uv-layer-cmp>📊 四层全面对比 →</button>
        </div>
        ${uvLayers(U)}
      </div>
      <div class="uv-sec">
        <div class="uv-sec-head"><div class="uv-sec-title">② 忠诚度分层<span class="uv-sec-sub">按回复次数切分 · 全局 TOP100 用户</span></div></div>
        ${renderEngLayers(U)}
      </div>
      <div class="uv-sec">
        <div class="uv-sec-head"><div class="uv-sec-title">③ 意图倾向分层<span class="uv-sec-sub">按主导意图归类 · 全局 TOP100 用户</span></div></div>
        ${renderIntentLayers(U)}
      </div>`;
  }

  // 忠诚度分层：按回复次数切分；卡片含占比条 + 下钻按钮
  function renderEngLayers(U) {
    const EM = (U.meta && U.meta.eng_meta) || {};
    const order = ["heavy", "active", "light", "once"];
    const ENG_COL = { heavy: "#ffd166", active: "#a06bff", light: "#00f0ff", once: "#6b7a99" };
    const ENG_DESC = {
      heavy: "对该品牌反复发声，是铁粉 / KOC 候选，最值得单独运营。",
      active: "稳定参与者，已建立品牌认知，可培养为深度用户。",
      light: "偶尔回来互动，处在观望期，需内容持续触达。",
      once: "路人 / 首次接触，规模最大，是拉新与转化的入口。",
    };
    const topUsers = U.topUsers || [];
    const engCounts = { heavy: 0, active: 0, light: 0, once: 0 };
    const nUsers = topUsers.length || 1;
    topUsers.forEach((u) => {
      const c = u.replyCount || 0;
      if (c >= 10) engCounts.heavy++;
      else if (c >= 4) engCounts.active++;
      else if (c >= 2) engCounts.light++;
      else engCounts.once++;
    });
    const maxCount = Math.max(...order.map((k) => engCounts[k] || 0), 1);
    const cards = order.map((k) => {
      const name = (EM[k] && EM[k].name) || k;
      const count = engCounts[k] || 0;
      const share = uvPct(count, nUsers);
      const w = Math.round((count / maxCount) * 100);
      return `<div class="uv-layer-card">
        <div class="uv-layer-head"><span class="uv-layer-name">${esc(name)}</span><span class="uv-layer-count">${fmt(count)} 人 · ${share}%</span></div>
        <div class="uv-layer-desc">${ENG_DESC[k] || ""}</div>
        <div class="uv-mini-share"><i style="width:${w}%;background:${ENG_COL[k]}"></i></div>
        <div class="uv-layer-foot"><button class="btn-ghost uv-layer-enter" data-uv-layer="eng_${k}">🎯 深度分析 →</button></div>
      </div>`;
    }).join("");
    return `<div class="uv-layer-grid">${cards}</div>`;
  }

  function renderIntentLayers(U) {
    const users = U.topUsers || [];
    const INTENT_KEYS = ["praise", "request", "question", "complaint", "banter"];
    const INTENT_LABEL = { praise: "赞美型用户", request: "求购型用户", question: "提问型用户", complaint: "吐槽型用户", banter: "玩梗型用户" };
    const INTENT_DESC = {
      praise: "以正面赞美为主，对品牌有好感，适合做口碑传播与 UGC 激励。",
      request: "以求购/合作意向为主，有明确需求，是转化与承接的最佳目标。",
      question: "以提问为主，在评估决策中，需要内容教育打消疑虑。",
      complaint: "以吐槽/不满为主，是产品改进的信号源，也需危机公关关注。",
      banter: "以轻松玩梗/社交互动为主，是社群氛围的营造者，适合裂变活动。",
    };
    // 为每个用户确定主导意图
    const intentGroups = {};
    INTENT_KEYS.forEach((k) => { intentGroups[k] = []; });
    users.forEach((u) => {
      const it = u.intents || {};
      let maxK = "praise", maxV = 0;
      Object.entries(it).forEach(([k, v]) => { const vi = typeof v === "number" ? v : (v && v.count) || 0; if (vi > maxV) { maxV = vi; maxK = k; } });
      if (intentGroups[maxK]) intentGroups[maxK].push(u);
    });
    const cards = INTENT_KEYS.filter((k) => intentGroups[k].length).map((k) => {
      const grp = intentGroups[k];
      const count = grp.length;
      const share = uvPct(count, users.length);
      const brands = aggregateByField(grp.map((u) => ({ account: u.topBrand || "—" })), "account").slice(0, 4);
      const brandChips = brands.map((b) => `<span class="uv-chip">${esc(b.name)}<em>×${b.count}</em></span>`).join("");
      const sTot = grp.reduce((s, u) => s + ((u.sents || {}).pos || 0) + ((u.sents || {}).neu || 0) + ((u.sents || {}).neg || 0), 0) || 1;
      const posR = Math.round(grp.reduce((s, u) => s + ((u.sents || {}).pos || 0), 0) / sTot * 100);
      const q = grp.slice(0, 3).map((u) => {
        const s = (u.samples || [])[0];
        return s ? `<div class="uv-quote">${uvLangTag(s.lang || "")} ${uvSentTag(s.sent || "")} <span class="uv-q-text">${esc(s.text || "")}</span></div>` : "";
      }).join("");
      const insight = `${INTENT_LABEL[k]} · ${fmt(count)} 人（${share}%）· 正面情感率 ${posR}%。${INTENT_DESC[k]}`;
      return `<div class="uv-layer-card">
        <div class="uv-layer-head"><span class="uv-layer-name">${INTENT_LABEL[k]}</span><span class="uv-layer-count">${fmt(count)} 人 · ${share}%</span></div>
        <div class="uv-layer-desc">${INTENT_DESC[k]}</div>
        <div class="uv-row"><b>主力品牌</b><div class="uv-tags">${brandChips || "—"}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${q || "—"}</div></div>
        <div class="uv-insight" style="margin-top:8px">${insight}</div>
        <div class="uv-layer-foot"><button class="btn-ghost uv-layer-enter" data-uv-layer="intent_${k}">🎯 深度分析 →</button></div>
      </div>`;
    }).join("");
    return `<div class="uv-layer-grid">${cards}</div>`;
  }

  function renderIntentLayerDrill(key) {
    const U = state.users;
    const k = key.replace("intent_", "");
    const INTENT_LABEL = { praise: "赞美型用户", request: "求购型用户", question: "提问型用户", complaint: "吐槽型用户", banter: "玩梗型用户" };
    const users = U.topUsers || [];
    const grp = users.filter((u) => {
      const it = u.intents || {};
      let maxK = "praise", maxV = 0;
      Object.entries(it).forEach(([kk, v]) => { const vi = typeof v === "number" ? v : (v && v.count) || 0; if (vi > maxV) { maxV = vi; maxK = kk; } });
      return maxK === k;
    });
    const sTot = grp.reduce((s, u) => s + ((u.sents || {}).pos || 0) + ((u.sents || {}).neu || 0) + ((u.sents || {}).neg || 0), 0) || 1;
    const posR = Math.round(grp.reduce((s, u) => s + ((u.sents || {}).pos || 0), 0) / sTot * 100);
    const negR = Math.round(grp.reduce((s, u) => s + ((u.sents || {}).neg || 0), 0) / sTot * 100);
    // 品牌分布
    const brandMap = {}; grp.forEach((u) => { const b = u.topBrand || "—"; brandMap[b] = (brandMap[b] || 0) + 1; });
    const brandBars = uvBars(Object.entries(brandMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([b, n], i) => [b, n, PAL[i % PAL.length]]));
    // 形式分布
    const formMap = {}; grp.forEach((u) => { const f = u.topForm || "—"; formMap[f] = (formMap[f] || 0) + 1; });
    const formBars = uvBars(Object.entries(formMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f, n], i) => [f, n, PAL[(i + 3) % PAL.length]]));
    // 代表语录
    const samples = grp.slice(0, 8).map((u) => {
      const s = (u.samples || [])[0];
      return s ? `<div class="uv-layer-sample">${uvLangTag(s.lang || "")} ${uvSentTag(s.sent || "")} ${uvIntentTag(s.intent || "")} <span class="uv-sample-text">${esc(s.text || "")}</span> <span class="uv-sample-form">@${esc(u.name)} · ${esc(u.topBrand || "—")}</span></div>` : "";
    }).join("");
    const insight = `${INTENT_LABEL[k]} · ${fmt(grp.length)} 人 · 正面情感率 ${posR}% · 负面仅 ${negR}%。${k === "praise" ? "高好感用户群，适合做口碑放大、UGC 征集和品牌大使计划。" : k === "request" ? "高转化意向用户群，适合推送产品链接、限时优惠和购买引导。" : k === "question" ? "决策中用户群，适合做 FAQ 内容、对比评测和信任背书。" : k === "complaint" ? "不满用户群，需要及时回应、问题解决和品牌关怀。" : "社交型用户群，适合做互动活动、梗文化和社群裂变。"}`;
    return `<div class="uv-drill">
      <div class="uv-drill-head">
        <button class="btn-ghost" data-uv-layer-back>← 返回分层</button>
        <div class="uv-drill-title">${INTENT_LABEL[k]} · 深度分析</div>
        <div class="uv-drill-count">${fmt(grp.length)} 人 · 全局 TOP100 占比 ${uvPct(grp.length, (U.topUsers || []).length)}%</div>
      </div>
      <div class="uv-insight">${insight}</div>
      <div class="dp-section">
        <div class="dp-sec-title">主要品牌来源</div>
        ${brandBars}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">内容形式偏好</div>
        ${formBars}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">代表用户语录</div>
        <div class="uv-layer-samples">${samples}</div>
      </div>
    </div>`;
  }

  // 忠诚度分层下钻：按回复次数阈值筛选该层用户，聚合品牌/形式/情感/意图
  function renderEngLayerDrill(key) {
    const U = state.users;
    const k = key.replace("eng_", "");
    const EM = (U.meta && U.meta.eng_meta) || {};
    const name = (EM[k] && EM[k].name) || k;
    const ENG_DESC = {
      heavy: "对该品牌反复发声，是铁粉 / KOC 候选，最值得单独运营。",
      active: "稳定参与者，已建立品牌认知，可培养为深度用户。",
      light: "偶尔回来互动，处在观望期，需内容持续触达。",
      once: "路人 / 首次接触，规模最大，是拉新与转化的入口。",
    };
    const TH = { heavy: [10, 1e9], active: [4, 9], light: [2, 3], once: [0, 1] };
    const [lo, hi] = TH[k] || [0, 1e9];
    const users = U.topUsers || [];
    const grp = users.filter((u) => { const c = u.replyCount || 0; return c >= lo && c <= hi; });
    if (!grp.length) return `<div class="uv-drill"><div class="uv-insight">该分层暂无可下钻的用户样本。</div></div>`;
    const sTot = grp.reduce((s, u) => s + ((u.sents || {}).pos || 0) + ((u.sents || {}).neu || 0) + ((u.sents || {}).neg || 0), 0) || 1;
    const posR = Math.round(grp.reduce((s, u) => s + ((u.sents || {}).pos || 0), 0) / sTot * 100);
    const negR = Math.round(grp.reduce((s, u) => s + ((u.sents || {}).neg || 0), 0) / sTot * 100);
    const brandMap = {}; grp.forEach((u) => { const b = u.topBrand || "—"; brandMap[b] = (brandMap[b] || 0) + 1; });
    const brandBars = uvBars(Object.entries(brandMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([b, n], i) => [b, n, PAL[i % PAL.length]]));
    const formMap = {}; grp.forEach((u) => { const f = u.topForm || "—"; formMap[f] = (formMap[f] || 0) + 1; });
    const formBars = uvBars(Object.entries(formMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f, n], i) => [f, n, PAL[(i + 3) % PAL.length]]));
    const samples = grp.slice(0, 8).map((u) => {
      const s = (u.samples || [])[0];
      return s ? `<div class="uv-layer-sample">${uvLangTag(s.lang || "")} ${uvSentTag(s.sent || "")} ${uvIntentTag(s.intent || "")} <span class="uv-sample-text">${esc(s.text || "")}</span> <span class="uv-sample-form">@${esc(u.name)} · ${esc(u.topBrand || "—")}</span></div>` : "";
    }).join("");
    const insight = `${name} · ${fmt(grp.length)} 人 · 正面情感率 ${posR}% · 负面仅 ${negR}%。${ENG_DESC[k]}`;
    return `<div class="uv-drill">
      <div class="uv-drill-head">
        <button class="btn-ghost" data-uv-layer-back>← 返回分层</button>
        <div class="uv-drill-title">${name} · 深度分析</div>
        <div class="uv-drill-count">${fmt(grp.length)} 人 · 全局 TOP100 占比 ${uvPct(grp.length, users.length)}%</div>
      </div>
      <div class="uv-insight">${insight}</div>
      <div class="dp-section"><div class="dp-sec-title">主要品牌来源</div>${brandBars}</div>
      <div class="dp-section"><div class="dp-sec-title">内容形式偏好</div>${formBars}</div>
      <div class="dp-section"><div class="dp-sec-title">代表用户语录</div><div class="uv-layer-samples">${samples}</div></div>
    </div>`;
  }

  function bindUserTier() {
    $$("[data-uv-layer]", $("#board")).forEach((b) => b.addEventListener("click", () => { state.uvLayerDrill = b.dataset.uvLayer; renderBoard(); }));
    const back = $("[data-uv-layer-back]", $("#board"));
    if (back) back.addEventListener("click", () => { state.uvLayerDrill = null; renderBoard(); });
    const cmp = $("[data-uv-layer-cmp]", $("#board"));
    if (cmp) cmp.addEventListener("click", () => { state.uvLayerCmp = true; renderBoard(); });
    const cmpBack = $("[data-uv-layer-cmp-back]", $("#board"));
    if (cmpBack) cmpBack.addEventListener("click", () => { state.uvLayerCmp = false; renderBoard(); });
    // 意图分层返回（复用 data-uv-layer-back）
  }

  /* ---------- 空态 ---------- */
  function emptyState(msg = "没有符合当前筛选的内容") {
    return `<div class="empty"><div class="em-ic">🔍</div><div class="em-t">${esc(msg)}<br>试试放宽顶部筛选条件</div></div>`;
  }

  /* ============ 维度分析工具（仍被我方运营等复用）============ */
  function aggregateByField(data, field) {
    const map = new Map();
    data.forEach((c) => {
      const v = Array.isArray(c[field]) ? c[field] : [c[field]];
      v.forEach((x) => { if (!x) return; if (!map.has(x)) map.set(x, []); map.get(x).push(c); });
    });
    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      count: items.length,
      avgRate: items.length ? Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length) : 0,
      avgEng: items.length ? items.reduce((s, c) => s + c.engagementRate, 0) / items.length : 0,
      latest: items.reduce((m, c) => (c.publishDate > m ? c.publishDate : m), ""),
      topCount: items.filter((c) => c.isTop).length,
      totalExposure: items.reduce((s, c) => s + c.exposure, 0),
      accounts: [...new Set(items.map((c) => c.account))],
      platforms: [...new Set(items.map((c) => c.platform))],
    })).sort((a, b) => b.count - a.count);
  }

  function barHTML(label, val) {
    const w = Math.max(0, Math.min(100, val));
    return `<div class="qc-bar"><span class="qc-name">${label}</span><span class="qc-track"><i style="width:${w}%"></i></span><span class="qc-val">${Math.round(val)}</span></div>`;
  }

  /* ============ 看竞品：竞品内容库（整合）+ 多品牌对比 ============ */
  function burstsFor(items) {
    const map = new Map();
    items.filter((c) => c.isActivity && c.campaignName).forEach((c) => { if (!map.has(c.campaignName)) map.set(c.campaignName, []); map.get(c.campaignName).push(c); });
    const all = getFiltered();
    const allNon = all.filter((c) => !c.isActivity).length || 1;
    const normalDaily = allNon / Math.max(1, new Set(all.filter((c) => !c.isActivity).map((c) => c.publishDate)).size || 1);
    let rows = Array.from(map.entries()).map(([name, arr]) => {
      const dates = arr.map((c) => c.publishDate).sort();
      const dur = Math.max(1, (new Date(dates[dates.length - 1]) - new Date(dates[0])) / 86400000 + 1);
      const freq = arr.length / dur;
      return { name, count: arr.length, dur, lift: normalDaily > 0 ? freq / normalDaily : 0, avgRate: Math.round(arr.reduce((s, c) => s + rate(c), 0) / arr.length) };
    });
    rows.sort((a, b) => b.lift - a.lift);
    return rows;
  }
  function accountMeta(name) {
    const accs = (state.raw && state.raw.accounts) || [];
    return accs.filter((a) => a.account === name);
  }
  function groupRate(items, key, multi) {
    const map = new Map();
    items.forEach((c) => {
      const vals = multi ? (c[key] || []) : [c[key]];
      vals.forEach((v) => { if (!v) return; if (!map.has(v)) map.set(v, []); map.get(v).push(c); });
    });
    return Array.from(map.entries()).map(([name, arr]) => ({
      name, count: arr.length,
      avgRate: arr.length ? Math.round(arr.reduce((s, c) => s + rate(c), 0) / arr.length) : 0,
    })).sort((a, b) => b.count - a.count);
  }
  /* 竞品单品牌深度整合：cf=null → 全量紧凑版（全部竞品模式）；cf 提供 → 局部筛选 + 多维面板 */
  function competitorSection(data, name, cf) {
    const itemsAll = data.filter((c) => c.account === name);
    if (!itemsAll.length) return "";
    let items = itemsAll;
    if (cf) {
      if (cf.types.size) items = items.filter((c) => cf.types.has(c.contentType));
      if (cf.topOnly) items = items.filter((c) => c.isTop);
      if (cf.viralMin > 0) items = items.filter((c) => rate(c) >= cf.viralMin);
      if (cf.mode === "activity") items = items.filter((c) => isActivityPost(c));
      if (cf.mode === "daily") items = items.filter((c) => !isActivityPost(c));
      items = [...items].sort((a, b) => {
        if (cf.sort === "exposure") return b.exposure - a.exposure;
        if (cf.sort === "engagement") return b.engagement - a.engagement;
        if (cf.sort === "date") return b.publish_time.localeCompare(a.publish_time);
        return b.viralScore - a.viralScore;
      });
    } else {
      items = [...itemsAll].sort((a, b) => b.viralScore - a.viralScore);
    }
    const avgRate = items.length ? Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length) : 0;
    const topCount = items.filter((c) => c.isTop).length;
    const totalExp = items.reduce((s, c) => s + c.exposure, 0);
    const avgEng = items.length ? (items.reduce((s, c) => s + c.engagementRate, 0) / items.length).toFixed(2) : "0.00";
    // 内容构成与互动深度指标（基于当前筛选）
    const originalCount = items.filter((c) => (c.content_source || "") === "原创").length;
    const repostCount = items.filter((c) => (c.content_source || "") === "转发").length;
    const replyCount = items.filter((c) => (c.brand_replies || 0) > 0).length;
    const activityCount = items.filter((c) => isActivityPost(c)).length;
    const denom = items.length || 1;
    const originalPct = Math.round(originalCount / denom * 100);
    const repostPct = Math.round(repostCount / denom * 100);
    const replyPct = Math.round(replyCount / denom * 100);
    const activityPct = Math.round(activityCount / denom * 100);
    const metas = accountMeta(name);
    const followers = metas.reduce((s, a) => s + (a.followers || 0), 0);
    const m0 = metas[0] || {};
    const handles = metas.map((a) => `<a class="comp-handle" href="${esc(a.account_link || "#")}" target="_blank" rel="noreferrer">${esc(a.handle || a.account)} ↗</a>`).join(" · ");
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.account === name).sort((a, b) => b.likes - a.likes);
    const voiceHTML = voices.length
      ? `<div class="uv-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-top:8px">${voices.slice(0, 6).map((v) => `<div class="uv-card"><div class="uv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes)}</span></div><div class="uv-text">${esc(dispVoice(v))}</div><a class="uv-link" href="${esc(v.originalLink || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>`).join("")}</div>`
      : `<div style="color:var(--text-3);font-size:12.5px;margin-top:6px">暂无该竞品的用户评价数据</div>`;
    const listCap = cf ? items.length : Math.min(items.length, 8);
    const contentHTML = `<div class="list-rows">${items.slice(0, listCap).map((c) => `<div class="list-row ${c.post_link ? 'has-link' : ''}" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div><div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div><div class="lr-num">${fmt(c.engagement)}<small>互动</small></div><div class="lr-num" style="color:var(--hot)" title="爆款指数：该帖「爆款内容指数」在全库的百分位（0–100，越高越爆）"><span>${rate(c)}</span><small>爆款指数</small></div>${c.post_link ? `<a class="lr-link" href="${esc(c.post_link)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">原帖↗</a>` : ""}</div>`).join("")}${cf && items.length > listCap ? `<div style="color:var(--text-3);font-size:12px;padding:8px 0;text-align:center">已显示全部 ${items.length} 条（受筛选约束）</div>` : (cf && items.length === 0 ? `<div class="empty-state">当前筛选条件下该品牌暂无匹配帖子</div>` : "")}</div>`;
    const typeBreak = groupRate(items, "contentType");
    const topicBreak = groupRate(items, "topicTags", true).slice(0, 8);
    const emotionBreak = groupRate(items, "emotion");
    const maxRate = Math.max(...typeBreak.map((t) => t.avgRate), 1);
    const dimCards = [
      { title: `形式分布（${typeBreak.length}）`, rows: typeBreak },
      { title: `主题分布（Top8）`, rows: topicBreak },
      { title: `风格/情绪分布（${emotionBreak.length}）`, rows: emotionBreak },
    ].map((d) => `<div class="comp-dim-card"><div class="comp-dim-title">${d.title}</div>${d.rows.map((r) => `<div class="qc-bar"><span class="qc-name" style="width:96px">${esc(r.name)}</span><span class="qc-track"><i style="width:${(r.avgRate / maxRate) * 100}%"></i></span><span class="qc-val">${r.count}·${r.avgRate}</span></div>`).join("") || '<div style="color:var(--text-3);font-size:12px">无</div>'}</div>`).join("");
    const weeks = aggregateWeeks(items);
    const rhythmHTML = weeks.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">运营节奏 · 频率 × 表现</div><div class="panel-sub">柱=当周发布数 · 线=当周平均爆款指数</div>${comboSVG(weeks)}</div>` : "";
    const bursts = burstsFor(items);
    const burstHTML = bursts.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">Campaign 爆发监测</div>${bursts.map((r) => `<div class="qc-bar"><span class="qc-name">${esc(r.name)}</span><span class="qc-track"><i style="width:${Math.min(100, r.lift * 20)}%"></i></span><span class="qc-val">${r.lift.toFixed(1)}× · ${r.count}条</span></div>`).join("")}</div>` : "";
    // 活动 vs 日常运营对比（始终基于全品牌，用于全局参照）
    const activityItemsAll = itemsAll.filter((c) => isActivityPost(c));
    const dailyItemsAll = itemsAll.filter((c) => !isActivityPost(c));
    function quickAgg(arr) {
      const n = arr.length || 1;
      const totalExp = arr.reduce((s, c) => s + c.exposure, 0);
      const avgEngRate = arr.reduce((s, c) => s + c.engagementRate, 0) / n;
      // 平均爆款指数：与列表/统计统一的 0–100 百分位（rate），保持口径一致
      const avgViral = arr.length ? arr.reduce((s, c) => s + rate(c), 0) / n : 0;
      const topN = arr.filter((c) => c.isTop).length;
      return { count: arr.length, totalExp, avgEngRate: (avgEngRate * 100).toFixed(2), avgViral: avgViral.toFixed(1), topN, topPct: Math.round(topN / n * 100) };
    }
    const actAgg = quickAgg(activityItemsAll);
    const dailyAgg = quickAgg(dailyItemsAll);
    const maxExp2 = Math.max(actAgg.totalExp, dailyAgg.totalExp, 1);
    const activityPctAll = itemsAll.length ? Math.round(activityItemsAll.length / itemsAll.length * 100) : 0;
    const modeHint = (cf && cf.mode !== "all") ? `（当前看板已筛选为「${cf.mode === "activity" ? "活动" : "日常"}」帖，下方为全品牌活动 vs 日常参照）` : "";
    const campaignCompareHTML = `<div class="panel" style="margin-top:12px"><div class="panel-title">活动运营 vs 日常运营</div><div class="panel-sub">基于文本/主题自动识别的 Campaign 帖 vs 日常帖对比（全品牌）${modeHint}</div>
      <div class="cmp-compare-grid">
        <div class="cmp-compare-col${cf && cf.mode === "activity" ? " on" : ""}"><div class="cmp-compare-h">活动帖 (${actAgg.count}条 · ${activityPctAll}%)</div>
          <div class="qc-bar"><span class="qc-name">总曝光</span><span class="qc-track"><i style="width:${(actAgg.totalExp / maxExp2 * 100).toFixed(0)}%"></i></span><span class="qc-val">${fmt(actAgg.totalExp)}</span></div>
          <div class="qc-bar"><span class="qc-name">平均互动率</span><span class="qc-track"><i style="width:${Math.min(100, actAgg.avgEngRate * 10)}%"></i></span><span class="qc-val">${actAgg.avgEngRate}%</span></div>
          <div class="qc-bar"><span class="qc-name">平均爆款指数</span><span class="qc-track"><i style="width:${Math.min(100, actAgg.avgViral)}%"></i></span><span class="qc-val">${actAgg.avgViral}</span></div>
          <div class="qc-bar"><span class="qc-name">爆款占比</span><span class="qc-track"><i style="width:${actAgg.topPct}%"></i></span><span class="qc-val">${actAgg.topPct}%</span></div>
        </div>
        <div class="cmp-compare-col${cf && cf.mode === "daily" ? " on" : ""}"><div class="cmp-compare-h">日常帖 (${dailyAgg.count}条 · ${100 - activityPctAll}%)</div>
          <div class="qc-bar"><span class="qc-name">总曝光</span><span class="qc-track"><i style="width:${(dailyAgg.totalExp / maxExp2 * 100).toFixed(0)}%"></i></span><span class="qc-val">${fmt(dailyAgg.totalExp)}</span></div>
          <div class="qc-bar"><span class="qc-name">平均互动率</span><span class="qc-track"><i style="width:${Math.min(100, dailyAgg.avgEngRate * 10)}%"></i></span><span class="qc-val">${dailyAgg.avgEngRate}%</span></div>
          <div class="qc-bar"><span class="qc-name">平均爆款指数</span><span class="qc-track"><i style="width:${Math.min(100, dailyAgg.avgViral)}%"></i></span><span class="qc-val">${dailyAgg.avgViral}</span></div>
          <div class="qc-bar"><span class="qc-name">爆款占比</span><span class="qc-track"><i style="width:${dailyAgg.topPct}%"></i></span><span class="qc-val">${dailyAgg.topPct}%</span></div>
        </div>
      </div>
    </div>`;
    const modeTag = cf && cf.mode !== "all" ? `<span class="tag" style="background:var(--accent);color:#fff;margin-left:8px">${cf.mode === "activity" ? "活动" : "日常"}</span>` : "";
    return `<div class="comp-section">
      <div class="comp-sec-head"><span class="comp-sec-name">${esc(name)}${modeTag}</span><span class="comp-sec-badge">内容 ${items.length} · 平均爆款指数 ${avgRate} · 爆款 ${topCount}</span></div>
      <div class="comp-meta">${m0.category ? `<span class="tag">${esc(m0.category)}</span>` : ""}${followers ? `<span class="comp-followers">👥 ${fmt(followers)} 粉丝</span>` : ""}${handles ? `<span class="comp-handles">${handles}</span>` : ""}</div>
      <div class="stat-row" style="margin:10px 0">
        <div class="stat"><div class="stat-label">内容量</div><div class="stat-val">${items.length}</div></div>
        <div class="stat"><div class="stat-label">平均爆款指数</div><div class="stat-val" style="color:var(--hot)">${avgRate}</div></div>
        <div class="stat"><div class="stat-label">爆款数</div><div class="stat-val">${topCount}</div></div>
        <div class="stat"><div class="stat-label">总曝光</div><div class="stat-val">${fmt(totalExp)}</div></div>
        <div class="stat"><div class="stat-label">平均互动率</div><div class="stat-val">${avgEng}%</div></div>
        <div class="stat"><div class="stat-label">原创 / 转发</div><div class="stat-val">${originalPct}% / ${repostPct}%</div></div>
        <div class="stat"><div class="stat-label">回复用户占比</div><div class="stat-val">${replyPct}%</div></div>
        <div class="stat"><div class="stat-label">活动帖占比</div><div class="stat-val">${activityPct}%</div></div>
      </div>
      <div class="comp-dims">${dimCards}</div>
      <div class="comp-sub">内容排序列表${cf ? "（受形式 / 数据筛选约束）" : "（按爆款指数 · 点开看原帖）"}</div>${contentHTML}
      <div class="comp-sub">用户对竞品的评价（最高赞）</div>${voiceHTML}
      ${campaignCompareHTML}${rhythmHTML}${burstHTML}
    </div>`;
  }
  /* 单品牌多维视图：顶部局部筛选条 + 深度整合 */
  function competitorDeep(data, name) {
    const cf = state.compFilters;
    const brandItems = data.filter((c) => c.account === name);
    const types = [...new Set(brandItems.map((c) => c.contentType))].sort();
    const typeChips = types.map((t) => `<span class="chip comp-type${cf.types.has(t) ? " on" : ""}" data-type="${esc(t)}">${esc(t)}</span>`).join("");
    const toolbar = `<div class="comp-toolbar">
      <div class="ct-group"><span class="ct-label">范围</span>
        <div class="seg" id="comp-mode">
          <button data-mode="all" class="${cf.mode === "all" ? "on" : ""}">全部</button>
          <button data-mode="activity" class="${cf.mode === "activity" ? "on" : ""}">活动</button>
          <button data-mode="daily" class="${cf.mode === "daily" ? "on" : ""}">日常</button>
        </div>
      </div>
      <div class="ct-group"><span class="ct-label">形式</span><div class="ct-chips" id="comp-type-chips">${typeChips || '<span style="color:var(--text-3);font-size:12px">无</span>'}</div></div>
      <div class="ct-group"><span class="ct-label">排序</span><select class="sel" id="comp-sort">
        <option value="viral"${cf.sort === "viral" ? " selected" : ""}>爆款指数</option>
        <option value="engagement"${cf.sort === "engagement" ? " selected" : ""}>互动</option>
        <option value="exposure"${cf.sort === "exposure" ? " selected" : ""}>浏览/曝光</option>
        <option value="date"${cf.sort === "date" ? " selected" : ""}>最新发布</option>
      </select></div>
      <div class="ct-group ct-range"><span class="ct-label">爆款指数≥</span><input type="range" id="comp-viral-min" min="0" max="100" value="${cf.viralMin}"><span class="ct-val" id="comp-viral-min-val">${cf.viralMin}</span></div>
      <div class="ct-group"><label class="chk"><input type="checkbox" id="comp-top-only"${cf.topOnly ? " checked" : ""}>只看爆款</label></div>
      <div class="ct-group"><button class="comp-reset" id="comp-reset">重置筛选</button></div>
    </div>`;
    return toolbar + competitorSection(data, name, cf);
  }
  function renderCompetitorLib() {
    const data = getFiltered();
    const brands = aggregateByField(data, "account");
    if (!brands.length) return emptyState("当前筛选下没有竞品内容");
    // 首次进入默认选中排名靠前的单品牌（单品牌默认选中）
    if (!state._compInit && brands.length) { state.compSel = new Set([brands[0].name]); state._compInit = true; }
    // 全局筛选可能把已选品牌过滤掉 → 回退到可见品牌
    if (state.compSel.size && !brands.some((b) => state.compSel.has(b.name))) state.compSel = new Set([brands[0].name]);
    const allActive = state.compSel.size === 0;
    const chips = `<span class="chip comp-chip all${allActive ? " on" : ""}" data-brand="__all__">全部竞品 (${brands.length})</span>` +
      brands.map((b) => `<span class="chip comp-chip${state.compSel.has(b.name) ? " on" : ""}" data-brand="${esc(b.name)}">${esc(b.name)} (${b.count})</span>`).join("");
    const note = allActive
      ? `已选「全部竞品」，下方为各品牌深度整合分析；点上方品牌切换为<b style="color:var(--accent-strong)">单品牌多维视图</b>。`
      : `单品牌多维视图：形式 / 数据筛选 + 整体数据 + 内容排序 + 形式·主题·情绪维度 + 用户评价 + 运营节奏 + Campaign 爆发，尽可能多维度。`;
    const body = allActive
      ? brands.map((b) => competitorSection(data, b.name, null)).join("")
      : competitorDeep(data, [...state.compSel][0]);
    return `<div class="board-head"><div class="board-desc">${boardDesc("competitor")}</div></div>
      <div class="comp-selbar">${chips}</div>
      <div class="dim-note">${note}</div>${body}`;
  }
  function renderCompareBoard() {
    const data = getFiltered();
    const brands = aggregateByField(data, "account");
    const chips = brands.map((b) => `<span class="chip cmp-chip${state.cmpSel.has(b.name) ? " on" : ""}" data-brand="${esc(b.name)}">${esc(b.name)}</span>`).join("");
    const sel = brands.filter((b) => state.cmpSel.has(b.name));
    const compare = sel.length >= 2 ? renderBrandCompare(sel) : `<div class="empty-state"><svg viewBox="0 0 24 24" class="ic" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><b>尚未选择对比品牌</b><span>请在上方的品牌列表中勾选 2 个及以上品牌，即可查看横向数据对比、Top3 内容与用户情况分析。</span></div>`;
    return `<div class="board-head"><div class="board-desc">${boardDesc("compare")}</div></div>
      <div class="fp-chips" style="margin-bottom:16px">${chips}</div>
      ${compare}`;
  }
  // 多竞品横向对比：品牌聚合（全部采用真实字段，源数据 1:1 聚合）
  function brandAgg(name, data) {
    const items = data.filter((c) => c.account === name);
    const c0 = items.length;
    if (!c0) return null;
    const sum = (arr, k) => arr.reduce((s, c) => s + (c[k] || 0), 0);
    const avg = (arr, k) => sum(arr, k) / arr.length;
    const topCount = items.filter((c) => c.isTop).length;
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.account === name);
    const voiceCount = voices.length;
    const voiceLikes = voiceCount ? sum(voices, "likes") : 0;
    const voiceAvg = voiceCount ? Math.round(voiceLikes / voiceCount) : 0;
    const sent = { pos: 0, neu: 0, neg: 0 };
    voices.forEach((v) => { const s = (v.sentiment || ""); if (s.includes("正面")) sent.pos++; else if (s.includes("负面")) sent.neg++; else sent.neu++; });
    const posPct = voiceCount ? Math.round(sent.pos / voiceCount * 100) : 0;
    // 主导维度（按出现频次）
    const dom = (key) => { const m = {}; items.forEach((c) => { const v = c[key]; if (v) m[v] = (m[v] || 0) + 1; }); const e = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; return e ? e[0] : "—"; };
    const originalPct = Math.round(items.filter((c) => (c.content_source || "") === "原创").length / c0 * 100);
    return {
      name, c0,
      totalExp: sum(items, "exposure"),
      avgExp: Math.round(avg(items, "exposure")),
      totalEng: sum(items, "engagement"),
      avgEng: Math.round(avg(items, "engagement")),
      avgEngRate: +avg(items, "engagementRate").toFixed(2),
      avgViral: +avg(items, "viralScore").toFixed(1),
      topCount, topPct: Math.round(topCount / c0 * 100),
      avgLikeRate: +avg(items, "likeRate").toFixed(2),
      avgCommentRate: +avg(items, "commentRate").toFixed(2),
      avgShareRate: +avg(items, "shareRate").toFixed(2),
      avgCollectRate: +avg(items, "collectRate").toFixed(2),
      voiceCount, voiceAvg, posPct,
      domType: dom("contentType"),
      domEmotion: dom("emotion") || "—",
      domCategory: dom("category"),
      domGoal: dom("marketing_goal") || "—",
      originalPct,
      top3: [...items].sort((a, b) => b.viralScore - a.viralScore).slice(0, 3),
    };
  }
  function renderBrandCompare(sel) {
    if (sel.length < 2) return `<div class="dim-note">勾选 2 个及以上品牌，查看横向对比。</div>`;
    const aggs = sel.map((b) => brandAgg(b.name, state.analysis.contents)).filter(Boolean);
    if (!aggs.length) return `<div class="dim-note">所选品牌暂无内容数据。</div>`;

    const BRAND_COLORS = ['#00b8e6','#f97316','#10b981','#8b5cf6','#ec4899','#f59e0b','#06b6d4','#6b7280'];
    const color = (i) => BRAND_COLORS[i % BRAND_COLORS.length];

    // ---------- 1. 结论面板（谁在哪个维度领先） ----------
    const kings = [
      { label: "爆款之王", icon: "🏆", key: "avgViral", fmt: (a) => `爆款指数 ${a.avgViral}`, sort: (arr) => arr.slice().sort((a,b) => b.avgViral - a.avgViral)[0] },
      { label: "声量之王", icon: "📢", key: "totalExp", fmt: (a) => `总曝光 ${fmt(a.totalExp)}`, sort: (arr) => arr.slice().sort((a,b) => b.totalExp - a.totalExp)[0] },
      { label: "互动之王", icon: "💬", key: "avgEngRate", fmt: (a) => `互动率 ${a.avgEngRate}%`, sort: (arr) => arr.slice().sort((a,b) => b.avgEngRate - a.avgEngRate)[0] },
      { label: "讨论热度王", icon: "🗣️", key: "voiceCount", fmt: (a) => `${fmt(a.voiceCount)} 条讨论`, sort: (arr) => arr.slice().sort((a,b) => b.voiceCount - a.voiceCount)[0] },
      { label: "原创王", icon: "✍️", key: "originalPct", fmt: (a) => `原创 ${a.originalPct}%`, sort: (arr) => arr.slice().sort((a,b) => b.originalPct - a.originalPct)[0] },
    ];
    const insightHTML = kings.map((k) => {
      const champ = k.sort(aggs);
      const ci = aggs.indexOf(champ);
      return `<div class="cmp-insight-card"><div class="ci-icon">${k.icon}</div><div class="ci-label">${k.label}</div><div class="ci-brand">${esc(champ.name)}</div><div class="ci-value">${k.fmt(champ)}</div><div class="ci-bar" style="background:${color(ci)};width:100%"></div></div>`;
    }).join("");

    // ---------- 2. SVG 雷达图 ----------
    const DIMS = [
      { key: "avgViral", label: "爆款指数", max: Math.ceil(Math.max(...aggs.map((a) => a.avgViral), 5)) },
      { key: "avgEngRate", label: "互动率%", max: Math.ceil(Math.max(...aggs.map((a) => a.avgEngRate), 5)) },
      { key: "topPct", label: "爆款占比%", max: Math.ceil(Math.max(...aggs.map((a) => a.topPct), 5)) },
      { key: "posPct", label: "正面情绪%", max: Math.ceil(Math.max(...aggs.map((a) => a.posPct), 5)) },
      { key: "voiceCount", label: "用户讨论", max: Math.ceil(Math.max(...aggs.map((a) => a.voiceCount), 5)) },
      { key: "originalPct", label: "原创占比%", max: Math.ceil(Math.max(...aggs.map((a) => a.originalPct), 5)) },
    ];
    const cv = { cx: 180, cy: 180, r: 150 };
    const N = DIMS.length;
    const flat = (i, r) => {
      const a = Math.PI * (2 * i / N - 0.5);
      return { x: cv.cx + r * Math.cos(a), y: cv.cy + r * Math.sin(a) };
    };
    // grid rings
    const rings = [0.2, 0.4, 0.6, 0.8, 1];
    const gridPaths = rings.map((pct) => {
      const pts = Array.from({ length: N }, (_, i) => { const p = flat(i, cv.r * pct); return `${p.x},${p.y}`; });
      pts.push(pts[0]);
      return `<polygon points="${pts.join(" ")}" fill="none" stroke="var(--glass-line)" stroke-width="${pct === 1 ? 1.2 : 0.6}" />`;
    }).join("");
    // axis lines + labels
    const axisLines = Array.from({ length: N }, (_, i) => {
      const p = flat(i, cv.r);
      return `<line x1="${cv.cx}" y1="${cv.cy}" x2="${p.x}" y2="${p.y}" stroke="var(--glass-line)" stroke-width="0.6" />`;
    }).join("");
    const axisLabels = Array.from({ length: N }, (_, i) => {
      const p = flat(i, cv.r + 22);
      // align text-anchor based on position
      const norm = (i / N) % 1;
      let anchor = "middle", dy = "0";
      if (norm < 0.15 || norm > 0.85) { anchor = "middle"; dy = norm < 0.5 ? "-4" : "14"; }
      else if (norm < 0.35) { anchor = "start"; dy = "4"; }
      else if (norm < 0.65) { anchor = "middle"; dy = "14"; }
      else { anchor = "end"; dy = "4"; }
      return `<text x="${p.x}" y="${p.y}" text-anchor="${anchor}" dy="${dy}" font-size="10" fill="var(--text-3)" font-weight="600">${DIMS[i].label}</text>`;
    }).join("");
    const polygons = aggs.map((a, bi) => {
      const pts = DIMS.map((dim, i) => {
        const raw = dim.key === "voiceCount" ? a.voiceCount : a[dim.key];
        const pct = Math.min(raw / dim.max, 1);
        const p = flat(i, cv.r * pct);
        return `${p.x},${p.y}`;
      });
      pts.push(pts[0]);
      return `<polygon points="${pts.join(" ")}" fill="${color(bi)}" fill-opacity="0.12" stroke="${color(bi)}" stroke-width="2" />`;
    }).join("");
    // brand dots at each axis for each brand
    const brandDots = aggs.map((a, bi) => {
      return DIMS.map((dim, i) => {
        const raw = dim.key === "voiceCount" ? a.voiceCount : a[dim.key];
        const pct = Math.min(raw / dim.max, 1);
        const p = flat(i, cv.r * pct);
        return `<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${color(bi)}" stroke="#fff" stroke-width="0.5" />`;
      }).join("");
    }).join("");
    // Legend
    const legendHTML = aggs.map((a, i) => `<span class="crl-item"><span class="crl-dot" style="background:${color(i)}"></span>${esc(a.name)}</span>`).join("");
    const svgW = 360, svgH = 380;
    const radarSVG = `<div class="cmp-radar-wrap">
      <div class="cr-title">品牌能力雷达图（6 维度归一化对比）</div>
      <svg width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
        ${gridPaths}
        ${axisLines}
        ${axisLabels}
        ${polygons}
        ${brandDots}
      </svg>
      <div class="cmp-radar-legend">${legendHTML}</div>
    </div>`;

    // ---------- 3. 视觉指标赛道对比 ----------
    const metricRows = [
      { label: "平均曝光", key: "avgExp", fmt: (v) => fmt(v), better: "high" },
      { label: "平均互动", key: "avgEng", fmt: (v) => fmt(v), better: "high" },
      { label: "综合互动率", key: "avgEngRate", fmt: (v) => v + "%", better: "high" },
      { label: "平均爆款指数", key: "avgViral", fmt: (v) => v, better: "high" },
      { label: "爆款占比", key: "topPct", fmt: (v) => v + "%", better: "high" },
      { label: "平均点赞率", key: "avgLikeRate", fmt: (v) => v + "%", better: "high" },
      { label: "平均评论率", key: "avgCommentRate", fmt: (v) => v + "%", better: "high" },
      { label: "平均转发率", key: "avgShareRate", fmt: (v) => v + "%", better: "high" },
      { label: "平均收藏率", key: "avgCollectRate", fmt: (v) => v + "%", better: "high" },
      { label: "用户讨论量", key: "voiceCount", fmt: (v) => fmt(v), better: "high" },
      { label: "正面情绪占比", key: "posPct", fmt: (v) => v + "%", better: "high" },
      { label: "原创占比", key: "originalPct", fmt: (v) => v + "%", better: "high" },
    ];
    const metricsHTML = metricRows.map((mr) => {
      const vals = aggs.map((a) => (mr.key === "voiceCount" ? a.voiceCount : mr.key === "avgViral" ? a.avgViral : a[mr.key]));
      const max = Math.max(...vals, 0.0001);
      const bestIdx = vals.indexOf(Math.max(...vals));
      // Build tracks — one per row, with dots for each brand
      const dots = aggs.map((a, i) => {
        const pct = vals[i] / max * 100;
        return `<div class="cm-dot${i === bestIdx ? " best" : ""}" style="left:${pct}%;background:${color(i)};color:${color(i)}" title="${esc(a.name)}: ${mr.fmt(vals[i])}">
          <span class="cm-dot-label">${esc(a.name)}</span>
          <span class="cm-dot-value">${mr.fmt(vals[i])}</span>
        </div>`;
      }).join("");
      return `<div class="cmp-metric-row">
        <div class="cm-row-label"><span>${mr.label}</span><span class="cm-best">🥇 ${esc(aggs[bestIdx].name)} ${mr.fmt(vals[bestIdx])}</span></div>
        <div class="cm-track">
          <div class="cm-track-fill" style="width:100%;background:${color(bestIdx)}"></div>
          ${dots}
        </div>
      </div>`;
    }).join("");

    // ---------- 4. 品牌摘要卡片 ----------
    const cardsHTML = aggs.map((a, i) => {
      const maxViral = Math.max(...aggs.map((x) => x.avgViral), 0.0001);
      const viralPct = (a.avgViral / maxViral * 100).toFixed(0);
      const maxEng = Math.max(...aggs.map((x) => x.avgEngRate), 0.0001);
      const engPct = (a.avgEngRate / maxEng * 100).toFixed(0);
      return `<div class="cmp-card">
        <div class="cmp-card-head"><span class="cmp-card-dot" style="background:${color(i)}"></span><span class="cmp-card-name">${esc(a.name)}</span><span class="cmp-card-badge">${a.c0} 条 · 爆款 ${a.topCount}</span></div>
        <div class="cmp-card-grid">
          <div class="cmp-card-metric"><span class="cc-k">爆款指数</span><span class="cc-v hot">${a.avgViral}</span><div class="ci-bar" style="background:${color(i)};width:${viralPct}%;margin-top:3px"></div></div>
          <div class="cmp-card-metric"><span class="cc-k">互动率</span><span class="cc-v good">${a.avgEngRate}%</span><div class="ci-bar" style="background:${color(i)};width:${engPct}%;margin-top:3px"></div></div>
          <div class="cmp-card-metric"><span class="cc-k">形式</span><span class="cc-v">${esc(a.domType)}</span></div>
          <div class="cmp-card-metric"><span class="cc-k">情绪</span><span class="cc-v">${esc(a.domEmotion)}</span></div>
          <div class="cmp-card-metric"><span class="cc-k">类目</span><span class="cc-v">${esc(a.domCategory)}</span></div>
          <div class="cmp-card-metric"><span class="cc-k">营销目的</span><span class="cc-v">${esc(a.domGoal)}</span></div>
        </div>
      </div>`;
    }).join("");

    // ---------- 5. 对标小结 ----------
    const bestViral = aggs.slice().sort((a, b) => b.avgViral - a.avgViral)[0];
    const bestExp = aggs.slice().sort((a, b) => b.totalExp - a.totalExp)[0];
    const bestVoice = aggs.slice().sort((a, b) => b.voiceCount - a.voiceCount)[0];
    const bestEng = aggs.slice().sort((a, b) => b.avgEngRate - a.avgEngRate)[0];
    const vt = Math.round(bestViral.topPct), ve = fmt(bestExp.totalExp), vv = fmt(bestVoice.voiceCount), vg = bestEng.avgEngRate;
    const benchmark = `<div class="bench-box">
      <b>对标建议：</b><br/>• <b>爆款标杆</b>：「${esc(bestViral.name)}」（平均爆款指数 ${bestViral.avgViral}·爆款占比 ${vt}%）<br/>• <b>声量标杆</b>：「${esc(bestExp.name)}」（总曝光 ${ve}，适合品牌声量对标）<br/>• <b>互动标杆</b>：「${esc(bestEng.name)}」（互动率 ${vg}%，内容质量最高）<br/>• <b>用户洞察标杆</b>：「${esc(bestVoice.name)}」（用户讨论 ${vv} 条，最值得分析用户反馈）<br/>建议重点观测各品牌的爆款指数·互动率·爆款形式占比，据此设定追赶目标。
    </div>`;

    return `<div class="cmp-wrap">
      <div class="cmp-insight">${insightHTML}</div>
      ${radarSVG}
      <div class="cmp-metrics">${metricsHTML}</div>
      <div class="cmp-cards">${cardsHTML}</div>
      ${benchmark}
    </div>`;
  }
  function bindCompetitor() {
    if (state.board === "competitor") {
      $$(".comp-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
        const name = el.dataset.brand;
        if (name === "__all__") state.compSel.clear();
        else state.compSel = new Set([name]); // 单品牌选中（排名靠前默认）
        renderBoard();
      }));
      const ct = $("#comp-type-chips");
      if (ct) ct.addEventListener("click", (e) => {
        const chip = e.target.closest(".comp-type"); if (!chip) return;
        const t = chip.dataset.type;
        if (state.compFilters.types.has(t)) state.compFilters.types.delete(t); else state.compFilters.types.add(t);
        renderBoard();
      });
      const sort = $("#comp-sort"); if (sort) sort.addEventListener("change", () => { state.compFilters.sort = sort.value; renderBoard(); });
      const vm = $("#comp-viral-min"); if (vm) vm.addEventListener("input", () => { state.compFilters.viralMin = +vm.value; const v = $("#comp-viral-min-val"); if (v) v.textContent = vm.value; renderBoard(); });
      const to = $("#comp-top-only"); if (to) to.addEventListener("change", () => { state.compFilters.topOnly = to.checked; renderBoard(); });
      const cm = $("#comp-mode"); if (cm) cm.addEventListener("click", (e) => {
        const b = e.target.closest("button"); if (!b) return;
        state.compFilters.mode = b.dataset.mode;
        renderBoard();
      });
      const rs = $("#comp-reset"); if (rs) rs.addEventListener("click", () => { state.compFilters = { types: new Set(), sort: "viral", viralMin: 0, topOnly: false, mode: "all" }; renderBoard(); });
    }
    if (state.board === "compare") {
      $$(".cmp-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
        const name = el.dataset.brand;
        if (state.cmpSel.has(name)) state.cmpSel.delete(name); else state.cmpSel.add(name);
        renderBoard();
      }));
    }
  }

  /* ============ 详情抽屉 ============ */
  function openDrawer(id) {
    const c = state.analysis.contents.find((x) => x.id === id);
    if (!c) return;
    state.detailId = id;
    const qc = c.commentQuality || {};
    const maxQ = Math.max(...Object.values(qc), 1);
    const drawer = $("#drawer");
    drawer.innerHTML = `<div class="drawer-head"><div class="dh-text">${esc(dispText(c))}</div><button class="drawer-close" id="drawer-close">×</button></div>
      <div class="drawer-body">
        <div class="dr-tags">${c.isTop ? '<span class="badge-top">爆款</span>' : ""}${c.isActivity ? `<span class="badge-act">${esc(c.activityTag)}</span>` : ""}
          <span class="tag">${esc(c.account)}</span><span class="tag">${esc(c.platform)}</span><span class="tag">${esc(c.contentType)}</span><span class="tag">${esc(c.emotion)}</span>
          ${c.topicTags.map((t) => `<span class="tag topic">${esc(t)}</span>`).join("")}
          ${(c.content_tags || []).slice(0, 8).map((t) => `<span class="tag hashtag">#${esc(t)}</span>`).join("")}</div>
        ${(c.content_topic || c.marketing_goal || c.content_source) ? `<div class="dr-extra">${c.content_topic ? `<span class="de-k">主题</span><b class="de-v">${esc(c.content_topic)}</b>` : ""}${c.marketing_goal ? `<span class="de-k">目的</span><b class="de-v">${esc(c.marketing_goal)}</b>` : ""}${c.content_source ? `<span class="de-k">来源</span><b class="de-v">${esc(c.content_source)}</b>` : ""}</div>` : ""}
        <div class="dr-metrics">
          <div class="dr-metric"><div class="dm-k">爆款指数</div><div class="dm-v" style="color:var(--hot)">${c.viralScore.toFixed(1)}</div><div class="dm-sub">🏅 ${viralTierLabel(c)}</div></div>
          <div class="dr-metric"><div class="dm-k">曝光</div><div class="dm-v">${fmt(c.exposure)}</div></div>
          <div class="dr-metric"><div class="dm-k">互动</div><div class="dm-v">${fmt(c.engagement)}</div></div>
          <div class="dr-metric"><div class="dm-k">互动率</div><div class="dm-v">${c.engagementRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">点赞率</div><div class="dm-v">${c.likeRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">评论率</div><div class="dm-v">${c.commentRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">转发率</div><div class="dm-v">${c.shareRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">发布时间</div><div class="dm-v" style="font-size:14px">${c.publishDate}</div></div>
        </div>
        ${Object.keys(qc).length ? `<div class="dr-section-title">评论质量分布</div>${Object.entries(qc).map(([k, v]) => `<div class="qc-bar"><span class="qc-name">${esc(k)}</span><span class="qc-track"><i style="width:${(v / maxQ) * 100}%"></i></span><span class="qc-val">${v}</span></div>`).join("")}` : ""}
        <div class="dr-section-title">内容属性（真实字段）</div>
        <div class="dr-attr">
          <div class="dr-attr-item"><span class="da-k">类目</span><b class="da-v">${esc(c.category || "—")}</b></div>
          <div class="dr-attr-item"><span class="da-k">内容来源</span><b class="da-v">${esc(c.content_source || "—")}</b></div>
          <div class="dr-attr-item"><span class="da-k">营销目的</span><b class="da-v">${esc(c.marketing_goal || "—")}</b></div>
          <div class="dr-attr-item"><span class="da-k">点赞 / 评论 / 转发 / 收藏率</span><b class="da-v">${c.likeRate.toFixed(2)}% / ${c.commentRate.toFixed(2)}% / ${c.shareRate.toFixed(2)}% / ${c.collectRate.toFixed(2)}%</b></div>
          ${c.post_link ? `<div class="dr-attr-item"><a class="dr-link" href="${esc(c.post_link)}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>` : ""}
        </div>
        <div class="handoff" style="margin-top:18px">
          <div class="handoff-text"><b>还想看得更深？</b><br>进入单帖深度分析：看用户怎么讨论它、它的风格/形式、以及同主题关联帖并排对比。</div>
          <button class="btn-primary" id="deep-open">进入单帖深度分析 →</button>
        </div>
        <div class="handoff" style="margin-top:12px;background:var(--glass-bg-light);border-color:var(--glass-line)">
          <div class="handoff-text" style="color:var(--text-2)"><b style="color:var(--accent-strong)">以此内容为灵感？</b><br>复制给 AI，让我结合爆款特征帮你延展选题或分析可复用要素。</div>
          <button class="btn-ghost" id="copy-detail">复制给 AI</button>
        </div>
      </div>`;
    drawer.classList.add("show");
    $("#drawer-overlay").classList.add("show");
    $("#drawer-close").addEventListener("click", closeDrawer);
    const dOpen = $("#deep-open"); if (dOpen) dOpen.addEventListener("click", () => { closeDrawer(); openDeepAnalysis(c.id); });
    $("#copy-detail").addEventListener("click", () => {
      const ctx = `【参考爆款内容深度分析】
内容：${dispText(c)}
账号/平台：${c.account} / ${c.platform} · 形式：${c.contentType} · 情绪：${c.emotion}
主题标签：${c.topicTags.join("、")}
内容标签：${(c.content_tags || []).join("、") || "—"}
${c.content_topic ? `内容主题：${c.content_topic}\n` : ""}${c.marketing_goal ? `营销目的：${c.marketing_goal}\n` : ""}${c.content_source ? `内容来源：${c.content_source}\n` : ""}
爆款指数：${rate(c)} · 曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 互动率 ${c.engagementRate.toFixed(2)}%
—— 请分析 ——
1) 这条内容为什么能爆（可复用的要素）；
2) 我可以如何借鉴它的选题/结构/钩子做出新内容；
3) 给出 2-3 个延展选题。`;
      navigator.clipboard.writeText(ctx).then(() => toast("已复制，去对话框粘贴给我"), () => toast("复制失败"));
    });
  }
  function closeDrawer() { $("#drawer").classList.remove("show"); $("#drawer-overlay").classList.remove("show"); state.detailId = null; }

  /* ============ 单帖深度分析（灵感库三级深度 · Level 3）============ */
  function userVoicesForContent(c) {
    const all = (state.raw && state.raw.userVoices) || [];
    const exact = all.filter((v) => v.contentId === c.id);
    if (exact.length) return { items: exact, mode: "exact" };
    const sameAcct = all.filter((v) => v.account === c.account);
    return { items: sameAcct, mode: sameAcct.length ? "account" : "none" };
  }
  // 从回复文本中提取高频词（用于单帖深度分析词云）
  function voiceWordCloud(voices, n = 18) {
    if (!voices || !voices.length) return [];
    const stop = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","can","shall","this","that","these","those","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","mine","yours","hers","ours","theirs","am","so","if","no","not","yes","oh","yeah","like","just","get","got","go","going","come","came","want","needs","need","know","see","look","make","made","take","took","say","said","think","way","time","good","really","one","two","also","now","only","even","well","back","there","here","when","where","how","what","who","why","which","then","than","too","very","more","most","some","any","all","each","every","other","another","such","own","same","few","much","many","little","less","least","last","first","next","right","still","new","old","long","great","under","over","again","further","once","im","dont","cant","isnt","arent","wasnt","werent","hasnt","havent","hadnt","wouldnt","couldnt","shouldnt","wont","ill","youre","its","thats","theres","heres","theyre","hes","shes","weve","youve","ive","theyve","weve","isn","aren","wasn","weren","haven","hasn","hadn","wouldn","couldn","shouldn","don","doesn","didn","won","would","could","should"]);
    const freq = {};
    voices.forEach((v) => {
      const text = (v.text || "").toLowerCase().replace(/https?:\/\/\S+/g, "").replace(/[@#]\w+/g, "").replace(/[^\w\s]/g, " ");
      text.split(/\s+/).forEach((w) => {
        if (w.length < 3 || stop.has(w) || /^\d+$/.test(w) || w.includes("@")) return;
        freq[w] = (freq[w] || 0) + 1;
      });
    });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, n);
  }
  function voiceSentimentDist(voices) {
    if (!voices || !voices.length) return [];
    const dist = {};
    voices.forEach((v) => { const s = v.sentiment || "未知"; dist[s] = (dist[s] || 0) + 1; });
    const total = voices.length;
    return Object.entries(dist).map(([k, v]) => ({ name: k, count: v, pct: Math.round((v / total) * 100) })).sort((a, b) => b.count - a.count);
  }
  function voiceQuestions(voices) {
    if (!voices || !voices.length) return [];
    return voices.filter((v) => (v.sentiment === "提问") || /[?？]/.test(v.text || "")).sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }
  function similarContents(c) {
    const tt = c.topicTags || [];
    const base = state.analysis.contents.filter((x) => x.id !== c.id);
    let scored = base.map((x) => {
      const shared = (x.topicTags || []).filter((t) => tt.includes(t));
      return { item: x, overlap: shared.length, shared };
    }).filter((s) => s.overlap > 0);
    // 无主题标签时回退：同账号 / 同形式 也算关联
    if (!scored.length && tt.length === 0) {
      scored = base.filter((x) => x.account === c.account || x.contentType === c.contentType)
        .map((x) => ({ item: x, overlap: 0, shared: [] }));
    }
    scored.sort((a, b) => b.overlap - a.overlap || b.item.viralScore - a.item.viralScore);
    return scored.slice(0, 14);
  }
  function styleCompareFor(c) {
    const acctItems = state.analysis.contents.filter((x) => x.account === c.account);
    const typeItems = acctItems.filter((x) => x.contentType === c.contentType);
    const typeRate = typeItems.length ? Math.round(typeItems.reduce((s, x) => s + rate(x), 0) / typeItems.length) : 0;
    const acctRate = acctItems.length ? Math.round(acctItems.reduce((s, x) => s + rate(x), 0) / acctItems.length) : 0;
    const typeShare = acctItems.length ? Math.round((typeItems.length / acctItems.length) * 100) : 0;
    // 该账号形式爆款指数分布（用于迷你条形）
    const byType = {};
    acctItems.forEach((x) => { (byType[x.contentType] = byType[x.contentType] || []).push(x); });
    const typeBreak = Object.entries(byType).map(([name, items]) => ({
      name, count: items.length,
      avgRate: items.length ? Math.round(items.reduce((s, x) => s + rate(x), 0) / items.length) : 0,
    })).sort((a, b) => b.avgRate - a.avgRate);
    return { typeRate, acctRate, typeShare, typeCount: typeItems.length, acctCount: acctItems.length, typeBreak };
  }
  function deepContextText(c) {
    const sim = similarContents(c).slice(0, 3).map((s) => `· ${dispText(s.item)}（爆款指数 ${rate(s.item)}，共享主题 ${s.shared.join("、") || "—"}）`).join("\n");
    return `【单帖深度分析】
内容：${dispText(c)}
账号/平台：${c.account} / ${c.platform} · 形式：${c.contentType} · 风格：${c.emotion}
主题：${c.topicTags.join("、") || "—"} · 发布：${c.publishDate}
爆款指数：${rate(c)} · 曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 互动率 ${c.engagementRate.toFixed(2)}%
—— 请帮我 ——
1) 这条内容为什么能爆（可复用要素：形式/钩子/主题/情绪）；
2) 它与下面同类内容的差异与可借鉴点：
${sim || "（无同主题关联帖）"}
3) 结合该账号的风格/形式分布，给我 2-3 个延展选题建议。`;
  }
  function openDeepAnalysis(id) {
    // 如果盲盒弹层开着，先关掉
    const bxM = $("#bx-modal"); const bxO = $("#bx-overlay");
    if (bxM && bxM.classList.contains("show")) { bxM.classList.remove("show"); bxO.classList.remove("show"); }
    const c = state.analysis.contents.find((x) => x.id === id);
    if (!c) return;
    state.deepId = id; state.deepView = "main"; state.deepCompare = [];
    renderDeepBody();
    const modal = $("#deep-modal"), ov = $("#deep-overlay");
    modal.classList.add("show"); ov.classList.add("show");
  }
  function closeDeep() { $("#deep-modal").classList.remove("show"); $("#deep-overlay").classList.remove("show"); state.deepId = null; state.deepCompare = []; state.deepView = "main"; }
  function renderDeepBody() {
    const c = state.analysis.contents.find((x) => x.id === state.deepId);
    if (!c) return;
    $("#deep-sub").textContent = `${esc(c.account)} · ${esc(c.contentType)} · ${c.publishDate}`;
    const body = $("#deep-body");
    body.innerHTML = state.deepView === "compare" ? renderDeepCompare(c) : renderDeepMain(c);
    bindDeep();
  }
  function renderDeepMain(c) {
    const sc = styleCompareFor(c);
    const voices = userVoicesForContent(c);
    const sim = similarContents(c);
    const voiceItems = voices.items || [];
    // 内容画像（品牌 / 形式 / 风格 / 平台 / 时间 / 主题）
    const profileCards = `
      <div class="dp-profile-grid">
        <div class="dp-profile-card"><div class="dp-pk">品牌 / 账号</div><div class="dp-pv">${esc(c.account)}</div></div>
        <div class="dp-profile-card"><div class="dp-pk">内容形式</div><div class="dp-pv">${esc(c.contentType)}</div><div class="dp-sub">该账号占比 ${sc.typeShare}% · ${sc.typeCount}/${sc.acctCount} 条</div></div>
        <div class="dp-profile-card"><div class="dp-pk">风格 / 情绪调性</div><div class="dp-pv">${esc(c.emotion)}</div></div>
        <div class="dp-profile-card"><div class="dp-pk">平台</div><div class="dp-pv">${esc(c.platform)}</div></div>
        <div class="dp-profile-card"><div class="dp-pk">发布时间</div><div class="dp-pv">${c.publishDate}</div><div class="dp-sub">${c.publishHour}:00 时段</div></div>
        <div class="dp-profile-card"><div class="dp-pk">主题标签</div><div class="dp-pv">${c.topicTags.length ? c.topicTags.map((t) => `<span class="tag topic">${esc(t)}</span>`).join(" ") : "—"}</div></div>
        <div class="dp-profile-card"><div class="dp-pk">内容标签（话题）</div><div class="dp-pv">${(c.content_tags || []).length ? c.content_tags.slice(0, 6).map((t) => `<span class="tag hashtag">#${esc(t)}</span>`).join(" ") : "—"}</div></div>
        <div class="dp-profile-card dp-span2"><div class="dp-pk">内容主题 / 营销目的 / 来源</div><div class="dp-pv">${[c.content_topic, c.marketing_goal, c.content_source].filter(Boolean).map((x) => esc(x)).join(" &nbsp;·&nbsp; ") || "—"}</div></div>
      </div>
      <div class="dp-cmp-note">该形式在 <b>${esc(c.account)}</b> 账号内的平均爆款指数 <b style="color:var(--hot)">${sc.typeRate}</b>，对比账号整体平均 <b>${sc.acctRate}</b> —— ${sc.typeRate >= sc.acctRate ? "这种形式在该账号表现优于平均，值得借鉴" : "这种形式在该账号表现低于平均，可优化或换形式"}。</div>`;
    // 帖子数据
    const metricCards = `
      <div class="dp-metric-grid">
        <div class="dp-metric-card"><div class="dp-mk">曝光</div><div class="dp-mv">${fmt(c.exposure)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">互动</div><div class="dp-mv">${fmt(c.engagement)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">互动率</div><div class="dp-mv">${c.engagementRate.toFixed(2)}%</div></div>
        <div class="dp-metric-card"><div class="dp-mk">爆款指数</div><div class="dp-mv" style="color:var(--hot)">${c.viralScore.toFixed(1)}</div><div class="dp-ms">🏅 ${viralTierLabel(c)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">点赞</div><div class="dp-mv">${fmt(c.likes || 0)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">评论</div><div class="dp-mv">${fmt(c.comments || 0)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">分享</div><div class="dp-mv">${fmt(c.shares || 0)}</div></div>
        <div class="dp-metric-card"><div class="dp-mk">收藏</div><div class="dp-mv">${fmt(c.collections || 0)}</div></div>
      </div>`;
    // 时序增长趋势
    const trend = trendSectionHTML(c);
    const trendHTML = trend.has ? `<div class="dp-section"><div class="dp-sec-title">时序增长趋势 <span class="dp-sec-note">D0 → D1 → D2 → D7 数据变化</span></div>${trend.html}</div>` : "";
    // 该账号形式分布（小条形）
    const typeBreakRows = sc.typeBreak.slice(0, 6).map((t) => {
      const r = t.avgRate;
      return `<div class="qc-bar"><span class="qc-name" style="width:70px">${esc(t.name)}</span><span class="qc-track"><i style="width:${r}%"></i></span><span class="qc-val">${r}</span></div>`;
    }).join("");
    const typeBreakHTML = typeBreakRows ? `<div class="dp-cmp-note" style="margin-top:14px"><b>${esc(c.account)}</b> 的形式爆款指数分布：</div>${typeBreakRows}` : "";
    // 回复词云
    const cloud = voiceWordCloud(voiceItems);
    const cloudHTML = cloud.length
      ? `<div class="dp-cloud">${cloud.map(([w, n]) => {
          const max = cloud[0][1] || 1;
          const s = 0.75 + (n / max) * 0.9;
          const alpha = 0.55 + (n / max) * 0.85;
          return `<span class="dp-cloud-word" style="font-size:${s.toFixed(2)}em;opacity:${alpha.toFixed(2)}">${esc(w)}<em>${n}</em></span>`;
        }).join("")}</div>`
      : `<div class="dp-novoice">暂无回复数据，无法生成词云。</div>`;
    // 回复情绪分布
    const sentDist = voiceSentimentDist(voiceItems);
    const sentHTML = sentDist.length
      ? `<div class="dp-sent-grid">${sentDist.map((s) => `<div class="dp-sent-row"><span class="uv-sent ${esc(s.name)}">${esc(s.name)}</span><span class="dp-sent-track"><i style="width:${s.pct}%"></i></span><span class="dp-sent-pct">${s.pct}% (${s.count})</span></div>`).join("")}</div>`
      : `<div class="dp-novoice">暂无回复情绪数据。</div>`;
    // 新导入真实字段：回复意图 / 回复焦点分布（仅在该帖讨论有标注时展示）
    const intentAgg = {}, focusAgg = {};
    voiceItems.forEach((v) => {
      (v.reply_intent || "").split("、").forEach((x) => { if (x) intentAgg[x] = (intentAgg[x] || 0) + 1; });
      (v.reply_focus || "").split("、").forEach((x) => { if (x) focusAgg[x] = (focusAgg[x] || 0) + 1; });
    });
    const intentBars = Object.keys(intentAgg).length ? uvBars(Object.entries(intentAgg).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [REPLY_INTENT_NAME[k] || k, v, PAL[i % PAL.length]])) : "";
    const focusBars = Object.keys(focusAgg).length ? uvBars(Object.entries(focusAgg).sort((a, b) => b[1] - a[1]).map(([k, v], i) => [REPLY_FOCUS_NAME[k] || k, v, PAL[(i + 3) % PAL.length]])) : "";
    const rfHTML = (intentBars || focusBars)
      ? `<div class="dp-section"><div class="dp-sec-title">回复意图 / 焦点分布 <span class="dp-sec-note">新导入真实字段 reply_intent / reply_focus</span></div>${intentBars ? `<div class="dp-sub">回复意图</div>${intentBars}` : ""}${focusBars ? `<div class="dp-sub" style="margin-top:12px">回复焦点</div>${focusBars}` : ""}</div>`
      : "";
    // 问题 / 用户诉求
    const questions = voiceQuestions(voiceItems);
    const questionHTML = questions.length
      ? `<div class="dp-voice-grid">${questions.slice(0, 6).map((v) => `<div class="dp-voice">
        <div class="dv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes || 0)}</span></div>
        <div class="dv-text">${esc(dispVoice(v))}</div>
        ${v.originalLink ? `<a class="dv-link" href="${esc(v.originalLink)}" target="_blank" rel="noreferrer">查看原帖 ↗</a>` : ""}
      </div>`).join("")}</div>`
      : `<div class="dp-novoice">暂未发现用户提问或诉求。</div>`;
    // 用户讨论（最高赞）
    let voiceHTML;
    if (voices.mode === "none") {
      voiceHTML = `<div class="dp-novoice">暂无该内容的用户讨论数据（用户语料/评论抓取接入后自动出现）。</div>`;
    } else {
      const label = voices.mode === "exact" ? "该帖下的用户回复（按点赞）" : `该账号（${esc(c.account)}）下的用户讨论（按点赞，最高赞）`;
      voiceHTML = `<div class="dp-sec-title" style="margin-top:4px">${label}</div><div class="dp-voice-grid">${voiceItems.slice(0, 6).map((v) => `<div class="dp-voice">
        <div class="dv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes || 0)}</span></div>
        <div class="dv-text">${esc(dispVoice(v))}</div>
        ${v.originalLink ? `<a class="dv-link" href="${esc(v.originalLink)}" target="_blank" rel="noreferrer">查看原帖 ↗</a>` : ""}
      </div>`).join("")}</div>`;
    }
    // 相似主题关联帖
    const simRows = sim.map((s, i) => `<div class="dp-sim-row" data-sim="${esc(s.item.id)}">
      <div class="dp-sim-rank">${i + 1}</div>
      <div class="dp-sim-main">
        <div class="dp-sim-text">${esc(dispText(s.item))}</div>
        <div class="dp-sim-meta">${esc(s.item.account)} · ${esc(s.item.contentType)} · 爆款指数 ${rate(s.item)} · ${s.shared.map((t) => `<span class="tag topic">${esc(t)}</span>`).join(" ")}</div>
      </div>
      <div class="dp-sim-overlap">${s.overlap > 0 ? "同主题×" + s.overlap : "关联"}</div>
      <div class="dp-sim-check"><input type="checkbox" data-cmp="${esc(s.item.id)}" ${state.deepCompare.includes(s.item.id) ? "checked" : ""}></div>
    </div>`).join("");
    const simHTML = sim.length ? `<div class="dp-sim-list">${simRows}</div>` : `<div class="dp-novoice">无同主题关联帖（该内容未打主题标签或主题唯一）。</div>`;
    const cmpBar = sim.length ? `<div class="dp-compare-bar">
      <div class="dcb-info">已选 <b id="dcb-count">${state.deepCompare.length}</b> 条关联帖对比</div>
      <div style="display:flex;gap:8px"><button class="btn-ghost" id="dcb-clear">清空</button><button class="btn-primary" id="dcb-go">多帖同看 →</button></div>
    </div>` : "";
    return `<div class="dp-hero">
        <div class="dp-hero-text">${esc(dispText(c))}</div>
        <div class="dp-hero-tags">${c.isTop ? '<span class="badge-top">爆款</span>' : ""}${c.isActivity ? `<span class="badge-act">${esc(c.activityTag)}</span>` : ""}
          <span class="tag">${esc(c.account)}</span><span class="tag">${esc(c.platform)}</span><span class="tag">${esc(c.contentType)}</span><span class="tag">${esc(c.emotion)}</span>
          ${c.topicTags.map((t) => `<span class="tag topic">${esc(t)}</span>`).join("")}
          ${c.post_link ? `<a class="tag" style="cursor:pointer" href="${esc(c.post_link)}" target="_blank" rel="noreferrer">原帖 ↗</a>` : ""}
        </div>
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">帖子数据 <span class="dp-sec-note">这条内容的量化表现</span></div>
        ${metricCards}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">内容画像 <span class="dp-sec-note">品牌 / 形式 / 风格 / 平台 / 时间 / 主题</span></div>
        ${profileCards}${typeBreakHTML}
      </div>
      ${trendHTML}
      <div class="dp-section">
        <div class="dp-sec-title">回复词云 <span class="dp-sec-note">用户讨论里出现的高频词</span></div>
        ${cloudHTML}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">回复情绪分布 <span class="dp-sec-note">用户怎么评价它</span></div>
        ${sentHTML}
      </div>
      ${rfHTML}
      <div class="dp-section">
        <div class="dp-sec-title">问题 / 用户诉求 <span class="dp-sec-note">提问、求购、求助类回复</span></div>
        ${questionHTML}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">用户讨论（最高赞） <span class="dp-sec-note">点击查看原帖</span></div>
        ${voiceHTML}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">相似主题关联帖 <span class="dp-sec-note">勾选多条 → 多帖同看并排对比</span></div>
        ${simHTML}${cmpBar}
      </div>
      <div class="handoff" style="margin-top:8px">
        <div class="handoff-text"><b>需要 AI 帮你延展？</b><br>复制整段深度分析上下文给 AI，结合爆款特征与关联帖给延展选题。</div>
        <button class="btn-primary" id="deep-copy">复制给 AI</button>
      </div>`;
  }
  function renderDeepCompare(c) {
    const ids = state.deepCompare.slice(0, 4);
    const posts = [c, ...ids.map((id) => state.analysis.contents.find((x) => x.id === id)).filter(Boolean)];
    const cols = posts.map((p) => `<div class="dp-cmp-col">
      <div class="dp-cmp-col-head"><span class="dp-cmp-col-name">${esc(p.account)}</span><span class="dp-cmp-col-rate">爆款指数 ${rate(p)}</span></div>
      <div class="dp-cmp-col-text">${esc(dispText(p))}</div>
      <div class="dp-hero-tags" style="margin-top:0">${p.isTop ? '<span class="badge-top">爆款</span>' : ""}<span class="tag">${esc(p.contentType)}</span><span class="tag">${esc(p.emotion)}</span>${p.topicTags.map((t) => `<span class="tag topic">${esc(t)}</span>`).join("")}</div>
      <div class="dp-cmp-col-metrics">
        <div class="dp-cmp-metric"><div class="cm-k">曝光</div><div class="cm-v">${fmt(p.exposure)}</div></div>
        <div class="dp-cmp-metric"><div class="cm-k">互动</div><div class="cm-v">${fmt(p.engagement)}</div></div>
        <div class="dp-cmp-metric"><div class="cm-k">互动率</div><div class="cm-v">${p.engagementRate.toFixed(2)}%</div></div>
        <div class="dp-cmp-metric"><div class="cm-k">发布</div><div class="cm-v" style="font-size:12px">${p.publishDate}</div></div>
      </div>
      <div class="dp-cmp-actions"><button class="btn-primary dp-cmp-deep" data-deep-id="${p.id}">深度分析 →</button></div>
    </div>`).join("");
    return `<div class="dp-back-row"><button class="btn-ghost" id="dcb-back">← 返回深度分析</button></div>
      <div class="dp-sec-title">多帖同看 · 并排对比（${posts.length} 条）<span class="dp-sec-note">横向看形式 / 主题 / 表现的异同</span></div>
      <div class="dp-cmp-cols" style="grid-template-columns:repeat(${Math.min(posts.length, 4)}, minmax(220px, 1fr))">${cols}</div>
      <div class="handoff" style="margin-top:18px">
        <div class="handoff-text"><b>对比完了想延展？</b><br>复制这份对比给 AI，让它总结可复用的共性要素与差异点。</div>
        <button class="btn-primary" id="deep-copy">复制对比给 AI</button>
      </div>`;
  }
  function bindDeep() {
    const dc = $("#deep-close"); if (dc) dc.addEventListener("click", closeDeep);
    const ov = $("#deep-overlay"); if (ov) ov.addEventListener("click", closeDeep);
    const copy = $("#deep-copy"); if (copy) copy.addEventListener("click", () => {
      const c = state.analysis.contents.find((x) => x.id === state.deepId); if (!c) return;
      const txt = state.deepView === "compare" ? deepContextText(c) + "\n\n【多帖同看对比】\n" + state.deepCompare.map((id) => { const p = state.analysis.contents.find((x) => x.id === id); return p ? `· ${dispText(p)}（爆款指数 ${rate(p)}）` : ""; }).join("\n") : deepContextText(c);
      navigator.clipboard.writeText(txt).then(() => toast("已复制，去对话框粘贴给我"), () => toast("复制失败"));
    });
    // 相似帖勾选
    $$("[data-cmp]", $("#deep-body")).forEach((cb) => cb.addEventListener("change", () => {
      const id = cb.dataset.cmp;
      if (cb.checked) { if (!state.deepCompare.includes(id)) state.deepCompare.push(id); }
      else state.deepCompare = state.deepCompare.filter((x) => x !== id);
      const cnt = $("#dcb-count"); if (cnt) cnt.textContent = state.deepCompare.length;
      cb.closest(".dp-sim-row").style.opacity = cb.checked ? ".62" : "1";
    }));
    const simRow = $$(".dp-sim-row", $("#deep-body"));
    simRow.forEach((row) => row.addEventListener("click", (e) => { if (e.target.closest("[data-cmp]")) return; const id = row.dataset.sim; const cb = row.querySelector("[data-cmp]"); if (cb && !e.target.closest("a")) { cb.checked = !cb.checked; cb.dispatchEvent(new Event("change")); } }));
    const dcbGo = $("#dcb-go"); if (dcbGo) dcbGo.addEventListener("click", () => { if (!state.deepCompare.length) { toast("先勾选至少 1 条关联帖"); return; } state.deepView = "compare"; renderDeepBody(); });
    const dcbClear = $("#dcb-clear"); if (dcbClear) dcbClear.addEventListener("click", () => { state.deepCompare = []; renderDeepBody(); });
    const back = $("#dcb-back"); if (back) back.addEventListener("click", () => { state.deepView = "main"; renderDeepBody(); });
    // 多贴同看 → 进入某帖的独立深度分析
    $$(".dp-cmp-deep", $("#deep-body")).forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.dataset.deepId;
      if (!id || !state.analysis.contents.find((x) => x.id === id)) return;
      state.deepId = id; state.deepView = "main"; state.deepCompare = [];
      renderDeepBody();
    }));
  }

  /* ============ 事件绑定 ============ */
  function bindBoard(data) {
    // 帖子卡片/列表点击：灵感库保持「抽屉 → 深度分析」两步；其余板块直接弹出深度分析
    $$("[data-id]", $("#board")).forEach((el) => el.addEventListener("click", (e) => {
      if (e.target.closest("[data-facet]")) return; // 标签点击走筛选
      if (e.target.closest("a")) return; // 链接不触发帖子交互
      if (state.board === "library") openDrawer(el.dataset.id);
      else openDeepAnalysis(el.dataset.id);
    }));
    // 标签点击 → 加入全局筛选
    $$("[data-facet]", $("#board")).forEach((el) => el.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = el.dataset.facet, val = el.dataset.val;
      const set = state.filters[key];
      if (!set.has(val)) { set.add(val); onFilterChange(); }
      else toast(`已筛选：${val}`);
    }));
    // 灵感库工具
    if (state.board === "library") {
      $$("#view-seg button").forEach((b) => b.addEventListener("click", () => { state.view = b.dataset.view; state.page = 0; renderBoard(); }));
      $$("#sort-chips button[data-sort]").forEach((b) => b.addEventListener("click", () => { state.sort = b.dataset.sort; state.page = 0; renderBoard(); }));
      $$("#lib-source button[data-source]").forEach((b) => b.addEventListener("click", () => { state.libSource = b.dataset.source; state.page = 0; state.randList = null; renderBoard(); }));
      $$("#lib-mode button").forEach((b) => b.addEventListener("click", () => { state.libMode = b.dataset.mode; state.page = 0; state.randList = null; renderBoard(); }));
      const topToggle = $("#lib-top-toggle"); if (topToggle) topToggle.addEventListener("click", () => { state.libQuick = state.libQuick === "top" ? "all" : "top"; state.page = 0; state.randList = null; renderBoard(); });
      const sortMore = $("#sort-more"); if (sortMore) sortMore.addEventListener("click", (e) => { e.stopPropagation(); state.sortExpanded = !state.sortExpanded; renderBoard(); });
      const rs = $("[data-action=rerand]"); if (rs) rs.addEventListener("click", () => { state.randList = null; renderBoard(); });
      const bxLaunch = $("#bx-launch"); if (bxLaunch) bxLaunch.addEventListener("click", openBlindboxModal);
      // 分页控件
      $$(".pager [data-pg]", $("#board")).forEach((b) => b.addEventListener("click", () => {
        const v = b.dataset.pg;
        if (v === "prev") state.page = Math.max(0, state.page - 1);
        else if (v === "next") state.page = state.page + 1; // 由 renderLibrary 自动夹紧
        else state.page = +v;
        renderBoard();
      }));
      const pgs = $("#pg-size"); if (pgs) pgs.addEventListener("change", () => { state.pageSize = +pgs.value; state.page = 0; renderBoard(); });
    }
    // 参考建议中枢
    // 看参考建议（现在在灵感工具组下，但保持绑定）
    if (state.board === "reference") bindReference();
    // 竞品内容库 / 多品牌对比
    if (["competitor", "compare"].includes(state.board)) bindCompetitor();
    // 我方运营
    if (state.board === "myops") bindMyOps();
    // 爆款内容深度分析
    if (state.board === "viraldeep") bindViralDeep();
    // 了解用户：品牌-用户讨论 / 高互动用户 / 用户分层分析 / 用户语料分析
    if (state.board === "uservoice") bindUserBoard();
    if (state.board === "branduser") bindBrandUser();
    if (state.board === "usertier") bindUserTier();
    if (state.board === "userseg") bindUserSeg();
  }


  function bindUserBoard() {
    $$(".uv-tab", $("#board")).forEach((b) => b.addEventListener("click", () => {
      state.uvTab = b.dataset.uv; renderBoard();
    }));
    // 美式本土化表达库：按标记筛选
    $$(".uv-loc-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
      state.uvLocMarker = el.dataset.loc; renderBoard();
    }));
    // 导出按钮
    $$("[data-uvx]", $("#board")).forEach((el) => el.addEventListener("click", () => { uvExportCorpus(el.dataset.uvx); }));
    // 钻入深度分析
    $$("[data-uv-drill]", $("#board")).forEach((b) => b.addEventListener("click", () => {
      state.uvDrillMeta = { tab: b.dataset.uvDrill, key: b.dataset.uvKey };
      renderBoard();
    }));
    // 钻入返回
    const backDrill = $("[data-uv-back-drill]", $("#board"));
    if (backDrill) backDrill.addEventListener("click", () => { state.uvDrillMeta = null; renderBoard(); });
    const cs = $("#uv-corpus-search");
    if (cs) {
      const applyCorpusFilter = () => {
        const q = cs.value.trim().toLowerCase();
        let shown = 0;
        $$(".uv-corp-item", $("#board")).forEach((el) => {
          const text = (el.dataset.text || "").toLowerCase();
          const brand = (el.dataset.brand || "").toLowerCase();
          const mks = (el.dataset.markers || "").split(/\s+/).filter(Boolean);
          const hitQ = !q || text.includes(q) || brand.includes(q);
          const hitM = state.uvCorpusMarker === "all" || mks.includes(state.uvCorpusMarker);
          const ok = hitQ && hitM;
          el.style.display = ok ? "" : "none";
          if (ok) shown++;
        });
        const cnt = $("#uv-corp-count"); if (cnt) cnt.textContent = shown;
      };
      cs.addEventListener("input", applyCorpusFilter);
      // 语料按标记筛选（不整页重渲染，保留搜索关键词）
      $$(".uv-corp-mk-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
        state.uvCorpusMarker = el.dataset.cm;
        $$(".uv-corp-mk-chip", $("#board")).forEach((c) => c.classList.toggle("on", c.dataset.cm === state.uvCorpusMarker));
        applyCorpusFilter();
      }));
    }
  }

  function bindGlobal() {
    // 搜索
    $("#global-search").addEventListener("input", (e) => { state.filters.search = e.target.value; renderBoard(); });
    // 筛选面板开关
    $("#filter-toggle").addEventListener("click", () => $("#filter-panel").classList.toggle("open"));
    // 爆款指数下限
    $("#viral-min").addEventListener("input", (e) => { state.filters.viralMin = +e.target.value; $("#viral-min-val").textContent = e.target.value; onFilterChange(); });
    // 时间范围
    $("#date-from").addEventListener("change", (e) => { state.filters.dateFrom = e.target.value; onFilterChange(); });
    $("#date-to").addEventListener("change", (e) => { state.filters.dateTo = e.target.value; onFilterChange(); });
    // 只看爆款
    $("#top-only").addEventListener("change", (e) => { state.filters.topOnly = e.target.checked; onFilterChange(); });
    // 抽屉关闭
    $("#drawer-overlay").addEventListener("click", closeDrawer);
    // 高互动用户综合深度分析弹层
    const segClose = $("#seg-close"); if (segClose) segClose.addEventListener("click", closeSegDeep);
    const segOverlay = $("#seg-overlay"); if (segOverlay) segOverlay.addEventListener("click", closeSegDeep);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if ($("#bx-modal").classList.contains("show")) closeBlindboxModal(); else if ($("#seg-modal").classList.contains("show")) closeSegDeep(); else if ($("#deep-modal").classList.contains("show")) closeDeep(); else closeDrawer(); } });
    // 正文语言切换（导航中文不动，仅帖子/回复正文 EN↔中）
    const lt = $("#lang-toggle");
    const syncLang = () => { $$(".lang-opt", lt).forEach((o) => o.classList.toggle("on", o.dataset.lang === state.lang)); };
    syncLang();
    $$(".lang-opt", lt).forEach((o) => o.addEventListener("click", (e) => {
      e.stopPropagation();
      state.lang = o.dataset.lang;
      try { localStorage.setItem("ca_lang", state.lang); } catch (err) {}
      syncLang();
      renderBoard();
      renderBlindboxFloat();
    }));
    // 灵感库随机模式：向下滚动加载更多
    const board = $("#board");
    if (board) board.addEventListener("scroll", () => {
      if (state.board !== "library" || state.libMode !== "rand" || state.randLoading) return;
      if (board.scrollTop + board.clientHeight >= board.scrollHeight - 200) {
        if (state.randVisible < (state.randList || []).length) {
          state.randLoading = true;
          const st = board.scrollTop;
          state.randVisible += 100;
          renderBoard();
          board.scrollTop = st;
          setTimeout(() => { state.randLoading = false; }, 200);
        }
      }
    });
    // 单帖深度分析 → 导出/复制图片
    const dExp = $("#deep-export"); if (dExp) dExp.addEventListener("click", () => exportDeepImage("download"));
    const dCpy = $("#deep-copyimg"); if (dCpy) dCpy.addEventListener("click", () => exportDeepImage("copy"));
  }

  // 把 #deep-body 渲染成图片（离屏舞台，避免玻璃拟态/透明背景问题）
  async function exportDeepImage(mode) {
    if (typeof html2canvas === "undefined") { toast("图片库未加载，刷新页面后重试"); return; }
    const stage = $("#deep-body");
    if (!stage || !stage.innerHTML.trim()) { toast("暂无可导出的内容"); return; }
    const expBtn = $("#deep-export"), cpyBtn = $("#deep-copyimg");
    if (expBtn) expBtn.disabled = true;
    if (cpyBtn) cpyBtn.disabled = true;
    const oldTxtE = expBtn ? expBtn.textContent : "", oldTxtC = cpyBtn ? cpyBtn.textContent : "";
    if (expBtn) expBtn.textContent = "生成中…";
    if (cpyBtn) cpyBtn.textContent = "生成中…";
    try {
      // 构建离屏舞台：标题 + 正文
      const wrap = document.createElement("div");
      wrap.className = "export-stage";
      const sub = $("#deep-sub") ? $("#deep-sub").textContent : "";
      wrap.innerHTML = `<div class="exp-kicker">单帖深度分析</div><div class="exp-sub">${esc(sub)}</div>${stage.innerHTML}`;
      document.body.appendChild(wrap);
      const canvas = await html2canvas(wrap, { backgroundColor: null, scale: 2, logging: false, useCORS: true, windowWidth: wrap.scrollWidth });
      wrap.remove();
      if (mode === "download") {
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `单帖分析_${state.deepId || "post"}.png`;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        toast("图片已导出");
      } else {
        if (!navigator.clipboard || !window.ClipboardItem) { toast("当前浏览器不支持复制图片"); return; }
        const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          toast("图片已复制到剪贴板");
        } catch (err) {
          // 退回到下载
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `单帖分析_${state.deepId || "post"}.png`;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1500);
          toast("浏览器拒绝剪贴板，已改为下载");
        }
      }
    } catch (err) {
      console.error(err);
      toast("生成图片失败：" + (err && err.message ? err.message : "未知错误"));
    } finally {
      if (expBtn) { expBtn.disabled = false; expBtn.textContent = oldTxtE; }
      if (cpyBtn) { cpyBtn.disabled = false; cpyBtn.textContent = oldTxtC; }
    }
  }
  function renderBlindboxModal() {
    // 若弹层已打开，重新渲染卡牌（语言切换等）
    const modal = $("#bx-modal");
    if (modal && modal.classList.contains("show")) {
      const dateEl = $("#bx-modal-date");
      if (dateEl) dateEl.textContent = todayStr();
      const grid = $("#bx-grid");
      if (grid) grid.innerHTML = bxCardsHTML();
      bindBlindboxModal();
    }
  }
  function renderBlindboxFloat() { renderBlindboxModal(); }

  /* ============ 初始化 ============ */
  /* ============ 数据来源 / 公式计算 弹层 ============ */
  function renderProvModal() {
    const cfg = BOARD_PROVENANCE[state.board];
    const b = BOARDS.find((x) => x.id === state.board) || {};
    $("#prov-title").textContent = `${b.name || "板块"} · 数据来源 / 公式计算`;
    $("#prov-sub").textContent = `共 ${cfg ? cfg.metrics.length : 0} 项指标`;
    const body = $("#prov-body");
    if (!cfg) { body.innerHTML = `<div class="prov-tip">该板块暂未配置指标明细。</div>`; return; }
    const legend = Object.entries(PROV_TYPES).map(([k, v]) => `<span class="lg"><i style="background:${v.color}"></i>${v.label}</span>`).join("");
    const counts = { source: 0, frontend: 0, ai: 0, combined: 0 };
    let flagCount = 0;
    cfg.metrics.forEach((m) => { counts[m.type] = (counts[m.type] || 0) + 1; if (m.flag || m.acc !== 100) flagCount++; });
    const summary = `<span class="ps ok">达标 ${cfg.metrics.length - flagCount}/${cfg.metrics.length}</span>` +
      (flagCount ? `<span class="ps bad">⚠ 未达100% ${flagCount} 项</span>` : `<span class="ps ok">全部 100%</span>`);
    const rows = cfg.metrics.map((m) => {
      const t = PROV_TYPES[m.type] || { label: m.type };
      const isBad = m.flag || m.acc !== 100;
      const accTxt = m.acc === 100 ? "100%" : (m.acc || "未达100%");
      const note = m.note ? `<span class="pr-note">⚠ ${esc(m.note)}</span>` : "";
      return `<div class="prov-row${isBad ? " flag" : ""}">
        <div class="pr-name">${esc(m.name)}</div>
        <div class="pr-tag ${m.type}">${t.label}</div>
        <div class="pr-formula">${esc(m.formula)}${note}</div>
        <div class="pr-acc ${isBad ? "bad" : "ok"}">${esc(String(accTxt))}</div>
      </div>`;
    }).join("");
    body.innerHTML = `<div class="prov-legend">${legend}</div><div class="prov-summary">${summary}</div><div class="prov-tip">${esc(cfg.tip || "")}</div>${rows}`;
  }
  function provEsc(e) { if (e.key === "Escape") closeProv(); }
  function openProv() { renderProvModal(); $("#prov-modal").hidden = false; $("#prov-backdrop").hidden = false; document.addEventListener("keydown", provEsc); }
  function closeProv() { $("#prov-modal").hidden = true; $("#prov-backdrop").hidden = true; document.removeEventListener("keydown", provEsc); }
  function bindProv() {
    const btn = $("#prov-toggle"); if (btn) btn.addEventListener("click", openProv);
    const bd = $("#prov-backdrop"); if (bd) bd.addEventListener("click", closeProv);
    const cl = $("#prov-close"); if (cl) cl.addEventListener("click", closeProv);
  }

  /* ============ 全局浮动按钮：随机、回到顶部、盲盒入口 ============ */
  function syncRandFloat() {} // no-op (replaced by inline button)
  function createFloatingButtons() {
    if (!$("#fab-top")) {
      const top = document.createElement("button");
      top.id = "fab-top";
      top.className = "fab-top";
      top.title = "回到顶部";
      top.innerHTML = `<span class="fab-ic">↑</span><span class="fab-txt">顶部</span>`;
      top.onclick = () => { $("#board").scrollTo({ top: 0, behavior: "smooth" }); };
      document.body.appendChild(top);
    }
    // 盲盒入口已 draggable，由 init 调用 makeDraggable
  }
  function bindScrollTop() {
    const board = $("#board");
    const topBtn = $("#fab-top");
    if (!board || !topBtn) return;
    const onScroll = () => {
      const show = board.scrollTop > 200;
      topBtn.classList.toggle("show", show);
    };
    board.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  function makeDraggable(el) {
    if (!el) return;
    let dragging = false, moved = false, startX, startY, startLeft, startTop;
    const onDown = (e) => {
      const evt = e.touches ? e.touches[0] : e;
      dragging = true; moved = false;
      startX = evt.clientX; startY = evt.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left; startTop = rect.top;
      el.style.transition = "none";
      el.style.cursor = "grabbing";
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const evt = e.touches ? e.touches[0] : e;
      const dx = evt.clientX - startX, dy = evt.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
      let nx = startLeft + dx, ny = startTop + dy;
      const maxW = window.innerWidth - el.offsetWidth, maxH = window.innerHeight - el.offsetHeight;
      nx = Math.max(0, Math.min(nx, maxW));
      ny = Math.max(0, Math.min(ny, maxH));
      el.style.left = nx + "px";
      el.style.top = ny + "px";
      el.style.right = "auto";
      el.style.bottom = "auto";
      e.preventDefault();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.transition = "transform .16s var(--ease), box-shadow .16s var(--ease)";
      el.style.cursor = "grab";
      // 保存位置到 localStorage
      try { localStorage.setItem("ca_bx_pos", JSON.stringify({ left: el.style.left, top: el.style.top })); } catch (e) {}
    };
    el.addEventListener("click", (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener("mousedown", onDown);
    el.addEventListener("touchstart", onDown, { passive: false });
    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    el.style.cursor = "grab";
    // 恢复上次位置
    try {
      const saved = JSON.parse(localStorage.getItem("ca_bx_pos") || "null");
      if (saved && saved.left && saved.top) { el.style.left = saved.left; el.style.top = saved.top; el.style.right = "auto"; el.style.bottom = "auto"; }
    } catch (e) {}
  }

  function renderFatalError(err) {
    const msg = (err && (err.message || err.stack)) || String(err);
    const target = document.getElementById("board") || document.body;
    target.innerHTML = `<div class="fatal-error">
      <div class="fatal-error-ic">!</div>
      <h2>页面加载失败</h2>
      <p class="fatal-error-msg">${esc(msg)}</p>
      <p class="fatal-error-tip">很可能原因：数据文件（约 8.5MB）加载超时或网络/CDN 抖动。</p>
      <div class="fatal-error-actions">
        <button class="btn-primary" onclick="location.reload(true)">重新加载</button>
        <a class="btn-ghost" href="https://ffswwwda.github.io/content-analytics-dashboard/" target="_blank">打开新页面</a>
      </div>
      <p class="fatal-error-note">若反复失败，请按 F12 打开 Console 复制红色报错发我。</p>
    </div>`;
  }

  async function init() {
    const boardEl = document.getElementById("board");
    if (boardEl) boardEl.innerHTML = `<div class="loading-state"><div class="loading-spin"></div><div>正在加载数据（约 8.5MB）…首次稍慢，请稍候</div></div>`;
    let data;
    try {
      data = await DataLoader.load();
    } catch (e) {
      console.error("[init] 数据加载失败:", e);
      renderFatalError(e);
      return;
    }
    state.raw = data;
    state.analysis = A.analyze(data.contents);
    computeViralRanks(state.analysis.contents);
    state.maxViral = Math.max(...state.analysis.contents.map((c) => c.viralScore), 0.0001);
    state.maxExposure = Math.max(...state.analysis.contents.map((c) => c.exposure), 1);
    state.users = await DataLoader.loadUsers();
    state.insights = await DataLoader.loadInsights();
    // 数据源标记
    const pill = $("#src-pill");
    if (data.meta && data.meta.source === "feishu") { pill.textContent = "飞书实时"; pill.classList.add("live"); }
    else if (data.meta && data.meta.source === "real") { pill.textContent = "真实数据"; pill.classList.add("live"); }
    else { pill.textContent = "演示数据"; pill.classList.remove("live"); }
    const lu = $("#last-updated");
    if (lu) {
      const ua = data.meta && data.meta.updated_at;
      if (ua) {
        const d = new Date(ua);
        lu.textContent = isNaN(d) ? `数据更新 ${ua}` : `数据更新 ${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
      } else {
        lu.textContent = "数据更新 待同步";
      }
    }
    // 时间范围默认值
    if (data.meta && data.meta.date_range) { /* 可选：预设 */ }
    renderNav();
    renderFilterPanel();
    bindGlobal();
    bindProv();
    syncFilterUI();
    renderActiveFilters();
    renderBoard();
    // 全局浮动按钮：随机、回到顶部、盲盒入口
    createFloatingButtons();
    syncRandFloat();
    bindScrollTop();
    // 右下角盲盒入口（可拖动）
    if (!$("#bx-reopen")) {
      const ro = document.createElement("button");
      ro.id = "bx-reopen";
      ro.className = "bx-reopen";
      ro.innerHTML = `<span class="bx-reopen-ic">🎁</span><span class="bx-reopen-txt">每日灵感盲盒</span>`;
      ro.addEventListener("click", () => openBlindboxModal());
      document.body.appendChild(ro);
    }
    makeDraggable($("#bx-reopen"));
    // 首次访问自动弹出盲盒（仅一次）
    try {
      const seen = localStorage.getItem("ca_bx_first_seen");
      if (!seen) {
        localStorage.setItem("ca_bx_first_seen", "1");
        openBlindboxModal();
      }
    } catch (e) {}
  }
  init().catch((e) => {
    console.error("[init] 未捕获错误:", e);
    renderFatalError(e);
  });
})();
