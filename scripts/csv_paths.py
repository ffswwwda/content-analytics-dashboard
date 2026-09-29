#!/usr/bin/env python3
"""源表 CSV 路径解析 —— 自动挑出 Downloads 里最新的那一份。

背景（本机实况）：从监控平台反复导出时，浏览器会把文件命名为
`<基础名>.csv`、`<基础名> (1).csv`、`<基础名> (2).csv` …
而导入脚本原先把路径写死成某个具体文件名，于是每次新导出都得先改代码。
更糟的情况是「脚本还指着旧那份、却以为导入的是新的」——静默用错数据源。

本模块按「基础名 + 任意后缀」匹配，取修改时间最新的一个，
并把「最终选了哪个文件」打印出来，让每次导入都留下可核对的一行证据。

用法：
    from csv_paths import resolve
    p = resolve("GTM跨境社媒数据监控_内容数据记录-X-续1_Grid View")
    # -> /Users/fsw/Downloads/GTM跨境社媒数据监控_内容数据记录-X-续1_Grid View (1).csv
"""
import glob
import os

DOWNLOADS = os.path.expanduser("~/Downloads")


def candidates(base, download_dir=None):
    """返回匹配 <base>*.csv 的全部文件（按修改时间倒序）。"""
    root = download_dir or DOWNLOADS
    hits = glob.glob(os.path.join(root, base + "*.csv"))
    # 排除同名前缀但属于别的数据集的（例如基名是「...-X」时不要吃掉「...-X-续1」）
    hits = [h for h in hits if os.path.basename(h).startswith(base)]
    return sorted(hits, key=os.path.getmtime, reverse=True)


def resolve(base, download_dir=None, verbose=True, required=True):
    """挑出最新的那一份；找不到时按 required 决定报错还是返回 None。"""
    hits = candidates(base, download_dir)
    if not hits:
        if required:
            raise SystemExit(f"[csv_paths] 在 {download_dir or DOWNLOADS} 找不到匹配 "
                             f"{base}*.csv 的文件")
        return None
    chosen = hits[0]
    if verbose:
        print(f"[csv_paths] {base}")
        print(f"            -> {os.path.basename(chosen)}"
              f"  ({os.path.getsize(chosen) / 1048576:.2f}MB, "
              f"mtime={__import__('datetime').datetime.fromtimestamp(os.path.getmtime(chosen)):%Y-%m-%d %H:%M})")
        if len(hits) > 1:
            others = ", ".join(os.path.basename(h) for h in hits[1:4])
            print(f"            另有 {len(hits) - 1} 个同基础名文件未选用（较旧）: {others}")
    return chosen


# 三份源表的基础名（从监控平台导出的固定前缀）
BASE_CONTENT = "GTM跨境社媒数据监控_内容数据记录-X_Grid View"
BASE_CONTENT_CONT = "GTM跨境社媒数据监控_内容数据记录-X-续1_Grid View"
BASE_ACCOUNT = "GTM跨境社媒数据监控_账号数据记录-X_Grid View"


if __name__ == "__main__":
    for b in (BASE_CONTENT, BASE_CONTENT_CONT, BASE_ACCOUNT):
        resolve(b)
