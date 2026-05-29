#!/usr/bin/env bash
# Push local ~/.cursor personal assets INTO this repo (my-cursor-sync).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${CURSOR_HOME:-$HOME/.cursor}"

echo "Source: $SRC"
echo "Repo:   $REPO_ROOT"
echo ""

# --delete 없음: repo 전용 스킬(my-cursor-sync) 실수 삭제 방지
# private 스킬은 ~/.cursor/private 또는 아래 이름 — repo 미동기화
rsync -avL \
  "$SRC/skills/" "$REPO_ROOT/skills/" \
  --exclude '.env' \
  --exclude 'node_modules' \
  --exclude 'kr-stock-analysis' \
  --exclude 'kr-stock-dual-strategy' \
  --exclude 'us-daily-portfolio-check'

mkdir -p "$REPO_ROOT/.cursor/rules"
if [[ -d "$SRC/.cursor/rules" ]]; then
  rsync -av "$SRC/.cursor/rules/" "$REPO_ROOT/.cursor/rules/" \
    --include='*/' --include='*.mdc' --exclude='*'
fi
if [[ -d "$SRC/rules" ]]; then
  rsync -av "$SRC/rules/" "$REPO_ROOT/.cursor/rules/" \
    --include='*.mdc' --exclude='*'
fi

# Never delete my-cursor-sync from repo if missing locally
rsync -av "$SRC/commands/cb/" "$REPO_ROOT/commands/cb/"
rsync -av "$SRC/scripts/cb/" "$REPO_ROOT/scripts/cb/" \
  --exclude 'slack-review-request-dedupe.json' \
  --exclude 'pr-review-notify-dedupe.json'

if [[ -d "$SRC/docs" ]]; then
  rsync -av "$SRC/docs/" "$REPO_ROOT/docs/"
fi

echo ""
echo "Synced. Next:"
echo "  cd $REPO_ROOT && git status"
echo "  git add -A"
echo "  ./scripts/commit-with-cursor.sh 'sync: cursor skills/commands/scripts'"
echo "  git push"
