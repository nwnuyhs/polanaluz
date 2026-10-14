#!/usr/bin/env bash
# 构建在线演示并推到 gh-pages 分支（GitHub Pages 从该分支发布）。
# 用法：npm run deploy
# 如果你的 GitHub 令牌有 workflow 权限，也可以改用 GitHub Actions 自动部署：
#   mkdir -p .github/workflows && cp scripts/pages-workflow.yml.example .github/workflows/pages.yml
set -euo pipefail
cd "$(dirname "$0")/.."

# Windows 的 Git Bash 会把 "/polanaluz/" 这类值改写成 Windows 路径，这里关掉
export MSYS_NO_PATHCONV=1
POLANALUZ_BASE=/polanaluz/ npm run build

OUT=dist/studio
mkdir -p "$OUT/lib" "$OUT/examples"
cp -r dist/lib/* "$OUT/lib/"
cp examples/*.html examples/*.json examples/*.webp "$OUT/examples/"
sed -i 's#\.\./dist/lib/#../lib/#g' "$OUT"/examples/*.html
touch "$OUT/.nojekyll"

REMOTE=$(git remote get-url origin)
cd "$OUT"
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy demo"
git push -f -q "$REMOTE" gh-pages
rm -rf .git
echo "已部署：https://nwnuyhs.github.io/polanaluz/"
