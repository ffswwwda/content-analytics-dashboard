#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
飞书数据源同步脚本

功能：
1. 从飞书多维表格（Bitable）或电子表格（Sheets）拉取内容数据
2. 转换为 content_data.json 的标准 schema
3. 支持本地运行测试，也支持 GitHub Actions 定时执行

环境变量（GitHub Secrets 或本地 .env）：
- FEISHU_APP_ID: 飞书自建应用 App ID
- FEISHU_APP_SECRET: 飞书自建应用 App Secret
- FEISHU_BASE_APP_TOKEN: 多维表格的 app_token
- FEISHU_TABLE_ID: 多维表格的 table_id（默认会自动获取第一个 table）
- OPENAI_API_KEY: 可选，用于 AI 自动标签/爆款分析
"""

import os
import sys
import json
import math
import requests
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "content_data.json"


def log(msg):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}")


def get_tenant_token(app_id, app_secret):
    url = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
    resp = requests.post(url, json={"app_id": app_id, "app_secret": app_secret}, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if data.get("code") != 0:
        raise RuntimeError(f"获取 tenant_access_token 失败: {data}")
    return data["tenant_access_token"]


def list_tables(app_token, token):
    url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables"
    resp = requests.get(url, headers={"Authorization": f"Bearer {token}"}, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    if data.get("code") != 0:
        raise RuntimeError(f"列出表格失败: {data}")
    return data["data"]["items"]


def fetch_bitable_records(app_token, table_id, token, page_size=500):
    """分页拉取多维表格记录"""
    records = []
    page_token = None
    while True:
        url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records"
        params = {"page_size": page_size, "page_token": page_token} if page_token else {"page_size": page_size}
        resp = requests.get(url, headers={"Authorization": f"Bearer {token}"}, params=params, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        if data.get("code") != 0:
            raise RuntimeError(f"拉取记录失败: {data}")
        items = data["data"].get("items", [])
        records.extend(items)
        if not data["data"].get("has_more"):
            break
        page_token = data["data"].get("page_token")
    return records


def parse_value(fields, key, default=None, as_list=False):
    """安全读取字段值，支持文本/多选/数字等"""
    val = fields.get(key, default)
    if val is None:
        return default
    if isinstance(val, list):
        return val if as_list else ", ".join(str(v) for v in val)
    if isinstance(val, dict):
        # 飞书多选/人员等字段可能是 [{"text": ...}]
        if "text" in val:
            return val["text"]
        if "value" in val:
            return val["value"]
        return json.dumps(val, ensure_ascii=False)
    return val


def normalize_number(val):
    if val is None or val == "":
        return 0
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return 0


def parse_tags(text):
    """将逗号/空格分隔的标签解析为数组"""
    if not text:
        return []
    return [t.strip() for t in str(text).replace("，", ",").split(",") if t.strip()]


def parse_comment_quality(fields):
    """读取评论质量各维度，字段名需与飞书表格保持一致"""
    keys = ["赞美", "提问", "分享体验", "开玩笑", "抱怨"]
    result = {}
    for k in keys:
        result[k] = normalize_number(fields.get(k, 0))
    return result


def transform_records(records):
    """将飞书原始记录转换为标准 schema"""
    contents = []
    for idx, rec in enumerate(records, 1):
        f = rec.get("fields", {})
        content = {
            "id": rec.get("record_id") or f"r{idx:04d}",
            "account": parse_value(f, "账号", "未分类"),
            "platform": parse_value(f, "平台", "小红书"),
            "publish_time": parse_value(f, "发布时间", datetime.now().isoformat()),
            "content_type": parse_value(f, "内容形式", "图片"),
            "topic_tags": parse_tags(parse_value(f, "主题标签", "", as_list=False)),
            "emotion": parse_value(f, "内容情绪", "普通信息"),
            "activity_tag": parse_value(f, "活动标签", "无"),
            "is_activity": str(parse_value(f, "是否活动", "否")).startswith("是"),
            "campaign_name": parse_value(f, "活动名称") or None,
            "text": parse_value(f, "内容文案", ""),
            "exposure": normalize_number(f.get("曝光量")),
            "likes": normalize_number(f.get("点赞数")),
            "shares": normalize_number(f.get("转发数")),
            "comments": normalize_number(f.get("评论数")),
            "collections": normalize_number(f.get("收藏数")),
            "brand_replies": normalize_number(f.get("品牌回复数")),
            "avg_reply_time_minutes": normalize_number(f.get("平均回复时长_分钟")),
            "comment_quality": parse_comment_quality(f),
        }
        contents.append(content)
    return contents


def build_meta(contents):
    accounts = sorted(set(c["account"] for c in contents))
    dates = sorted(c["publish_time"][:10] for c in contents if c["publish_time"])
    return {
        "updated_at": datetime.now().isoformat(),
        "source": "feishu",
        "account_count": len(accounts),
        "content_count": len(contents),
        "date_range": [dates[0], dates[-1]] if dates else [None, None],
    }


def save_content_data(contents):
    payload = {
        "meta": build_meta(contents),
        "contents": contents,
    }
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as fp:
        json.dump(payload, fp, ensure_ascii=False, indent=2)
    log(f"已保存 {len(contents)} 条记录到 {DATA_FILE}")


def run_ai_analysis_if_configured(contents):
    """可选：调用 OpenAI API 对内容进行自动标签/爆款分析（未配置则跳过）"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        log("未配置 OPENAI_API_KEY，跳过 AI 自动分析")
        return contents

    log("开始 AI 自动标签分析...")
    # 这里预留 AI 分析逻辑：可调用 ChatGPT 对每条内容的 text 做主题/情绪标签补全
    # 为示例，仅对缺失字段做补全
    for item in contents:
        if not item.get("topic_tags") or not item.get("emotion"):
            # 实际生产环境应批量调用 API，避免逐条请求导致超时
            pass
    return contents


def main():
    app_id = os.getenv("FEISHU_APP_ID")
    app_secret = os.getenv("FEISHU_APP_SECRET")
    app_token = os.getenv("FEISHU_BASE_APP_TOKEN")
    table_id = os.getenv("FEISHU_TABLE_ID")

    # 本地测试模式：如果未配置飞书密钥，直接读取示例数据并复制为标准数据
    if not all([app_id, app_secret, app_token]):
        log("未配置飞书密钥，进入本地测试模式")
        sample_path = ROOT / "data" / "sample_data.json"
        if sample_path.exists():
            with open(sample_path, "r", encoding="utf-8") as fp:
                sample = json.load(fp)
            save_content_data(sample["contents"])
            return
        else:
            raise RuntimeError("缺少飞书密钥且未找到 sample_data.json")

    log("开始同步飞书数据...")
    token = get_tenant_token(app_id, app_secret)

    if not table_id:
        tables = list_tables(app_token, token)
        if not tables:
            raise RuntimeError("未在多维表格中找到任何 table")
        table_id = tables[0]["table_id"]
        log(f"自动选择 table: {tables[0].get('name')} ({table_id})")

    records = fetch_bitable_records(app_token, table_id, token)
    log(f"从飞书拉取 {len(records)} 条原始记录")

    contents = transform_records(records)
    contents = run_ai_analysis_if_configured(contents)
    save_content_data(contents)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"同步失败: {e}")
        sys.exit(1)
