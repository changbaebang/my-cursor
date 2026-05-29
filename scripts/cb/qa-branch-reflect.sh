#!/usr/bin/env bash
# Merge origin/<feat-branch> into qa and push. See ~/.cursor/commands/cb/qa-branch-reflect.md
set -euo pipefail

FEAT_BRANCH="${1:?Usage: qa-branch-reflect.sh <feat-branch> e.g. feat/PROJ-123-remove-example-service}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: not a git repository" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "error: working tree not clean. stash or commit first." >&2
  exit 1
fi

echo "==> 1) main"
git checkout main
git fetch origin main
git merge --ff-only origin/main

echo "==> 2) qa from origin/qa"
git branch -D qa 2>/dev/null || true
git checkout -b qa origin/qa

echo "==> 3) merge origin/${FEAT_BRANCH}"
git fetch origin "${FEAT_BRANCH}"
git merge --no-ff "origin/${FEAT_BRANCH}" -m "merge: origin/${FEAT_BRANCH} into qa"

echo "==> 4) push origin qa"
git push origin qa

echo "done: qa includes origin/${FEAT_BRANCH} ($(git rev-parse --short HEAD))"
