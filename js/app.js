/* ============ 内容灵感台 · 交互核心 ============ */
(function () {
  "use strict";
  const A = window.Analysis;

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
    // —— 找灵感 ——
    { id: "blindbox", name: "每日盲盒", group: "找灵感", desc: "每天开 3 张灵感卡，翻一张看：品牌 / 内容形式 / 内容 / 数据情况 / 可借鉴方式 / 最高赞用户评价。可生图。" },
    { id: "library", name: "灵感库", group: "找灵感", desc: "全部内容的灵感库。可随机浏览，也可按爆款率 / 曝光 / 互动 / 类型 ROI 多指标排序与筛选；一键只看爆款(Top10%)。点标签加筛选，点卡片看详情。" },
    // —— 看参考建议 ——
    { id: "reference", name: "参考建议", group: "看参考建议", desc: "一个工具两个方向：有想法→评估质量（多维评分卡 + 用户风评）；没灵感→输入目的主动推荐参考内容。还有回测校准准确率。" },
    { id: "insights", name: "AI 洞察", group: "看参考建议", desc: "定时管线由大模型生成的选题方向 / 爆款特征 / 行动建议，打开即看。" },
    // —— 看竞品 ——
    { id: "competitor", name: "竞品内容库", group: "看竞品", desc: "选择竞品 → 进入该竞品的深度整合分析：它的内容、用户对它的评价、数据表现、运营节奏（频率×表现、Campaign）一站式呈现。" },
    { id: "compare", name: "多品牌对比", group: "看竞品", desc: "勾选多个品牌横向对比：内容量 / 爆款率 / 曝光 / 互动，找出标杆与差距。" },
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
    filters: { search: "", accounts: new Set(), platforms: new Set(), types: new Set(), topics: new Set(), emotions: new Set(), viralMin: 0, dateFrom: "", dateTo: "", topOnly: false },
    sort: "viral", view: "grid",
    topThreshold: 0,
    freqMode: "week",
    roiSort: "rate",
    campaignSort: "lift",
    detailId: null, predictor: null,
    dim: "brand", dimBrands: new Set(), topicWeights: { viral: 35, eng: 25, rec: 20, cov: 20 },
    blindbox: null, refMode: "eval", backtests: [], maxExposure: 1,
    users: null, uvTab: "framework", uvCorpusQ: "", uvRankAll: false,
    libMode: "sort", libQuick: "all",
    compSel: new Set(), cmpSel: new Set(),
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
      case "blindbox": html = renderBlindbox(data); break;
      case "library": html = renderLibrary(data); break;
      case "reference": html = renderReference(); break;
      case "insights": html = renderInsights(); break;
      case "competitor": html = renderCompetitorLib(); break;
      case "compare": html = renderCompareBoard(); break;
      case "uservoice": html = renderUserBoard(); break;
      case "format": html = renderDimFormat(); break;
      case "topic": html = renderDimTopic(); break;
      case "platform": html = renderDimPlatform(); break;
      case "myops": html = renderMyOps(); break;
    }
    $("#board").innerHTML = html;
    bindBoard(data);
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
      <div class="card-text">${esc(c.text)}</div>
      <div class="card-meta">${c.topicTags.map((t) => `<span class="tag topic" data-facet="topics" data-val="${esc(t)}">${esc(t)}</span>`).join("")}</div>
      <div class="card-meta"><span>${esc(c.platform)}</span><span class="dot"></span><span>${c.publishDate}</span><span class="dot"></span><span>${esc(c.emotion)}</span></div>
      <div class="card-score"><span class="score-num">${rate(c)}<small>/100</small></span><div class="score-bar"><i style="width:${rate(c)}%"></i></div></div>
    </div>`;
  }
  function listHTML(c) {
    return `<div class="list-row" data-id="${c.id}">
      <div><div class="lr-text">${esc(c.text)}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${c.publishDate}</div></div>
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
      <div><div class="lr-text">${i < 3 ? "🔥 " : ""}${esc(c.text)}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div>
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
      <div><div class="lr-text">${esc(c.text)}</div><div class="lr-sub">${esc(c.account)} · ${esc(c.contentType)} · ${c.topicTags.join("/")}</div></div>
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
        <div class="match-text">${esc(c.text)}</div>
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
      return `- ${c.text}（${c.account} · ${c.contentType} · 爆款率 ${viralRate} · 匹配原因：${c.matchReason}）`;
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

  /* ---------- AI 洞察 ---------- */
  function renderInsights() {
    const ins = state.insights;
    if (!ins) return `<div class="board-head"><div class="board-desc">${boardDesc("insights")}</div></div>` + emptyState("洞察报告尚未生成（定时管线运行后会自动出现）");
    const dir = (ins.directions || []).map((d) => `<li><b>${esc(d.title)}</b> — ${esc(d.why)}<div class="dir-ex">示例：${esc(d.example || "")}</div></li>`).join("");
    const feat = (ins.hitFeatures || []).map((f) => `<li><b>${esc(f.title)}</b> — ${esc(f.detail)}</li>`).join("");
    const lists = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join("");
    return `<div class="board-head"><div class="board-desc">${boardDesc("insights")} · 生成于 ${esc(ins.generatedAt || "")}</div></div>
      <div class="insight-summary">${esc(ins.summary || "")}</div>
      <div class="insight-grid">
        <div class="icard"><h4><span class="ic-dot"></span>爆款共性特征</h4><ul>${feat || '<li>暂无</li>'}</ul></div>
        <div class="icard"><h4><span class="ic-dot"></span>选题方向</h4><ul>${dir || '<li>暂无</li>'}</ul></div>
        <div class="icard"><h4><span class="ic-dot"></span>关键洞察</h4><ul>${lists(ins.insights)}</ul></div>
        <div class="icard"><h4><span class="ic-dot"></span>风险提示</h4><ul>${lists(ins.risks)}</ul></div>
        <div class="icard" style="grid-column:1/-1"><h4><span class="ic-dot"></span>下一步行动</h4><ul>${lists(ins.nextActions)}</ul></div>
      </div>`;
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
  function renderBlindbox(data) {
    const pool = data && data.length ? data : state.analysis.contents;
    state.blindbox = sampleN(pool, 3).map((c) => ({ c, rarity: rollRarity(), flipped: false }));
    const cards = state.blindbox.map((p, i) => {
      const c = p.c;
      const v = topVoiceFor(c);
      const cover = c.image
        ? `<img class="bx-cover-img" src="${esc(c.image)}" alt="">`
        : `<div class="bx-cover-grad"><div class="bx-cover-brand">${esc(c.account)}</div><div class="bx-cover-type">${esc(c.contentType)}</div></div>`;
      const voiceHTML = v
        ? `<div class="bx-voice"><div class="bx-voice-head">最高赞用户评价 · <span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span> <span class="uv-likes">♥ ${fmt(v.likes)}</span></div><div class="bx-voice-text">${esc(v.text)}</div><a class="uv-link" href="${esc(v.originalLink || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>`
        : `<div class="bx-voice bx-muted">暂无该内容的用户评价数据</div>`;
      return `<div class="bx-card face-down" data-bx="${i}">
        <div class="bx-face bx-front">${cover}<div class="bx-front-foot"><div class="bx-q">?</div><div class="bx-hint">点击翻牌</div></div></div>
        <div class="bx-face bx-back">
          <div class="bx-rarity ${p.rarity.cls}">${p.rarity.label}</div>
          <div class="bx-reveal">
            <div class="bx-row"><span class="bx-k">品牌</span><span class="bx-v">${esc(c.account)}</span></div>
            <div class="bx-row"><span class="bx-k">内容形式</span><span class="bx-v">${esc(c.contentType)}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">内容</span><span class="bx-v">${esc(c.text)}</span></div>
            <div class="bx-row"><span class="bx-k">数据情况</span><span class="bx-v">曝光 ${fmt(c.exposure)} · 互动 ${fmt(c.engagement)} · 爆款率 ${rate(c)}${c.isTop ? " · 🔥爆款" : ""}</span></div>
            <div class="bx-row bx-row-text"><span class="bx-k">可借鉴</span><span class="bx-v">${esc(borrowTip(c))}</span></div>
            ${voiceHTML}
          </div>
          <div class="bx-actions"><button class="mini-btn" data-use="${c.id}">点开详情</button><button class="mini-btn ghost" data-gen="${c.id}">生图</button></div>
        </div></div>`;
    }).join("");
    return `<div class="board-head"><div class="board-desc">${boardDesc("blindbox")}</div></div>
      <div class="blindbox-bar"><button class="btn-primary" id="bx-redraw">🎲 重新抽 3 张</button><span class="bx-tip">稀有度：普通 60% · 稀有 30% · 金色传说 10%</span></div>
      <div class="blindbox-grid">${cards}</div>`;
  }
  function bindBlindbox() {
    const rd = $("#bx-redraw"); if (rd) rd.addEventListener("click", () => renderBoard());
    $$(".bx-card.face-down").forEach((el) => el.addEventListener("click", () => { el.classList.remove("face-down"); el.classList.add("flipped"); }));
    $$("[data-use]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openDrawer(b.dataset.use); }));
    $$("[data-gen]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); toast("生图功能待接入小云雀（届时用你提供的图片生成背面配图）"); }));
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
  function renderFind() {
    const chips = GOAL_PRESETS.map((g) => `<button class="chip ec-chip" data-goal="${g.id}">${g.name}</button>`).join("");
    return `<div class="predictor-wrap">
      <div class="board-desc" style="margin-bottom:10px">输入你的<strong>运营目的</strong>（如卖货、获取测评用户），工具按目的主动推荐匹配的历史内容，并给出匹配理由与指标——区别于灵感库的被动浏览。</div>
      <div class="example-chips"><span class="ec-label">常用目的：</span>${chips}
        <input id="goal-free" class="goal-input" placeholder="或输入自定义目的…" /></div>
      <div class="predictor-input"><button class="btn-primary" id="find-btn">推荐参考内容</button></div>
      <div class="predict-result" id="find-result"></div></div>`;
  }
  function goalScore(c, g) {
    const w = g.w; let s = 0; const reasons = [];
    if (w.engagement) { s += Math.min(40, c.engagementRate * 8 * w.engagement); if (c.engagementRate > 1) reasons.push(`互动率 ${c.engagementRate.toFixed(2)}%`); }
    if (w.exposure) { const eN = state.maxExposure ? Math.min(100, (c.exposure / state.maxExposure) * 100) : 0; s += eN * 0.4 * w.exposure; if (c.exposure > 0) reasons.push(`曝光 ${fmt(c.exposure)}`); }
    if (w.activity && c.isActivity) { s += 15 * w.activity; reasons.push("活动/促销型内容"); }
    if (w.shares) { const sr = c.exposure ? (c.shares / c.exposure) * 100 : 0; s += Math.min(20, sr * w.shares); reasons.push(`转发 ${fmt(c.shares)}`); }
    if (w.collections) { const cr = c.exposure ? (c.collections / c.exposure) * 100 : 0; s += Math.min(15, cr * w.collections); reasons.push(`收藏 ${fmt(c.collections)}`); }
    if (g.emotion && g.emotion.includes(c.emotion)) { s += 12; reasons.push(`情绪「${c.emotion}」契合`); }
    if (g.type && g.type.includes(c.contentType)) { s += 12; reasons.push(`形式「${c.contentType}」契合`); }
    if (g.id === "review" && c.commentQuality && (c.commentQuality["提问"] || 0) > 0) { s += 10; reasons.push("含用户提问/讨论"); }
    return { score: Math.round(Math.min(100, s)), reasons };
  }
  function bindFind() {
    $$("[data-goal]").forEach((b) => b.addEventListener("click", () => { $("#goal-free").value = b.dataset.goal; runFind(b.dataset.goal); }));
    const fb = $("#find-btn"); if (fb) fb.addEventListener("click", () => {
      const v = ($("#goal-free").value || "").trim();
      const preset = GOAL_PRESETS.find((g) => g.id === v) || GOAL_PRESETS.find((g) => v.indexOf(g.name) >= 0) || null;
      runFind(preset ? preset.id : null, v);
    });
  }
  function runFind(presetId, freeText) {
    const data = getFiltered();
    const g = GOAL_PRESETS.find((x) => x.id === presetId) || null;
    const label = g ? g.name : (freeText || "自定义目的");
    const scored = data.map((c) => {
      const r = g ? goalScore(c, g) : { score: Math.round(Math.min(100, c.engagementRate * 6 + (state.maxExposure ? (c.exposure / state.maxExposure) * 30 : 0))), reasons: ["综合互动与曝光表现"] };
      return { c, ...r };
    }).sort((a, b) => b.score - a.score).slice(0, 8);
    const box = $("#find-result");
    if (!scored.length) { box.innerHTML = emptyState(); return; }
    box.innerHTML = `<div class="find-intro">为「<b>${esc(label)}</b>」推荐 ${scored.length} 条最匹配的历史内容（按目的匹配度排序）：</div>
      <div class="match-grid">${scored.map(({ c, score, reasons }) => `<div class="match-card" data-id="${c.id}">
        <div class="match-card-top"><span class="badge-top">匹配 ${score}</span></div>
        <div class="match-text">${esc(c.text)}</div>
        <div class="match-meta">${esc(c.account)} · ${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div>
        <div class="match-reason"><span>为何推荐：</span>${esc(reasons.join("；"))}</div>
        <div class="match-mini-metrics"><span>爆款率 <b>${rate(c)}</b></span><span>曝光 <b>${fmt(c.exposure)}</b></span><span>互动 <b>${fmt(c.engagement)}</b></span></div>
      </div>`).join("")}</div>`;
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
    const options = state.analysis.contents.map((c) => `<option value="${c.id}">${esc(c.text.slice(0, 40))}</option>`).join("");
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
  function renderMyOps() {
    const brands = aggregateByField(getFiltered(), "account");
    const brandChips = brands.map((b) => `<span class="chip ops-brand${state.opsBrands.includes(b.name) ? " on" : ""}" data-brand="${esc(b.name)}">${esc(b.name)} (${b.count})</span>`).join("");
    const refs = [["rhythm", "运营节奏"], ["topic", "选题/内容"], ["format", "内容形式"], ["style", "风格调性"], ["metric", "指标阈值"]];
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
      const k = el.dataset.ref;
      if (el.querySelector("input").checked) state.opsRefs.add(k); else state.opsRefs.delete(k);
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
        const topContent = items.slice().sort((a, b) => b.viralScore - a.viralScore).slice(0, 3);
        const tcHTML = topContent.map((c) => `<div class="list-row" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(c.text)}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)}</div></div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div></div>`).join("");
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
    const tabs = [["framework", "分析框架"], ["say", "用户在说什么"], ["language", "用户如何说"], ["layers", "用户分层"], ["rank", "高互动用户"], ["brand", "分品牌评价"], ["form", "分内容形式"]];
    const tabBar = `<div class="uv-tabs">${tabs.map(([id, name]) => `<button class="uv-tab${state.uvTab === id ? " on" : ""}" data-uv="${id}">${name}</button>`).join("")}</div>`;
    const m = U.meta;
    const meta = `<div class="uv-meta">真实用户回帖 <b>${fmt(m.genuine_replies_in_window)}</b> · 独立用户 <b>${fmt(m.genuine_users)}</b> · 多帖用户 <b>${fmt(m.multi_reply_users)}</b> · 窗口 ${m.window[0]} ~ ${m.window[1]}<span class="uv-meta-sub">（已过滤品牌官方回复 ${fmt(m.brand_reply_filtered)} 条）</span></div>`;
    let body = "";
    if (state.uvTab === "framework") body = uvFramework(U);
    else if (state.uvTab === "say") body = uvSay(U);
    else if (state.uvTab === "language") body = uvLanguage(U);
    else if (state.uvTab === "layers") body = uvLayers(U);
    else if (state.uvTab === "rank") body = uvRank(U);
    else if (state.uvTab === "brand") body = uvBrand(U);
    else body = uvForm(U);
    return `<div class="board-head"><div class="board-desc">${desc}</div></div>${meta}${tabBar}${body}`;
  }

  function uvFramework(U) {
    const F = U.framework;
    const dims = F.dims.map((d) => `<div class="uv-dim"><div class="uv-dim-name">${d.name}</div><div class="uv-dim-logic">${d.logic}</div></div>`).join("");
    const demo = F.demo.map((s) => `<tr><td class="uv-d-text">${esc(s.text)}</td><td>${uvLangTag(s.lang)}</td><td>${uvIntentTag(s.intent)}</td><td>${uvSentTag(s.sent)}</td><td class="uv-d-num">${s.tokens}</td><td class="uv-d-num">♥${fmt(s.likes)}</td></tr>`).join("");
    return `<div class="uv-block">
      <div class="uv-fw-title">${F.title}</div>
      <div class="uv-fw-desc">${F.desc}</div>
      <div class="uv-dim-grid">${dims}</div>
      <div class="uv-block-title" style="margin-top:18px">真实语料 · 逻辑演示（每一步打标结果都可见）</div>
      <table class="uv-demo"><thead><tr><th>原始回帖</th><th>语言</th><th>意图</th><th>情绪</th><th>词数</th><th>赞</th></tr></thead><tbody>${demo}</tbody></table>
    </div>`;
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
    const lPairs = Object.entries(c.lang).map(([k, v]) => [LANG_NAME[k] || k, v, LANG_COL[k] || COL.slate]);
    const deN = c.lang.de || 0, zhN = c.lang.zh || 0;
    const locNote = `<div class="uv-note">⚠️ 本土化机会：除英语外，检测到 <b>${deN}</b> 条德语、<b>${zhN}</b> 条中文等母语表达——存在稳定的非英语母语用户群，可用对应语言做定向互动 / 客服。</div>`;
    const browser = `<div class="uv-corp">
      <div class="uv-corp-head"><input id="uv-corpus-search" class="uv-search" placeholder="搜索语料：关键词 / 品牌…" /><span class="uv-corp-count-wrap">命中 <b id="uv-corp-count">${U.corpusSamples.length}</b> / ${U.corpusSamples.length}</span></div>
      <div class="uv-corp-list">${U.corpusSamples.map(uvCorpItem).join("")}</div></div>`;
    return `<div class="uv-block">
      <div class="uv-block-title">① 用户使用什么语言？</div>
      ${uvBars(lPairs)}
      ${locNote}
      <div class="uv-block-title" style="margin-top:18px">② 用户词云（高频表达 · 越大越常出现）</div>
      ${uvCloud(c.wordFreq)}
      <div class="uv-block-title" style="margin-top:18px">③ 真实语料库（按点赞排序，可搜索英文原文）</div>
      ${browser}
    </div>`;
  }
  function uvCorpItem(s) {
    return `<div class="uv-corp-item" data-text="${esc(s.text)}" data-brand="${esc(s.brand)}">
      <div class="uv-corp-top">${uvLangTag(s.lang)} ${uvSentTag(s.sent)} ${uvIntentTag(s.intent)} <span class="uv-corp-brand">${esc(s.brand)}</span> <span class="uv-corp-form">${esc(s.form)}</span> <span class="uv-corp-like">♥ ${fmt(s.likes)}</span></div>
      <div class="uv-corp-text">${esc(s.text)}</div>
      <a class="uv-link" href="${esc(s.link || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a>
    </div>`;
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
      const quotes = u.samples.slice(0, 2).map((q) => `<div class="uv-quote">${uvLangTag(q.lang)} ${uvSentTag(q.sent)} ${uvIntentTag(q.intent)} <span class="uv-q-text">${esc(q.text)}</span></div>`).join("");
      // 展开后的深度画像：全部语录（带赞数与原帖链接）+ 完整意图分布 + 活跃周期
      const deepQuotes = (u.samples || []).map((q) => `<div class="uv-quote uv-dq">
        <span class="uv-q-tags">${uvLangTag(q.lang)} ${uvSentTag(q.sent)} ${uvIntentTag(q.intent)}</span>
        <span class="uv-q-text">${esc(q.text)}</span>
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
      const q = b.quotes.slice(0, 3).map((qq) => `<div class="uv-quote">${uvLangTag(qq.lang)} ${uvSentTag(qq.sent)} <span class="uv-q-text">${esc(qq.text)}</span> <a class="uv-link" href="${esc(qq.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
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
      const q = f.quotes.slice(0, 3).map((qq) => `<div class="uv-quote">${uvLangTag(qq.lang)} ${uvSentTag(qq.sent)} <span class="uv-q-text">${esc(qq.text)}</span> <a class="uv-link" href="${esc(qq.link || "#")}" target="_blank" rel="noreferrer">↗</a></div>`).join("");
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
  function competitorSection(data, name) {
    const items = data.filter((c) => c.account === name);
    if (!items.length) return "";
    const avgRate = Math.round(items.reduce((s, c) => s + rate(c), 0) / items.length);
    const topCount = items.filter((c) => c.isTop).length;
    const totalExp = items.reduce((s, c) => s + c.exposure, 0);
    const avgEng = (items.reduce((s, c) => s + c.engagementRate, 0) / items.length).toFixed(2);
    const metas = accountMeta(name);
    const followers = metas.reduce((s, a) => s + (a.followers || 0), 0);
    const m0 = metas[0] || {};
    const handles = metas.map((a) => `<a class="comp-handle" href="${esc(a.account_link || "#")}" target="_blank" rel="noreferrer">${esc(a.handle || a.account)} ↗</a>`).join(" · ");
    const voices = ((state.raw && state.raw.userVoices) || []).filter((v) => v.account === name).sort((a, b) => b.likes - a.likes);
    const voiceHTML = voices.length
      ? `<div class="uv-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));margin-top:8px">${voices.slice(0, 4).map((v) => `<div class="uv-card"><div class="uv-top"><span class="uv-sent ${esc(v.sentiment)}">${esc(v.sentiment)}</span><span class="uv-likes">♥ ${fmt(v.likes)}</span></div><div class="uv-text">${esc(v.text)}</div><a class="uv-link" href="${esc(v.originalLink || "#")}" target="_blank" rel="noreferrer">查看原帖 ↗</a></div>`).join("")}</div>`
      : `<div style="color:var(--text-3);font-size:12.5px;margin-top:6px">暂无该竞品的用户评价数据</div>`;
    const contentHTML = `<div class="list-rows">${items.slice().sort((a, b) => b.viralScore - a.viralScore).slice(0, 8).map((c) => `<div class="list-row" data-id="${c.id}"><div><div class="lr-text">${c.isTop ? "🔥 " : ""}${esc(c.text)}</div><div class="lr-sub">${esc(c.contentType)} · ${esc(c.emotion)} · ${c.publishDate}</div></div><div class="lr-num">${fmt(c.exposure)}<small>曝光</small></div><div class="lr-num">${fmt(c.engagement)}<small>互动</small></div><div><div class="lr-num" style="color:var(--hot)">${rate(c)}<small>爆款率</small></div></div>${c.post_link ? `<a class="lr-link" href="${esc(c.post_link)}" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">原帖↗</a>` : ""}`).join("")}</div>`;
    const weeks = aggregateWeeks(items);
    const rhythmHTML = weeks.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">运营节奏 · 频率 × 表现</div><div class="panel-sub">柱=当周发布数 · 线=当周平均爆款率</div>${comboSVG(weeks)}</div>` : "";
    const bursts = burstsFor(items);
    const burstHTML = bursts.length ? `<div class="panel" style="margin-top:12px"><div class="panel-title">Campaign 爆发监测</div>${bursts.map((r) => `<div class="qc-bar"><span class="qc-name">${esc(r.name)}</span><span class="qc-track"><i style="width:${Math.min(100, r.lift * 20)}%"></i></span><span class="qc-val">${r.lift.toFixed(1)}× · ${r.count}条</span></div>`).join("")}</div>` : "";
    return `<div class="comp-section">
      <div class="comp-sec-head"><span class="comp-sec-name">${esc(name)}</span><span class="comp-sec-badge">内容 ${items.length} · 平均爆款率 ${avgRate} · 爆款 ${topCount}</span></div>
      <div class="comp-meta">${m0.category ? `<span class="tag">${esc(m0.category)}</span>` : ""}${followers ? `<span class="comp-followers">👥 ${fmt(followers)} 粉丝</span>` : ""}${handles ? `<span class="comp-handles">${handles}</span>` : ""}</div>
      <div class="stat-row" style="margin:10px 0">
        <div class="stat"><div class="stat-label">内容量</div><div class="stat-val">${items.length}</div></div>
        <div class="stat"><div class="stat-label">平均爆款率</div><div class="stat-val" style="color:var(--hot)">${avgRate}</div></div>
        <div class="stat"><div class="stat-label">爆款数</div><div class="stat-val">${topCount}</div></div>
        <div class="stat"><div class="stat-label">总曝光</div><div class="stat-val">${fmt(totalExp)}</div></div>
        <div class="stat"><div class="stat-label">平均互动率</div><div class="stat-val">${avgEng}%</div></div>
      </div>
      <div class="comp-sub">竞品的内容（按爆款率 · 点开看原帖）</div>${contentHTML}
      <div class="comp-sub">用户对竞品的评价（最高赞）</div>${voiceHTML}
      ${rhythmHTML}${burstHTML}
    </div>`;
  }
  function renderCompetitorLib() {
    const data = getFiltered();
    const brands = aggregateByField(data, "account");
    const sel = state.compSel.size ? [...state.compSel] : [brands[0].name];
    const chips = brands.map((b) => `<span class="chip comp-chip${sel.includes(b.name) ? " on" : ""}" data-brand="${esc(b.name)}">${esc(b.name)} (${b.count})</span>`).join("");
    const sections = sel.map((name) => competitorSection(data, name)).join("");
    return `<div class="board-head"><div class="board-desc">${boardDesc("competitor")}</div></div>
      <div class="dim-note">勾选竞品（可多选）进入其深度整合分析：内容 / 用户评价 / 数据 / 运营节奏一站式。
        ${state.compSel.size ? '<button class="mini-btn" id="comp-clear">清空选择</button>' : ""}</div>
      <div class="fp-chips" style="margin-bottom:16px">${chips}</div>
      ${sections}`;
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
  function renderBrandCompare(sel) {
    if (sel.length < 2) return "";
    const metrics = [["平均爆款率", (b) => b.avgRate], ["爆款数", (b) => b.topCount], ["总曝光", (b) => fmt(b.totalExposure)], ["内容数", (b) => b.count]];
    const head = `<tr><th>指标</th>${sel.map((b) => `<th>${esc(b.name)}</th>`).join("")}</tr>`;
    const rows = metrics.map(([label, fn]) => `<tr><td>${label}</td>${sel.map((b) => `<td>${fn(b)}</td>`).join("")}</tr>`).join("");
    const top = sel.slice().sort((a, b) => b.avgRate - a.avgRate)[0];
    const benchmark = `<div class="bench-box"><b>对标建议：</b>以「${esc(top.name)}」为标杆（平均爆款率 ${top.avgRate}）。其余品牌可重点观测：发布频率、互动率、爆款形式占比，并据此设定追赶目标值。</div>`;
    return `<div class="panel" style="margin-top:16px"><div class="panel-title">品牌横向对比（${sel.length} 个）</div>
      <table class="cmp-table"><thead>${head}</thead><tbody>${rows}</tbody></table>${benchmark}</div>`;
  }
  function bindCompetitor() {
    if (state.board === "competitor") {
      $$(".comp-chip").forEach((el) => el.addEventListener("click", () => {
        const name = el.dataset.brand;
        if (state.compSel.has(name)) state.compSel.delete(name); else state.compSel.add(name);
        renderBoard();
      }));
      const cl = $("#comp-clear"); if (cl) cl.addEventListener("click", () => { state.compSel.clear(); renderBoard(); });
    }
    if (state.board === "compare") {
      $$(".cmp-chip").forEach((el) => el.addEventListener("click", () => {
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
      <div class="uv-text">${esc(v.text)}</div>
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
    drawer.innerHTML = `<div class="drawer-head"><div class="dh-text">${esc(c.text)}</div><button class="drawer-close" id="drawer-close">×</button></div>
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
          <div class="handoff-text"><b>以此内容为灵感？</b><br>复制给 AI，让我结合爆款特征帮你延展选题或分析可复用要素。</div>
          <button class="btn-primary" id="copy-detail">复制给 AI</button>
        </div>
      </div>`;
    drawer.classList.add("show");
    $("#drawer-overlay").classList.add("show");
    $("#drawer-close").addEventListener("click", closeDrawer);
    $("#copy-detail").addEventListener("click", () => {
      const ctx = `【参考爆款内容深度分析】
内容：${c.text}
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
    // 每日盲盒
    if (state.board === "blindbox") bindBlindbox();
    // 我方运营
    if (state.board === "myops") bindMyOps();
    // 了解用户：用户讨论与语言（富用户分析中枢）
    if (state.board === "uservoice") bindUserBoard();
  }

  function bindUserBoard() {
    $$(".uv-tab", $("#board")).forEach((b) => b.addEventListener("click", () => {
      state.uvTab = b.dataset.uv; renderBoard();
    }));
    const rt = $("[data-uv-rank-toggle]", $("#board"));
    if (rt) rt.addEventListener("click", () => { state.uvRankAll = !state.uvRankAll; renderBoard(); });
    const cs = $("#uv-corpus-search");
    if (cs) cs.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      $$(".uv-corp-item", $("#board")).forEach((el) => {
        const hit = !q || (el.dataset.text || "").toLowerCase().includes(q) || (el.dataset.brand || "").toLowerCase().includes(q);
        el.style.display = hit ? "" : "none";
      });
      const shown = $$(".uv-corp-item", $("#board")).filter((el) => el.style.display !== "none").length;
      const cnt = $("#uv-corp-count"); if (cnt) cnt.textContent = shown;
    });
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
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
  }

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
  }
  init();
})();
