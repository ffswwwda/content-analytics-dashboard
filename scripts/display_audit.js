// 显示问题自动体检：NaN/undefined 文本、内容溢出、空区块、横向裁切、图表异常
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const EXEC = path.join(ROOT, "chrome-headless-shell/mac_arm-151.0.7922.34/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const PORT = 8134;
const BOARDS = ["sourcedb", "library", "reference", "viraldeep", "competitor", "compare", "growth", "branduser", "userseg", "usertier", "uservoice", "myops"];
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };

(async () => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end("nf"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(PORT, r));
  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console:" + m.text()); });
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 60000 });

  for (const id of BOARDS) {
    await page.evaluate((bid) => { const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === bid); if (el) el.click(); }, id);
    await new Promise((r) => setTimeout(r, 700));
    if (id === "viraldeep") { try { await page.click('#vd-dim-tabs .uv-tab[data-vd-dim="topic"]', { delay: 20 }); } catch (e) {} }
    if (id === "compare") { try { await page.evaluate(() => [...document.querySelectorAll(".cmp-chip")].slice(0, 3).forEach((c) => c.click())); } catch (e) {} }
    await new Promise((r) => setTimeout(r, 500));
    const r = await page.evaluate(() => {
      const b = document.getElementById("board");
      const txt = (el) => (el.textContent || "").trim();
      const bad = [];
      // 1) 异常文本
      const badRe = /(\bNaN\b|\bundefined\b|\bnull\b|Infinity|\[object Object\]|%undefined|-100%)/;
      b.querySelectorAll("div,span,b,small,em,i,td,th,p").forEach((el) => {
        if (el.children.length) return;
        const t = txt(el);
        if (t && badRe.test(t)) bad.push({ kind: "badtext", t: t.slice(0, 60), cls: String(el.className).slice(0, 30) });
      });
      // 2) 文本被横向裁切（可见但内容超出且 overflow hidden/clip）
      const clipped = [];
      b.querySelectorAll("*").forEach((el) => {
        const cs = getComputedStyle(el);
        if (cs.overflowX === "hidden" || cs.overflow === "hidden") {
          if (el.scrollWidth - el.clientWidth > 4 && el.clientWidth > 20) clipped.push({ t: txt(el).slice(0, 40), cls: String(el.className).slice(0, 30), over: el.scrollWidth - el.clientWidth });
        }
      });
      // 3) 图表 svg 是否有异常尺寸
      const svgs = [...b.querySelectorAll("svg")].map((s) => ({ w: Math.round(s.getBoundingClientRect().width), h: Math.round(s.getBoundingClientRect().height), cls: String(s.getAttribute("class") || "").slice(0, 24) }));
      const zeroSvg = svgs.filter((s) => s.w === 0 || s.h === 0);
      // 4) 空区块标题（有标题但下面无内容）
      const empties = [];
      b.querySelectorAll(".uv-sec-title,.dp-sec-title,.card-title,.panel-title").forEach((el) => {
        const nxt = el.nextElementSibling;
        if (nxt && nxt.getBoundingClientRect().height < 4) empties.push(txt(el).slice(0, 40));
      });
      // 5) 文字溢出到视口右侧之外的可见元素
      const outside = [];
      b.querySelectorAll("*").forEach((el) => {
        const rc = el.getBoundingClientRect();
        if (rc.width > 0 && rc.height > 0 && rc.right > window.innerWidth + 2) outside.push({ cls: String(el.className).slice(0, 30), right: Math.round(rc.right) });
      });
      return {
        badText: bad.slice(0, 8), badTextN: bad.length,
        clipped: clipped.slice(0, 6), clippedN: clipped.length,
        svgN: svgs.length, zeroSvg,
        emptiesN: empties.length, empties: empties.slice(0, 5),
        outsideN: outside.length, outside: outside.slice(0, 5),
      };
    });
    console.log(id, JSON.stringify(r));
  }
  console.log("=== ERRORS ===", errors.length, errors.slice(0, 8).join(" | "));
  await browser.close(); server.close(); process.exit(0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
