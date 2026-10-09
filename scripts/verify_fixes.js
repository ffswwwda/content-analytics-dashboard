// 验证本轮三处修复（真实浏览器）
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const EXEC = path.join(ROOT, "chrome-headless-shell/mac_arm-151.0.7922.34/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
let pass = 0, fail = 0;
function ck(ok, msg) { console.log((ok ? "PASS " : "FAIL ") + msg); ok ? pass++ : fail++; }

(async () => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]); if (p === "/") p = "/index.html";
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end("nf"); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(8146, r));
  const b = await puppeteer.launch({ executablePath: EXEC, headless: "shell", args: ["--no-sandbox", "--disable-gpu"] });
  const p = await b.newPage();
  const errs = [];
  p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  p.on("console", (m) => { if (m.type() === "error") errs.push("c:" + m.text().slice(0, 160)); });
  await p.setViewport({ width: 1600, height: 1100 });
  await p.goto("http://localhost:8146/index.html", { waitUntil: "networkidle0", timeout: 150000 });
  await p.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 150000 });

  // 1) 数据源看板
  await p.evaluate(() => { const e = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "sourcedb"); if (e) e.click(); });
  await new Promise((r) => setTimeout(r, 1500));
  const kpi = await p.evaluate(() => {
    const t = document.getElementById("board").textContent.replace(/\s+/g, " ");
    const a = t.match(/([0-9,]+)\s*品牌数/);   // DOM 里是「16品牌数」这种「值在前」的顺序
    const b = t.match(/品牌数\s*([0-9,]+)/);
    return { v: (a && a[1]) || (b && b[1]) || null };
  });
  ck(kpi.v === "15", "数据源看板「品牌数」= " + kpi.v + "（期望 15）");
  const sub = await p.evaluate(() => [...document.querySelectorAll("#board *")]
    .filter((n) => n.children.length === 0 && /条用户回帖/.test(n.textContent || ""))
    .map((e) => e.textContent.trim()));
  ck(sub.length === 0 || !sub.some((s) => /6793/.test(s)), "回帖副标题已无写死的 6793（实测: " + JSON.stringify(sub) + "）");

  // 2) 爆款页洞察
  await p.evaluate(() => { const e = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === "viraldeep"); if (e) e.click(); });
  await new Promise((r) => setTimeout(r, 2500));
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
  await b.close(); server.close();
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => { console.error("失败:", e.message); process.exit(1); });
