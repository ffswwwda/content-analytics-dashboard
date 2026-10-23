/**
 * 验证「竞品内容监测」板块新增的内容类型筛选（全部 / 原创 / 转推 / 被转原帖）。
 * 走真实 UI 路径：点导航 → 点 tab → 读 sec-head 统计 → 比对 JSON 真实值。
 *
 * 用法: node scripts/verify_posttype.js
 */
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function findChrome() {
  const bases = [
    require("os").homedir() + "/.cache/puppeteer/chrome-headless-shell",
    "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/chrome-headless-shell",
  ];
  for (const b of bases) {
    try {
      const out = execSync(`find ${b} -name chrome-headless-shell -type f 2>/dev/null`).toString().trim().split("\n").filter(Boolean);
      if (out[0]) return out[0];
    } catch (e) {}
  }
  return null;
}
const EXEC = findChrome();
if (!EXEC) { console.error("NO_CHROME"); process.exit(3); }

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const PORT = 8136;
const LIVE = process.argv.includes("--live");
/* --live 时页面资产从线上取，只把 data/*.json 换成本地同名文件。
   原因：本机 Chrome 拉 21MB 的 content_data.json 需 27~63s，会撞页面自身 45s 超时；
   而 curl 同一 URL 仅 2s。这是链路问题不是站点问题，--local-data 只为绕过传输、不改被验内容。 */
const LOCAL_DATA = process.argv.includes("--local-data");
const LIVE_BASE = "https://ffswwwda.github.io/content-analytics-dashboard";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
const check = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

(async () => {
  // 期望值直接从 JSON 现算，不硬编码
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "data/content_data.json"), "utf8"));
  const C = raw.contents;
  const ptOf = (c) => c.post_type || (c.content_source === "转发" ? "转发" : "发帖");
  const exp = {
    all: C.length,
    "发帖": C.filter((c) => ptOf(c) === "发帖").length,
    "转发": C.filter((c) => ptOf(c) === "转发").length,
    "被转发原帖": C.filter((c) => ptOf(c) === "被转发原帖").length,
  };
  console.log("JSON 真实值:", exp);

  const http = require("http");
  let server = null;
  if (!LIVE) {
    server = http.createServer((req, res) => {
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
  }
  const PAGE_URL = LIVE ? `${LIVE_BASE}/index.html` : `http://localhost:${PORT}/index.html`;

  const browser = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errs.push("console:" + m.text()); });
  if (LIVE && LOCAL_DATA) {
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const mm = req.url().match(/\/data\/(content_data|sample_data)\.json/);
      if (mm) {
        const f = path.join(ROOT, "data", mm[1] + ".json");
        if (fs.existsSync(f)) { req.respond({ status: 200, contentType: "application/json", body: fs.readFileSync(f) }); return; }
      }
      req.continue();
    });
  }
  await page.setViewport({ width: 1600, height: 1000 });
  await page.goto(PAGE_URL, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0, { timeout: 45000 });

  // 进入竞品内容监测
  await page.evaluate(() => {
    const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "competitor");
    if (el) el.click();
  });
  await page.waitForFunction(() => document.querySelector("#comp-posttype"), { timeout: 20000 });
  await sleep(400);

  // 页面首次进入默认选中排名第一的单品牌（不是全局视图）→ 先点「全部竞品」切到全局口径，
  // 否则后面读到的计数是单品牌的，会被误判成功能错误。
  await page.evaluate(() => {
    const c = document.querySelector('.comp-chip[data-brand="__all__"]');
    if (c) c.click();
  });
  await sleep(700);

  // 1) tab 存在且数量正确
  const tabs = await page.evaluate(() =>
    [...document.querySelectorAll("#comp-posttype .posttype-tab")].map((b) => ({
      pt: b.dataset.pt,
      label: b.querySelector("b") ? b.textContent.replace(b.querySelector("b").textContent, "").trim() : b.textContent.trim(),
      count: Number((b.querySelector("b") || {}).textContent || 0),
      on: b.classList.contains("on"),
    }))
  );
  check("tab 数量 = 4", tabs.length === 4, JSON.stringify(tabs.map((t) => t.pt)));
  check("默认选中「全部」", tabs[0] && tabs[0].pt === "all" && tabs[0].on, tabs[0] && tabs[0].label);

  // 2) 计数与 JSON 一致（计数显示的是该品牌/全部总量，用千分位或万缩写，故按数值比对）
  const cntOf = (pt) => (tabs.find((t) => t.pt === pt) || {}).count;
  check("全部计数 = " + exp.all, cntOf("all") === exp.all, "页面 " + cntOf("all"));
  check("原创计数 = " + exp["发帖"], cntOf("发帖") === exp["发帖"], "页面 " + cntOf("发帖"));
  check("转推计数 = " + exp["转发"], cntOf("转发") === exp["转发"], "页面 " + cntOf("转发"));

  // 3) 点「原创」→ sec-head 的「内容 N」应等于原创数
  const readHead = () => page.evaluate(() => {
    const b = document.querySelector(".comp-sec-badge");
    return b ? b.textContent.trim() : "";
  });
  const numIn = (s) => { const m = s.match(/内容\s*([\d,]+)/); return m ? Number(m[1].replace(/,/g, "")) : null; };

  await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="发帖"]').click());
  await sleep(450);
  let h1 = await readHead();
  const n1 = numIn(h1);
  // 全局视图下「内容 N」是聚合后条数，应 = 原创总数
  check("切到原创后 sec-head 内容数 = " + exp["发帖"], n1 === exp["发帖"], "页面 " + n1 + " | " + h1);

  await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="转发"]').click());
  await sleep(450);
  const n2 = numIn(await readHead());
  check("切到转推后 sec-head 内容数 = " + exp["转发"], n2 === exp["转发"], "页面 " + n2);

  await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="被转发原帖"]').click());
  await sleep(450);
  const n3 = numIn(await readHead());
  check("切到被转原帖后 sec-head 内容数 = " + exp["被转发原帖"], n3 === exp["被转发原帖"], "页面 " + n3);

  // 4) 切回全部
  await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="all"]').click());
  await sleep(450);
  const n4 = numIn(await readHead());
  check("切回全部后 sec-head 内容数 = " + exp.all, n4 === exp.all, "页面 " + n4);

  // 5) 单品牌视图：点第一个品牌 chip，tab 仍在且计数为该品牌口径
  const brandClicked = await page.evaluate(() => {
    const chips = [...document.querySelectorAll(".comp-chip")].filter((c) => c.dataset.brand && c.dataset.brand !== "__all__");
    if (!chips.length) return null;
    chips[0].click();
    return chips[0].dataset.brand;
  });
  await sleep(600);
  const stillHas = await page.evaluate(() => !!document.querySelector("#comp-posttype"));
  check("单品牌视图也有 tab", stillHas, "品牌=" + brandClicked);
  if (stillHas && brandClicked) {
    const brandTabs = await page.evaluate(() =>
      [...document.querySelectorAll("#comp-posttype .posttype-tab")].map((b) => ({
        pt: b.dataset.pt, count: Number((b.querySelector("b") || {}).textContent || 0),
      }))
    );
    const bExp = {
      all: C.filter((c) => c.account === brandClicked).length,
      "发帖": C.filter((c) => c.account === brandClicked && ptOf(c) === "发帖").length,
      "转发": C.filter((c) => c.account === brandClicked && ptOf(c) === "转发").length,
    };
    const bAll = (brandTabs.find((t) => t.pt === "all") || {}).count;
    check(`单品牌「${brandClicked}」全部计数 = ${bExp.all}`, bAll === bExp.all, "页面 " + bAll);
    const bOrig = (brandTabs.find((t) => t.pt === "发帖") || {}).count;
    check(`单品牌「${brandClicked}」原创计数 = ${bExp["发帖"]}`, bOrig === bExp["发帖"], "页面 " + bOrig);
    // 三档相加必须等于「全部」，否则说明有记录落在四档之外（未见类型）
    const bRep = (brandTabs.find((t) => t.pt === "转发") || {}).count;
    const bOrg = (brandTabs.find((t) => t.pt === "被转发原帖") || {}).count;
    check(`单品牌「${brandClicked}」转推计数 = ${bExp["转发"]}`, bRep === bExp["转发"], "页面 " + bRep);
    check(`单品牌「${brandClicked}」三档相加 = 全部`,
      bOrig + bRep + bOrg === bAll, `${bOrig}+${bRep}+${bOrg}=${bOrig + bRep + bOrg} vs ${bAll}`);
    // 切到原创，看 sec-head 是否随之变化
    await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="发帖"]').click());
    await sleep(450);
    const bn = numIn(await readHead());
    check(`单品牌切原创后 sec-head = ${bExp["发帖"]}`, bn === bExp["发帖"], "页面 " + bn);
    await page.evaluate(() => document.querySelector('#comp-posttype .posttype-tab[data-pt="all"]').click());
    await sleep(300);
  }

  // 6) 截图（全局 + 单品牌）——先关掉每日灵感盲盒弹窗，否则会被遮罩挡住
  await page.evaluate(() => { const c = document.querySelector("#bx-close"); if (c) c.click(); });
  await sleep(300);
  const shotDir = path.join(ROOT, "scripts", "_shots");
  fs.mkdirSync(shotDir, { recursive: true });
  await page.screenshot({ path: path.join(shotDir, "posttype-single.png") });
  await page.evaluate(() => { const c = document.querySelector('.comp-chip[data-brand="__all__"]'); if (c) c.click(); });
  await sleep(600);
  await page.screenshot({ path: path.join(shotDir, "posttype-all.png") });
  console.log("截图: scripts/_shots/posttype-all.png / posttype-single.png");

  check("无 JS 报错", errs.length === 0, errs.slice(0, 3).join(" | "));

  await browser.close();
  if (server) server.close();

  const failed = results.filter((r) => !r.pass);
  console.log(`\n===== ${results.length - failed.length}/${results.length} 通过 =====`);
  if (failed.length) { failed.forEach((f) => console.log("未通过:", f.name, "|", f.detail)); process.exit(1); }
})();
