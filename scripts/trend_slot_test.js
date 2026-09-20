/* 【已被 trend_ui_test.js 取代，保留备查】
   本脚本依赖 js/app.js 里临时加的一行调试钩子（window.__state / window.__openDeep），
   而该钩子按约定不允许随代码发布 —— 也就是说它验证的不是待发布文件本身。
   trend_ui_test.js 走「灵感库卡片 → 抽屉 → 进入单帖深度分析」真实 UI 路径，
   无需任何钩子，请优先用那份做发布前验证。

   时序口径落位验证：轴标签只可出现 D0/D1/D2/D7；非四档点归 D7 槽位，真实天数只在悬停提示里出现 */
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
const PORT = 8126;
const OUT = path.join(ROOT, "scripts", "_shots");
fs.mkdirSync(OUT, { recursive: true });

const WIN = [0, 1, 2, 7];
const fails = [];
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

  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction("window.__state && window.__state.raw && window.__state.raw.contents", { timeout: 60000 });

  const picks = await page.evaluate((WIN) => {
    const cs = window.__state.raw.contents || [];
    const ds = (t) => Object.keys(t || {}).filter((k) => Object.values(t[k]).some((v) => (v || 0) > 0)).map((k) => parseInt(k.slice(1), 10));
    const byDays = (want) => cs.find((c) => {
      if (!c.timeseries) return false;
      const d = ds(c.timeseries).sort((a, b) => a - b);
      return d.length === want.length && d.every((x, i) => x === want[i]);
    });
    const derived = cs.find((c) => c.timeseries && ds(c.timeseries).every((n) => WIN.indexOf(n) === -1) && (c.timeseries[Object.keys(c.timeseries)[0]].view || 0) > 100000);
    const pick = (c) => c && { id: c.id, days: ds(c.timeseries).sort((a, b) => a - b), view: Math.max(...Object.values(c.timeseries).map((b) => b.view || 0)) };
    return {
      derived: pick(derived),
      d0d7: pick(byDays([0, 7])),
      four: pick(byDays([0, 1, 2, 7])),
      d2d7: pick(byDays([2, 7])),
      noTs: cs.filter((c) => !c.timeseries).length,
    };
  }, WIN);
  console.log("PICKS:", JSON.stringify(picks, null, 1));

  async function shoot(c, name) {
    if (!c) { console.log(`[${name}] 无样本，跳过`); return; }
    await page.evaluate((cid) => { window.__openDeep(cid); }, c.id);
    await new Promise((r) => setTimeout(r, 900));
    const info = await page.evaluate(() => {
      const grid = document.querySelector("#deep-modal .dp-trend-grid");
      if (!grid) return { none: (document.querySelector("#deep-modal .trend-empty") || {}).textContent || "无" };
      const labels = [...grid.querySelectorAll(".trend-row:first-child .trend-xaxis span")].map((s) => ({ t: s.textContent, l: s.style.left }));
      const tips = [];
      grid.querySelectorAll(".trend-row").forEach((row) => {
        const hit = row.querySelector(".trend-hit");
        if (!hit) return;
        hit.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        const el = row.querySelector(".trend-tip.show");
        tips.push(el ? el.textContent.replace(/\s+/g, " ").trim() : "");
        hit.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
      });
      return { rows: grid.querySelectorAll(".trend-row").length, labels, tips };
    });
    console.log(`[${name}] ${JSON.stringify(info)}`);
    const raw = c.days.join("/");
    const bad = (info.labels || []).filter((x) => !/^D(0|1|2|7)$/.test(x.t));
    check(!info.none && info.labels && info.labels.length > 0, `[${name} raw=${raw}] 有轴标签渲染`);
    check(bad.length === 0, `[${name} raw=${raw}] 轴标签仅 D0/D1/D2/D7（实测 ${JSON.stringify((info.labels || []).map((x) => x.t))}）`);
    if (info.labels && info.labels.length === 1) {
      check(Math.abs(parseFloat(info.labels[0].l) - 97) < 0.6, `[${name} raw=${raw}] 单点落在 D7 槽位右端 97%（实测 ${info.labels[0].l}）`);
    }
    const t = (info.tips || [])[0] || "";
    if (["derived"].includes(name)) {
      check(/实为第\d+天/.test(t), `[${name}] 悬停提示保留真实天数（实测「${t}」）`);
    } else if (name === "four") {
      check(/第0天/.test(t), `[${name}] D0 点悬停显示「第0天」（实测「${t}」）`);
    }
    const grid = await page.$("#deep-modal .dp-trend-grid");
    if (grid) {
      await page.evaluate(() => { const g = document.querySelector("#deep-modal .dp-trend-grid"); g.scrollIntoView({ block: "center" }); const h = g.querySelector(".trend-hit"); if (h) h.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); });
      await new Promise((r) => setTimeout(r, 300));
      await grid.screenshot({ path: path.join(OUT, `slot_${name}.png`) });
    }
    await page.evaluate(() => { const m = document.querySelector("#deep-modal .dp-close, #deep-modal .close"); if (m) m.click(); });
    await new Promise((r) => setTimeout(r, 400));
  }

  // 侧栏「数据更新」与无时序兜底
  const misc = await page.evaluate(() => {
    const noTs = window.__state.raw.contents.filter((c) => !c.timeseries).length;
    return { noTs };
  });
  console.log("无时序帖数:", misc.noTs);

  for (const [c, n] of [[picks.derived, "derived"], [picks.d0d7, "d0d7"], [picks.four, "four"], [picks.d2d7, "d2d7"]]) await shoot(c, n);

  console.log("=== ERRORS ===", JSON.stringify(errors));
  check(errors.length === 0, `无 JS 运行时错误（${errors.length}）`);
  console.log(fails.length ? `\n=== ${fails.length} 项未通过 ===` : "\n=== 全部通过 ===");
  await browser.close();
  server.close();
  process.exit(fails.length ? 1 : 0);
})();
