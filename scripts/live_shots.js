/* 线上页面截图取证：直接打开 GitHub Pages，逐板块截图 + 记录溢出/报错。
   用途：用户问「页面能打开吗」时给出可看的证据，而不是口头保证。
   用法：node scripts/live_shots.js            # 默认 1440×900
        node scripts/live_shots.js 1280 800    # 自定义视口 */
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
const URL = "https://ffswwwda.github.io/content-analytics-dashboard/index.html";
const OUT = path.join(ROOT, "scripts", "_shots", "live");
fs.mkdirSync(OUT, { recursive: true });

const W = parseInt(process.argv[2] || "1440", 10);
const H = parseInt(process.argv[3] || "900", 10);

// board 名 -> 人话板块名（截图文件名带中文，方便直接看）
const BOARDS = [
  ["library", "灵感库"],
  ["viraldeep", "爆款深度分析"],
  ["reference", "找参考"],
  ["sourcedb", "源数据看板"],
  ["competitor", "看竞品"],
  ["branduser", "品牌用户"],
  ["userseg", "用户分群"],
  ["usertier", "用户分层"],
  ["uservoice", "用户原声"],
  ["myops", "我方运营"],
  ["compare", "多品对比"],
  ["growth", "增长"],
];

const report = [];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXEC, headless: "shell",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: W, height: H });

  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url().slice(0, 120) + " :: " + (r.failure() || {}).errorText));
  const statuses = [];
  page.on("response", (r) => statuses.push([r.status(), r.url().slice(0, 110)]));

  const t0 = Date.now();
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 120000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0
    && document.getElementById("board") && document.getElementById("board").innerHTML.length > 50, { timeout: 90000 });
  const loadMs = Date.now() - t0;

  // 标题 + 徽标：证明加载的是线上这一版
  const head = await page.evaluate(() => {
    const lu = document.getElementById("last-updated");
    return {
      title: document.title,
      scripts: [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).join(","),
      badge: lu ? lu.textContent.trim() : "(无)",
      badgeTitle: lu ? (lu.getAttribute("title") || "") : "",
      navCount: document.querySelectorAll(".nav-item").length,
      boards: [...document.querySelectorAll(".nav-item")].map((x) => x.dataset.board),
    };
  });
  report.push({
    step: "加载", http: statuses.find((s) => s[1].includes("index.html"))?.[0] || "?",
    loadMs, title: head.title, badge: head.badge, navCount: head.navCount,
  });

  // 首屏总览（把内层滚动容器临时放开，让 fullPage 能抓到全部内容）
  await page.screenshot({ path: path.join(OUT, "00_首屏.png") });

  // 逐板块
  let i = 1;
  for (const [id, name] of BOARDS) {
    const exists = head.boards.includes(id);
    if (!exists) { report.push({ step: name, board: id, skipped: "导航里没有这个板块" }); continue; }
    await page.evaluate((bid) => {
      const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === bid);
      if (el) el.click();
      const b = document.getElementById("board"); if (b) b.scrollTop = 0;
    }, id);
    await new Promise((r) => setTimeout(r, 900));

    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const board = document.getElementById("board");
      const txt = board ? board.innerText.replace(/\s+/g, " ").trim() : "";
      return {
        overflowX: de.scrollWidth - de.clientWidth,
        boardH: board ? board.scrollHeight : 0,
        boardVisibleH: board ? board.clientHeight : 0,
        chars: txt.length,
        head: txt.slice(0, 70),
        badTokens: (txt.match(/NaN|undefined|\[object Object\]/g) || []).length,
        canvases: board ? board.querySelectorAll("canvas").length : 0,
        svgs: board ? board.querySelectorAll("svg").length : 0,
      };
    });
    const file = String(i).padStart(2, "0") + "_" + name + ".png";
    await page.screenshot({ path: path.join(OUT, file) });
    report.push({
      step: name, board: id, shot: file, overflowX: m.overflowX, chars: m.chars,
      canvas: m.canvases, svg: m.svgs, badTokens: m.badTokens,
      "内容可滚高度": m.boardH + "/" + m.boardVisibleH, 摘要: m.head,
    });
    i++;
  }

  console.log("=== 线上截图报告 ===");
  report.forEach((r) => console.log(JSON.stringify(r, null, 0)));
  console.log("\n=== HTTP 非 200 ===");
  const bad = statuses.filter((s) => s[0] >= 400);
  console.log(bad.length ? bad.map((b) => b.join(" ")).join("\n") : "无");
  console.log("\n=== 请求失败 ===");
  console.log(failed.length ? failed.join("\n") : "无");
  console.log("\n=== JS 错误 (" + errors.length + ") ===");
  console.log(errors.length ? errors.slice(0, 20).join("\n") : "无");
  console.log("\n输出目录:", OUT);

  await browser.close();
  process.exit(0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
