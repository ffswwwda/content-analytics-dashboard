/**
 * 生成真实质感的演示内容数据
 * 用法: node scripts/gen_sample.js  （自动写入 data/sample_data.json）
 * 说明: 仅用于未接入真实飞书时的演示；接入后由 sync_feishu.py 覆盖 data/content_data.json
 */
const fs = require("fs");
const path = require("path");

// 简单可复现的伪随机
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260710);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (a, b) => a + Math.floor(rnd() * (b - a + 1));

const accounts = ["品牌主号", "副线账号", "种草官号"];
const platforms = ["小红书", "抖音", "微博"];
const contentTypes = ["视频", "图文", "直播切片", "清单", "测评"];
const topics = [
  "产品介绍", "教程", "测评", "联名", "限定", "节日", "赠礼",
  "抽奖", "平替", "穿搭", "妆容", "成分科普",
];
const emotions = ["高级", "搞笑", "治愈", "震惊", "共鸣", "实用"];

// 标题模板（美妆/个护内容调性）
const titleTemplates = [
  "春日限定香氛开箱 | 一支让你闻起来很贵",
  "黄皮显白口红实测对比，到底是不是天花板",
  "大牌平替合集 | 学生党也能用的宝藏好物",
  "成分党必看 | 烟酰胺到底怎么选不踩雷",
  "通勤淡妆教程 | 5分钟搞定伪素颜",
  "联名款抢先试色 | 这波不冲真的会后悔",
  "宠粉抽奖 | 评论区抽3位送正装礼盒",
  "熬夜脸急救 | 急救面膜实测哪款真的有用",
  "约会妆容灵感 | 温柔到犯规的伪素颜",
  "618清单 | 囤货前先看这份避坑指南",
  "搞笑 | 当男朋友第一次帮你挑口红色号",
  "震惊 | 这支眉笔居然能画一整天不掉",
  "治愈系开箱 | 把梳妆台变成小展厅",
  "共鸣 | 谁懂啊 换季烂脸真的太崩溃了",
  "新品首发 | 早C晚A精华到底谁更适合你",
  "周年庆攻略 | 怎么买最划算一篇讲透",
  "测评 | 9.9和199的洗面奶差别在哪",
  "穿搭 | 秋冬氛围感围巾搭配公式",
  "实用 | 化妆品保质期对照表建议收藏",
  "联名 | 和艺术家联名的包装也太美了",
  "节日 | 情人节送礼指南不出错清单",
  "赠礼 | 送给妈妈的护肤套装实测",
  "平替 | 大牌同厂平替到底值不值",
  "妆容 | 纯欲风眼妆 step by step",
  "成分科普 | 早C晚A到底能不能一起用",
  "直播切片 | 主播力荐的3支神仙单品",
  "清单 | 油皮亲妈级控油产品盘点",
  "搞笑 | 化妆翻车现场之眼线手抖星人",
  "治愈 | 周末宅家护肤仪式感拉满",
  "震惊 | 原来洗脸这么多人都洗错了",
  "共鸣 | 成年人崩溃从换季烂脸开始",
  "测评 | 热门身体乳留香时长横评",
  "限定 | 季节限定色调一口气试完",
  "实用 | 出差极简护肤包怎么装",
  "联名 | 动漫联名彩妆真的会心动",
  "节日 | 圣诞倒数礼盒开箱现场",
];

// 质量因子：影响互动率
function qualityFactor(item) {
  let q = 0.5; // 基线
  if (item.contentType === "视频" || item.contentType === "直播切片") q += 0.18;
  if (item.emotion === "搞笑" || item.emotion === "震惊") q += 0.16;
  if (item.emotion === "共鸣" || item.emotion === "实用") q += 0.08;
  if (item.activity !== "无") q += 0.2; // 活动加持
  if (["联名", "限定", "测评", "赠礼", "抽奖"].some((t) => item.topicTags.includes(t))) q += 0.14;
  if (item.account === "品牌主号") q += 0.06;
  return Math.min(q, 1.25);
}

// 活动窗口：短时集中爆发（这才叫 campaign burst）
const campaignPlan = [
  { name: "618专题", win: ["2026-06-15", "2026-06-18"], n: 6 },
  { name: "双11专题", win: ["2026-04-12", "2026-04-14"], n: 4 },
  { name: "宠粉日专题", win: ["2026-05-20", "2026-05-22"], n: 3 },
  { name: "新品首发专题", win: ["2026-07-01", "2026-07-03"], n: 4 },
  { name: "周年庆专题", win: ["2026-04-25", "2026-04-27"], n: 5 },
];

function randDateInWindow(win) {
  const [s, e] = win;
  const [sy, sm, sd] = s.split("-").map(Number);
  const [ey, em, ed] = e.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const days = Math.round((end - start) / 86400000);
  const d = new Date(start);
  d.setDate(start.getDate() + between(0, days));
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = pick([9, 12, 13, 18, 19, 20, 21, 22]);
  const minute = pick([0, 15, 30, 45]);
  return `2026-${m}-${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+08:00`;
}
function randDateNormal() {
  const start = new Date(2026, 3, 1); // 04-01
  const end = new Date(2026, 6, 10); // 07-10
  const days = Math.round((end - start) / 86400000);
  const d = new Date(start);
  d.setDate(start.getDate() + between(0, days));
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = pick([9, 12, 13, 18, 19, 20, 21, 22]);
  const minute = pick([0, 15, 30, 45]);
  return `2026-${m}-${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+08:00`;
}

const N = 36;
const contents = [];
const usedTitles = new Set();

function makeCommentQuality(total) {
  const q = {};
  const labels = ["赞美", "提问", "分享体验", "开玩笑", "抱怨"];
  let remain = Math.max(total, 1);
  labels.forEach((l, i) => {
    if (i === labels.length - 1) {
      q[l] = remain;
    } else {
      const v = Math.floor(remain * (0.15 + rnd() * 0.35));
      q[l] = v;
      remain -= v;
    }
  });
  return q;
}

// 构建生成计划：活动项聚到各自窗口，其余铺在常规日期
const plans = [];
campaignPlan.forEach((c) => {
  for (let k = 0; k < c.n; k++) plans.push({ activity: c.name.replace("专题", ""), win: c.win });
});
while (plans.length < N) plans.push({ activity: "无", win: null });
// 洗牌，避免活动项都堆在开头
for (let i = plans.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [plans[i], plans[j]] = [plans[j], plans[i]];
}

for (let i = 0; i < N; i++) {
  const plan = plans[i];
  let text;
  do {
    text = pick(titleTemplates);
  } while (usedTitles.has(text) && usedTitles.size < titleTemplates.length);
  usedTitles.add(text);

  const account = pick(accounts);
  const platform = pick(platforms);
  const contentType = pick(contentTypes);
  const emotion = pick(emotions);
  const activity = plan.activity;

  const topicCount = 1 + Math.floor(rnd() * 3);
  const topicTags = [];
  while (topicTags.length < topicCount) {
    const t = pick(topics);
    if (!topicTags.includes(t)) topicTags.push(t);
  }

  const q = qualityFactor({ contentType, emotion, activity, topicTags, account });

  const exposure = between(18000, 420000);
  const engRate = 0.02 + q * (0.02 + rnd() * 0.05); // 2%~约9%
  const engagement = Math.floor(exposure * engRate);
  const likes = Math.floor(engagement * (0.55 + rnd() * 0.15));
  const comments = Math.floor(engagement * (0.12 + rnd() * 0.08));
  const shares = Math.floor(engagement * (0.08 + rnd() * 0.06));
  const collections = engagement - likes - comments - shares;

  const brandReplies = Math.floor(comments * (0.05 + rnd() * 0.2));
  const avgReplyTime = between(15, 180);

  const publish_time = plan.win ? randDateInWindow(plan.win) : randDateNormal();

  contents.push({
    id: "c" + String(i + 1).padStart(3, "0"),
    account,
    platform,
    publish_time,
    content_type: contentType,
    topic_tags: topicTags,
    emotion,
    activity_tag: activity,
    is_activity: activity !== "无",
    campaign_name: activity !== "无" ? activity + "专题" : null,
    text,
    exposure,
    likes,
    shares,
    comments,
    collections,
    brand_replies: brandReplies,
    avg_reply_time_minutes: avgReplyTime,
    comment_quality: makeCommentQuality(comments),
  });
}

const out = {
  meta: {
    updated_at: new Date().toISOString().slice(0, 19),
    source: "sample",
    account_count: accounts.length,
    content_count: contents.length,
    date_range: ["2026-04-01", "2026-07-10"],
  },
  contents,
};

const outPath = path.join(__dirname, "..", "data", "sample_data.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log("wrote", outPath, "records:", contents.length);
