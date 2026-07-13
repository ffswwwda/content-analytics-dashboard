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
    // —— 灵感工具 ——
    { id: "library", name: "灵感库", group: "灵感工具", desc: "全部内容的灵感库。可随机浏览，也可按爆款率 / 曝光 / 互动 / 类型 ROI 多指标排序与筛选；一键只看爆款(Top10%)。点标签加筛选，点卡片看详情，再进单帖深度分析。" },
    // —— 看参考建议 ——
    { id: "reference", name: "评估想法", group: "看参考建议", desc: "一个工具两个方向：有想法→评估质量（多维评分卡 + 用户风评）；没灵感→输入目的主动推荐参考内容。还有回测校准准确率。" },
    // —— 看竞品情况 ——
    { id: "competitor", name: "竞品内容监测", group: "看竞品情况", desc: "选择单竞品 → 深度查看（整体数据 + 内容排序列表 + 形式/数据筛选 + 用户评价 + 运营节奏×表现 + Campaign 爆发监测）；也可看全部竞品排名。" },
    { id: "compare", name: "多竞品横向对比", group: "看竞品情况", desc: "勾选多个品牌横向对比：数据表现 + Top3 内容 + 用户情况，全面看标杆与差距。" },
    // —— 了解用户 ——
    { id: "uservoice", name: "用户讨论与语言", group: "了解用户", desc: "看用户讨论什么、用什么语言——学习美国用户的表达与话题讨论方式（用户语料 skill 后续接入）。" },
    { id: "format", name: "内容形式与风格", group: "了解用户", desc: "内容形式（含风格 / 情绪调性）表现对比——用户偏爱什么形式与调性。" },
    { id: "topic", name: "主题洞察", group: "了解用户", desc: "主题维度下钻：爆款率 / 参与度 / 时效 / 内容量，按权重合成综合爆款潜力分（滑块可调）。" },
    { id: "platform", name: "平台特点", group: "了解用户", desc: "同一内容在不同平台的特点与表现差异。" },
    // —— 我方运营 ——
    { id: "myops", name: "我方运营", group: "我方运营", desc: "选一个或多个竞品 → 勾选要参考的维度（节奏 / 选题 / 形式 / 风格 / 指标）→ 生成可执行的运营方案，支持导出。" },
  ];
  const boardDesc = (id) => (BOARDS.find((b) => b.id === id) || {}).desc || "";

  /* ---------- 状态 ---------- */
  const state = {
    raw: null, analysis: null, maxViral: 1, board: "library", insights: null,
    lang: (function () { try { return localStorage.getItem("ca_lang") || "en"; } catch (e) { return "en"; } })(),
    filters: { search: "", accounts: new Set(), platforms: new Set(), types: new Set(), topics: new Set(), emotions: new Set(), viralMin: 0, dateFrom: "", dateTo: "", topOnly: false },
    sort: "viral", view: "grid",
    topThreshold: 0,
    freqMode: "week",
    roiSort: "rate",
    campaignSort: "lift",
    detailId: null, predictor: null,
    dim: "brand", dimBrands: new Set(), topicWeights: { viral: 35, eng: 25, rec: 20, cov: 20 },
    blindbox: null, bxSeed: null, refMode: "eval", backtests: [], maxExposure: 1,
    users: null, uvTab: "language", uvCorpusQ: "", uvRankAll: false, uvLocMarker: "all", uvCorpusMarker: "all",
    libMode: "sort", libQuick: "all",
    compSel: new Set(), cmpSel: new Set(),
    compFilters: { types: new Set(), sort: "viral", viralMin: 0, topOnly: false },
    deepId: null, deepCompare: [], deepView: "main",
    opsBrands: [], opsRefs: new Set(["rhythm", "topic", "format", "style", "metric"]),
  };

  const FACETS = [
    { key: "accounts", label: "账号", field: "account" },
    { key: "platforms", label: "平台", field: "platform" },
    { key: "types", label: "形式", field: "contentType" },
    { key: "topics", label: "主题", field: "topicTags", multi: true },
    { key: "emotions", label: "情绪", field: "emotion" },
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
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("show"), 1900); }

  /* ---------- 筛选 ---------- */
  function getFiltered() {
    const f = state.filters;
    return state.analysis.contents.filter((c) => {
      if (f.search && !c.text.toLowerCase().includes(f.search.toLowerCase())) return false;
      if (f.accounts.size && !f.accounts.has(c.account)) return false;
      if (f.platforms.size && !f.platforms.has(c.platform)) return false;
      if (f.types.size && !f.types.has(c.contentType)) return false;
      if (f.topics.size && !c.topicTags.some((t) => f.topics.has(t))) return false;
      if (f.emotions.size && !f.emotions.has(c.emotion)) return false;
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
        const badge = b.id === "top" ? `<span class="nav-badge">${state.analysis.overview.topCount}</span>` : (b.id === "library" ? '<span class="nav-dot"></span>' : "");
        return `<div class="nav-item${state.board === b.id ? " active" : ""}" data-board="${b.id}">
          <svg viewBox="0 0 24 24" class="nav-ic">${ICON[b.id]}</svg>
          <span>${b.name}</span>${badge}</div>`;
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
      if (Array.isArray(v)) v.forEach((x) => x && set.add(x));
      else if (v) set.add(v);
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
    if (f.viralMin > 0) pills.push({ label: `爆款率 ≥ ${f.viralMin}`, kind: "viralMin" });
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
  function onFilterChange() { syncFilterUI(); renderActiveFilters(); renderBoard(); }

  /* ============ 板块切换 ============ */
  function switchBoard(id) {
    state.board = id;
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
      case "uservoice": html = renderUserBoard(); break;
      case "format": html = renderDimFormat(); break;
      case "topic": html = renderDimTopic(); break;
      case "platform": html = renderDimPlatform(); break;
      case "myops": html = renderMyOps(); break;
    }
    if (!["myops", "reference", "insights"].includes(state.board)) html += renderSectionInsight(state.board);
    $("#board").innerHTML = html;
    bindBoard(data);
    bindSectionInsight();
  }

  /* ---------- 灵感库（整合：随机浏览 + 指标排序 + 只看爆款 + 类型ROI）---------- */
  function renderLibrary(data) {
    let list = [...data];
    if (state.libQuick === "top") list = list.filter((c) => c.isTop);
    if (state.libMode === "rand") {
      list = sampleN(list, Math.max(12, list.length));
    } else if (state.sort === "roi") {
      const roiMap = new Map(state.analysis.contentTypeROI.map((t) => [t.type, t.avgViralScore]));
      list = [...list].sort((a, b) => (roiMap.get(b.contentType) || 0) - (roiMap.get(a.contentType) || 0));
    } else {
      list = sortContents(list, state.sort);
    }
    const tools = `<div class="board-tools">
      <div class="seg" id="lib-mode">
        <button data-mode="rand" class="${state.libMode === "rand" ? "on" : ""}">🎲 随机浏览</button>
        <button data-mode="sort" class="${state.libMode === "sort" ? "on" : ""}">📊 指标排序</button>
      </div>
      <div class="seg" id="lib-eval">
        <button data-eval="all" class="${state.libQuick === "all" ? "on" : ""}">全部</button>
        <button data-eval="top" class="${state.libQuick === "top" ? "on" : ""}">只看爆款</button>
        <button data-eval="roi" class="${state.libQuick === "roi" ? "on" : ""}">类型ROI</button>
      </div>
      <select class="sel" id="sort-sel">
        <option value="viral"${state.sort === "viral" ? " selected" : ""}>按爆款率</option>
        <option value="exposure"${state.sort === "exposure" ? " selected" : ""}>按曝光</option>
        <option value="engagement"${state.sort === "engagement" ? " selected" : ""}>按互动</option>
        <option value="date"${state.sort === "date" ? " selected" : ""}>按最新</option>
        <option value="roi"${state.sort === "roi" ? " selected" : ""}>按类型ROI</option>
      </select>
      <div class="seg" id="view-seg">
        <button data-view="grid" class="${state.view === "grid" ? "on" : ""}">卡片</button>
        <button data-view="list" class="${state.view === "list" ? "on" : ""}">列表</button>
      </div>
    </div>`;
    const head = `<div class="board-head"><div class="board-desc">${boardDesc("library")}<br><b style="color:var(--accent-strong)">${data.length}</b> 条符合筛选 · 随机模式打破信息茧房；指标模式含「只看爆款(Top10%) / 类型 ROI」等评估标准。点标签加筛选，点卡片看详情。</div>${tools}</div>`;
    if (!list.length) return head + emptyState();
    let roiPanel = "";
    if (state.libQuick === "roi" || state.sort === "roi") {
      const maxV = Math.max(...state.analysis.contents.map((c) => c.viralScore), 0.0001);
      roiPanel = `<div class="panel" style="margin-bottom:14px"><div class="panel-title">内容形式 ROI 概览（按平均爆款指数排序）</div><div class="panel-sub">作为「高 ROI 形式」的评估标准——哪种形式最值得借鉴</div>
        ${state.analysis.contentTypeROI.map((t) => `<div class="qc-bar"><span class="qc-name" style="width:90px">${esc(t.type)}</span><span class="qc-track"><i style="width:${((t.avgViralScore / maxV) * 100).toFixed(0)}%"></i></span><span class="qc-val">${t.count}条 · 互动率${(t.avgEngagementRate * 100).toFixed(1)}%</span></div>`).join("")}</div>`;
    }
    const body = state.view === "grid" ? `<div class="grid">${list.map(cardHTML).join("")}</div>` : list.map(listHTML).join("");
    const randBar = state.libMode === "rand" ? `<div class="blindbox-bar"><button class="btn-primary" id="lib-reshuffle">🎲 重新随机</button><span class="bx-tip">当前为随机抽样 ${list.length} 条，用于灵感发散</span></div>` : "";
    return head + roiPanel + randBar + body;
  }
  function sortContents(data, mode) {
    const a = [...data];
    if (mode === "viral") a.sort((x, y) => y.viralScore - x.viralScore);
    else if (mode === "date") a.sort((x, y) => y.publish_time.localeCompare(x.publish_time));
    else if (mode === "exposure") a.sort((x, y) => y.exposure - x.exposure);
    else if (mode === "engagement") a.sort((x, y) => y.engagement - x.engagement);
    return a;
  }
  function cardHTML(c) {
    return `<div class="card" data-id="${c.id}">
      <div class="card-top">
        ${c.isTop ? '<span class="badge-top">爆款</span>' : ""}
        ${c.isActivity ? `<span class="badge-act">${esc(c.activityTag)}</span>` : ""}
        <span class="tag" data-facet="accounts" data-val="${esc(c.account)}">${esc(c.account)}</span>
        <span class="tag" data-facet="types" data-val="${esc(c.contentType)}">${esc(c.contentType)}</span>
      </div>
      <div class="card-text">${esc(dispText(c))}</div>
      <div class="card-meta">${c.topicTags.map((t) => `<span class="tag topic" data-facet="topics" data-val="${esc(t)}">${esc(t)}</span>`).join("")}</div>
      <div class="card-meta"><span>${esc(c.platform)}</span><span class="dot"></span><span>${c.publishDate}</span><span class="dot"></span><span>${esc(c.emotion)}</span></div>
      <div class="card-score"><span class="score-num">${rate(c)}<small>/100</small></span><div class="score-bar"><i style="width:${rate(c)}%"></i></div></div>
    </div>`;
  }
  function listHTML(c) {
    return `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${c.publishDate}</div></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
      <div class="lr-num">${fmt(c.engagement)}<small>互动</small></div>
      <div><div class="lr-num">${rate(c)}<small>爆款率</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
    </div>`;
  }

  /* ---------- 高表现内容 ---------- */
  function renderTop(data) {
    const ranked = [...data].sort((a, b) => b.viralScore - a.viralScore).filter((c) => rate(c) >= state.topThreshold);
    const tools = `<div class="board-tools"><div class="fp-range-group"><label>爆款率 ≥</label>
      <input type="range" id="top-threshold" min="0" max="100" value="${state.topThreshold}" step="1" style="width:110px;accent-color:var(--hot)">
      <span class="range-val" id="top-threshold-val" style="color:var(--hot)">${state.topThreshold}</span></div></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[1].desc}<br>当前显示 <b style="color:var(--hot)">${ranked.length}</b> 条头部内容（门槛 ${state.topThreshold}）。</div>${tools}</div>`;
    if (!ranked.length) return head + emptyState();
    return head + ranked.map((c, i) => `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${i < 3 ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div>
      <div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div>
      <div class="lr-num">${fmt(c.engagement)}<small>互动</small></div>
      <div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
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
      <div class="stat"><div class="stat-label">平均爆款率</div><div class="stat-val" style="color:var(--hot)">${top.length ? rate(top[0]) : 0}</div><div class="stat-foot">头部基准</div></div>
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
      <div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div><div class="mini-bar" style="margin-top:5px"><i style="width:${rate(c)}%"></i></div></div>
    </div>`).join("");
    return `<div class="board-head"><div class="board-desc">${BOARDS[2].desc}</div></div>${statRow}${commons}
      <div class="panel" style="margin-top:16px"><div class="panel-title">爆款清单（按爆款率排序）</div><div class="panel-sub">点击查看详情与可复用的爆款特征</div>${list}</div>`;
  }

  /* ---------- 频率 × 表现 ---------- */
  function renderFreq(data) {
    const tools = `<div class="board-tools"><div class="seg" id="freq-seg">
      <button data-mode="week" class="${state.freqMode === "week" ? "on" : ""}">按周</button>
      <button data-mode="form" class="${state.freqMode === "form" ? "on" : ""}">按形式</button></div></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[3].desc} 当前筛选 <b>${data.length}</b> 条内容。</div>${tools}</div>`;
    if (state.freqMode === "week") {
      const weeks = aggregateWeeks(data);
      return head + `<div class="panel"><div class="panel-title">每周发布频率 vs 平均爆款率</div><div class="panel-sub">柱=当周发布数（左轴） · 线=当周平均爆款率（右轴 0-100）</div>${comboSVG(weeks)}</div>
        <div class="panel"><div class="panel-title">周明细</div>${weeks.map((w) => `<div class="rank-row"><div class="rank-main"><div class="rank-name">${w.label}</div><div class="rank-sub">发布 ${w.count} 条</div></div><div class="rank-right"><div class="rank-val">${w.avgRate}<small> 爆款率</small></div><div class="rank-track"><i style="width:${w.avgRate}%"></i></div></div></div>`).join("")}</div>`;
    } else {
      const byType = state.analysis.contentTypeROI.map((t) => {
        const items = data.filter((c) => c.contentType === t.type);
        const weeks = new Set(items.map((c) => c.publishDate.slice(0, 7))).size || 1;
        return { type: t.type, freq: items.length / weeks, rate: rate(items.sort((a, b) => b.viralScore - a.viralScore)[0] || { viralScore: 0 }), avgRate: items.length ? Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length) : 0, count: items.length };
      }).filter((x) => x.count);
      const maxF = Math.max(...byType.map((x) => x.freq), 1);
      return head + `<div class="panel"><div class="panel-title">各形式：发布频率 vs 平均爆款率</div><div class="panel-sub">频率=该形式平均每周发布条数</div>
        ${byType.sort((a, b) => b.avgRate - a.avgRate).map((x) => `<div class="rank-row"><div class="rank-main"><div class="rank-name">${esc(x.type)}</div><div class="rank-sub">${x.count} 条 · ${x.freq.toFixed(1)} 条/周</div></div><div class="rank-right"><div class="rank-val">${x.avgRate}<small> 爆款率</small></div><div class="rank-track"><i style="width:${x.avgRate}%"></i></div></div></div>`).join("")}</div>`;
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
      <option value="rate"${state.roiSort === "rate" ? " selected" : ""}>按爆款率</option>
      <option value="eng"${state.roiSort === "eng" ? " selected" : ""}>按互动率</option>
      <option value="exp"${state.roiSort === "exp" ? " selected" : ""}>按曝光</option></select></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[4].desc} 当前筛选命中 <b>${data.length}</b> 条。</div>${tools}</div>`;
    return head + `<div class="panel"><div class="panel-title">内容形式 ROI 排行</div><div class="panel-sub">爆款率=该形式内容的平均相对爆款指数（0-100）</div>
      ${sorted.map((r, i) => `<div class="rank-row"><div class="rank-no${i === 0 ? " top" : ""}">${i + 1}</div>
        <div class="rank-main"><div class="rank-name">${esc(r.type)}</div><div class="rank-sub">${r.realCount} 条 · 平均曝光 ${fmt(r.avgExposure)} · 互动率 ${r.avgEngagementRate.toFixed(2)}%</div></div>
        <div class="rank-right"><div class="rank-val">${r.rate}<small> 爆款率</small></div><div class="rank-track"><i style="width:${(r.rate / maxR) * 100}%"></i></div></div></div>`).join("")}</div>`;
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
      <option value="rate"${state.campaignSort === "rate" ? " selected" : ""}>按爆款率</option></select></div>`;
    const head = `<div class="board-head"><div class="board-desc">${BOARDS[5].desc} 「爆发倍数」= 活动期日均发布频次 ÷ 日常日均频次，越高说明越「集中爆发」。</div>${tools}</div>`;
    if (!rows.length) return head + emptyState("无活动期间内容");
    return head + rows.map((r, i) => `<div class="panel" style="${i ? "margin-top:14px" : ""}">
      <div class="panel-title">${esc(r.name)} ${r.lift >= 2 ? '<span class="badge-top">集中爆发</span>' : ""}</div>
      <div class="panel-sub">${r.start} ~ ${r.end} · 持续 ${r.dur} 天 · 标签：${r.tags.join("、") || "—"}</div>
      <div class="stat-row" style="margin-bottom:0">
        <div class="stat"><div class="stat-label">发布条数</div><div class="stat-val">${r.count}</div></div>
        <div class="stat"><div class="stat-label">爆发倍数</div><div class="stat-val" style="color:${r.lift >= 2 ? "var(--hot)" : "var(--text)"}">${r.lift.toFixed(1)}×</div></div>
        <div class="stat"><div class="stat-label">日均频次</div><div class="stat-val">${r.freq.toFixed(1)}</div></div>
        <div class="stat"><div class="stat-label">平均爆款率</div><div class="stat-val" style="color:var(--hot)">${r.avgRate}</div></div>
      </div></div>`).join("");
  }

  /* ---------- 选题预测 ---------- */
  const EXAMPLE_IDEAS = [
    { label: "打折活动如何，5折", text: "打折活动如何，5折。" },
    { label: "黄皮显白口红实测", text: "黄皮显白口红实测对比，看看到底是不是天花板。" },
    { label: "新品首发开箱", text: "新品首发开箱 | 这次联名包装真的美到离谱。" },
    { label: "学生党平价平替", text: "学生党必看！这些平价平替真的不输大牌。" },
  ];

  function renderPredictor() {
    return `<div class="predictor-wrap">
      <div class="board-head"><div class="board-desc">${BOARDS.find((b) => b.id === "reference").desc}</div></div>
      <div class="example-chips">
        <span class="ec-label">内置示例（点击载入）：</span>
        ${EXAMPLE_IDEAS.map((e) => `<button class="chip ec-chip" data-example="${esc(e.text)}">${esc(e.label)}</button>`).join("")}
      </div>
      <div class="predictor-input">
        <textarea id="idea-input" placeholder="描述你的内容想法，例如：黄皮显白口红实测对比，看看到底是不是天花板"></textarea>
        <button class="btn-primary" id="predict-btn">评估爆款率</button>
      </div>
      <div class="predict-result" id="predict-result"></div>
    </div>`;
  }
  function runPredict() {
    const idea = $("#idea-input").value.trim();
    if (!idea) { toast("先输入你的内容想法"); return; }
    const r = A.predictIdea(state.analysis.contents, idea);
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
          <span>爆款率 <b>${rateOf(c)}</b></span>
          <span>曝光 <b>${fmt(c.exposure)}</b></span>
          <span>互动 <b>${fmt(c.engagement)}</b></span>
        </div>
      </div>`;
    }).join("");

    const matchStatsHTML = ms.count ? `<div class="stat-row" style="margin-bottom:14px">
      <div class="stat"><div class="stat-label">匹配历史内容</div><div class="stat-val">${ms.count}<small>条</small></div></div>
      <div class="stat"><div class="stat-label">其中爆款占比</div><div class="stat-val" style="color:var(--hot)">${(ms.topRate * 100).toFixed(0)}<small>%</small></div></div>
      <div class="stat"><div class="stat-label">来自活动/Campaign</div><div class="stat-val">${(ms.activityRatio * 100).toFixed(0)}<small>%</small></div></div>
      <div class="stat"><div class="stat-label">平均爆款率</div><div class="stat-val">${ms.avgViralRate}</div></div>
    </div>` : "";

    const um = r.userMetrics;
    const userHTML = um && um.topKeywords.length ? `<div class="panel" style="margin-bottom:16px"><div class="panel-title">用户指标与风评</div><div class="panel-sub">基于匹配到的历史内容，提炼用户侧的互动表现与口碑倾向</div>
      <div class="stat-row" style="margin-bottom:12px">
        <div class="stat"><div class="stat-label">平均互动</div><div class="stat-val">${fmt(um.avgEngagement)}</div></div>
        <div class="stat"><div class="stat-label">平均评论</div><div class="stat-val">${fmt(um.avgComments)}</div></div>
        <div class="stat"><div class="stat-label">平均点赞</div><div class="stat-val">${fmt(um.avgLikes)}</div></div>
        <div class="stat"><div class="stat-label">评价倾向</div><div class="stat-val" style="color:var(--accent-2)">${esc(um.reviewTone)}</div></div>
      </div>
      <div class="hit-tags"><span class="hit-label">用户高频关键词：</span>${um.topKeywords.map((t) => `<span class="tag topic">${esc(t)}</span>`).join("")}</div>
      <div style="margin-top:10px">${um.reviewDist.map((x) => barHTML("评价·" + x.name, x.count)).join("")}</div>
    </div>` : "";

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
            <div class="sm-item"><div class="sm-k">同主题历史爆款率</div><div class="sm-v hot">${r.topicViralRate}%</div></div>
            <div class="sm-item"><div class="sm-k">同情绪历史爆款率</div><div class="sm-v hot">${r.emotionViralRate}%</div></div>
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
    box.classList.add("show");
    $("#copy-ai").addEventListener("click", copyToAI);
    // 匹配卡片可点击打开抽屉
    $$(".match-card", box).forEach((el) => el.addEventListener("click", () => openDrawer(el.dataset.id)));
  }
  function copyToAI() {
    if (!state.predictor) return;
    const { idea, r } = state.predictor;
    const topMatches = r.matches.items.slice(0, 4).map((c) => {
      const maxV = Math.max(...state.analysis.contents.map((x) => x.viralScore), 0.0001);
      const viralRate = Math.round((c.viralScore / maxV) * 100);
      return `- ${dispText(c)}（${c.account} · ${c.contentType} · 爆款率 ${viralRate} · 匹配原因：${c.matchReason}）`;
    }).join("\n");
    const ctx = `【内容选题深度分析请求】
我的内容想法：${idea}

—— 前端即时快评 ——
爆款率：${r.score}/100
同主题历史爆款率：${r.topicViralRate}% | 同情绪历史爆款率：${r.emotionViralRate}%
命中关键词数：${r.keywordHits}
匹配历史内容：${r.matches.total} 条，其中 ${(r.matchedStats.topRate * 100).toFixed(0)}% 为爆款
用户侧：平均互动 ${fmt(r.userMetrics.avgEngagement)} · 平均评论 ${fmt(r.userMetrics.avgComments)} · 评价倾向「${r.userMetrics.reviewTone}」 · 用户高频关键词：${r.userMetrics.topKeywords.join("、")}

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
      return `<div class="bx-card face-down" data-bx="${i}">
        <div class="bx-face bx-front">${cover}</div>
        <div class="bx-face bx-back">
          <div class="bx-rarity ${p.rarity.cls}">${p.rarity.label}</div>
          <div class="bx-reveal">
            <div class="bx-row"><span class="bx-k">品牌</span><span class="bx-v">${esc(c.account)}</span></div>
            <div class="bx-row"><span class="bx-k">内容形式</span><span class="bx-v">${esc(c.contentType)}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">内容</span><span class="bx-v">${esc(dispText(c))}</span></div>
            <div class="bx-row"><span class="bx-k">数据情况</span><span class="bx-v">曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 爆款率 ${rate(c)}${c.isTop ? " · 🔥爆款" : ""}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">可借鉴</span><span class="bx-v">${esc(borrowTip(c))}</span></div>
            ${voiceHTML}
          </div>
          <div class="bx-actions"><button class="mini-btn" data-use="${c.id}">点开详情</button><button class="mini-btn ghost" data-share="${i}">下载图片</button><button class="mini-btn ghost" data-copy="${i}">复制图片</button></div>
        </div></div>`;
    }).join("");
  }

  function initBlindboxFloat(forceOpen) {
    let box = $("#bx-float");
    if (!box) {
      box = document.createElement("div");
      box.id = "bx-float";
      box.className = "bx-float";
      // 首次打开：按当天日期定下「每日抽」的种子（当天稳定、跨天不同）
      state.bxSeed = dateSeed();
      box.innerHTML = `<div class="bx-float-head" id="bx-float-head">
          <span class="bx-float-title" id="bx-float-title">🎁 每日盲盒 · ${todayStr()}</span>
          <div class="bx-float-tools">
            <button class="mini-btn" id="bx-redraw">🎲 重抽</button>
            <button class="mini-btn ghost" id="bx-close">×</button>
          </div>
        </div>
        <div class="bx-float-body" id="bx-float-body"><div class="blindbox-grid bx-float-grid">${bxCardsHTML()}</div></div>`;
      document.body.appendChild(box);
      bindBlindboxFloat(box);
      box.classList.add("show");
    } else {
      // 已存在：仅重绘卡牌（如语言切换 / 重抽），不改变显隐状态
      $("#bx-float-body", box).innerHTML = `<div class="blindbox-grid bx-float-grid">${bxCardsHTML()}</div>`;
      bindBlindboxFloat(box);
      if (forceOpen) box.classList.add("show");
    }
    const reopen = $("#bx-reopen");
    if (reopen) reopen.style.display = box.classList.contains("show") ? "none" : "";
  }

  function bindBlindboxFloat(box) {
    // 拖动
    const head = $("#bx-float-head", box);
    head.onmousedown = (e) => {
      if (e.target.closest("button")) return;
      const r = box.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      box.style.transition = "none";
      const mv = (ev) => { box.style.left = ev.clientX - dx + "px"; box.style.top = ev.clientY - dy + "px"; box.style.right = "auto"; };
      const up = () => { document.removeEventListener("mousemove", mv); document.removeEventListener("mouseup", up); box.style.transition = ""; };
      document.addEventListener("mousemove", mv); document.addEventListener("mouseup", up);
    };
    // 重抽：清空每日种子 → 立即换新一组（真随机）
    const rd = $("#bx-redraw", box); if (rd) rd.onclick = (e) => { e.stopPropagation(); state.bxSeed = null; $("#bx-float-body", box).innerHTML = `<div class="blindbox-grid bx-float-grid">${bxCardsHTML()}</div>`; bindBlindboxFloat(box); };
    // 关闭
    const cl = $("#bx-close", box); if (cl) cl.onclick = (e) => { e.stopPropagation(); box.classList.remove("show"); let ro = $("#bx-reopen"); if (!ro) { ro = document.createElement("button"); ro.id = "bx-reopen"; ro.className = "bx-reopen"; ro.textContent = "🎁 盲盒"; ro.onclick = () => initBlindboxFloat(true); document.body.appendChild(ro); } ro.style.display = ""; };
    // 翻牌
    $$(".bx-card.face-down", box).forEach((el) => el.onclick = () => { el.classList.remove("face-down"); el.classList.add("flipped"); });
    // 点开详情
    $$("[data-use]", box).forEach((b) => b.onclick = (e) => { e.stopPropagation(); openDrawer(b.dataset.use); });
    // 分享生图
    $$("[data-share]", box).forEach((b) => b.onclick = (e) => { e.stopPropagation(); blindboxShareImage(state.blindbox[+b.dataset.share]); });
    // 复制图片
    $$("[data-copy]", box).forEach((b) => b.onclick = (e) => { e.stopPropagation(); blindboxCopyImage(state.blindbox[+b.dataset.copy]); });
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
    const stats = [`曝光 ${fmt(c.exposure)}`, `互动 ${fmt(c.engagement)}`, `爆款率 ${rate(c)}`];
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
    { id: "sell", name: "卖货转化", emotion: ["种草", "共鸣"], type: ["图文", "短视频"], activity: true, w: { engagement: 1.5, exposure: 1, activity: 1 } },
    { id: "review", name: "获取测评用户", emotion: ["实用", "高级"], type: ["测评", "图文"], w: { engagement: 2, exposure: 0.6, activity: 0.5 } },
    { id: "growth", name: "拉新涨粉", emotion: ["搞笑", "共鸣"], type: ["短视频", "直播"], w: { exposure: 2, shares: 1.2, engagement: 0.8 } },
    { id: "brand", name: "品牌曝光", emotion: ["高级", "治愈"], type: ["图文", "短视频"], w: { exposure: 1.5, shares: 1.2, collections: 1 } },
  ];
  function renderReference() {
    const tabs = `<div class="ref-tabs">
      <button class="ref-tab${state.refMode === "eval" ? " on" : ""}" data-rm="eval">① 评估想法</button>
      <button class="ref-tab${state.refMode === "find" ? " on" : ""}" data-rm="find">② 找参考</button>
      <button class="ref-tab${state.refMode === "back" ? " on" : ""}" data-rm="back">③ 回测校准</button></div>`;
    let body = "";
    if (state.refMode === "eval") body = renderPredictor();
    else if (state.refMode === "find") body = renderFind();
    else body = renderBacktest();
    return `<div class="board-head"><div class="board-desc">${BOARDS.find((b) => b.id === "reference").desc}</div></div>${tabs}<div id="ref-body">${body}</div>`;
  }
  function bindReference() {
    $$(".ref-tab").forEach((b) => b.addEventListener("click", () => { state.refMode = b.dataset.rm; renderBoard(); }));
    if (state.refMode === "eval") bindPredictorBoard();
    else if (state.refMode === "find") bindFind();
    else bindBacktest();
  }
  function bindPredictorBoard() {
    const pb = $("#predict-btn"); if (pb) pb.addEventListener("click", runPredict);
    const ta = $("#idea-input"); if (ta) ta.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") runPredict(); });
    bindExampleChips();
  }
  function findPurposeChips() {
    const all = state.analysis.contents;
    const cnt = (g) => all.filter((c) => {
      if (g.emotion && g.emotion.includes(c.emotion)) return true;
      if (g.type && g.type.some((t) => t === c.contentType)) return true;
      if (g.id === "review" && c.commentQuality && Object.keys(c.commentQuality).length) return true;
      return false;
    }).length;
    const presets = GOAL_PRESETS.map((g) => `<button class="chip ec-chip find-preset" data-goal="${g.id}">${g.name}<span class="ec-cnt">${cnt(g)}</span></button>`).join("");
    const topicCount = new Map();
    all.forEach((c) => (c.topicTags || []).forEach((t) => { if (t) topicCount.set(t, (topicCount.get(t) || 0) + 1); }));
    const topTopics = [...topicCount.entries()].sort((a, b) => b[1] - a[1]).filter(([, n]) => n >= 2).slice(0, 6);
    const auto = topTopics.map(([t, n]) => `<button class="chip ec-chip find-topic" data-topic="${esc(t)}">${esc(t)}<span class="ec-cnt">${n}</span></button>`).join("");
    return { presets, auto };
  }
  function renderFind() {
    const { presets, auto } = findPurposeChips();
    const dims = [["type", "形式"], ["topic", "主题"], ["emotion", "情绪"], ["platform", "平台"], ["keyword", "关键词"], ["perf", "表现"]];
    const dimHTML = dims.map(([k, l]) => `<label class="dim-toggle on" data-dim="${k}"><input type="checkbox" checked> ${l}</label>`).join("");
    return `<div class="predictor-wrap">
      <div class="board-desc" style="margin-bottom:12px">输入你的<strong>运营目的</strong>，或选常用目的 / 真实帖子主题，工具按<strong>多维度</strong>主动推荐最匹配的历史内容，并展示<strong>原贴 + 整体说明</strong>——区别于灵感库的被动浏览。</div>
      <div class="find-block">
        <div class="find-label">常用目的（沿用现有分类，括号为真实匹配数）</div>
        <div class="example-chips" id="find-presets">${presets}</div>
      </div>
      <div class="find-block">
        <div class="find-label">根据真实帖子发现的主题（点选即按该主题匹配）</div>
        <div class="example-chips" id="find-topics">${auto || '<span class="uv-muted">暂无足够主题样本</span>'}</div>
      </div>
      <div class="find-block">
        <div class="find-label">目的详述（自由输入，用于多维度匹配）</div>
        <textarea id="goal-detail" class="goal-textarea" rows="3" placeholder="例如：想给美国男性用户推一款高端 Anal 玩具，主打成分安全与体验升级，希望引发讨论和测评，而不是硬广…"></textarea>
      </div>
      <div class="find-block">
        <div class="find-label">匹配维度（可关掉不相关的）</div>
        <div class="find-dims" id="find-dims">${dimHTML}</div>
      </div>
      <div class="predictor-input"><button class="btn-primary" id="find-btn">🔍 推荐参考内容</button></div>
      <div class="predict-result" id="find-result"></div></div>`;
  }
  function tokenize(text) {
    const t = (text || "").toLowerCase();
    const words = (t.match(/[a-z0-9]+/g) || []).filter((w) => w.length >= 2);
    const out = new Set(words);
    if (/[一-龥]/.test(t)) out.add(t.replace(/\s+/g, ""));
    return [...out];
  }
  function matchScoreMulti(c, ctx) {
    const { g, topic, detail, dims } = ctx;
    let score = 0; const reasons = []; const dimHits = [];
    const cText = (c.text || "").toLowerCase();
    if (g) {
      if (g.emotion && g.emotion.includes(c.emotion)) { score += 18; reasons.push(`情绪「${c.emotion}」契合目的`); dimHits.push("emotion"); }
      if (g.type && g.type.includes(c.contentType)) { score += 18; reasons.push(`形式「${c.contentType}」契合目的`); dimHits.push("type"); }
      if (g.activity && c.isActivity) { score += 14; reasons.push("活动/促销型内容"); dimHits.push("type"); }
      if (g.id === "review" && c.commentQuality && Object.keys(c.commentQuality).length) { score += 12; reasons.push("含用户提问/讨论（利于测评）"); dimHits.push("keyword"); }
    }
    if (topic) {
      const tl = topic.toLowerCase();
      if ((c.topicTags || []).some((t) => String(t).toLowerCase() === tl)) { score += 22; reasons.push(`命中真实主题「${topic}」`); dimHits.push("topic"); }
      else if (cText.includes(tl)) { score += 10; reasons.push(`正文含主题「${topic}」`); dimHits.push("topic"); }
    }
    if (detail) {
      const tokens = tokenize(detail);
      let kw = 0; const kwEx = [];
      tokens.forEach((tk) => { if (cText.includes(tk)) { kw++; if (kwEx.length < 4) kwEx.push(tk); } });
      if (kw && dims.has("keyword")) { score += Math.min(30, kw * 6); reasons.push(`关键词命中 ${kw} 处（${kwEx.join("、")}）`); dimHits.push("keyword"); }
      if (dims.has("topic")) {
        const tOverlap = (c.topicTags || []).filter((t) => tokens.includes(String(t).toLowerCase()) || tokens.some((tk) => String(t).toLowerCase().includes(tk)));
        if (tOverlap.length) { score += 10 * tOverlap.length; reasons.push(`主题契合 ${tOverlap.join("、")}`); dimHits.push("topic"); }
      }
      if (dims.has("emotion") && tokens.some((tk) => c.emotion.toLowerCase().includes(tk))) { score += 8; reasons.push(`情绪契合「${c.emotion}」`); dimHits.push("emotion"); }
      if (dims.has("type") && tokens.some((tk) => c.contentType.toLowerCase().includes(tk))) { score += 8; reasons.push(`形式契合「${c.contentType}」`); dimHits.push("type"); }
      if (dims.has("platform") && tokens.some((tk) => c.platform.toLowerCase().includes(tk))) { score += 6; reasons.push(`平台契合「${c.platform}」`); dimHits.push("platform"); }
    }
    if (dims.has("perf")) {
      const vr = rate(c);
      if (vr >= 70) { score += 20; reasons.push(`爆款内容（爆款率 ${vr}%）`); }
      else if (vr >= 50) { score += 12; reasons.push(`高表现（爆款率 ${vr}%）`); }
      else if (vr >= 30) { score += 6; }
      dimHits.push("perf");
    }
    return { score: Math.round(Math.min(100, score)), reasons, dimHits: [...new Set(dimHits)] };
  }
  function postSummary(c, reasons) {
    const vr = rate(c);
    const eng = (c.engagementRate || 0).toFixed(2);
    const topics = (c.topicTags || []).join("、") || "未标注";
    const hit = c.isTop ? "属于爆款(Top10%)内容" : `爆款率 ${vr}%`;
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
    const fstate = { goalId: null, topic: null, dims: new Set(["type", "topic", "emotion", "platform", "keyword", "perf"]) };
    $$("#find-presets .ec-chip").forEach((b) => b.addEventListener("click", () => {
      $$("#find-presets .ec-chip").forEach((x) => x.classList.remove("on"));
      $$("#find-topics .ec-chip").forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); fstate.goalId = b.dataset.goal; fstate.topic = null;
      runFind(fstate);
    }));
    $$("#find-topics .ec-chip").forEach((b) => b.addEventListener("click", () => {
      $$("#find-topics .ec-chip").forEach((x) => x.classList.remove("on"));
      $$("#find-presets .ec-chip").forEach((x) => x.classList.remove("on"));
      b.classList.add("on"); fstate.topic = b.dataset.topic; fstate.goalId = null;
      runFind(fstate);
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
      const r = matchScoreMulti(c, { g, topic: fstate.topic, detail, dims: fstate.dims });
      if (r.score > 0) scored.push({ c, ...r });
    }
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 8);
    const box = $("#find-result");
    if (!box) return;
    if (!top.length) { box.innerHTML = emptyState("没有匹配的内容，试试放宽维度或调整目的"); return; }
    const label = g ? g.name : (fstate.topic ? `主题「${fstate.topic}」` : (detail ? "自定义目的" : "全部内容（按表现排序）"));
    box.innerHTML = `<div class="find-intro">为「<b>${esc(label)}</b>」按多维度匹配出 <b>${top.length}</b> 条最相关历史内容（综合匹配分越高越契合）：</div>
      <div class="match-grid">${top.map(({ c, score, reasons, dimHits }) => matchCardHTML(c, score, reasons, dimHits)).join("")}</div>`;
    $$(".match-card", box).forEach((el) => el.addEventListener("click", () => openDrawer(el.dataset.id)));
  }

  /* 回测：预测 vs 真实 */
  function loadBacktests() { try { return JSON.parse(localStorage.getItem("cad_backtests") || "[]"); } catch (e) { return []; } }
  function saveBacktests(a) { try { localStorage.setItem("cad_backtests", JSON.stringify(a)); } catch (e) {} }
  function backtestAccuracy(list) {
    if (!list.length) return "";
    const hit = list.filter((b) => b.hit).length;
    const mae = list.reduce((s, b) => s + Math.abs(b.predicted - b.actualRate), 0) / list.length;
    return `<div class="stat"><div class="stat-label">回测样本</div><div class="stat-val">${list.length}</div></div>
      <div class="stat"><div class="stat-label">预测命中率</div><div class="stat-val" style="color:var(--hot)">${Math.round((hit / list.length) * 100)}%</div></div>
      <div class="stat"><div class="stat-label">平均绝对误差</div><div class="stat-val">${mae.toFixed(1)}</div></div>`;
  }
  function btRowHTML(b) {
    return `<div class="bt-row"><div class="bt-text">${esc((b.text || "").slice(0, 50))}</div>
      <div class="bt-nums"><span>预测 ${b.predicted}</span><span>实际 ${b.actualRate}${b.actualTop ? "(爆)" : ""}</span><span class="${b.hit ? "ok" : "no"}">${b.hit ? "✓命中" : "✗偏差"}</span></div>
      <button class="mini-btn ghost" data-bt-del="${b.id}">删</button></div>`;
  }
  function renderBacktest() {
    const list = state.backtests || [];
    const options = state.analysis.contents.map((c) => `<option value="${c.id}">${esc(dispText(c).slice(0, 40))}</option>`).join("");
    const agg = backtestAccuracy(list);
    return `<div class="predictor-wrap">
      <div class="board-desc" style="margin-bottom:10px">回测：拿真实活动来，回填实际表现，对比「预测 vs 真实」，累积准确率以校准工具权重。</div>
      <div class="bt-form">
        <select id="bt-content" class="sel">${options}</select>
        <label class="bt-check"><input type="checkbox" id="bt-top"> 实际是爆款</label>
        <input id="bt-rate" class="bt-num" type="number" min="0" max="100" placeholder="实际爆款率 0-100">
        <button class="btn-primary" id="bt-add">记录回测</button>
      </div>
      ${agg ? `<div class="stat-row" style="margin:14px 0">${agg}</div>` : ""}
      <div id="bt-list">${list.length ? list.map(btRowHTML).join("") : emptyState("暂无回测记录")}</div></div>`;
  }
  function bindBacktest() {
    const add = $("#bt-add"); if (add) add.addEventListener("click", () => {
      const id = $("#bt-content").value; const c = state.analysis.contents.find((x) => x.id === id);
      if (!c) return;
      const actualTop = $("#bt-top").checked; const actualRate = +($("#bt-rate").value || 0);
      const predicted = rate(c);
      const hit = (predicted >= 70) === actualTop;
      state.backtests.push({ id: "bt" + Date.now(), contentId: id, text: c.text, predicted, actualTop, actualRate, hit, ts: new Date().toISOString() });
      saveBacktests(state.backtests); renderBoard();
    });
    $$("[data-bt-del]").forEach((b) => b.addEventListener("click", () => {
      state.backtests = state.backtests.filter((x) => x.id !== b.dataset.btDel);
      saveBacktests(state.backtests); renderBoard();
    }));
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
        if (refs.has("rhythm")) { sec += opsSec("① 运营节奏", `<li>建议发布频率：<b>${freq}</b> 条/周（参照该竞品历史节奏）</li><li>爆款率基准：${avgRate} · 爆款数 ${topCount}/${items.length}</li>`); mdSec += `### ① 运营节奏\n- 发布频率 ${freq} 条/周\n- 爆款率基准 ${avgRate}\n`; }
        if (refs.has("topic")) { const tops = [...new Set(items.flatMap((c) => c.topicTags))].slice(0, 5).join("、") || "—"; const actPct = Math.round(items.filter((c) => c.isActivity).length / items.length * 100); sec += opsSec("② 选题 / 内容", `<li>高频主题：${esc(tops)}</li><li>活动型内容占比：${actPct}%</li>`); mdSec += `### ② 选题/内容\n- 高频主题 ${tops}\n- 活动占比 ${actPct}%\n`; }
        if (refs.has("format")) { sec += opsSec("③ 内容形式建议", `<li>主力形式：<b>${esc(topType[0])}</b>（占 ${topType[1]}/${items.length}）</li>`); mdSec += `### ③ 内容形式\n- 主力 ${topType[0]}\n`; }
        if (refs.has("style")) { sec += opsSec("④ 风格调性", `<li>推荐情绪调性：<b>${esc(topEmo[0])}</b></li>`); mdSec += `### ④ 风格调性\n- ${topEmo[0]}\n`; }
        if (refs.has("metric")) { sec += opsSec("⑤ 要观测的指标 + 阈值", `<li>爆款率：周均值 ≥ ${avgRate}</li><li>互动率：≥ ${avgEng}%</li><li>发布频率：稳定 ≥ ${freq} 条/周</li><li>异常预警：单条爆款率连续 2 周低于基准即复盘</li>`); mdSec += `### ⑤ 指标阈值\n- 爆款率≥${avgRate}\n- 互动率≥${avgEng}%\n- 频率≥${freq}条/周\n`; }
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
        const tcHTML = topContent.map((c) => `<div class="list-row" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)}</div></div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div></div>`).join("");
        sec += opsSec("该竞品优质内容（可借鉴）", tcHTML);
        mdSec += `### 优质内容\n` + topContent.map((c, i) => `${i + 1}. ${c.text}（${c.contentType}·爆款率${rate(c)}）`).join("\n") + `\n`;
        html += `<div class="ops-plan"><div class="ops-head">对标 <b>${esc(name)}</b> 的运营方案</div>${sec}</div>`;
        md += `## 对标 ${name}\n${mdSec}\n`;
      });
      md += `\n---\n※ 基于历史数据的规则化方案；接入 GPT 后可生成更精细文案与节奏建议。\n`;
      $("#ops-result").innerHTML = html + `<button class="btn-primary" id="ops-export" style="margin-top:14px">⬇ 导出方案（Markdown）</button>`;
      const ex = $("#ops-export"); if (ex) ex.addEventListener("click", () => downloadText(`运营方案_${state.opsBrands.join("_")}.md`, md));
    });
  }

  /* ============ 了解用户：用户讨论与语言（富用户分析中枢）============ */
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
    const tabs = [["say", "用户在说什么"], ["language", "用户语料库分析"], ["layers", "用户分层"], ["rank", "高互动用户"], ["brand", "分品牌评价"], ["form", "分内容形式"]];
    const tabBar = `<div class="uv-tabs">${tabs.map(([id, name]) => `<button class="uv-tab${state.uvTab === id ? " on" : ""}" data-uv="${id}">${name}</button>`).join("")}</div>`;
    const m = U.meta;
    const meta = `<div class="uv-meta">真实用户回帖 <b>${fmt(m.genuine_replies_in_window)}</b> · 独立用户 <b>${fmt(m.genuine_users)}</b> · 多帖用户 <b>${fmt(m.multi_reply_users)}</b> · 窗口 ${m.window[0]} ~ ${m.window[1]}<span class="uv-meta-sub">（已过滤品牌官方回复 ${fmt(m.brand_reply_filtered)} 条）</span></div>`;
    let body = "";
    if (state.uvTab === "say") body = uvSay(U);
    else if (state.uvTab === "language") body = uvLanguage(U);
    else if (state.uvTab === "layers") body = uvLayers(U);
    else if (state.uvTab === "rank") body = uvRank(U);
    else if (state.uvTab === "brand") body = uvBrand(U);
    else body = uvForm(U);
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
      </div>`;
    }).join("");
    return `<div class="uv-block"><div class="uv-block-title">按回复字数分层用户（不同「投入度」对应不同运营动作）</div><div class="uv-layer-grid">${cards}</div></div>`;
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
          <span class="uv-uname">@${esc(u.name)}</span>
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
    const hint = state.uvRankAll ? "" : `<div class="uv-muted uv-rank-hint">已显示窗口内回复数最高的 50 人；点击「展开全部」查看共 ${all} 位高互动用户。每个卡片可点开看完整深度画像。</div>`;
    return `<div class="uv-block">
      <div class="uv-block-title">高互动用户排行（窗口内回复数 · 已显示 Top ${shown} / 共分析 ${all} 人） ${toggleBtn}</div>
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
        <div class="uv-form-head"><span class="uv-form-name">${esc(f.form)}</span><span class="uv-form-count">${fmt(f.replyCount)} 条参与</span></div>
        ${uvBars(sPairs)}
        <div class="uv-row"><b>用户提及词</b><div class="uv-tags">${kw}</div></div>
        <div class="uv-row"><b>代表语录</b><div class="uv-quotes">${q}</div></div>
      </div>`;
    }).join("");
    return `<div class="uv-block"><div class="uv-block-title">分内容形式（用户参与了什么形式、怎么聊它）</div><div class="uv-form-grid">${cards}</div></div>`;
  }

  /* ---------- 空态 ---------- */
  function emptyState(msg = "没有符合当前筛选的内容") {
    return `<div class="empty"><div class="em-ic">🔍</div><div class="em-t">${esc(msg)}<br>试试放宽顶部筛选条件</div></div>`;
  }

  /* ============ 维度分析（品牌/平台/用户/内容形式/主题）============ */
  const DIM_TABS = [
    { id: "brand", name: "品牌" },
    { id: "platform", name: "平台" },
    { id: "user", name: "用户" },
    { id: "format", name: "内容形式" },
    { id: "topic", name: "主题" },
  ];

  function renderDimensions() {
    const tabs = `<div class="dim-tabs">${DIM_TABS.map((t) => `<button class="dim-tab${state.dim === t.id ? " on" : ""}" data-dim="${t.id}">${t.name}</button>`).join("")}</div>`;
    let body = "";
    if (state.dim === "brand") body = renderDimBrand();
    else if (state.dim === "platform") body = renderDimPlatform();
    else if (state.dim === "user") body = renderDimUser();
    else if (state.dim === "format") body = renderDimFormat();
    else if (state.dim === "topic") body = renderDimTopic();
    return `<div class="board-head"><div class="board-desc">按维度下钻分析：先选维度，再看该维度下的爆款率 / 参与度 / 数据 / 关键词。所有结果均受顶部全局筛选约束（账号·平台·形式·主题·风格·爆款率·时间）。</div></div>${tabs}${body}`;
  }

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
  function fmtDimCard(d, facetKey, facetLabel) {
    return `<div class="dim-card" data-dfacet="${facetKey}" data-dval="${esc(d.name)}">
      <div class="dc-top"><span class="dc-name">${esc(d.name)}</span><span class="dc-tag">${facetLabel}</span></div>
      <div class="dc-metrics">
        <div class="dc-m"><span>内容</span><b>${d.count}</b></div>
        <div class="dc-m"><span>平均爆款率</span><b style="color:var(--hot)">${d.avgRate}</b></div>
        <div class="dc-m"><span>爆款数</span><b>${d.topCount}</b></div>
        <div class="dc-m"><span>总曝光</span><b>${fmt(d.totalExposure)}</b></div>
      </div>
    </div>`;
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
      items = [...items].sort((a, b) => cf.sort === "exposure" ? b.exposure - a.exposure : cf.sort === "engagement" ? b.engagement - a.engagement : b.viralScore - a.viralScore);
    } else {
      items = [...itemsAll].sort((a, b) => b.viralScore - a.viralScore);
    }
    const avgRate = Math.round(itemsAll.reduce((s, c) => s + rate(c), 0) / itemsAll.length);
    const topCount = itemsAll.filter((c) => c.isTop).length;
    const totalExp = itemsAll.reduce((s, c) => s + c.exposure, 0);
    const avgEng = (itemsAll.reduce((s, c) => s + c.engagementRate, 0) / itemsAll.length).toFixed(2);
    const metas = accountMeta(name);
    const followers = metas.reduce((s, a) => s + (a.followers || 0), 0);
    const m0 = metas[0] || {};
    const handles = metas.map((a) => `<a class="comp-handle" href="${esc(a.account_link || "#")}" target="_blank" rel="noreferrer">${esc(a.handle || a.account)} ↗</a>`).join(" · ");
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.account === name).sort((a, b) => b.likes - a.likes);
    const voiceHTML = voices.length
      ? `<div class="uv-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-top:8px">${voices.slice(0, 6).map((v) => `<div class="uv-card"><div class="uv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes)}</span></div><div class="uv-text">${esc(dispVoice(v))}</div><a class="uv-link" href="${esc(v.originalLink || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>`).join("")}</div>`
      : `<div style="color:var(--text-3);font-size:12.5px;margin-top:6px">暂无该竞品的用户评价数据</div>`;
    const listCap = cf ? items.length : Math.min(items.length, 8);
    const contentHTML = `<div class="list-rows">${items.slice(0, listCap).map((c) => `<div class="list-row" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(dispText(c))}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div><div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div><div class="lr-num">${fmt(c.engagement)}<small>互动</small></div><div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div></div>${c.post_link ? `<a class="lr-link" href="${esc(c.post_link)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">原帖↗</a>` : ""}</div>`).join("")}${cf && items.length > listCap ? `<div style="color:var(--text-3);font-size:12px;padding:8px 0;text-align:center">已显示全部 ${items.length} 条（受筛选约束）</div>` : ""}</div>`;
    const typeBreak = groupRate(itemsAll, "contentType");
    const topicBreak = groupRate(itemsAll, "topicTags", true).slice(0, 8);
    const emotionBreak = groupRate(itemsAll, "emotion");
    const maxRate = Math.max(...typeBreak.map((t) => t.avgRate), 1);
    const dimCards = [
      { title: `形式分布（${typeBreak.length}）`, rows: typeBreak },
      { title: `主题分布（Top8）`, rows: topicBreak },
      { title: `风格/情绪分布（${emotionBreak.length}）`, rows: emotionBreak },
    ].map((d) => `<div class="comp-dim-card"><div class="comp-dim-title">${d.title}</div>${d.rows.map((r) => `<div class="qc-bar"><span class="qc-name" style="width:96px">${esc(r.name)}</span><span class="qc-track"><i style="width:${(r.avgRate / maxRate) * 100}%"></i></span><span class="qc-val">${r.count}·${r.avgRate}</span></div>`).join("") || '<div style="color:var(--text-3);font-size:12px">无</div>'}</div>`).join("");
    const weeks = aggregateWeeks(itemsAll);
    const rhythmHTML = weeks.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">运营节奏 · 频率 × 表现</div><div class="panel-sub">柱=当周发布数 · 线=当周平均爆款率</div>${comboSVG(weeks)}</div>` : "";
    const bursts = burstsFor(itemsAll);
    const burstHTML = bursts.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">Campaign 爆发监测</div>${bursts.map((r) => `<div class="qc-bar"><span class="qc-name">${esc(r.name)}</span><span class="qc-track"><i style="width:${Math.min(100, r.lift * 20)}%"></i></span><span class="qc-val">${r.lift.toFixed(1)}× · ${r.count}条</span></div>`).join("")}</div>` : "";
    return `<div class="comp-section">
      <div class="comp-sec-head"><span class="comp-sec-name">${esc(name)}</span><span class="comp-sec-badge">内容 ${itemsAll.length} · 平均爆款率 ${avgRate} · 爆款 ${topCount}</span></div>
      <div class="comp-meta">${m0.category ? `<span class="tag">${esc(m0.category)}</span>` : ""}${followers ? `<span class="comp-followers">👥 ${fmt(followers)} 粉丝</span>` : ""}${handles ? `<span class="comp-handles">${handles}</span>` : ""}</div>
      <div class="stat-row" style="margin:10px 0">
        <div class="stat"><div class="stat-label">内容量</div><div class="stat-val">${itemsAll.length}</div></div>
        <div class="stat"><div class="stat-label">平均爆款率</div><div class="stat-val" style="color:var(--hot)">${avgRate}</div></div>
        <div class="stat"><div class="stat-label">爆款数</div><div class="stat-val">${topCount}</div></div>
        <div class="stat"><div class="stat-label">总曝光</div><div class="stat-val">${fmt(totalExp)}</div></div>
        <div class="stat"><div class="stat-label">平均互动率</div><div class="stat-val">${avgEng}%</div></div>
      </div>
      <div class="comp-sub">内容排序列表${cf ? "（受形式 / 数据筛选约束）" : "（按爆款率 · 点开看原帖）"}</div>${contentHTML}
      <div class="comp-sub">用户对竞品的评价（最高赞）</div>${voiceHTML}
      <div class="comp-dims">${dimCards}</div>
      ${rhythmHTML}${burstHTML}
    </div>`;
  }
  /* 单品牌多维视图：顶部局部筛选条 + 深度整合 */
  function competitorDeep(data, name) {
    const cf = state.compFilters;
    const brandItems = data.filter((c) => c.account === name);
    const types = [...new Set(brandItems.map((c) => c.contentType))].sort();
    const typeChips = types.map((t) => `<span class="chip comp-type${cf.types.has(t) ? " on" : ""}" data-type="${esc(t)}">${esc(t)}</span>`).join("");
    const toolbar = `<div class="comp-toolbar">
      <div class="ct-group"><span class="ct-label">形式</span><div class="ct-chips" id="comp-type-chips">${typeChips || '<span style="color:var(--text-3);font-size:12px">无</span>'}</div></div>
      <div class="ct-group"><span class="ct-label">排序</span><select class="sel" id="comp-sort">
        <option value="viral"${cf.sort === "viral" ? " selected" : ""}>爆款率</option>
        <option value="engagement"${cf.sort === "engagement" ? " selected" : ""}>互动</option>
        <option value="exposure"${cf.sort === "exposure" ? " selected" : ""}>浏览/曝光</option>
      </select></div>
      <div class="ct-group ct-range"><span class="ct-label">爆款率≥</span><input type="range" id="comp-viral-min" min="0" max="100" value="${cf.viralMin}"><span class="ct-val" id="comp-viral-min-val">${cf.viralMin}</span></div>
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
    const compare = sel.length >= 2 ? renderBrandCompare(sel) : `<div class="dim-note">勾选 2 个及以上品牌，查看横向对比表与对标建议。</div>`;
    return `<div class="board-head"><div class="board-desc">${boardDesc("compare")}</div></div>
      <div class="dim-note">勾选多个品牌进行横向对比。</div>
      <div class="fp-chips" style="margin-bottom:16px">${chips}</div>
      ${compare}`;
  }
  function brandAgg(name, data) {
    const items = data.filter((c) => c.account === name);
    const c0 = items.length;
    const avgRate = c0 ? Math.round(items.reduce((s, c) => s + rate(c), 0) / c0) : 0;
    const topCount = items.filter((c) => c.isTop).length;
    const totalExp = items.reduce((s, c) => s + c.exposure, 0);
    const avgExp = c0 ? Math.round(totalExp / c0) : 0;
    const avgEng = c0 ? Math.round(items.reduce((s, c) => s + c.engagement, 0) / c0) : 0;
    const avgEngRate = c0 ? (items.reduce((s, c) => s + c.engagementRate, 0) / c0).toFixed(2) : 0;
    const metas = accountMeta(name);
    const followers = metas.reduce((s, a) => s + (a.followers || 0), 0);
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.account === name);
    const voiceCount = voices.length;
    const voiceLikes = voiceCount ? voices.reduce((s, v) => s + (v.likes || 0), 0) : 0;
    const voiceAvg = voiceCount ? Math.round(voiceLikes / voiceCount) : 0;
    const sent = { pos: 0, neu: 0, neg: 0 };
    voices.forEach((v) => { const s = (v.sentiment || ""); if (s.includes("赞美") || s.includes("共鸣") || s.toLowerCase().includes("pos")) sent.pos++; else if (s.includes("震惊") || s.includes("投诉") || s.toLowerCase().includes("neg") || s.includes("抱怨")) sent.neg++; else sent.neu++; });
    const top3 = [...items].sort((a, b) => b.viralScore - a.viralScore).slice(0, 3);
    const domType = groupRate(items, "contentType")[0];
    const domTopic = groupRate(items, "topicTags", true)[0];
    return { name, c0, avgRate, topCount, totalExp, avgExp, avgEng, avgEngRate, followers, voiceCount, voiceAvg, sent, top3, domType, domTopic };
  }
  function renderBrandCompare(sel) {
    if (sel.length < 2) return `<div class="dim-note">勾选 2 个及以上品牌，查看横向对比（数据 + Top3 内容 + 用户情况综合）。</div>`;
    const aggs = sel.map((b) => brandAgg(b.name, state.analysis.contents));
    const cards = aggs.map((a) => `<div class="cmp-brand-card">
      <div class="cmp-brand-head"><span class="cmp-brand-name">${esc(a.name)}</span><span class="cmp-brand-badge">${a.c0} 条 · 爆款 ${a.topCount}</span></div>
      <div class="dc-metrics" style="grid-template-columns:1fr 1fr 1fr;gap:8px 10px">
        <div class="dc-m"><span>平均爆款率</span><b style="color:var(--hot)">${a.avgRate}</b></div>
        <div class="dc-m"><span>总曝光</span><b>${fmt(a.totalExp)}</b></div>
        <div class="dc-m"><span>平均曝光</span><b>${fmt(a.avgExp)}</b></div>
        <div class="dc-m"><span>平均互动</span><b>${fmt(a.avgEng)}</b></div>
        <div class="dc-m"><span>互动率</span><b>${a.avgEngRate}%</b></div>
        <div class="dc-m"><span>粉丝</span><b>${fmt(a.followers)}</b></div>
      </div>
      <div class="cmp-user-row"><span class="cu-k">用户讨论</span><span class="cu-v">${a.voiceCount} 条 · 均赞 ${fmt(a.voiceAvg)}</span></div>
      <div class="cmp-user-row"><span class="cu-k">情绪分布</span><span class="cu-v">赞 ${a.sent.pos} · 中 ${a.sent.neu} · 负 ${a.sent.neg}</span></div>
      <div class="cmp-user-row"><span class="cu-k">主力形式</span><span class="cu-v">${a.domType ? esc(a.domType.name) + "（爆款率 " + a.domType.avgRate + "）" : "—"}</span></div>
      <div class="cmp-top3">
        <div class="cmp-top3-title">Top3 内容（按爆款率）</div>
        ${a.top3.map((c) => `<div class="cmp-top3-item"><div class="ct-text">${c.isTop ? "🔥 " : ""}${esc(dispText(c))}</div><div class="ct-meta">爆款率 ${rate(c)} · ${esc(c.contentType)} · ${fmt(c.exposure)} 曝光</div></div>`).join("")}
      </div>
    </div>`).join("");
    const best = aggs.slice().sort((a, b) => b.avgRate - a.avgRate)[0];
    const mostFollowers = aggs.slice().sort((a, b) => b.followers - a.followers)[0];
    const mostVoices = aggs.slice().sort((a, b) => b.voiceCount - a.voiceCount)[0];
    const benchmark = `<div class="bench-box"><b>对标建议：</b>以「${esc(best.name)}」为<b>爆款标杆</b>（平均爆款率 ${best.avgRate}）；「${esc(mostFollowers.name)}」粉丝体量最大（${fmt(mostFollowers.followers)}），适合做声量对标；「${esc(mostVoices.name)}」用户讨论最活跃（${mostVoices.voiceCount} 条），用户洞察优先看它。可重点观测发布频率、互动率、爆款形式占比，并据此设定追赶目标值。</div>`;
    return `<div class="cmp-grid">${cards}</div>${benchmark}`;
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
      const rs = $("#comp-reset"); if (rs) rs.addEventListener("click", () => { state.compFilters = { types: new Set(), sort: "viral", viralMin: 0, topOnly: false }; renderBoard(); });
    }
    if (state.board === "compare") {
      $$(".cmp-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
        const name = el.dataset.brand;
        if (state.cmpSel.has(name)) state.cmpSel.delete(name); else state.cmpSel.add(name);
        renderBoard();
      }));
    }
  }

  /* 平台维度 */
  function renderDimPlatform() {
    const data = getFiltered();
    const rows = aggregateByField(data, "platform");
    return `<div class="dim-note">同一维度下看各平台内容特点。点击卡片把全局筛选切到该平台。</div>
      <div class="dim-grid">${rows.map((p) => `<div class="dim-card" data-dfacet="platforms" data-dval="${esc(p.name)}">
        <div class="dc-top"><span class="dc-name">${esc(p.name)}</span></div>
        <div class="dc-metrics">
          <div class="dc-m"><span>内容</span><b>${p.count}</b></div>
          <div class="dc-m"><span>平均爆款率</span><b style="color:var(--hot)">${p.avgRate}</b></div>
          <div class="dc-m"><span>爆款数</span><b>${p.topCount}</b></div>
          <div class="dc-m"><span>总曝光</span><b>${fmt(p.totalExposure)}</b></div>
        </div>
        <div class="dc-platforms">${p.accounts.map((a) => `<span class="tag">${esc(a)}</span>`).join("")}</div>
      </div>`).join("")}</div>`;
  }

  /* 用户维度 */
  function renderDimUser() {
    const voices = (state.raw && state.raw.userVoices) || [];
    if (!voices.length) return `<div class="dim-note">暂无用户语料数据。接入评论抓取 / 飞书后，这里会展示最高赞用户评价、原帖链接与语料库。</div>` + emptyState("用户语料待接入");
    const sorted = [...voices].sort((a, b) => b.likes - a.likes);
    const cards = sorted.map((v) => `<div class="uv-card">
      <div class="uv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes)}</span></div>
      <div class="uv-text">${esc(dispVoice(v))}</div>
      <div class="uv-meta">${esc(v.account)} · ${esc(v.platform)}</div>
      <a class="uv-link" href="${esc(v.originalLink)}" target="_blank" rel="noreferrer">查看原帖 ↗</a>
    </div>`).join("");
    return `<div class="dim-note">单独看用户：最高赞用户评价 + 原帖链接。下方「用户语料 skill」为规划中的独立交付。</div>
      <div class="dim-grid uv-grid">${cards}</div>
      <div class="panel" style="margin-top:16px"><div class="panel-title">用户语料 skill（规划中）</div><div class="panel-sub">学习美国用户语言、提炼本土化表达——需接入 GPT 语料分析，后续以独立 skill 交付；也可结合品牌方发送内容做品牌本土化 skill。</div></div>`;
  }

  /* 内容形式维度（含风格 / 原「情绪」） */
  function renderDimFormat() {
    const data = getFiltered();
    const types = aggregateByField(data, "contentType");
    const styles = aggregateByField(data, "emotion");
    const typeCards = types.map((t) => fmtDimCard(t, "types", "形式")).join("");
    const styleCards = styles.map((s) => fmtDimCard(s, "emotions", "风格")).join("");
    return `<div class="dim-note">内容形式维度（含风格 / 原「情绪」）：形式看 ROI，风格看情绪调性表现。点击卡片加入全局筛选。</div>
      <div class="dim-subtitle">内容形式</div><div class="dim-grid">${typeCards}</div>
      <div class="dim-subtitle">风格 / 情绪调性</div><div class="dim-grid">${styleCards}</div>`;
  }

  /* 主题维度（权重可调） */
  function renderDimTopic() {
    const w = state.topicWeights;
    const labels = { viral: "爆款率", eng: "参与度", rec: "时效", cov: "内容量" };
    const sliders = `<div class="weight-panel" id="weight-panel">
      <div class="wp-title">综合爆款潜力分 · 默认权重可调（拖动实时重算）</div>
      <div class="wp-rows">${["viral", "eng", "rec", "cov"].map((k) => `<div class="wp-row"><label>${labels[k]}</label><input type="range" class="wslider" data-w="${k}" min="0" max="100" value="${w[k]}"><span class="wp-val" id="wp-${k}">${w[k]}</span></div>`).join("")}</div>
    </div>`;
    return `<div class="dim-note">主题维度下钻：每个主题的爆款率、参与度、时效、内容量，及按权重合成的「综合爆款潜力分」。拖动滑块自定义权重，实时重算排序。</div>
      ${sliders}
      <div id="topic-grid" class="dim-grid">${topicGridHTML()}</div>`;
  }
  function topicGridHTML() {
    const data = getFiltered();
    const topics = aggregateByField(data, "topicTags");
    if (!topics.length) return emptyState("当前筛选下无主题数据");
    const dates = topics.map((t) => t.latest).filter(Boolean).sort();
    const minD = dates[0], maxD = dates[dates.length - 1];
    const maxCount = Math.max(...topics.map((t) => t.count), 1);
    const w = state.topicWeights;
    const wsum = w.viral + w.eng + w.rec + w.cov || 1;
    const scored = topics.map((t) => {
      const viralN = t.avgRate;
      const engN = Math.min(100, t.avgEng * 10);
      const recN = (maxD && minD && maxD !== minD) ? ((new Date(t.latest) - new Date(minD)) / (new Date(maxD) - new Date(minD)) * 100) : 50;
      const covN = (t.count / maxCount) * 100;
      const composite = (viralN * w.viral + engN * w.eng + recN * w.rec + covN * w.cov) / wsum;
      return { ...t, viralN, engN, recN, covN, composite: Math.round(composite) };
    }).sort((a, b) => b.composite - a.composite);
    return scored.map((t) => `<div class="dim-card topic-card" data-dfacet="topics" data-dval="${esc(t.name)}">
      <div class="dc-top"><span class="dc-name">${esc(t.name)}</span><span class="dc-composite">${t.composite}</span></div>
      <div class="dc-bars">
        ${barHTML("爆款率", t.viralN)}
        ${barHTML("参与度", t.engN)}
        ${barHTML("时效", t.recN)}
        ${barHTML("内容量", t.covN)}
      </div>
      <div class="dc-metrics"><div class="dc-m"><span>内容</span><b>${t.count}</b></div><div class="dc-m"><span>爆款数</span><b>${t.topCount}</b></div><div class="dc-m"><span>总曝光</span><b>${fmt(t.totalExposure)}</b></div></div>
    </div>`).join("");
  }

  function bindDimensions() {
    $$(".dim-tab").forEach((b) => b.addEventListener("click", () => { state.dim = b.dataset.dim; renderBoard(); }));
    $$(".brand-card").forEach((el) => el.addEventListener("click", (e) => {
      if (e.target.closest("[data-only]")) return;
      const name = el.dataset.brand;
      if (state.dimBrands.has(name)) state.dimBrands.delete(name); else state.dimBrands.add(name);
      renderBoard();
    }));
    $$("[data-only]").forEach((btn) => btn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.filters.accounts.clear(); state.filters.accounts.add(btn.dataset.only); onFilterChange();
    }));
    $$("[data-dfacet]").forEach((el) => el.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = el.dataset.dfacet, val = el.dataset.dval;
      const set = state.filters[key];
      if (set && !set.has(val)) { set.add(val); onFilterChange(); } else if (set) toast("已筛选：" + val);
    }));
    $$(".wslider").forEach((s) => s.addEventListener("input", () => {
      state.topicWeights[s.dataset.w] = +s.value;
      const lbl = $("#wp-" + s.dataset.w); if (lbl) lbl.textContent = s.value;
      const g = $("#topic-grid"); if (g) g.innerHTML = topicGridHTML();
    }));
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
          ${c.topicTags.map((t) => `<span class="tag topic">${esc(t)}</span>`).join("")}</div>
        <div class="dr-metrics">
          <div class="dr-metric"><div class="dm-k">爆款率</div><div class="dm-v" style="color:var(--hot)">${rate(c)}</div></div>
          <div class="dr-metric"><div class="dm-k">曝光</div><div class="dm-v">${fmt(c.exposure)}</div></div>
          <div class="dr-metric"><div class="dm-k">互动</div><div class="dm-v">${fmt(c.engagement)}</div></div>
          <div class="dr-metric"><div class="dm-k">互动率</div><div class="dm-v">${c.engagementRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">点赞率</div><div class="dm-v">${c.likeRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">评论率</div><div class="dm-v">${c.commentRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">转发率</div><div class="dm-v">${c.shareRate.toFixed(2)}%</div></div>
          <div class="dr-metric"><div class="dm-k">发布时间</div><div class="dm-v" style="font-size:14px">${c.publishDate}</div></div>
        </div>
        <div class="dr-section-title">评论质量分布</div>
        ${Object.entries(qc).map(([k, v]) => `<div class="qc-bar"><span class="qc-name">${esc(k)}</span><span class="qc-track"><i style="width:${(v / maxQ) * 100}%"></i></span><span class="qc-val">${v}</span></div>`).join("") || '<div style="color:var(--text-3);font-size:12.5px">无数据</div>'}
        <div class="dr-section-title">品牌互动</div>
        <div style="font-size:13px;color:var(--text-2);line-height:1.7">品牌回复 ${c.brandReplies} 条 · 平均回复时长 ${c.avgReplyTimeMinutes ? c.avgReplyTimeMinutes + " 分钟" : "—"}${c.post_link ? ` · <a class="dr-link" href="${esc(c.post_link)}" target="_blank" rel="noreferrer">查看原帖 ↗</a>` : ""}</div>
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
爆款率：${rate(c)} · 曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 互动率 ${c.engagementRate.toFixed(2)}%
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
    // 该账号形式爆款率分布（用于迷你条形）
    const byType = {};
    acctItems.forEach((x) => { (byType[x.contentType] = byType[x.contentType] || []).push(x); });
    const typeBreak = Object.entries(byType).map(([name, items]) => ({
      name, count: items.length,
      avgRate: items.length ? Math.round(items.reduce((s, x) => s + rate(x), 0) / items.length) : 0,
    })).sort((a, b) => b.avgRate - a.avgRate);
    return { typeRate, acctRate, typeShare, typeCount: typeItems.length, acctCount: acctItems.length, typeBreak };
  }
  function deepContextText(c) {
    const sim = similarContents(c).slice(0, 3).map((s) => `· ${dispText(s.item)}（爆款率 ${rate(s.item)}，共享主题 ${s.shared.join("、") || "—"}）`).join("\n");
    return `【单帖深度分析】
内容：${dispText(c)}
账号/平台：${c.account} / ${c.platform} · 形式：${c.contentType} · 风格：${c.emotion}
主题：${c.topicTags.join("、") || "—"} · 发布：${c.publishDate}
爆款率：${rate(c)} · 曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 互动率 ${c.engagementRate.toFixed(2)}%
—— 请帮我 ——
1) 这条内容为什么能爆（可复用要素：形式/钩子/主题/情绪）；
2) 它与下面同类内容的差异与可借鉴点：
${sim || "（无同主题关联帖）"}
3) 结合该账号的风格/形式分布，给我 2-3 个延展选题建议。`;
  }
  function openDeepAnalysis(id) {
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
    // 风格 / 形式
    const styleCards = `
      <div class="dp-style-grid">
        <div class="dp-style-card"><div class="ds-k">内容形式</div><div class="ds-v">${esc(c.contentType)}</div><div class="ds-sub">该账号占比 ${sc.typeShare}% · ${sc.typeCount}/${sc.acctCount} 条</div></div>
        <div class="dp-style-card"><div class="ds-k">风格 / 情绪调性</div><div class="ds-v">${esc(c.emotion)}</div></div>
        <div class="dp-style-card"><div class="ds-k">平台</div><div class="ds-v">${esc(c.platform)}</div></div>
        <div class="dp-style-card"><div class="ds-k">发布时间</div><div class="ds-v">${c.publishDate}</div><div class="ds-sub">${c.publishHour}:00 时段</div></div>
      </div>
      <div class="dp-cmp-note">该形式在 <b>${esc(c.account)}</b> 账号内的平均爆款率 <b style="color:var(--hot)">${sc.typeRate}</b>，对比账号整体平均 <b>${sc.acctRate}</b> —— ${sc.typeRate >= sc.acctRate ? "这种形式在该账号表现优于平均，值得借鉴" : "这种形式在该账号表现低于平均，可优化或换形式"}。</div>`;
    // 该账号形式分布（小条形）
    const typeBreakRows = sc.typeBreak.slice(0, 6).map((t) => {
      const r = t.avgRate;
      return `<div class="qc-bar"><span class="qc-name" style="width:70px">${esc(t.name)}</span><span class="qc-track"><i style="width:${r}%"></i></span><span class="qc-val">${r}</span></div>`;
    }).join("");
    const typeBreakHTML = typeBreakRows ? `<div class="dp-cmp-note" style="margin-top:14px"><b>${esc(c.account)}</b> 的形式爆款率分布：</div>${typeBreakRows}` : "";
    // 用户讨论
    let voiceHTML;
    if (voices.mode === "none") {
      voiceHTML = `<div class="dp-novoice">暂无该内容的用户讨论数据（用户语料/评论抓取接入后自动出现）。</div>`;
    } else {
      const label = voices.mode === "exact" ? "该帖下的用户回复（按点赞）" : `该账号（${esc(c.account)}）下的用户讨论（按点赞，最高赞）`;
      voiceHTML = `<div class="dp-sec-title" style="margin-top:4px">${label}</div><div class="dp-voice-grid">${voices.items.slice(0, 6).map((v) => `<div class="dp-voice">
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
        <div class="dp-sim-meta">${esc(s.item.account)} · ${esc(s.item.contentType)} · 爆款率 ${rate(s.item)} · ${s.shared.map((t) => `<span class="tag topic">${esc(t)}</span>`).join(" ")}</div>
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
        <div class="dp-sec-title">风格 / 形式 <span class="dp-sec-note">这条内容「长什么样、用什么调性」</span></div>
        ${styleCards}${typeBreakHTML}
      </div>
      <div class="dp-section">
        <div class="dp-sec-title">用户回复 / 讨论 <span class="dp-sec-note">用户怎么评价它（最高赞）</span></div>
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
      <div class="dp-cmp-col-head"><span class="dp-cmp-col-name">${esc(p.account)}</span><span class="dp-cmp-col-rate">爆款率 ${rate(p)}</span></div>
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
      const txt = state.deepView === "compare" ? deepContextText(c) + "\n\n【多帖同看对比】\n" + state.deepCompare.map((id) => { const p = state.analysis.contents.find((x) => x.id === id); return p ? `· ${dispText(p)}（爆款率 ${rate(p)}）` : ""; }).join("\n") : deepContextText(c);
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
    // 卡片 / 列表点击 → 抽屉
    $$("[data-id]", $("#board")).forEach((el) => el.addEventListener("click", (e) => {
      if (e.target.closest("[data-facet]")) return; // 标签点击走筛选
      openDrawer(el.dataset.id);
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
      $$("#view-seg button").forEach((b) => b.addEventListener("click", () => { state.view = b.dataset.view; renderBoard(); }));
      const ss = $("#sort-sel"); if (ss) ss.addEventListener("change", () => { state.sort = ss.value; renderBoard(); });
      $$("#lib-mode button").forEach((b) => b.addEventListener("click", () => { state.libMode = b.dataset.mode; renderBoard(); }));
      $$("#lib-eval button").forEach((b) => b.addEventListener("click", () => { state.libQuick = b.dataset.eval; renderBoard(); }));
      const rs = $("#lib-reshuffle"); if (rs) rs.addEventListener("click", () => renderBoard());
    }
    // 参考建议中枢
    if (state.board === "reference") bindReference();
    // 维度透视（了解用户 3 项）
    if (["format", "topic", "platform"].includes(state.board)) bindDimensions();
    // 竞品内容库 / 多品牌对比
    if (["competitor", "compare"].includes(state.board)) bindCompetitor();
    // 我方运营
    if (state.board === "myops") bindMyOps();
    // 了解用户：用户讨论与语言（富用户分析中枢）
    if (state.board === "uservoice") bindUserBoard();
  }

  /* ============ 每板块整体洞察 ============ */
  function copyText(t) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => {}, () => fallbackCopy(t));
      else fallbackCopy(t);
    } catch (e) { fallbackCopy(t); }
  }
  function fallbackCopy(t) {
    const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }
  function filtersDesc() {
    const f = state.filters; const parts = [];
    if (f.search) parts.push(`搜索「${f.search}」`);
    FACETS.forEach((fc) => { if (f[fc.key].size) parts.push(`${fc.label}:${[...f[fc.key]].join("/")}`); });
    if (f.viralMin > 0) parts.push(`爆款率≥${f.viralMin}`);
    if (f.dateFrom) parts.push(`起${f.dateFrom}`);
    if (f.dateTo) parts.push(`止${f.dateTo}`);
    if (f.topOnly) parts.push("只看爆款");
    return parts.join("，") || "无";
  }
  function sectionItems(boardId) {
    let items = getFiltered();
    if (boardId === "competitor" && state.compSel.size) items = items.filter((c) => state.compSel.has(c.account));
    if (boardId === "compare" && state.cmpSel.size) items = items.filter((c) => state.cmpSel.has(c.account));
    return items;
  }
  function autoSummary(items) {
    const n = items.length;
    if (!n) return null;
    const avg = Math.round(items.reduce((s, c) => s + rate(c), 0) / n);
    const tops = items.filter((c) => c.isTop).length;
    const grpAvg = (key, multi) => {
      const m = new Map();
      items.forEach((c) => {
        const vals = multi ? (c[key] || []) : [c[key]];
        vals.forEach((v) => { if (v) m.set(v, (m.get(v) || 0) + rate(c)); });
      });
      let best = null, bv = -1;
      m.forEach((sum, k) => {
        const cnt = items.filter((c) => { const vals = multi ? (c[key] || []) : [c[key]]; return vals.includes(k); }).length;
        const a = sum / Math.max(1, cnt);
        if (a > bv) { bv = a; best = k; }
      });
      return best ? { name: best, avg: Math.round(bv) } : null;
    };
    return { n, avg, tops, topType: grpAvg("contentType", false), topTopic: grpAvg("topicTags", true), topEmo: grpAvg("emotion", false), topAcc: grpAvg("account", false), best: items.slice().sort((a, b) => rate(b) - rate(a))[0] };
  }
  function aiCard(title, t, d) {
    return `<div class="icard"><h4><span class="ic-dot"></span>${esc(title)}</h4><ul><li>${t ? `<b>${esc(t)}</b> — ` : ""}${esc(d || "")}</li></ul></div>`;
  }
  function renderSectionInsight(boardId) {
    if (boardId === "myops" || boardId === "insights") return "";
    const items = sectionItems(boardId);
    const s = autoSummary(items);
    const ins = state.insights;
    let aiHTML = "";
    if (ins) {
      const want = ["library", "reference", "format", "topic", "platform"].includes(boardId)
        ? { feat: true, dir: true, actions: true }
        : (["competitor", "compare"].includes(boardId) ? { risks: true, insights: true, actions: true } : { insights: true });
      const cards = [];
      if (want.feat) (ins.hitFeatures || []).slice(0, 3).forEach((f) => cards.push(aiCard("爆款共性", f.title, f.detail)));
      if (want.dir) (ins.directions || []).slice(0, 3).forEach((d) => cards.push(aiCard("选题方向", d.title, d.why)));
      if (want.risks) (ins.risks || []).slice(0, 3).forEach((x) => cards.push(aiCard("风险提示", "", x)));
      if (want.insights) (ins.insights || []).slice(0, 3).forEach((x) => cards.push(aiCard("关键洞察", "", x)));
      if (want.actions) (ins.nextActions || []).slice(0, 3).forEach((x) => cards.push(aiCard("下一步", "", x)));
      if (cards.length) aiHTML = `<div class="si-ai"><div class="si-ai-head">🤖 AI 洞察（定时管线生成${ins.generatedAt ? ` · ${esc(ins.generatedAt)}` : ""}）</div><div class="insight-grid">${cards.join("")}</div></div>`;
    }
    const autoHTML = s
      ? `<div class="si-auto"><div class="si-auto-line">当前共 <b>${s.n}</b> 条内容（受全局筛选约束），平均爆款率 <b>${s.avg}%</b>，其中爆款 <b>${s.tops}</b> 条${s.topType ? `；最佳形式「<b>${esc(s.topType.name)}</b>」(均 ${s.topType.avg}%)` : ""}${s.topTopic ? `、最热主题「<b>${esc(s.topTopic.name)}</b>」` : ""}${s.topEmo ? `、主导情绪「<b>${esc(s.topEmo.name)}</b>」` : ""}${s.topAcc ? `；头部账号「<b>${esc(s.topAcc.name)}</b>」` : ""}。</div>${s.best ? `<div class="si-auto-line hi">爆款代表：<b>${esc(s.best.account)}</b> 的《${esc(dispText(s.best).slice(0, 46))}…》爆款率 <b>${rate(s.best)}%</b>。</div>` : ""}</div>`
      : `<div class="si-auto"><div class="si-auto-line uv-muted">当前筛选下没有内容，无法生成整体洞察。</div></div>`;
    return `<section class="section-insight">
      <div class="si-head"><span class="si-title">📊 板块整体洞察</span><button class="si-btn" data-insight-copy="${boardId}">✨ 一键总结（复制上下文给 AI）</button></div>
      ${autoHTML}
      ${aiHTML}
    </section>`;
  }
  function bindSectionInsight() {
    $$("[data-insight-copy]").forEach((b) => b.addEventListener("click", () => {
      const boardId = b.dataset.insightCopy;
      const items = sectionItems(boardId);
      const s = autoSummary(items);
      const name = (BOARDS.find((x) => x.id === boardId) || {}).name || boardId;
      const af = activeFilterCount() ? filtersDesc() : "无";
      let ctx = `【板块：${name} · 整体洞察】\n当前内容：${s ? s.n : 0} 条，平均爆款率 ${s ? s.avg : 0}%，爆款 ${s ? s.tops : 0} 条\n全局筛选：${af}\n`;
      const top5 = items.slice().sort((a, b) => rate(b) - rate(a)).slice(0, 5);
      ctx += "Top 内容（前5）：\n" + top5.map((c, i) => `${i + 1}. ${c.account} · ${c.platform} · ${c.contentType} · ${c.emotion} · 爆款率${rate(c)}% · 曝光${fmt(c.exposure)}\n   ${dispText(c).slice(0, 80)}`).join("\n");
      ctx += `\n请基于以上数据，给出该板块的「整体洞察」：趋势 / 机会 / 风险 / 下一步建议（分点、可落地）。`;
      copyText(ctx);
      toast("已复制上下文，去对话框粘贴给我即可");
    }));
  }

  function bindUserBoard() {
    $$(".uv-tab", $("#board")).forEach((b) => b.addEventListener("click", () => {
      state.uvTab = b.dataset.uv; renderBoard();
    }));
    const rt = $("[data-uv-rank-toggle]", $("#board"));
    if (rt) rt.addEventListener("click", () => { state.uvRankAll = !state.uvRankAll; renderBoard(); });
    // 美式本土化表达库：按标记筛选
    $$(".uv-loc-chip", $("#board")).forEach((el) => el.addEventListener("click", () => {
      state.uvLocMarker = el.dataset.loc; renderBoard();
    }));
    // 导出按钮
    $$("[data-uvx]", $("#board")).forEach((el) => el.addEventListener("click", () => { uvExportCorpus(el.dataset.uvx); }));
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
    // 爆款率下限
    $("#viral-min").addEventListener("input", (e) => { state.filters.viralMin = +e.target.value; $("#viral-min-val").textContent = e.target.value; onFilterChange(); });
    // 时间范围
    $("#date-from").addEventListener("change", (e) => { state.filters.dateFrom = e.target.value; onFilterChange(); });
    $("#date-to").addEventListener("change", (e) => { state.filters.dateTo = e.target.value; onFilterChange(); });
    // 只看爆款
    $("#top-only").addEventListener("change", (e) => { state.filters.topOnly = e.target.checked; onFilterChange(); });
    // 抽屉关闭
    $("#drawer-overlay").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if ($("#deep-modal").classList.contains("show")) closeDeep(); else closeDrawer(); } });
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
  }
  function renderBlindboxFloat() { initBlindboxFloat(false); }

  /* ============ 初始化 ============ */
  async function init() {
    const data = await DataLoader.load();
    state.raw = data;
    state.analysis = A.analyze(data.contents);
    state.maxViral = Math.max(...state.analysis.contents.map((c) => c.viralScore), 0.0001);
    state.maxExposure = Math.max(...state.analysis.contents.map((c) => c.exposure), 1);
    state.users = await DataLoader.loadUsers();
    state.backtests = loadBacktests();
    state.insights = await DataLoader.loadInsights();
    // 数据源标记
    const pill = $("#src-pill");
    if (data.meta && data.meta.source === "feishu") { pill.textContent = "飞书实时"; pill.classList.add("live"); }
    else if (data.meta && data.meta.source === "real") { pill.textContent = "真实数据"; pill.classList.add("live"); }
    else { pill.textContent = "演示数据"; pill.classList.remove("live"); }
    $("#last-updated") && ($("#last-updated").textContent = "");
    // 时间范围默认值
    if (data.meta && data.meta.date_range) { /* 可选：预设 */ }
    renderNav();
    renderFilterPanel();
    bindGlobal();
    syncFilterUI();
    renderActiveFilters();
    renderBoard();
    initBlindboxFloat(true);
  }
  init();
})();
