/* 时序口径落位验证 · 纯 UI 路径版（不带任何调试钩子，验证的就是待发布文件本身）
   路径：灵感库卡片 → 抽屉 → 「进入单帖深度分析」→ 读时序图 DOM
   断言：轴标签只可出现 D0/D1/D2/D7；推算单点归 D7 且悬停提示保留真实天数 */
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findChrome() {
  const homes = [
    require("os").homedir() + "/.cache/puppeteer/chrome-headless-shell",
    "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/chrome-headless-shell",
  ];
  for (const base of homes) {
    try {
      const out = execSync(`find ${base} -name chrome-headless-shell -type f 2>/dev/null`).toString().trim().split("\n").filter(Boolean);
      if (out[0]) return out[0];
    } catch (e) {}
  }
  return null;
}
const EXEC = findChrome();
if (!EXEC) { console.error("NO_CHROME"); process.exit(3); }

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const PORT = 8128;
const OUT = path.join(ROOT, "scripts", "_shots");
fs.mkdirSync(OUT, { recursive: true });

const fails = [];
const rowsChecked = [];
function check(ok, msg) { console.log((ok ? "PASS " : "FAIL ") + msg); if (!ok) fails.push(msg); }

(async () => {
  const http = require("http");
  const server = http.createServer((req, res) => {
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

  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 960 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 60000 });

  async function gotoLibrary() {
    await page.evaluate(() => { const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "library"); if (el) el.click(); });
    await new Promise((r) => setTimeout(r, 700));
  }
  async function setSearch(q) {
    await page.evaluate((v) => {
      const inp = document.getElementById("global-search");
      inp.value = v;
      inp.dispatchEvent(new Event("input", { bubbles: true }));
    }, q);
    await new Promise((r) => setTimeout(r, 700));
  }
  const readTrend = () => page.evaluate(() => {
    const grid = document.querySelector("#deep-modal .dp-trend-grid");
    if (!grid) return { none: (document.querySelector("#deep-modal .trend-empty") || {}).textContent || "无" };
    const first = grid.querySelector(".trend-row");
    const labels = [...first.querySelectorAll(".trend-xaxis span")].map((s) => ({ t: s.textContent, l: s.style.left }));
    // 逐行取标签后展平（每行内部用 + 连接）
    const allLabels = [...grid.querySelectorAll(".trend-row")].map((r) => [...r.querySelectorAll(".trend-xaxis span")].map((s) => s.textContent).join("+"));
    const tips = [];
    grid.querySelectorAll(".trend-row").forEach((row) => {
      const hit = row.querySelector(".trend-hit");
      if (!hit) return;
      hit.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const el = row.querySelector(".trend-tip.show");
      tips.push(el ? el.textContent.replace(/\s+/g, " ").trim() : "");
      hit.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });
    return { rows: grid.querySelectorAll(".trend-row").length, labels, allLabels, tips };
  });
  // 精确打开指定帖：走「灵感库卡片 → 抽屉 → 进入深度分析」真实路径
  async function openPost(id, tag) {
    await gotoLibrary();
    const found = await page.evaluate((cid) => {
      const el = document.querySelector(`#board [data-id="${cid}"]`);
      if (!el) return false;
      el.scrollIntoView({ block: "center" }); el.click(); return true;
    }, id);
    if (!found) return { none: `灵感库首页未出现该帖（${id}）` };
    await new Promise((r) => setTimeout(r, 600));
    const opened = await page.evaluate(() => { const b = document.getElementById("deep-open"); if (b) { b.click(); return true; } return false; });
    if (!opened) return { none: "抽屉未出现「进入单篇深度分析」按钮" };
    await new Promise((r) => setTimeout(r, 900));
    const info = await readTrend();
    info.id = id;
    if (tag) {
      const g = await page.$("#deep-modal .dp-trend-grid");
      if (g) {
        await page.evaluate(() => { const x = document.querySelector("#deep-modal .dp-trend-grid"); x.scrollIntoView({ block: "center" }); const h = x.querySelector(".trend-hit"); if (h) h.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); });
        await new Promise((r) => setTimeout(r, 300));
        await g.screenshot({ path: path.join(OUT, `ui_${tag}.png`) });
      }
    }
    await page.evaluate(() => { const c = document.getElementById("deep-close"); if (c) c.click(); });
    await new Promise((r) => setTimeout(r, 400));
    return info;
  }
  // 带搜索的精确打开（目标帖不在灵感库首页 100 张里时用）
  async function openPostBySearch(id, q, tag) {
    await gotoLibrary();
    await setSearch(q);
    return openPost(id, tag);
  }

  function assertSlot(info, tag) {
    if (info.none) { check(false, `[${tag}] 未取到时序图：${info.none}`); return; }
    const flat = [];
    (info.allLabels || []).forEach((s) => s.split("+").forEach((t) => { if (t) flat.push(t); }));
    const bad = flat.filter((t) => !/^D(0|1|2|7)$/.test(t));
    rowsChecked.push({ tag, id: info.id, rows: info.rows, labels: flat.join(" ") });
    check(bad.length === 0, `[${tag} ${info.id}] 轴标签仅 D0/D1/D2/D7（实测 ${JSON.stringify(flat)}）`);
    check(info.rows > 0, `[${tag} ${info.id}] 有指标行渲染（${info.rows} 行）`);
  }

  // --- A. 默认灵感库：批量抽样 ---
  await gotoLibrary();
  const bulk = [];
  for (let i = 0; i < 8; i++) {
    const ids = await page.evaluate((k) => [...document.querySelectorAll("#board [data-id]")].slice(k, k + 1).map((e) => e.dataset.id), i);
    if (!ids.length) break;
    await page.evaluate((id) => { const el = document.querySelector(`#board [data-id="${id}"]`); el.scrollIntoView({ block: "center" }); el.click(); }, ids[i] || ids[0]);
    await new Promise((r) => setTimeout(r, 550));
    const ok = await page.evaluate(() => { const b = document.getElementById("deep-open"); if (b) { b.click(); return true; } return false; });
    if (!ok) { await page.evaluate(() => { const c = document.getElementById("drawer-close"); if (c) c.click(); }); continue; }
    await new Promise((r) => setTimeout(r, 800));
    const info = await readTrend(); info.id = ids[0];
    bulk.push(info);
    await page.evaluate(() => { const c = document.getElementById("deep-close"); if (c) c.click(); });
    await new Promise((r) => setTimeout(r, 350));
    await page.evaluate(() => { const c = document.getElementById("drawer-close"); if (c) c.click(); });
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`默认灵感库抽样 ${bulk.length} 帖`);
  bulk.forEach((b, i) => assertSlot(b, "lib" + i));

  // --- B. 定向：已知样本（口径A 四窗齐全 / 口径B 推算单点 D32、D5）---
  // 结构对照（来自 data/content_data.json，用于验证断言本身是否命中目标）
  const CASES = [
    { tag: "src4", id: "ID:2072832693986095512", q: "We found a new way to play music", expect: "D0+D1+D2+D7", tip: /第0天/ },
    { tag: "derived32", id: "ID:2067882882429816878", q: "Silver figurine depicting either a dragon", expect: "D7", tip: /实为第32天/ },
    { tag: "derived5", id: "ID:2077775539503300635", q: "blessed the feed with a photo dump", expect: "D7", tip: /实为第5天/ },
  ];
  for (const cs of CASES) {
    const info = await openPostBySearch(cs.id, cs.q, cs.tag);
    console.log(`定向[${cs.tag}]`, JSON.stringify(info));
    assertSlot(info, cs.tag);
    if (info.none) continue;
    const flat = [];
    (info.allLabels || []).forEach((s) => s.split("+").forEach((t) => { if (t) flat.push(t); }));
    const uniq = [...new Set(flat)].join("+");
    check(uniq === cs.expect, `[${cs.tag}] 轴标签组合为 ${cs.expect}（实测 ${uniq}）`);
    const tips = (info.tips || []).join(" ");
    check(cs.tip.test(tips), `[${cs.tag}] 悬停提示符合预期 ${cs.tip}（实测「${tips}」）`);
    if (uniq === "D7") {
      const lb = info.labels || [];
      check(lb.length === 1 && lb[0].t === "D7" && Math.abs(parseFloat(lb[0].l) - 97) < 0.6,
        `[${cs.tag}] 单点落在 D7 槽位 97%（实测 ${JSON.stringify(lb)}）`);
    }
  }

  console.log("=== ERRORS ===", JSON.stringify(errors));
  check(errors.length === 0, `无 JS 运行时错误（${errors.length}）`);
  console.log("\n=== 抽样汇总 ===");
  rowsChecked.forEach((r) => console.log(JSON.stringify(r)));
  console.log(fails.length ? `\n=== ${fails.length} 项未通过 ===` : "\n=== 全部通过 ===");
  await browser.close();
  server.close();
  process.exit(fails.length ? 1 : 0);
})();
