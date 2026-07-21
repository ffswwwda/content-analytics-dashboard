const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// 找到已安装的 chrome-headless-shell（缓存目录 或 项目目录）
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
console.log("CHROME:", EXEC);

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const PORT = 8123;
const OUT = path.join(ROOT, "scripts", "_shots");
fs.mkdirSync(OUT, { recursive: true });

const BOARDS = ["library", "reference", "viraldeep", "competitor", "compare", "branduser", "userseg", "usertier", "uservoice", "myops"];

(async () => {
  // 启动本地静态服务器
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

  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console:" + m.text()); });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 60000 });
  // 等 init 完成
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board") && document.getElementById("board").innerHTML.length > 50, { timeout: 40000 });

  const report = [];
  for (const id of BOARDS) {
    await page.evaluate((bid) => {
      const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === bid);
      if (el) el.click();
    }, id);
    await new Promise((r) => setTimeout(r, 500));
    // 爆款深度分析默认是「全部」总览，切到「爆款高频主题」维度以展示排序按钮
    if (id === "viraldeep") {
      try { await page.click('#vd-dim-tabs .uv-tab[data-vd-dim="topic"]', { delay: 20 }); } catch (e) {}
      await new Promise((r) => setTimeout(r, 500));
    }
    // 多竞品横向对比：勾选 3 个品牌以展示对比矩阵
    if (id === "compare") {
      try { await page.evaluate(() => { [...document.querySelectorAll(".cmp-chip")].slice(0, 3).forEach((c) => c.click()); }); } catch (e) {}
      await new Promise((r) => setTimeout(r, 500));
    }
    // 检测横向溢出
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      const be = document.body;
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, bodyScrollW: be.scrollWidth, diff: de.scrollWidth - de.clientWidth };
    });
    const shot = path.join(OUT, id + ".png");
    await page.screenshot({ path: shot, fullPage: false });
    report.push({ id, overflowX: overflow.diff, scrollW: overflow.scrollW, clientW: overflow.clientW, shot });
  }
  // 核对数据浮层（真实浏览器验证）
  try {
    await page.evaluate(() => { [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "competitor").click(); });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => document.getElementById("verify-btn").click());
    await new Promise((r) => setTimeout(r, 300));
    await page.evaluate(() => document.getElementById("verify-run").click());
    await new Promise((r) => setTimeout(r, 3500));
    const v = await page.evaluate(() => {
      const m = document.getElementById("verify-modal");
      const rows = m ? m.querySelectorAll(".vrow") : [];
      const ok = [...rows].filter((r) => r.querySelector(".vrow-status.ok")).length;
      const fail = [...rows].filter((r) => r.querySelector(".vrow-status.fail")).length;
      return { open: !!m && !m.hidden, rows: rows.length, ok, fail };
    });
    const vshot = path.join(OUT, "verify.png");
    await page.screenshot({ path: vshot });
    report.push({ id: "verify-modal", rows: v.rows, ok: v.ok, fail: v.fail, shot: vshot });
    await page.evaluate(() => { const m = document.getElementById("verify-modal"); if (m) m.hidden = true; });
  } catch (e) { errors.push("verify-modal: " + e.message); }
  console.log("=== 视觉/溢出报告 ===");
  report.forEach((r) => console.log(JSON.stringify(r)));
  console.log("=== 页面错误 ===");
  console.log(errors.length, errors.slice(0, 20).join("\n"));
  await browser.close();
  server.close();
  process.exit(0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
