// 验证本轮修复（真实浏览器）
//   默认：本地静态服务（8146），验的是待发布文件
//   --live：直接跑线上 GitHub Pages，验收发布结果
//   --live --local-data：页面资产仍从线上取，但把 data/*.json 的响应替换成本地同名文件。
//     用途：本机 Chrome 到 github.io 拉 20MB payload 极慢（实测 27~63s，而 curl 仅 2.1s），
//     会触发页面自身 45s 超时而回退/失败 —— 那是本机链路问题，不是站点问题。
//     因为线上 data/*.json 已用 md5 逐字节证明与本地一致，此处替换只绕过传输、不改变被验内容。
// 注意：期望值一律从本地 data/content_data.json 现算，不写死，避免下次换数据后必然误报。
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const EXEC = path.join(ROOT, "chrome-headless-shell/mac_arm-151.0.7922.34/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
const PORT = 8146;
const LIVE = process.argv.includes("--live");
const LOCAL_DATA = process.argv.includes("--local-data");
const BASE = LIVE ? "https://ffswwwda.github.io/content-analytics-dashboard" : `http://localhost:${PORT}`;
let pass = 0, fail = 0;
function ck(ok, msg) { console.log((ok ? "PASS " : "FAIL ") + msg); ok ? pass++ : fail++; }

// —— 期望值从本地数据现算 ——
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "content_data.json"), "utf8"));
const EXP_BRANDS = new Set(DATA.contents.map((c) => c.account).filter(Boolean)).size;
const EXP_VOICES = DATA.userVoices.length;

(async () => {
  let server = null;
  if (!LIVE) {
    server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
      const f = path.join(ROOT, p);
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end("nf"); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
      fs.createReadStream(f).pipe(res);
    });
    await new Promise((r) => server.listen(PORT, r));
  }
  console.log(`目标: ${BASE}/index.html (${LIVE ? "线上" : "本地"})`);
  console.log(`本地数据期望: 品牌数=${EXP_BRANDS}, 回帖=${EXP_VOICES}\n`);

  const b = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu"] });
  const p = await b.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => { if (m.type() === "error") errs.push("c:" + m.text().slice(0, 160)); });

  if (LIVE && LOCAL_DATA) {
    console.log("【模式】线上页面资产 + 本地 data/*.json（已证与线上逐字节一致，仅绕过本机慢链路）\n");
    await p.setRequestInterception(true);
    p.on("request", (req) => {
      const u = req.url();
      const mm = u.match(/\/data\/(content_data|sample_data)\.json/);
      if (mm) {
        const f = path.join(ROOT, "data", mm[1] + ".json");
        if (fs.existsSync(f)) {
          req.respond({ status: 200, contentType: "application/json", body: fs.readFileSync(f) });
          return;
        }
      }
      req.continue();
    });
  }

  await p.setViewport({ width: 1600, height: 1100 });
  // 线上是 18MB 数据，networkidle0 不可靠
  await p.goto(`${BASE}/index.html`, { waitUntil: LIVE ? "domcontentloaded" : "networkidle0", timeout: LIVE ? 180000 : 150000 });
  await p.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 180000 });

  // 1) 数据源看板
  await p.evaluate(() => { const e = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "sourcedb"); if (e) e.click(); });
  await new Promise((r) => setTimeout(r, 2500));
  const kpi = await p.evaluate(() => {
    const t = document.getElementById("board").textContent.replace(/\s+/g, " ");
    const a = t.match(/([0-9,]+)\s*品牌数/);   // DOM 里是「16品牌数」这种「值在前」的顺序
    const bb = t.match(/品牌数\s*([0-9,]+)/);
    return { v: (a && a[1]) || (bb && bb[1]) || null };
  });
  ck(kpi.v === String(EXP_BRANDS), `数据源看板「品牌数」= ${kpi.v}（期望 ${EXP_BRANDS}）`);
  const sub = await p.evaluate(() => [...document.querySelectorAll("#board *")]
    .filter((n) => n.children.length === 0 && /条用户回帖/.test(n.textContent || ""))
    .map((e) => e.textContent.trim()));
  ck(sub.length === 0 || !sub.some((s) => /6793/.test(s)), "回帖副标题已无写死的 6793（实测: " + JSON.stringify(sub) + "）");

  // 2) 爆款页洞察
  await p.evaluate(() => { const e = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "viraldeep"); if (e) e.click(); });
  await new Promise((r) => setTimeout(r, 3500));
  const ins = await p.evaluate(() => {
    const t = document.getElementById("board").textContent.replace(/\s+/g, " ");
    const i = t.indexOf("核心发现");
    return i >= 0 ? t.slice(i, i + 330) : "(未找到)";
  });
  console.log("\n--- 洞察文案 ---\n" + ins + "\n");
  const m = ins.match(/驱动因素：(.+?) 是与普通内容差距最大的指标/);
  ck(!!m, "洞察含「驱动因素：…是与普通内容差距最大的指标」");
  if (m) {
    const nums = [...m[1].matchAll(/([0-9.]+)x/g)].map((x) => parseFloat(x[1]));
    ck(nums.length > 0 && nums.every((v) => v > 1), "驱动因素倍数全部 >1（实测 " + nums.join(", ") + "）");
  }
  ck(!/传播率\s*0\.0x/.test(ins), "不再出现「传播率 0.0x」");
  ck(!/转载型内容天然具备传播优势/.test(ins), "已移除与数据相反的「转载型天然具备传播优势」");
  ck(!/品牌标杆：（/.test(ins), "品牌标杆不再为空");
  ck(/共 \d+ 个品牌可按爆款率比较/.test(ins), "品牌标杆标明了品牌数");

  // 3) 品牌 TOP5（在默认「全部」页签下的「维度深度钻取」总览里，不在「按品牌」子页）
  const top5 = await p.evaluate(() => {
    const t = document.getElementById("board").textContent.replace(/\s+/g, " ");
    const i = t.indexOf("品牌 TOP5");
    return i >= 0 ? t.slice(i, i + 70) : "(未找到)";
  });
  console.log("品牌TOP5:", top5);
  ck(/品牌 TOP5[^(\s]/.test(top5) && !/品牌 TOP5\(空\)/.test(top5), "「品牌 TOP5」首位是真实品牌名（非空）");

  console.log("\nJS 错误:", errs.length ? errs : "[]");
  ck(errs.length === 0, "0 JS 错误");
  console.log("\n=== " + (fail === 0 ? "全部通过" : fail + " 项失败") + " (" + pass + " pass / " + fail + " fail) ===");
  await b.close(); if (server) server.close();
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error("失败:", e.message); process.exit(1); });
