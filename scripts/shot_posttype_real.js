/**
 * 真实点击 → 真实截图：对线上站点逐档点「全部 / 原创 / 转推 / 被转原帖」，
 * 每次截同一块区域（sec-head + 8 个统计卡），让数字变化肉眼可比。
 *
 * 用法:
 *   node scripts/shot_posttype_real.js                 # 本地起服务，用本地文件
 *   node scripts/shot_posttype_real.js --live --local-data   # 页面资产取线上，仅 data/*.json 取本地
 *   node scripts/shot_posttype_real.js --live          # 完全线上（含 21MB JSON，本机链路可能超时）
 */
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function findChrome() {
  const bases = [
    os.homedir() + "/.cache/puppeteer/chrome-headless-shell",
    "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/chrome-headless-shell",
  ];
  for (const b of bases) {
    try {
      const out = execSync(`find ${b} -name chrome-headless-shell -type f 2>/dev/null`).toString().trim().split("\n").filter(Boolean);
      if (out[0]) return out[0];
    } catch (e) {}
  }
  return null;
}
const EXEC = findChrome();
if (!EXEC) { console.error("NO_CHROME"); process.exit(3); }

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const PORT = 8137;
const LIVE = process.argv.includes("--live");
const LOCAL_DATA = process.argv.includes("--local-data");
const LIVE_BASE = "https://ffswwwda.github.io/content-analytics-dashboard";
const OUT = path.join(ROOT, "scripts", "_shots", "real");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TABS = [
  { pt: "all", slug: "1-all", label: "全部" },
  { pt: "发帖", slug: "2-original", label: "原创" },
  { pt: "转发", slug: "3-repost", label: "转推" },
  { pt: "被转发原帖", slug: "4-quoted", label: "被转原帖" },
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  let server = null;
  if (!LIVE) {
    const http = require("http");
    server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]);
      if (p === "/") p = "/index.html";
      const f = path.join(ROOT, p);
      if (!fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end("nf"); return; }
      const ext = path.extname(f);
      const ct = ext === ".html" ? "text/html" : ext === ".js" ? "application/javascript" : ext === ".json" ? "application/json" : ext === ".css" ? "text/css" : "application/octet-stream";
      res.writeHead(200, { "Content-Type": ct });
      fs.createReadStream(f).pipe(res);
    });
    await new Promise((r) => server.listen(PORT, r));
  }

  const browser = await puppeteer.launch({
    executablePath: EXEC,
    headless: "shell",
    args: ["--no-sandbox", "--disable-gpu", "--font-render-hinting=none"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1200, deviceScaleFactor: 2 });

  const t0 = Date.now();
  if (LIVE && LOCAL_DATA) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const mm = req.url().match(/\/data\/(content_data|sample_data)\.json/);
      if (mm) {
        const f = path.join(ROOT, "data", mm[1] + ".json");
        if (fs.existsSync(f)) { req.respond({ status: 200, contentType: "application/json", body: fs.readFileSync(f) }); return; }
      }
      req.continue();
    });
  }
  const URL_ = LIVE ? `${LIVE_BASE}/index.html` : `http://localhost:${PORT}/index.html`;
  console.log("打开:", URL_);
  await page.goto(URL_, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0, { timeout: 150000 });
  console.log("数据就绪，耗时", ((Date.now() - t0) / 1000).toFixed(1), "s");

  // 关掉每日灵感盲盒弹窗
  await page.evaluate(() => { const c = document.querySelector("#bx-close"); if (c) c.click(); });
  await sleep(400);

  // 进竞品内容监测
  await page.evaluate(() => {
    const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "competitor");
    if (el) el.click();
  });
  await page.waitForFunction(() => document.querySelector("#comp-posttype"), { timeout: 30000 });
  await sleep(600);

  // 切到「全部竞品」
  await page.evaluate(() => { const c = document.querySelector('.comp-chip[data-brand="__all__"]'); if (c) c.click(); });
  await sleep(800);

  const report = [];

  // 读取当前可见区域的关键数字
  async function readState(tag) {
    return page.evaluate((tag) => {
      const head = document.querySelector(".comp-sec-head");
      const badge = document.querySelector(".comp-sec-badge");
      const stats = [...document.querySelectorAll(".comp-section .stat-row .stat")].map((s) => ({
        k: (s.querySelector(".stat-label") || {}).textContent,
        v: (s.querySelector(".stat-val") || {}).textContent,
      }));
      const tabs = [...document.querySelectorAll("#comp-posttype .posttype-tab")].map((b) => ({
        pt: b.dataset.pt,
        on: b.classList.contains("on"),
        txt: b.textContent.trim(),
      }));
      const sub = (document.querySelector(".comp-sub") || {}).textContent || "";
      return { tag, badge: badge ? badge.textContent.trim() : "", stats, tabs, sub: sub.replace(/\s+/g, " ").trim().slice(0, 90) };
    }, tag);
  }

  // 截「sec-head + stat-row」这一块，坐标换算成页面绝对坐标
  async function shot(file) {
    const box = await page.evaluate(() => {
      const head = document.querySelector(".comp-section .comp-sec-head");
      const statRow = document.querySelector(".comp-section .stat-row");
      if (!head) return null;
      const a = head.getBoundingClientRect();
      const b = statRow ? statRow.getBoundingClientRect() : a;
      const pad = 10;
      return {
        x: Math.max(0, a.left - pad) + window.scrollX,
        y: Math.max(0, a.top - pad) + window.scrollY,
        w: Math.min(window.innerWidth - Math.max(0, a.left - pad), a.width + pad * 2),
        h: b.bottom - a.top + pad * 2,
      };
    });
    if (!box) { console.log("  跳过截图（找不到 sec-head）"); return; }
    await page.screenshot({
      path: file,
      clip: { x: box.x, y: box.y, width: box.w, height: Math.min(box.h, 900) },
      captureBeyondViewport: true,
    });
    console.log("  →", path.basename(file), `${Math.round(box.w)}x${Math.round(Math.min(box.h, 900))}`);
  }

  // ---------- 全局视图：逐档点击 ----------
  console.log("\n=== 全局视图（全部竞品）===");
  for (const t of TABS) {
    await page.evaluate((pt) => {
      const b = document.querySelector(`#comp-posttype .posttype-tab[data-pt="${pt}"]`);
      if (b) b.click();
    }, t.pt);
    await sleep(700);
    const st = await readState(t.label);
    report.push({ view: "全局", tab: t.label, ...st });
    const c = (st.stats.find((s) => s.k && s.k.includes("内容量")) || {}).v;
    const top = (st.stats.find((s) => s.k && s.k.includes("爆款数")) || {}).v;
    console.log(`  [${t.label}] ${st.badge} | 内容量=${c} 爆款数=${top}`);
    await shot(path.join(OUT, `global-${t.slug}.png`));
  }

  // 全局「全部」的整块看板（含 tab 在原位的上下文）
  await page.evaluate(() => { const b = document.querySelector('#comp-posttype .posttype-tab[data-pt="all"]'); if (b) b.click(); });
  await sleep(600);
  await page.screenshot({ path: path.join(OUT, "global-context.png"), clip: await page.evaluate(() => {
    const h = document.querySelector(".comp-section");
    const r = h.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: Math.min(r.height, 1150) };
  }), captureBeyondViewport: true });
  console.log("  → global-context.png（整块看板上下文）");

  // ---------- 全部品牌逐一验证：每个单品牌视图都必须自带筛选 ----------
  console.log("\n=== 全部品牌逐个验证（筛选是否存在 + 是否生效）===");
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data/content_data.json"), "utf8"));
  const CNT = {};
  for (const c of raw.contents) {
    const b = c.account || "";
    const pt = c.post_type || "发帖";
    CNT[b] = CNT[b] || { all: 0, "发帖": 0, "转发": 0, "被转发原帖": 0 };
    CNT[b].all++;
    CNT[b][pt] = (CNT[b][pt] || 0) + 1;
  }
  const numIn = (s) => { const m = (s || "").match(/内容\s*([\d,]+)/); return m ? Number(m[1].replace(/,/g, "")) : null; };
  // 注意：含「未归属品牌」那枚空名 chip（874 条被转原帖/转推），按索引点，避免被空字符串过滤掉
  const chipList = await page.evaluate(() =>
    [...document.querySelectorAll(".comp-chip")]
      .map((c, i) => ({ i, brand: c.dataset.brand }))
      .filter((x) => x.brand !== "__all__")
  );
  const brandNames = chipList.map((x) => x.brand);
  let okCount = 0;
  const brandRows = [];
  for (const { i, brand: bn } of chipList) {
    await page.evaluate((idx) => { document.querySelectorAll(".comp-chip")[idx].click(); }, i);
    await sleep(600);
    const tabs = await page.evaluate(() => document.querySelectorAll("#comp-posttype .posttype-tab").length);
    // 切到原创，验证筛选真的作用在这个品牌上
    await page.evaluate(() => { const b = document.querySelector('#comp-posttype .posttype-tab[data-pt="发帖"]'); if (b) b.click(); });
    await sleep(480);
    const n = numIn(await page.evaluate(() => (document.querySelector(".comp-sec-badge") || {}).textContent || ""));
    const exp = (CNT[bn] || {})["发帖"] || 0;
    const pass = tabs === 4 && n === exp;
    if (pass) okCount++;
    brandRows.push({ brand: bn, tabs, pageOriginal: n, jsonOriginal: exp, pass });
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${(bn || "(未归属品牌)").padEnd(16)} tab=${tabs} 切原创后=${n} JSON=${exp}`);
    await page.evaluate(() => { const b = document.querySelector('#comp-posttype .posttype-tab[data-pt="all"]'); if (b) b.click(); });
    await sleep(180);
  }
  console.log(`  品牌数 ${brandNames.length}，通过 ${okCount}`);

  // ---------- 单品牌截图（默认排名第一个品牌）----------
  console.log("\n=== 单品牌视图截图 ===");
  const brand = brandNames[0];
  await page.evaluate((idx) => { document.querySelectorAll(".comp-chip")[idx].click(); }, chipList[0].i);
  await sleep(800);
  console.log("  选中品牌:", brand);
  for (const t of TABS) {
    await page.evaluate((pt) => {
      const b = document.querySelector(`#comp-posttype .posttype-tab[data-pt="${pt}"]`);
      if (b) b.click();
    }, t.pt);
    await sleep(700);
    const st = await readState(t.label);
    report.push({ view: "单品牌", tab: t.label, ...st });
    const c = (st.stats.find((s) => s.k && s.k.includes("内容量")) || {}).v;
    console.log(`  [${t.label}] ${st.badge} | 内容量=${c}`);
    await shot(path.join(OUT, `brand-${t.slug}.png`));
  }

  fs.writeFileSync(path.join(OUT, "readback.json"), JSON.stringify({ brand, brandRows, report }, null, 2), "utf8");
  console.log("\n读数已存 scripts/_shots/real/readback.json");

  await browser.close();
  if (server) server.close();
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
