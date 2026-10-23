/**
 * 数据加载器
 * - load()：内容数据（data/content_data.json）
 * - loadInsights()：大模型生成的洞察报告（data/insights.json）
 * - loadUsers()：用户分析补充数据（data/users_data.json）
 *
 * 性能约定（2026-10-23 优化）：
 * 1) **不拼 `?t=` 时间戳**。原实现每次加载都加 Date.now()，HTTP 缓存 100% 失效，
 *    每次打开都要重下 20MB 文件（gzip 约 2.7MB）。GitHub Pages 自带 ETag + Last-Modified，
 *    去掉时间戳后浏览器正常缓存、过期后协商成 304，重复打开几乎零传输。
 * 2) 超时 25s，**不再回退 sample_data.json**：那份文件与主数据同为 20MB，
 *    主数据超时后再拉一份只会把等待从 45s 拖到 75s。失败即报错 + 重试按钮。
 * 3) `loadAll()` 让三个请求并行，小文件不再串行等待。
 */

const DataLoader = (function () {
  const TIMEOUT_MS = 25000;

  async function getJSON(url, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms || TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: ctrl.signal, credentials: "same-origin" });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText + " · " + url);
      return await res.json();
    } catch (e) {
      if (e.name === "AbortError") {
        throw new Error("请求超时（" + Math.round((ms || TIMEOUT_MS) / 1000) + "s）· " + url);
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 带进度回调的 JSON 加载：读流统计已收字节，让加载界面能显示真实进度而不是干转圈。
   * onProgress(receivedBytes, totalBytes)  total 为 0 时表示服务端未给 Content-Length。
   */
  async function getJSONWithProgress(url, onProgress, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms || TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: ctrl.signal, credentials: "same-origin" });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText + " · " + url);
      /* Content-Encoding 为 gzip 时 content-length 是「压缩后」字节数，而流里读到的
         是「解压后」字节数，直接相除会让进度瞬间冲到 100%。这种情况按未知总量处理，
         只显示已接收量。 */
      const encoded = !!res.headers.get("content-encoding");
      const total = encoded ? 0 : (Number(res.headers.get("content-length")) || 0);
      if (!res.body || typeof onProgress !== "function") return await res.json();
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        onProgress(received, total);
      }
      const buf = new Uint8Array(received);
      let off = 0;
      for (const c of chunks) { buf.set(c, off); off += c.length; }
      const text = new TextDecoder("utf-8").decode(buf);
      return JSON.parse(text);
    } catch (e) {
      if (e.name === "AbortError") {
        throw new Error("请求超时（" + Math.round((ms || TIMEOUT_MS) / 1000) + "s）· " + url);
      }
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  async function load(onProgress) {
    const json = await getJSONWithProgress("data/content_data.json", onProgress);
    if (!json || !Array.isArray(json.contents)) throw new Error("数据格式异常（缺少 contents 数组）");
    return json;
  }

  async function loadInsights() {
    try {
      return await getJSON("data/insights.json", 12000);
    } catch (e) {
      console.warn("未找到洞察报告", e);
      return null;
    }
  }

  async function loadUsers() {
    try {
      return await getJSON("data/users_data.json", 15000);
    } catch (e) {
      console.warn("未找到用户分析数据", e);
      return null;
    }
  }

  /** 并行拉取；主数据失败向上抛，两个小文件失败降级为 null */
  async function loadAll(onProgress) {
    const [data, users, insights] = await Promise.all([load(onProgress), loadUsers(), loadInsights()]);
    return { data, users, insights };
  }

  return { load, loadAll, loadInsights, loadUsers };
})();
