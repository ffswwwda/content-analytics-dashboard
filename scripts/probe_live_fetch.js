/* 隔离测试：浏览器内直接 fetch 线上 20MB JSON，测耗时与字节数；对比小文件。
   目的：判定「浏览器拉不动大 JSON」是网络问题还是应用问题。 */
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

const BASE = "https://ffswwwda.github.io/content-analytics-dashboard";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findChrome(), headless: "shell",
    args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage();
  // 先拿一个同源页面，避免 CORS
  await page.goto(`${BASE}/index.html`, { waitUntil: "domcontentloaded", timeout: 60000 });

  const out = await page.evaluate(async (base) => {
    const res = [];
    async function probe(url, limitMs) {
      const t = performance.now();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), limitMs);
      try {
        const r = await fetch(url + "?t=" + Date.now(), { signal: ctrl.signal });
        const total = performance.now() - t;
        const txt = await r.text();
        const ttfb = null;
        return { url, ok: r.ok, status: r.status, ttfbMs: Math.round(total), chars: txt.length,
                 dlg: (performance.now() - t).toFixed(0), note: "OK" };
      } catch (e) {
        return { url, error: e.name + ": " + e.message, elapsed: Math.round(performance.now() - t) };
      } finally { clearTimeout(timer); }
    }
    res.push(await probe(base + "/data/content_data.json", 120000));
    return res;
  }, BASE);

  console.log("=== 浏览器内 fetch 结果 ===");
  for (const r of out) console.log(JSON.stringify(r));

  // 再看资源计时
  const entries = await page.evaluate(() => performance.getEntriesByType("resource")
    .filter((e) => /\.json/.test(e.name))
    .map((e) => ({ name: e.name.split("/").pop().slice(0, 60), dur: Math.round(e.duration),
                   size: e.transferSize, dec: e.decodedBodySize, enc: e.encodedBodySize })));
  console.log("=== 资源计时 ===");
  for (const e of entries) console.log(JSON.stringify(e));

  await browser.close();
})();
