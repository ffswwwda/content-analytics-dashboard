/* 线上生产环境时序口径实测：直接打开 GitHub Pages，不做任何本地注入
   目的：证明用户看到的线上页面里，x 轴标签只出现 D0/D1/D2/D7。 */
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

const URL = "https://ffswwwda.github.io/content-analytics-dashboard/index.html";
const OUT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard/scripts/_shots";
fs.mkdirSync(OUT, { recursive: true });

const fails = [];
function check(ok, msg) { console.log((ok ? "PASS " : "FAIL ") + msg); if (!ok) fails.push(msg); }

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EXEC, headless: "shell",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--ignore-certificate-errors"],
  });
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => { try { localStorage.setItem("ca_bx_first_seen", "1"); } catch (e) {} });
  await page.setViewport({ width: 1440, height: 960 });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  console.log("打开线上:", URL);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 120000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 90000 });

  // 确认线上加载的版本与本地 index.html 一致。
  // 不写死版本号：每次发版都会 +1，写死会让这条断言在发版后必然误报 FAIL。
  const expectVer = ((fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8")
    .match(/app\.js\?v=(\d+)/) || [])[1]) || "";
  const ver = await page.evaluate(() => {
    const t = [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).join(",");
    return t;
  });
  console.log("线上引用的脚本:", ver);
  check(new RegExp("app\\.js\\?v=" + expectVer + "(?![0-9])").test(ver),
    `线上加载 app.js?v=${expectVer}（取自本地 index.html；实测 ${ver}）`);

  const gotoLibrary = async () => {
    await page.evaluate(() => { const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "library"); if (el) el.click(); });
    await new Promise((r) => setTimeout(r, 800));
  };
  const setSearch = async (q) => {
    await page.evaluate((v) => { const i = document.getElementById("global-search"); if (i) { i.value = v; i.dispatchEvent(new Event("input", { bubbles: true })); } }, q);
    await new Promise((r) => setTimeout(r, 900));
  };
  const readTrend = () => page.evaluate(() => {
    const grid = document.querySelector("#deep-modal .dp-trend-grid");
    if (!grid) return { none: (document.querySelector("#deep-modal .trend-empty") || {}).textContent || "无" };
    const first = grid.querySelector(".trend-row");
    const labels = [...first.querySelectorAll(".trend-xaxis span")].map((s) => ({ t: s.textContent, l: s.style.left }));
    const rows = [...grid.querySelectorAll(".trend-row")];
    // 收集该帖所有轴标签文本（含多行）
    const all = rows.map((r) => [...r.querySelectorAll(".trend-xaxis span")].map((s) => s.textContent));
    const tips = [];
    rows.forEach((row) => {
      const hit = row.querySelector(".trend-hit");
      if (!hit) return;
      hit.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      const el = row.querySelector(".trend-tip.show");
      tips.push(el ? el.textContent.replace(/\s+/g, " ").trim() : "");
      hit.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    });
    return { rows: rows.length, labels, all, tips };
  });
  async function openPost(id, q, tag, shot) {
    await gotoLibrary();
    if (q) await setSearch(q);
    const found = await page.evaluate((cid) => {
      const el = document.querySelector(`#board [data-id="${cid}"]`);
      if (!el) return false;
      el.scrollIntoView({ block: "center" }); el.click(); return true;
    }, id);
    if (!found) return { none: `列表里没找到 ${id}` };
    await new Promise((r) => setTimeout(r, 700));
    const ok = await page.evaluate(() => { const b = document.getElementById("deep-open"); if (b) { b.click(); return true; } return false; });
    if (!ok) return { none: "没出现「进入单帖深度分析」按钮" };
    await new Promise((r) => setTimeout(r, 1000));
    const info = await readTrend();
    info.id = id;
    if (shot) {
      const g = await page.$("#deep-modal .dp-trend-grid");
      if (g) {
        await page.evaluate(() => { const x = document.querySelector("#deep-modal .dp-trend-grid"); x.scrollIntoView({ block: "center" }); const h = x.querySelector(".trend-hit"); if (h) h.dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); });
        await new Promise((r) => setTimeout(r, 350));
        await g.screenshot({ path: path.join(OUT, `live_${shot}.png`) });
      }
    }
    await page.evaluate(() => { const c = document.getElementById("deep-close"); if (c) c.click(); });
    await new Promise((r) => setTimeout(r, 400));
    return info;
  }

  const seen = [];
  function verify(info, tag) {
    if (info.none) { check(false, `[${tag}] ${info.none}`); return; }
    const flat = [];
    (info.all || []).forEach((arr) => arr.forEach((t) => { if (t) flat.push(t); }));
    const bad = [...new Set(flat)].filter((t) => !/^D(0|1|2|7)$/.test(t));
    check(bad.length === 0, `[${tag} ${info.id}] 轴标签只出现 D0/D1/D2/D7（出现集合=${JSON.stringify([...new Set(flat)])}${bad.length ? " 非法=" + JSON.stringify(bad) : ""}）`);
    seen.push({ tag, id: info.id, labels: [...new Set(flat)].join("/"), rows: info.rows });
  }

  // 抽样：灵感库前 10 张卡
  await gotoLibrary();
  for (let k = 0; k < 10; k++) {
    const ids = await page.evaluate((i) => [...document.querySelectorAll("#board [data-id]")].map((e) => e.dataset.id).slice(i, i + 1), k);
    if (!ids.length) break;
    const info = await openPost(ids[0], null, "s" + k);
    verify(info, "抽样" + k);
  }

  // 定向：口径A 四窗齐全 / 口径B 推算单点
  const CASES = [
    { id: "ID:2072832693986095512", q: "We found a new way to play music", tag: "四窗齐全", shot: "src4", expect: /D0.*D1.*D2.*D7/ },
    { id: "ID:2067882882429816878", q: "Silver figurine depicting either a dragon", tag: "推算D32", shot: "derived32", tip: /实为第32天/ },
    { id: "ID:2077775539503300635", q: "blessed the feed with a photo dump", tag: "推算D5", shot: "derived5", tip: /实为第5天/ },
  ];
  for (const cs of CASES) {
    const info = await openPost(cs.id, cs.q, cs.tag, cs.shot);
    console.log(`定向[${cs.tag}]`, JSON.stringify(info));
    verify(info, cs.tag);
    if (info.none) continue;
    const flat = [];
    (info.all || []).forEach((arr) => arr.forEach((t) => { if (t) flat.push(t); }));
    const uniq = [...new Set(flat)];
    if (cs.expect) check(cs.expect.test(uniq.join(" ")), `[${cs.tag}] 出现 D0/D1/D2/D7 全套（实测 ${uniq.join(" ")}）`);
    if (cs.tip) {
      const tips = (info.tips || []).join(" ");
      check(cs.tip.test(tips), `[${cs.tag}] 悬停照实显示真实天数（实测「${tips.slice(0, 90)}」）`);
    }
  }

  console.log("=== 线上页面错误 ===", JSON.stringify(errors));
  check(errors.length === 0, `线上 0 JS 错误（实测 ${errors.length}）`);
  console.log("\n=== 线上抽样汇总 ===");
  seen.forEach((r) => console.log(JSON.stringify(r)));
  console.log(fails.length ? `\n=== ${fails.length} 项未通过 ===` : "\n=== 线上全部通过 ===");
  await browser.close();
  process.exit(fails.length ? 1 : 0);
})();
