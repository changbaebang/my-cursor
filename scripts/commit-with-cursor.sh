#!/usr/bin/env bash
# Git commit for my-cursor (and Cursor config) — always adds Co-authored-by: Cursor
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

CURSOR_CO_AUTHOR='Co-authored-by: Cursor <cursoragent@cursor.com>'

usage() {
  echo "Usage: $0 \"commit subject\" [- optional extra body lines]"
  echo "       git add -A is NOT run — stage files before commit."
  exit 1
}

[[ $# -ge 1 ]] || usage

SUBJECT="$1"
shift
BODY="${*:-}"

if [[ -n "$BODY" ]]; then
  MSG="${SUBJECT}

${BODY}

${CURSOR_CO_AUTHOR}"
else
  MSG="${SUBJECT}

${CURSOR_CO_AUTHOR}"
fi

git commit -m "$MSG"
echo "Committed with ${CURSOR_CO_AUTHOR}"
