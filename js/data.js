/**
 * 数据加载器
 * - load()：内容数据（优先 content_data.json，回退 sample_data.json）
 * - loadInsights()：大模型生成的洞察报告（data/insights.json）
 */

const DataLoader = (function () {
  async function load() {
    try {
      const res = await fetch("data/content_data.json?t=" + Date.now());
      if (res.ok) return await res.json();
      throw new Error("content_data.json not found");
    } catch (e) {
      console.warn("未找到同步数据，使用示例数据", e);
      const res = await fetch("data/sample_data.json?t=" + Date.now());
      return await res.json();
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
