#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""在 github.com:443 不可达时，改用 GitHub REST API 推送本地已有的提交。

背景（本机实况 2026-09-21）：
  - github.com 直连失败（curl 返回 000 / connection failed）
  - 环境变量里的 HTTP_PROXY 指向工具自用代理，访问 github 一律 502
  - 但 api.github.com 直连可用（HTTP 200）

思路：不 push。改用 Git Data API 在服务端「重建」这个提交对象。
只要 blob / tree / commit / 作者与时间戳逐字相同，得到的 SHA 就与本地一致，
远程 ref 就能快进（fast-forward）过去，不产生任何分叉。

关键坑（踩过一次）：
  提交信息尾部的换行符是 commit 对象内容的一部分。
  Python 里 git() 默认 .rstrip("\n") 会吃掉它，导致 commit SHA 不匹配
  （tree 一模一样、commit 却变了）。所以必须用 cat-file commit + 二进制读取。

用法：
  GH_TOKEN=ghp_xxx python3 scripts/push_via_api.py
前置条件：远程 main 必须恰好停在本地 HEAD 的父提交上，否则脚本拒绝执行。
"""
import base64
import datetime
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

REPO = "ffswwwda/content-analytics-dashboard"
API = "https://api.github.com"
PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 必须显式关掉代理：本机 HTTP_PROXY 指向工具代理，会 502
_opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def req(method, path, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    r = urllib.request.Request(API + path, data=data, method=method)
    r.add_header("Authorization", "token " + os.environ["GH_TOKEN"])
    r.add_header("Accept", "application/vnd.github+json")
    r.add_header("User-Agent", "push-via-api")
    if data:
        r.add_header("Content-Type", "application/json")
    try:
        with _opener.open(r, timeout=180) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print("HTTP %s %s -> %s" % (e.code, method + " " + path,
                                    e.read().decode("utf-8", "replace")[:800]))
        sys.exit(1)


def git(*args, binary=False):
    out = subprocess.run(["git"] + list(args), cwd=PROJ, capture_output=True)
    if out.returncode != 0:
        raise SystemExit("git %s failed: %s" % (" ".join(args), out.stderr.decode()))
    return out.stdout if binary else out.stdout.decode("utf-8").rstrip("\n")


def parse_ident(header_bytes, kind):
    """从 commit header 还原 author / committer 的 name/email/date（含时区偏移）。

    必须分别解析：`git commit --amend` 会保留 author 时间但刷新 committer 时间，
    两者不同；把 committer 也写成 author 会得到另一个 SHA。
    """
    for line in header_bytes.decode("utf-8").splitlines():
        if not line.startswith(kind + " "):
            continue
        name_email, ts = line[len(kind) + 1:].rsplit(">", 1)
        name, email = name_email.split(" <")
        secs, tz = ts.strip().split(" ")
        sign = 1 if tz[0] == "+" else -1
        delta = datetime.timedelta(hours=int(tz[1:3]), minutes=int(tz[3:5])) * sign
        dt = datetime.datetime.fromtimestamp(int(secs), datetime.timezone.utc)
        dt = dt.astimezone(datetime.timezone(delta))
        off = "%s%s:%s" % (tz[0], tz[1:3], tz[3:5])
        return {"name": name, "email": email,
                "date": dt.strftime("%Y-%m-%dT%H:%M:%S") + off}
    raise SystemExit("找不到 %s 行" % kind)


def main():
    head = git("rev-parse", "HEAD")
    remote = req("GET", "/repos/%s/git/refs/heads/main" % REPO)["object"]["sha"]
    print("本地 HEAD   =", head)
    print("远程 main   =", remote)

    # 二进制读取：尾部换行属于对象内容，少一个 \n 就是另一个 SHA
    meta = git("cat-file", "commit", head, binary=True)
    header_b, _, message_b = meta.partition(b"\n\n")
    header = header_b.decode("utf-8")
    message = message_b.decode("utf-8")
    lines = header.splitlines()
    tree_sha = [l.split()[1] for l in lines if l.startswith("tree ")][0]
    parents = [l.split()[1] for l in lines if l.startswith("parent ")]
    print("tree        =", tree_sha)
    print("parents     =", parents)

    if remote != parents[0]:
        print("\n中止：远程 main 不是本提交的父提交，直接推送会产生分叉。")
        sys.exit(2)

    # 1) 变更文件 -> blob（内容一致的会被 GitHub 去重，返回同一个 sha）
    #    用 --name-status 而不是 --name-only：删除要显式发 sha=null，
    #    否则 base_tree 会把旧文件带过来，tree 就对不上了。
    entries = []
    for line in git("diff", "--name-status", parents[0], head).splitlines():
        parts = line.split("\t")
        status, path = parts[0], parts[-1]
        if status.startswith("D"):
            print("DEL            %s" % path)
            entries.append({"path": path, "mode": "100644", "type": "blob", "sha": None})
            continue
        mode = "100755" if git("ls-tree", head, path).startswith("100755") else "100644"
        blob_sha = git("rev-parse", "%s:%s" % (head, path))
        content = git("cat-file", "blob", blob_sha, binary=True)
        res = req("POST", "/repos/%s/git/blobs" % REPO,
                  {"content": base64.b64encode(content).decode("ascii"),
                   "encoding": "base64"})
        print("%s%s  %s  (%d bytes)" % ("OK " if res["sha"] == blob_sha else "!! ",
                                        res["sha"][:12], path, len(content)))
        if res["sha"] != blob_sha:
            raise SystemExit("blob sha 不一致，中止")
        entries.append({"path": path, "mode": mode, "type": "blob", "sha": blob_sha})

    # 2) 新 tree（以父提交的 tree 为基底，只覆盖变更项）
    base_tree = req("GET", "/repos/%s/git/commits/%s" % (REPO, parents[0]))["tree"]["sha"]
    new_tree = req("POST", "/repos/%s/git/trees" % REPO,
                   {"base_tree": base_tree, "tree": entries})["sha"]
    print("新 tree     =", new_tree, "(", "OK" if new_tree == tree_sha else "!! MISMATCH", ")")
    if new_tree != tree_sha:
        raise SystemExit("tree sha 不一致，中止")

    # 3) 新 commit（作者/提交者/时间/信息逐字沿用，保证 SHA 相同）
    payload = {"message": message, "tree": tree_sha, "parents": parents,
               "author": parse_ident(header_b, "author"),
               "committer": parse_ident(header_b, "committer")}
    commit = req("POST", "/repos/%s/git/commits" % REPO, payload)
    print("新 commit   =", commit["sha"], "(", "OK" if commit["sha"] == head else "!! MISMATCH", ")")
    if commit["sha"] != head:
        raise SystemExit("commit sha 不一致，中止")

    # 4) 移动 ref（非强制，只允许快进）
    res = req("PATCH", "/repos/%s/git/refs/heads/main" % REPO,
              {"sha": commit["sha"], "force": False})
    print("ref 已更新  ->", res["object"]["sha"])


if __name__ == "__main__":
    main()
