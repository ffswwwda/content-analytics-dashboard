/* 诊断探针：线上页面加载卡在哪一步。
   记录每个请求的开始/失败/状态码、控制台错误、页面错误，并周期性打印 DOM 就绪进度。 */
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");

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

const BASE = process.argv[2] || "https://ffswwwda.github.io/content-analytics-dashboard";
const EXEC = findChrome();
const t0 = Date.now();
const el = () => ((Date.now() - t0) / 1000).toFixed(1) + "s";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXEC, headless: "shell",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 960 });

  page.on("request", (r) => {
    const u = r.url();
    if (u.startsWith(BASE) || u.includes("github")) console.log(`[${el()}] REQ  ${r.method()} ${u.slice(0, 110)}`);
  });
  page.on("requestfailed", (r) => console.log(`[${el()}] FAIL ${r.url().slice(0, 110)} :: ${r.failure() && r.failure().errorText}`));
  page.on("response", (r) => {
    const u = r.url();
    if (u.endsWith(".json") || u.endsWith(".js") || u.endsWith(".html")) {
      console.log(`[${el()}] RES  ${r.status()} ${u.slice(0, 110)}`);
    }
  });
  page.on("pageerror", (e) => console.log(`[${el()}] PAGEERR ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") console.log(`[${el()}] CONSOLE-ERR ${m.text().slice(0, 200)}`); });

  console.log(`[${el()}] goto ${BASE}/index.html`);
  try {
    await page.goto(`${BASE}/index.html`, { waitUntil: "domcontentloaded", timeout: 120000 });
    console.log(`[${el()}] domcontentloaded OK`);
  } catch (e) {
    console.log(`[${el()}] goto 失败: ${e.message}`);
  }

  // 每 15s 打印一次页面状态，最多 8 分钟
  for (let i = 0; i < 32; i++) {
    await new Promise((r) => setTimeout(r, 15000));
    let st;
    try {
      st = await page.evaluate(() => ({
        nav: document.querySelectorAll(".nav-item").length,
        board: (document.getElementById("board") || {}).innerHTML ? document.getElementById("board").innerHTML.length : -1,
        lu: document.getElementById("last-updated") ? document.getElementById("last-updated").textContent.trim() : "(无)",
        nodes: document.querySelectorAll("[data-id]").length,
        ready: document.readyState,
      }));
    } catch (e) {
      st = { err: e.message.slice(0, 120) };
    }
    console.log(`[${el()}] 状态`, JSON.stringify(st));
    if (st.nav > 0 && st.board > 50) { console.log(`[${el()}] 页面已就绪`); break; }
  }

  await browser.close();
})();
