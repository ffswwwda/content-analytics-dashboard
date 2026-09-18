/* 时序图真浏览器验证：单点快照帖 / 多天帖 / 悬停 tooltip */
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
const PORT = 8124;
const OUT = path.join(ROOT, "scripts", "_shots");
fs.mkdirSync(OUT, { recursive: true });

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

  const picks = await page.evaluate(() => {
    const cs = window.__state.raw.contents || [];
    const dayKeys = (t) => Object.keys(t).filter((k) => Object.values(t[k]).some((v) => (v || 0) > 0));
    const one = cs.find((c) => String(c.id).includes("2067882882429816878"));
    const many = cs.find((c) => {
      if (!c.timeseries) return false;
      const ks = dayKeys(c.timeseries);
      if (ks.length < 2) return false;
      const maxV = Math.max(...ks.map((k) => c.timeseries[k].view || 0));
      return maxV > 50000;
    });
    const noTs = cs.filter((c) => !c.timeseries).length;
    return {
      one: one && { id: one.id, days: dayKeys(one.timeseries) },
      many: many && { id: many.id, days: dayKeys(many.timeseries) },
      noTsCount: noTs,
    };
  });
  console.log("PICKS:", JSON.stringify(picks));

  async function openAndShoot(id, name) {
    await page.evaluate((cid) => { window.__openDeep(cid); }, id);
    await new Promise((r) => setTimeout(r, 900));
    const info = await page.evaluate(() => {
      const grid = document.querySelector("#deep-modal .dp-trend-grid");
      if (!grid) return { rows: 0, note: (document.querySelector("#deep-modal .trend-empty") || {}).textContent || "" };
      const rows = grid.querySelectorAll(".trend-row").length;
      const hits = grid.querySelectorAll(".trend-hit").length;
      const labels = [...grid.querySelectorAll(".trend-xaxis span")].map((s) => s.textContent).join(",");
      const lefts = [...grid.querySelectorAll(".trend-xaxis span")].map((s) => s.style.left).join(",");
      const hit = grid.querySelector(".trend-hit");
      let tip = null;
      if (hit) {
        hit.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        const tipEl = grid.querySelector(".trend-tip.show");
        tip = tipEl ? tipEl.textContent.replace(/\s+/g, " ").trim() : "(not shown)";
        hit.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
      }
      return { rows, hits, labels, lefts, tip };
    });
    console.log(`[${name}]`, JSON.stringify(info));
    const grid = await page.$("#deep-modal .dp-trend-grid");
    if (grid) {
      await page.evaluate(() => { const g = document.querySelector("#deep-modal .dp-trend-grid"); g.scrollIntoView({ block: "center" }); });
      await new Promise((r) => setTimeout(r, 300));
      await grid.screenshot({ path: path.join(OUT, `trend2_${name}.png`) });
      // 再截一张「悬停 tooltip 已显示」的图
      await page.evaluate(() => {
        const g = document.querySelector("#deep-modal .dp-trend-grid");
        g.scrollIntoView({ block: "center" });
        const hit = g.querySelector(".trend-hit");
        hit.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      });
      await new Promise((r) => setTimeout(r, 250));
      await grid.screenshot({ path: path.join(OUT, `trend2_${name}_tip.png`) });
    }
  }

  if (picks.one) await openAndShoot(picks.one.id, "single");
  if (picks.many) await openAndShoot(picks.many.id, "multi");

  console.log("=== ERRORS ===", JSON.stringify(errors));
  await browser.close();
  server.close();
})();
