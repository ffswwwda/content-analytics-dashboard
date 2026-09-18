const { JSDOM, VirtualConsole } = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/jsdom");
const fs = require("fs");
const path = require("path");
const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/<script[^>]*\ssrc=[^>]*><\/script>/g, "");
const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.detail ? e.detail.stack || e.detail : e.message)));
vc.sendTo({ error: (...a) => errors.push(a.map(String).join(" ")), warn() {}, log() {}, info() {}, debug() {} }, { omitJSDOMErrors: true });
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom; const { document } = window;
window.fetch = async (url) => { const p = String(url).split("?")[0]; const file = path.join(ROOT, p); if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => ({}), text: async () => "nf" }; const txt = fs.readFileSync(file, "utf8"); return { ok: true, status: 200, json: async () => JSON.parse(txt), text: async () => txt }; };
try { window.localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {}
window.addEventListener("error", (e) => errors.push("window.error: " + (e.error ? e.error.stack : e.message)));
window.addEventListener("unhandledrejection", (e) => errors.push("unhandledrejection: " + (e.reason ? e.reason.stack || e.reason : "")));
window.prompt = () => "测试";
if (!window.URL.createObjectURL) window.URL.createObjectURL = () => "blob:x";
window.URL.revokeObjectURL = () => {};
for (const f of ["js/data.js", "js/analysis.js", "js/app.js"]) { const s = document.createElement("script"); s.textContent = fs.readFileSync(path.join(ROOT, f), "utf8"); document.body.appendChild(s); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function waitInit(t = 30000) { return new Promise((res, rej) => { const t0 = Date.now(); const iv = setInterval(() => { if (document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board") && document.getElementById("board").innerHTML.length > 50) { clearInterval(iv); res(); } else if (Date.now() - t0 > t) { clearInterval(iv); rej(new Error("init timeout")); } }, 200); }); }
function clickBoard(id) { const item = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === id); if (item) item.click(); }
function clickPost(id) { const el = document.querySelector(`[data-id="${id}"]`); if (!el) return false; el.click(); return true; }
function readTrend() {
  const body = document.getElementById("deep-body");
  if (!body) return "(no deep-body)";
  const grid = body.querySelector(".dp-trend-grid");
  if (!grid) return "(no trend grid = 该帖无时序或区块隐藏)";
  const rows = [...grid.querySelectorAll(".trend-row")];
  return rows.map((r) => {
    const labels = [...r.querySelectorAll(".trend-xaxis span")].map((s) => s.textContent);
    const val = r.querySelector(".trend-val") ? r.querySelector(".trend-val").textContent : "?";
    const growth = r.querySelector(".trend-growth") ? r.querySelector(".trend-growth").textContent : "?";
    return `label=${labels.join(",")} val=${val} growth=${growth}`;
  }).join(" | ");
}
const TARGET_SINGLE = "ID:2070170949953953969";
const TARGET_MULTI = "ID:2073542702046883888";
(async () => {
  try { await waitInit(); } catch (e) { console.log("INIT_FAIL:", e.message); process.exit(2); }
  // 进爆款深度(帖子带 data-id 监听)
  clickBoard("viraldeep"); await sleep(150);
  const inDom = (id) => !!document.querySelector(`[data-id="${id}"]`);
  console.log("单天帖在DOM:", inDom(TARGET_SINGLE), "| 多天帖在DOM:", inDom(TARGET_MULTI));
  let ok = clickPost(TARGET_SINGLE);
  await sleep(200);
  console.log("点击单天帖:", ok, "-> trend:", readTrend());
  ok = clickPost(TARGET_MULTI);
  await sleep(200);
  console.log("点击多天帖:", ok, "-> trend:", readTrend());
  // 在 viraldeep 板块扫描可见帖子行，找多天帖确认双标签渲染
  const rows = [...document.querySelectorAll(".list-row[data-id]")];
  console.log("viraldeep 可见帖子行数:", rows.length);
  let foundMulti = null, foundSingle = null;
  for (const el of rows.slice(0, 120)) {
    el.click(); await sleep(20);
    const body = document.getElementById("deep-body");
    if (!body) continue;
    const grid = body.querySelector(".dp-trend-grid");
    if (!grid) continue;
    const firstRow = grid.querySelector(".trend-row");
    if (!firstRow) continue;
    const labels = [...firstRow.querySelectorAll(".trend-xaxis span")].map((s) => s.textContent);
    if (labels.length >= 2 && !foundMulti) foundMulti = { id: el.dataset.id, labels };
    if (labels.length === 1 && !foundSingle) foundSingle = { id: el.dataset.id, labels };
    if (foundMulti && foundSingle) break;
  }
  console.log("多天帖样本:", foundMulti ? `${foundMulti.id} labels=${foundMulti.labels.join(",")}` : "(未在扫描中找到)");
  console.log("单天帖样本:", foundSingle ? `${foundSingle.id} labels=${foundSingle.labels.join(",")}` : "(未在扫描中找到)");
  if (foundMulti) { clickPost(foundMulti.id); await sleep(150); console.log("多天帖 trend:", readTrend()); }
  console.log("=== ERRORS ===", "errors:", errors.length, "consoleErrors:", errors.length);
  errors.slice(0, 10).forEach((e) => console.log("  " + e.slice(0, 300)));
  process.exit(0);
})();
