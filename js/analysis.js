/**
 * 内容分析引擎
 * 负责：指标计算、爆款识别、发布频率分析、内容类型 ROI、活动爆发检测、评论质量分析等
 */

const Analysis = (function () {
  function safeRate(numerator, denominator) {
    if (denominator <= 0) return 0;
    // 比率本质是「部分/整体」，不可能 >100%。源数据偶发「互动>曝光」（曝光采集缺失），
    // 限幅避免爆款率/ROI 被虚高，属于校正而非伪造。
    return Math.min(numerator, denominator) / denominator;
  }

  function enrich(contents) {
    return contents.map((item) => {
      const engagement = item.likes + item.shares + item.comments + item.collections;
      const engagementRate = safeRate(engagement, item.exposure) * 100;
      const likeRate = safeRate(item.likes, item.exposure) * 100;
      const commentRate = safeRate(item.comments, item.exposure) * 100;
      const shareRate = safeRate(item.shares, item.exposure) * 100;
      const viralScore = engagementRate * 0.4 + likeRate * 0.3 + commentRate * 0.2 + shareRate * 0.1;
      const roi = safeRate(engagement, item.exposure) * 1000; // 千次曝光互动
      return {
        ...item,
        engagement,
        engagementRate,
        likeRate,
        commentRate,
        shareRate,
        viralScore,
        roi,
        // 统一驼峰别名，方便分析引擎使用
        contentType: item.content_type,
        topicTags: item.topic_tags || [],
        activityTag: item.activity_tag,
        isActivity: item.is_activity,
        campaignName: item.campaign_name,
        brandReplies: item.brand_replies,
        avgReplyTimeMinutes: item.avg_reply_time_minutes,
        commentQuality: item.comment_quality,
        publishDate: item.publish_time.slice(0, 10),
        publishHour: Number(item.publish_time.slice(11, 13)),
        weekDay: new Date(item.publish_time).getDay(),
      };
    });
  }

  function markTop(contents, pct = 0.1, key = "viralScore") {
    const sorted = [...contents].sort((a, b) => b[key] - a[key]);
    const cutoffIndex = Math.max(1, Math.floor(sorted.length * pct));
    const threshold = sorted[cutoffIndex - 1][key];
    return contents.map((item) => ({
      ...item,
      isTop: item[key] >= threshold,
      topRank: sorted.findIndex((s) => s.id === item.id) + 1,
    }));
  }

  function groupBy(arr, keyFn) {
    const map = new Map();
    arr.forEach((item) => {
      const k = keyFn(item);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(item);
    });
    return map;
  }

  function avg(arr, key) {
    if (!arr.length) return 0;
    return arr.reduce((sum, i) => sum + i[key], 0) / arr.length;
  }

  function sum(arr, key) {
    return arr.reduce((s, i) => s + (i[key] || 0), 0);
  }

  // 内容策略：发布时间分布
  function hourDistribution(contents) {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const map = groupBy(contents, (i) => i.publishHour);
    return hours.map((h) => ({
      hour: `${h}:00`,
      count: (map.get(h) || []).length,
      avgViralScore: avg(map.get(h) || [], "viralScore"),
    }));
  }

  // 内容策略：发布频率（按周/日）
  function publishFrequency(contents) {
    const map = groupBy(contents, (i) => i.publishDate);
    const dates = Array.from(map.keys()).sort();
    return dates.map((d) => ({
      date: d,
      count: map.get(d).length,
      avgViralScore: avg(map.get(d), "viralScore"),
    }));
  }

  // 内容策略：形式/主题/情绪分布
  function dimensionBreakdown(contents, key, multi = false) {
    const counts = new Map();
    const viralSum = new Map();
    contents.forEach((item) => {
      const vals = multi ? item[key] : [item[key]];
      vals.forEach((v) => {
        counts.set(v, (counts.get(v) || 0) + 1);
        viralSum.set(v, (viralSum.get(v) || 0) + item.viralScore);
      });
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        count,
        avgViralScore: viralSum.get(name) / count,
        share: count / contents.length,
      }))
      .sort((a, b) => b.count - a.count);
  }

  // 爆款共性：Top 10% 的内容在哪些维度集中
  function viralCommonalities(contents) {
    const top = contents.filter((i) => i.isTop);
    if (!top.length) return {};
    return {
      topCount: top.length,
      avgExposure: avg(top, "exposure"),
      avgEngagementRate: avg(top, "engagementRate"),
      contentType: dimensionBreakdown(top, "contentType"),
      topicTags: dimensionBreakdown(top, "topicTags", true),
      emotion: dimensionBreakdown(top, "emotion"),
      activityTag: dimensionBreakdown(top, "activityTag"),
      topHour: dimensionBreakdown(top, "publishHour").sort((a, b) => b.count - a.count)[0],
      topAccounts: dimensionBreakdown(top, "account"),
    };
  }

  // 内容类型 ROI ranking
  function contentTypeROI(contents) {
    const map = groupBy(contents, (i) => i.contentType);
    return Array.from(map.entries())
      .map(([type, items]) => ({
        type,
        count: items.length,
        avgExposure: avg(items, "exposure"),
        avgEngagementRate: avg(items, "engagementRate"),
        avgViralScore: avg(items, "viralScore"),
        avgROI: avg(items, "roi"),
        totalEngagement: sum(items, "engagement"),
      }))
      .sort((a, b) => b.avgViralScore - a.avgViralScore);
  }

  // 活动爆发检测：识别 campaign 期间的发布频率变化
  function campaignBursts(contents) {
    const campaigns = new Map();
    contents
      .filter((i) => i.isActivity && i.campaignName)
      .forEach((item) => {
        const name = item.campaignName;
        if (!campaigns.has(name)) campaigns.set(name, []);
        campaigns.get(name).push(item);
      });

    const normalDaily = avg(publishFrequency(contents.filter((i) => !i.isActivity)), "count");

    return Array.from(campaigns.entries()).map(([name, items]) => {
      const dates = items.map((i) => i.publishDate).sort();
      const start = dates[0];
      const end = dates[dates.length - 1];
      const durationDays = Math.max(1, (new Date(end) - new Date(start)) / 86400000 + 1);
      const frequency = items.length / durationDays;
      return {
        name,
        count: items.length,
        start,
        end,
        durationDays,
        frequency,
        lift: normalDaily > 0 ? (frequency / normalDaily).toFixed(2) : "∞",
        totalExposure: sum(items, "exposure"),
        totalEngagement: sum(items, "engagement"),
        avgViralScore: avg(items, "viralScore"),
        activityTags: [...new Set(items.map((i) => i.activityTag).filter(Boolean))],
      };
    });
  }

  // 用户粘性：评论质量分布、品牌回复效率
  function userEngagement(contents) {
    const totals = {
      totalComments: sum(contents, "comments"),
      totalBrandReplies: sum(contents, "brandReplies"),
      avgReplyTime: avg(contents.filter((i) => i.avgReplyTimeMinutes), "avgReplyTimeMinutes"),
      avgComments: avg(contents, "comments"),
      commentRate: avg(contents, "commentRate"),
    };

    const quality = {};
    contents.forEach((item) => {
      Object.entries(item.commentQuality || {}).forEach(([k, v]) => {
        quality[k] = (quality[k] || 0) + v;
      });
    });

    const replyRateByAccount = Array.from(groupBy(contents, (i) => i.account).entries()).map(
      ([account, items]) => ({
        account,
        totalComments: sum(items, "comments"),
        totalReplies: sum(items, "brandReplies"),
        replyRate: safeRate(sum(items, "brandReplies"), sum(items, "comments")) * 100,
        avgReplyTime: avg(items.filter((i) => i.avgReplyTimeMinutes), "avgReplyTimeMinutes"),
      })
    );

    return { totals, quality, replyRateByAccount };
  }

  // 多账号横向对比
  function accountComparison(contents) {
    return Array.from(groupBy(contents, (i) => i.account).entries()).map(([account, items]) => ({
      account,
      count: items.length,
      totalExposure: sum(items, "exposure"),
      totalEngagement: sum(items, "engagement"),
      avgViralScore: avg(items, "viralScore"),
      avgEngagementRate: avg(items, "engagementRate"),
      topCount: items.filter((i) => i.isTop).length,
    }));
  }

  // 灵感库筛选
  function filterLibrary(contents, filters) {
    return contents.filter((item) => {
      if (filters.account && item.account !== filters.account) return false;
      if (filters.contentType && item.contentType !== filters.contentType) return false;
      if (filters.topic && !item.topicTags.includes(filters.topic)) return false;
      if (filters.emotion && item.emotion !== filters.emotion) return false;
      if (filters.activityTag && item.activityTag !== filters.activityTag) return false;
      if (filters.isTop !== undefined && item.isTop !== filters.isTop) return false;
      if (filters.search && !item.text.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }

  // AI 选题预测器：基于历史爆款特征计算概率，并给出匹配内容与关键成功点
  function predictIdea(contents, ideaText) {
    const top = contents.filter((i) => i.isTop);
    const normal = contents.filter((i) => !i.isTop);
    if (!top.length || !normal.length) return null;

    const lower = ideaText.toLowerCase();

    // 关键词库：按维度分组，并配合同义词
    const keywordBank = {
      情绪: ["离谱", "震惊", "爆款", "绝了", "救命", "破防", "卷", "天花板", "平替", "对比", "挑战", "搞笑", "幽默", "夸张", "治愈", "温暖", "安心", "爽", "上头", "哇塞"],
      形式: ["视频", "教程", "开箱", "实测", "试色", "清单", "直播", "图文", "对比", "合集", "测评", "测评", "vlog", "攻略", "干货"],
      主题: ["联名", "限定", "节日", "618", "双11", "赠礼", "抽奖", "宠粉", "活动", "促销", "打折", "折扣", "5折", "半价", "新品", "首发", "限定", "礼盒", "限量"],
      人群: ["黄皮", "通勤", "约会", "clean", "新手", "学生党", "敏感肌", "干皮", "油皮", "混油皮", "打工人", "早八", "熬夜"],
      痛点: ["卡粉", "起皮", "斑驳", "显黑", "显黄", "拔干", "脱妆", "暗沉", "毛孔", "痘印", "泛红", "敏感", "闷痘", "搓泥", "油腻"],
      效果: ["显白", "持妆", "遮瑕", "服帖", "滋润", "保湿", "哑光", "光泽", "提亮", "修饰", "自然", "通透", "干净", "高级", "精致"],
    };

    // 同义词扩展：输入词 -> 相关词（用于更宽地匹配历史内容）
    const synonymMap = {
      打折: ["促销", "折扣", "大促", "优惠", "宠粉", "半价", "活动"],
      "5折": ["半价", "促销", "折扣", "打折"],
      活动: ["大促", "节日", "618", "双11", "周年庆", "宠粉日", "新品首发", "赠礼", "抽奖", "促销"],
      促销: ["打折", "折扣", "优惠", "大促", "活动"],
      大促: ["618", "双11", "周年庆", "活动", "促销"],
      新品: ["首发", "限定", "新品首发"],
      实测: ["测评", "试色"],
      教程: ["干货", "攻略"],
      对比: ["横评", "测评"],
      显白: ["提亮", "黄皮"],
      学生党: ["平价", "平替"],
      通勤: ["日常", "clean"],
      约会: ["氛围感", "精致"],
      熬夜: ["急救", "暗沉"],
      烂脸: ["敏感", "泛红", "痘印"],
      卡粉: ["起皮", "斑驳", "脱妆"],
      持妆: ["服帖", "遮瑕", "自然"],
      急救: ["熬夜", "暗沉", "急救面膜"],
      联名: ["限定", "艺术家", "包装"],
      抽奖: ["宠粉", "赠礼", "送正装", "礼盒"],
      平替: ["平价", "学生党", "大牌同厂"],
      成分: ["成分科普", "烟酰胺", "早C晚A"],
    };

    function expandTerms(words) {
      const expanded = new Set(words.map((w) => w.toLowerCase()));
      words.forEach((w) => {
        const low = w.toLowerCase();
        (synonymMap[w] || []).forEach((s) => expanded.add(s.toLowerCase()));
        Object.entries(synonymMap).forEach(([key, syns]) => {
          if (low === key.toLowerCase() || syns.some((s) => s.toLowerCase() === low)) {
            expanded.add(key.toLowerCase());
            syns.forEach((s) => expanded.add(s.toLowerCase()));
          }
        });
      });
      return Array.from(expanded);
    }

    // 从输入提取原始词并扩展
    const rawWords = lower.split(/[^\u4e00-\u9fa5a-z0-9]+/i).filter((w) => w.length >= 2);
    const expanded = expandTerms(rawWords);

    // 关键词命中（用扩展词集）
    const allKeywords = Object.values(keywordBank).flat();
    const hitKeywords = [...new Set(allKeywords.filter((kw) => expanded.some((e) => kw.toLowerCase().includes(e) || e.includes(kw.toLowerCase()))))];
    const keywordScore = Math.min(hitKeywords.length, 6);

    // 主题/活动标签/情绪/形式推断：用扩展词集匹配库中的枚举
    const allTopicTags = [...new Set(contents.flatMap((i) => i.topicTags || []))].filter(Boolean);
    const matchedTopics = allTopicTags.filter((t) => expanded.some((e) => t.toLowerCase().includes(e) || e.includes(t.toLowerCase())));
    const allActivityTags = [...new Set(contents.map((i) => i.activityTag).filter(Boolean))];
    const matchedActivityTags = allActivityTags.filter((t) => t !== "无" && expanded.some((e) => t.toLowerCase().includes(e) || e.includes(t.toLowerCase())));
    const allEmotions = [...new Set(contents.map((i) => i.emotion).filter(Boolean))];
    const matchedEmotions = allEmotions.filter((e) => expanded.some((t) => e.toLowerCase().includes(t) || t.includes(e.toLowerCase())));
    const allTypes = [...new Set(contents.map((i) => i.contentType).filter(Boolean))];
    const matchedTypes = allTypes.filter((t) => expanded.some((e) => t.toLowerCase().includes(e) || e.includes(t.toLowerCase())));

    // 若输入里有"活动/促销/打折/大促/5折"等促销意图，即使没有直接命中 activityTag，也尝试命中活动型内容
    const activityIntent = ["活动", "促销", "打折", "折扣", "大促", "5折", "半价", "优惠"].some((w) => lower.includes(w));

    // 为每条内容计算相关度
    const scored = contents.map((item) => {
      let rel = 0;
      let reasons = [];
      const itemText = (item.text || "").toLowerCase();
      const itemTopics = (item.topicTags || []).map((t) => t.toLowerCase());

      // 主题标签匹配
      const topicOverlap = (item.topicTags || []).filter((t) => matchedTopics.includes(t));
      if (topicOverlap.length) {
        rel += topicOverlap.length * 25;
        reasons.push(`主题：${topicOverlap.join("、")}`);
      }

      // 活动标签/活动意图匹配
      if (matchedActivityTags.includes(item.activityTag)) {
        rel += 22;
        reasons.push(`活动：${item.activityTag}`);
      } else if (activityIntent && item.isActivity) {
        rel += 12;
        reasons.push(`同类活动：${item.activityTag || "活动"}`);
      }

      // 关键词命中（标题/文本）
      const itemKwHits = hitKeywords.filter((kw) => itemText.includes(kw.toLowerCase()));
      if (itemKwHits.length) {
        rel += itemKwHits.length * 8;
        reasons.push(`关键词：${itemKwHits.slice(0, 3).join("、")}`);
      }

      // 通过扩展词集在文本中找匹配
      const expandedTextHits = expanded.filter((e) => e.length >= 2 && itemText.includes(e));
      if (expandedTextHits.length) {
        rel += Math.min(expandedTextHits.length * 5, 15);
        if (!reasons.length) reasons.push(`文本相关：${expandedTextHits.slice(0, 2).join("、")}`);
      }

      // 情绪匹配
      if (matchedEmotions.includes(item.emotion)) {
        rel += 15;
        reasons.push(`情绪：${item.emotion}`);
      }

      // 形式匹配
      if (matchedTypes.includes(item.contentType)) {
        rel += 8;
        reasons.push(`形式：${item.contentType}`);
      }

      rel = Math.min(100, rel);
      return { item, rel: rel, reasons: [...new Set(reasons)] };
    });

    // 相关阈值：至少与某个维度有关
    const matchedItems = scored.filter((s) => s.rel > 0).sort((a, b) => b.rel - a.rel);
    const topMatchedItems = matchedItems.slice(0, 8);

    // 历史同主题爆款率（基于 matchedTopics）
    const topicMatches = contents.filter((i) => i.topicTags.some((t) => matchedTopics.includes(t)));
    const topicViralRate = topicMatches.length
      ? topicMatches.filter((i) => i.isTop).length / topicMatches.length
      : 0;

    // 历史同情绪爆款率
    const emotionMatches = matchedEmotions.length
      ? contents.filter((i) => matchedEmotions.includes(i.emotion))
      : contents.filter((i) => lower.includes(i.emotion.toLowerCase()));
    const emotionViralRate = emotionMatches.length
      ? emotionMatches.filter((i) => i.isTop).length / emotionMatches.length
      : 0;

    // 爆款的平均特征
    const topAvg = {
      exposure: avg(top, "exposure"),
      engagementRate: avg(top, "engagementRate"),
      viralScore: avg(top, "viralScore"),
    };

    // 匹配内容统计特征
    const matched = topMatchedItems.map((s) => s.item);
    const matchedStats = {
      count: matchedItems.length,
      avgExposure: matched.length ? avg(matched, "exposure") : 0,
      avgEngagementRate: matched.length ? avg(matched, "engagementRate") : 0,
      avgViralScore: matched.length ? avg(matched, "viralScore") : 0,
      topRate: matched.length ? matched.filter((i) => i.isTop).length / matched.length : 0,
      avgViralRate: matched.length ? Math.round(matched.reduce((s, i) => s + Math.round((i.viralScore / Math.max(...contents.map((c) => c.viralScore))) * 100), 0) / matched.length) : 0,
      // 主要形式
      dominantType: matched.length ? dimensionBreakdown(matched, "contentType")[0] : null,
      // 主要情绪
      dominantEmotion: matched.length ? dimensionBreakdown(matched, "emotion")[0] : null,
      // 主要主题
      dominantTopic: matched.length ? dimensionBreakdown(matched, "topicTags", true)[0] : null,
      // 最佳发布时段
      bestHour: matched.length ? dimensionBreakdown(matched, "publishHour").sort((a, b) => b.count - a.count)[0] : null,
      // 是否多来自活动
      activityRatio: matched.length ? matched.filter((i) => i.isActivity).length / matched.length : 0,
    };

    // 关键成功点：从匹配内容中提炼
    const keyTakeaways = [];
    if (matchedStats.dominantType) {
      keyTakeaways.push(`同类内容多以「${matchedStats.dominantType.name}」形式呈现，平均爆款率 ${Math.round(matchedStats.dominantType.avgViralScore / Math.max(...contents.map((c) => c.viralScore)) * 100)}/100。`);
    }
    if (matchedStats.dominantEmotion) {
      keyTakeaways.push(`情绪上「${matchedStats.dominantEmotion.name}」表现最好，占比 ${(matchedStats.dominantEmotion.share * 100).toFixed(0)}%。`);
    }
    if (matchedStats.bestHour) {
      keyTakeaways.push(`建议在 ${matchedStats.bestHour.name}:00 左右发布，该时段匹配内容最多且表现稳定。`);
    }
    if (matchedStats.activityRatio > 0.3) {
      keyTakeaways.push(`${(matchedStats.activityRatio * 100).toFixed(0)}% 的匹配内容来自活动/Campaign，说明活动节点能显著放大这一方向。`);
    }
    if (matchedStats.topRate > 0.2) {
      keyTakeaways.push(`历史匹配内容中 ${(matchedStats.topRate * 100).toFixed(0)}% 进入 Top 10%，说明该方向有爆款潜力。`);
    } else if (matched.length > 0) {
      keyTakeaways.push("该方向在现有数据中爆款样本较少，建议通过强化钩子或形式来提升爆发力。");
    }

    // 综合概率（0-100）
    const score = Math.min(
      100,
      Math.round(
        topicViralRate * 35 +
          emotionViralRate * 25 +
          Math.min(keywordScore * 8, 25) +
          (matchedStats.topRate * 15) +
          (matchedStats.activityRatio * 8) +
          5
      )
    );

    // 生成建议
    const suggestions = [];
    if (score < 40) {
      suggestions.push("选题偏普通或数据样本少，建议加入强对比/冲突点（如大牌平替、成分/效果对比）。");
      suggestions.push("尝试绑定节日/活动节点，或增加互动机制（投票、抽奖、挑战）。");
    } else if (score < 70) {
      suggestions.push("选题有潜力，可进一步强化情绪钩子（争议、好奇、共鸣）。");
      suggestions.push("参考下方匹配的同主题爆款，加入教程/实测/清单类结构化内容。");
    } else {
      suggestions.push("选题方向与历史爆款特征高度吻合，建议优先制作。");
      suggestions.push(`可搭配 ${matchedStats.dominantType ? matchedStats.dominantType.name : "视频"} 形式，并在 ${matchedStats.bestHour ? matchedStats.bestHour.name : "19"}:00 左右发布。`);
    }

    if (!matchedTypes.length && !lower.includes("视频") && !lower.includes("gif")) {
      suggestions.push("历史数据显示视频/GIF/对比类形式爆款率更高，建议优先考虑动态或结构化形式。");
    }
    if (!matchedActivityTags.length && !lower.includes("联名") && !lower.includes("限定") && !lower.includes("节日")) {
      suggestions.push("若可结合限定、联名或节日节点，可显著提升爆发力。");
    }
    if (matchedStats.topRate < 0.15 && matched.length > 0) {
      suggestions.push("匹配内容中爆款比例偏低，建议添加更明确的价值主张或标题钩子再试。");
    }

    // 用户指标与风评：基于匹配到的历史内容提炼用户侧表现
    const umAvgEng = matched.length ? avg(matched, "engagement") : 0;
    const umAvgComments = matched.length ? avg(matched, "comments") : 0;
    const umAvgLikes = matched.length ? avg(matched, "likes") : 0;
    const kwCount = {};
    matched.forEach((it) => (it.topicTags || []).forEach((t) => { kwCount[t] = (kwCount[t] || 0) + 1; }));
    const cq = {};
    matched.forEach((it) => Object.entries(it.commentQuality || {}).forEach(([k, v]) => { cq[k] = (cq[k] || 0) + v; }));
    const topKeywords = Object.entries(kwCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
    const topSentiment = Object.entries(cq).sort((a, b) => b[1] - a[1])[0];
    const reviewDist = Object.entries(cq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
    const userMetrics = {
      avgEngagement: Math.round(umAvgEng),
      avgComments: Math.round(umAvgComments),
      avgLikes: Math.round(umAvgLikes),
      topKeywords,
      reviewTone: topSentiment ? topSentiment[0] : "—",
      reviewDist,
    };

    return {
      score,
      topicViralRate: Math.round(topicViralRate * 100),
      emotionViralRate: Math.round(emotionViralRate * 100),
      keywordHits: keywordScore,
      hitKeywords: [...new Set(hitKeywords)],
      matchedTopics,
      matchedEmotions,
      matchedActivityTags,
      matchedTypes,
      topBenchmark: topAvg,
      matches: {
        total: matchedItems.length,
        items: topMatchedItems.map((s) => ({ ...s.item, matchReason: s.reasons.slice(0, 2).join(" · "), matchScore: s.rel })),
      },
      matchedStats,
      keyTakeaways,
      suggestions,
      userMetrics,
    };
  }

  function analyze(contents) {
    let data = enrich(contents);
    data = markTop(data, 0.1, "viralScore");
    return {
      overview: {
        contentCount: data.length,
        totalExposure: sum(data, "exposure"),
        totalEngagement: sum(data, "engagement"),
        avgEngagementRate: avg(data, "engagementRate"),
        avgViralScore: avg(data, "viralScore"),
        topCount: data.filter((i) => i.isTop).length,
      },
      hourDistribution: hourDistribution(data),
      publishFrequency: publishFrequency(data),
      contentTypeBreakdown: dimensionBreakdown(data, "contentType"),
      topicBreakdown: dimensionBreakdown(data, "topicTags", true),
      emotionBreakdown: dimensionBreakdown(data, "emotion"),
      activityBreakdown: dimensionBreakdown(data, "activityTag"),
      viralCommonalities: viralCommonalities(data),
      contentTypeROI: contentTypeROI(data),
      campaignBursts: campaignBursts(data),
      userEngagement: userEngagement(data),
      accountComparison: accountComparison(data),
      contents: data,
    };
  }

  return {
    analyze,
    filterLibrary,
    predictIdea,
  };
})();

if (typeof window !== "undefined") window.Analysis = Analysis;
if (typeof module !== "undefined" && module.exports) {
  module.exports = Analysis;
}
