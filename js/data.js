/**
 * 数据加载器
 * - load()：内容数据（优先 content_data.json，回退 sample_data.json）
 * - loadInsights()：大模型生成的洞察报告（data/insights.json）
 */

const DataLoader = (function () {
  async function load() {
    const tryFetch = async (url, ms) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ms);
      try {
        const res = await fetch(url + "?t=" + Date.now(), { signal: ctrl.signal });
        if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
        const json = await res.json();
        if (!json || !Array.isArray(json.contents)) throw new Error("数据格式异常（缺少 contents 数组）");
        return json;
      } finally {
        clearTimeout(timer);
      }
    };
    try {
      return await tryFetch("data/content_data.json", 45000);
    } catch (e1) {
      console.warn("[DataLoader] 主数据加载失败，尝试回退示例数据:", e1.message);
      try {
        const s = await tryFetch("data/sample_data.json", 30000);
        s.__fellback = true;
        return s;
      } catch (e2) {
        const msg = "主数据(content_data.json)与示例数据(sample_data.json)均加载失败 —— " + e2.message;
        console.error("[DataLoader]", msg);
        throw new Error(msg);
      }
    }
  }

  async function loadInsights() {
    try {
      const res = await fetch("data/insights.json?t=" + Date.now());
      if (res.ok) return await res.json();
      throw new Error("insights.json not found");
    } catch (e) {
      console.warn("未找到洞察报告", e);
      return null;
    }
  }

  async function loadUsers() {
    try {
      const res = await fetch("data/users_data.json?t=" + Date.now());
      if (res.ok) return await res.json();
      throw new Error("users_data.json not found");
    } catch (e) {
      console.warn("未找到用户分析数据", e);
      return null;
    }
  }

  return { load, loadInsights, loadUsers };
})();
