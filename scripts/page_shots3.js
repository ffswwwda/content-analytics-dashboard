// 逐板块整页长图：滚动内层容器 → canvas 拼接；同时输出每屏分段图
const puppeteer = require("/Users/fsw/.workbuddy/binaries/node/workspace/node_modules/puppeteer-core");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "/Users/fsw/WorkBuddy/2026-07-10-18-44-40/content-analytics-dashboard";
const EXEC = path.join(ROOT, "chrome-headless-shell/mac_arm-151.0.7922.34/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const OUT = path.join(ROOT, "scripts/_shots/pages");
const SEGDIR = path.join(OUT, "seg");
const PORT = 8133;
const CAP = Number(process.env.CAP || 6200);

const BOARDS = process.argv[2] ? process.argv[2].split(",") : [
  "sourcedb", "library", "reference", "viraldeep", "competitor", "compare",
  "growth", "branduser", "userseg", "usertier", "uservoice", "myops",
];

const MIME = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };

function deps() { return { fs, path, OUT, SEGDIR }; }

async function stitch(page, rect, id, suffix, cap, pick) {
  const targets = [];
  for (let y = 0; y < Math.min(rect.H, cap); y += rect.h) targets.push(y);
  if (!targets.length) targets.push(0);

  const shots = [];
  let segIdx = 0;
  // 内层列表：先把主容器滚到它可见，再按新几何抓取
  if (pick === "inner") {
    const r2 = await page.evaluate(() => {
      const isScroll = (el) => { const o = getComputedStyle(el).overflowY; return o === "auto" || o === "scroll"; };
      const board = document.getElementById("board");
      const all = [];
      document.querySelectorAll("*").forEach((e) => { if (isScroll(e) && e.scrollHeight - e.clientHeight > 20) all.push(e); });
      const inner = all.filter((e) => e !== board).sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0];
      if (!inner || !board) return null;
      const bR = board.getBoundingClientRect();
      const iR = inner.getBoundingClientRect();
      board.scrollTop += (iR.top - bR.top);
      const r = inner.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: inner.clientHeight };
    });
    if (!r2) return;
    rect = { ...rect, ...r2 };
    await new Promise((r) => setTimeout(r, 300));
  }
  for (const y of targets) {
    const actual = await page.evaluate((yy, mode) => {
      const isScroll = (el) => { const o = getComputedStyle(el).overflowY; return o === "auto" || o === "scroll"; };
      const board = document.getElementById("board");
      const boardOk = board && isScroll(board) && board.scrollHeight - board.clientHeight > 20;
      let el = null;
      if (mode === "main") {
        el = boardOk ? board : null;
      } else {
        const all = [];
        document.querySelectorAll("*").forEach((e) => { if (isScroll(e) && e.scrollHeight - e.clientHeight > 20) all.push(e); });
        el = all.filter((e) => e !== board).sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight))[0] || null;
      }
      if (!el && boardOk) el = board;
      if (el) el.scrollTop = yy;
      return el ? el.scrollTop : 0;
    }, y, pick || "main");
    await new Promise((r) => setTimeout(r, 260));
    if (shots.length && shots[shots.length - 1].y === actual) continue;
    const b64 = await page.screenshot({ encoding: "base64", captureBeyondViewport: true, clip: { x: rect.x, y: rect.y, width: rect.w, height: rect.h } });
    segIdx++;
    fs.writeFileSync(path.join(SEGDIR, `${id}${suffix ? "_" + suffix : ""}_${segIdx}.png`), Buffer.from(b64, "base64"));
    shots.push({ y: actual, b64 });
  }

  const out = path.join(OUT, id + (suffix ? "_" + suffix : "") + ".png");
  const canvasH = shots[shots.length - 1].y + rect.h;
  const dataUrl = await page.evaluate(async (list, w, h, totalH) => {
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = totalH;
    const cx = cv.getContext("2d");
    cx.fillStyle = "#0b1020";
    cx.fillRect(0, 0, w, totalH);
    for (const item of list) {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/png;base64," + item.b64; });
      cx.drawImage(img, 0, item.y);
    }
    return cv.toDataURL("image/png");
  }, shots, rect.w, rect.h, canvasH);
  fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
  const buf = fs.readFileSync(out);
  console.log(JSON.stringify({ id: id + (suffix ? "_" + suffix : ""), scrollerH: rect.H, clientH: rect.h, segs: shots.length, cover: canvasH, png: `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}` }));
  return shots.length;
}

(async () => {
  fs.mkdirSync(SEGDIR, { recursive: true });
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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console:" + m.text()); });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: "networkidle0", timeout: 90000 });
  await page.waitForFunction(() => document.querySelectorAll(".nav-item").length > 0 && document.getElementById("board").innerHTML.length > 50, { timeout: 60000 });

  for (const id of BOARDS) {
    await page.evaluate((bid) => {
      const el = [...document.querySelectorAll(".nav-item")].find((x) => x.dataset.board === bid);
      if (el) el.click();
    }, id);
    await new Promise((r) => setTimeout(r, 600));
    if (id === "viraldeep") { try { await page.click('#vd-dim-tabs .uv-tab[data-vd-dim="topic"]', { delay: 20 }); } catch (e) {} }
    if (id === "compare") { try { await page.evaluate(() => [...document.querySelectorAll(".cmp-chip")].slice(0, 3).forEach((c) => c.click())); } catch (e) {} }
    await new Promise((r) => setTimeout(r, 700));

    const meta = await page.evaluate(() => {
      const box = (el, i) => { const r = el.getBoundingClientRect(); return { i, d: el.scrollHeight - el.clientHeight, H: el.scrollHeight, h: el.clientHeight, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), tag: el.tagName + (el.id ? "#" + el.id : "") + (el.className ? "." + String(el.className).split(" ")[0] : "") }; };
      const isScroll = (el) => { const o = getComputedStyle(el).overflowY; return o === "auto" || o === "scroll"; };
      const all = [];
      document.querySelectorAll("*").forEach((el) => { if (isScroll(el) && el.scrollHeight - el.clientHeight > 20) all.push(box(el, all.length)); });
      const board = document.getElementById("board");
      let main = null;
      if (board && isScroll(board) && board.scrollHeight - board.clientHeight > 20) main = all.find((b) => b.tag.startsWith("SECTION#board")) || null;
      if (!main) main = all.slice().sort((a, b) => b.d - a.d)[0] || null;
      let inner = null;
      if (main) { const rest = all.filter((b) => b.i !== main.i && b.d > 400); inner = rest.sort((a, b) => b.d - a.d)[0] || null; }
      return { main, inner };
    });

    if (!meta.main) {
      const shot = path.join(OUT, id + ".png");
      await page.screenshot({ path: shot });
      const buf = fs.readFileSync(shot);
      fs.writeFileSync(path.join(SEGDIR, `${id}_1.png`), buf);
      console.log(JSON.stringify({ id, note: "短页(整页可见)", png: `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}` }));
      continue;
    }
    await stitch(page, meta.main, id, "", CAP, "main");
    // 内层子列表单独拼（避免被主容器裁掉）
    if (meta.inner && meta.inner.d > 400 && meta.inner.i !== meta.main.i) {
      await stitch(page, meta.inner, id, "inner", Math.min(meta.inner.H, 4000), "inner");
    }
    await page.evaluate(() => { document.querySelectorAll("*").forEach((el) => { if (el.scrollTop > 0) el.scrollTop = 0; }); });
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("=== ERRORS ===", errors.length, errors.slice(0, 10).join(" | "));
  await browser.close();
  server.close();
  process.exit(0);
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
