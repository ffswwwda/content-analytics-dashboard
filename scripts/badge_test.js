/* 侧边栏「更新于 / 数据截止」徽标验证（本地静态服务 + 真实 UI，无调试钩子） */
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findChrome() {
  for (const base of [require("os").homedir() + "/.cache/puppeteer/chrome-headless-shell",
    "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/chrome-headless-shell"]) {
    try {
      const o = execSync(`find ${base} -name chrome-headless-shell -type f 2>/dev/null`).toString().trim().split("\n").filter(Boolean);
      if (o[0]) return o[0];
    } catch (e) {}
  }
  return null;
}
const EXEC = findChrome();
if (!EXEC) { console.error("NO_CHROME"); process.exit(3); }

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const PORT = 8130;
const OUT = path.join(ROOT, "scripts", "_shots");
fs.mkdirSync(OUT, { recursive: true });

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

  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 960 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 60000 });

  const info = await page.evaluate(() => {
    const lu = document.getElementById("last-updated");
    const r = lu ? lu.getBoundingClientRect() : null;
    return {
      text: lu ? lu.textContent.trim() : "(元素不存在)",
      title: lu ? (lu.getAttribute("title") || "") : "",
      visible: !!r && r.width > 0 && r.height > 0,
      w: r ? Math.round(r.width) : 0,
      h: r ? Math.round(r.height) : 0,
    };
  });
  console.log("徽标:", JSON.stringify(info, null, 1));

  check(/^更新于 \d{4}-\d{2}-\d{2}$/.test(info.text), `文案形如「更新于 YYYY-MM-DD」（实测「${info.text}」）`);
  check(info.text === "更新于 2026-09-21", `显示今天的更新日 2026-09-21（实测「${info.text}」）`);
  check(info.title === "数据截止 2026-09-18（源监控最后一个抓取批次）", `悬停提示写明数据截止日（实测「${info.title}」）`);
  check(info.visible, `徽标可见（${info.w}×${info.h}）`);
  check(!/数据更新/.test(info.text), `旧文案「数据更新」已移除（实测「${info.text}」）`);

  // 截侧边栏徽标
  const el = await page.$("#last-updated");
  if (el) {
    const box = await el.boundingBox();
    if (box) {
      await page.screenshot({
        path: path.join(OUT, "badge_updated.png"),
        clip: { x: Math.max(0, box.x - 130), y: Math.max(0, box.y - 60), width: 320, height: Math.max(110, box.height + 90) },
      });
    }
  }

  console.log("=== 页面错误 ===", JSON.stringify(errors));
  check(errors.length === 0, `0 JS 错误（实测 ${errors.length}）`);
  console.log(fails.length ? `\n=== ${fails.length} 项未通过 ===` : "\n=== 全部通过 ===");
  await browser.close();
  server.close();
  process.exit(fails.length ? 1 : 0);
})();
