const { JSDOM, VirtualConsole } = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/jsdom");
const fs = require("fs");
const path = require("path");

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/<script[^>]*\ssrc=[^>]*><\/script>/g, "");

const errors = [];
const consoleErrors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.detail ? e.detail.stack || e.detail : e.message)));
vc.sendTo({ error: (...a) => consoleErrors.push(a.map(String).join(" ")), warn() {}, log() {}, info() {}, debug() {} }, { omitJSDOMErrors: true });

const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/", pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom;
const { document } = window;
window.fetch = async (url) => {
  let p = String(url).split("?")[0];
  const file = path.join(ROOT, p);
  if (!fs.existsSync(file)) return { ok: false, status: 404, text: async () => "nf", json: async () => ({}) };
  const txt = fs.readFileSync(file, "utf8");
  return { ok: true, status: 200, json: async () => JSON.parse(txt), text: async () => txt };
};
try { window.localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {}
window.addEventListener("error", (e) => errors.push("window.error: " + (e.error ? e.error.stack : e.message)));
window.addEventListener("unhandledrejection", (e) => errors.push("unhandledrejection: " + (e.reason ? e.reason.stack || e.reason : "")));

for (const f of ["js/data.js", "js/analysis.js", "js/app.js"]) {
  const s = document.createElement("script");
  s.textContent = fs.readFileSync(path.join(ROOT, f), "utf8");
  document.body.appendChild(s);
}

function scan(htmlStr) {
  const issues = [];
  if (/undefined/.test(htmlStr)) issues.push("undefined");
  if (/\bNaN\b/.test(htmlStr)) issues.push("NaN");
  if (/\[object Object\]/.test(htmlStr)) issues.push("[object Object]");
  if (/>null</.test(htmlStr)) issues.push("null");
  if (/Infinity/.test(htmlStr)) issues.push("Infinity");
  return issues;
}
function waitInit(t = 30000) {
  return new Promise((res, rej) => {
    const t0 = Date.now();
    const iv = setInterval(() => {
      const n = document.querySelectorAll(".nav-item").length;
      const b = document.getElementById("board");
      if (n > 0 && b && b.innerHTML.length > 50) { clearInterval(iv); res(); }
      else if (Date.now() - t0 > t) { clearInterval(iv); rej(new Error("init timeout")); }
    }, 200);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function clickBoard(id) {
  const item = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === id);
  if (!item) return false;
  item.click();
  return true;
}
function report(id, name, extra) {
  const b = document.getElementById("board");
  const h = b ? b.innerHTML : "";
  const fatal = b ? b.querySelector(".fatal-error") : null;
  console.log(JSON.stringify(Object.assign({ id, name, status: fatal ? "FATAL" : (h.length < 50 ? "EMPTY" : "OK"), htmlLen: h.length, issues: scan(h), hasEls: b ? b.querySelectorAll("*").length : 0 }, extra || {})));
}

(async () => {
  try { await waitInit(); } catch (e) { console.log("INIT_FAIL:", e.message); process.exit(2); }

  // 1) 基础板块点击
  const boards = ["sourcedb", "library", "reference", "viraldeep", "competitor", "compare", "growth", "branduser", "userseg", "usertier", "uservoice", "myops"];
  for (const id of boards) { clickBoard(id); await sleep(70); report(id, id); }

  // 1.5) 源数据看板：点一个筛选 chip + 切到回帖数据源
  clickBoard("sourcedb"); await sleep(50);
  const sdbChip = document.querySelector(".sdb-chip[data-filter][data-val]");
  if (sdbChip) { sdbChip.click(); await sleep(80); report("sourcedb:filter", "源数据-筛选", { chip: sdbChip.textContent.slice(0, 20) }); }
  const sdbSource2 = document.querySelector(".sdb-source-card[data-source='voices']");
  if (sdbSource2) { sdbSource2.click(); await sleep(80); report("sourcedb:voices", "源数据-切回帖", {}); }

  // 2) 找参考：输入目的并运行
  clickBoard("reference"); await sleep(50);
  const ta = document.getElementById("goal-detail");
  if (ta) { ta.value = "提升品牌曝光，想做一系列短视频内容"; const fb = document.getElementById("find-btn"); if (fb) fb.click(); await sleep(120); report("reference:run", "找参考-运行查询", { goalSet: !!ta.value }); }

  // 3) 竞品：进入第一个品牌
  clickBoard("competitor"); await sleep(50);
  const chip = document.querySelector(".comp-chip:not(.all)");
  if (chip) { chip.click(); await sleep(120); report("competitor:enter", "竞品-进入品牌", { chip: chip.textContent.slice(0, 20) }); }
  else report("competitor:enter", "竞品-进入品牌", { note: "no chip" });

  // 3.5) 多竞品横向对比：勾选 2 个品牌查看矩阵
  clickBoard("compare"); await sleep(50);
  const cmpChips = [...document.querySelectorAll(".cmp-chip")];
  if (cmpChips.length >= 2) { cmpChips.slice(0, 3).forEach((c) => c.click()); await sleep(150); report("compare:select", "多竞品-勾选品牌", { chips: cmpChips.length }); }
  else report("compare:select", "多竞品-勾选品牌", { note: "chips<2" });

  // 4) 品牌用户：进入第一个品牌深度
  clickBoard("branduser"); await sleep(50);
  const bud = document.querySelector("[data-bud]");
  if (bud) { bud.click(); await sleep(150); report("branduser:enter", "品牌用户-深度", { bud: bud.textContent.slice(0, 20) }); }
  else report("branduser:enter", "品牌用户-深度", { note: "no data-bud" });

  // 5) 高互动用户：展开深度
  clickBoard("userseg"); await sleep(50);
  const seg = document.querySelector("[data-uv-seg-deep]");
  if (seg) { seg.click(); await sleep(120); report("userseg:deep", "高互动-深度分析", {}); }
  else report("userseg:deep", "高互动-深度分析", { note: "no seg-deep" });

  // 6) 用户分层：进入某层
  clickBoard("usertier"); await sleep(50);
  const layer = document.querySelector("[data-uv-layer]");
  if (layer) { layer.click(); await sleep(120); report("usertier:layer", "分层-进入层", { layer: layer.textContent.slice(0, 20) }); }
  else report("usertier:layer", "分层-进入层", { note: "no layer" });

  // 7) 爆款深度：切换维度 + 下钻卡片
  clickBoard("viraldeep"); await sleep(50);
  const dimTab = document.querySelector("#vd-dim-tabs .uv-tab:not(.on)");
  if (dimTab) { dimTab.click(); await sleep(100); report("viraldeep:dim", "爆款深度-切维度", { dim: dimTab.textContent }); }
  const card = document.querySelector(".vd-dim-card[data-dim]");
  if (card) { card.click(); await sleep(120); report("viraldeep:drill", "爆款深度-下钻卡片", { card: card.textContent.slice(0, 20) }); }

  console.log("=== ERRORS ===");
  console.log("errors:", errors.length); errors.slice(0, 20).forEach((e) => console.log("  " + e.slice(0, 400)));
  console.log("consoleErrors:", consoleErrors.length); consoleErrors.slice(0, 20).forEach((e) => console.log("  " + e.slice(0, 400)));
  process.exit(0);
})();
