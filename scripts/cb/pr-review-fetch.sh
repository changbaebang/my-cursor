#!/usr/bin/env bash
# Fetch PR + reviews + comments for pr-review-notify automation.
# Usage: pr-review-fetch.sh <pr-number> [owner/repo]
set -euo pipefail

PR="${1:?PR number required}"
OWNER_REPO="${2:-29CM-Developers/frontend-29cm-platform}"
OWNER="${OWNER_REPO%%/*}"
REPO="${OWNER_REPO##*/}"

echo "=== pull ==="
gh api "/repos/$OWNER/$REPO/pulls/$PR"

echo "=== reviews ==="
gh api "/repos/$OWNER/$REPO/pulls/$PR/reviews"

echo "=== review comments (inline) ==="
gh api "/repos/$OWNER/$REPO/pulls/$PR/comments"

echo "=== issue comments ==="
gh api "/repos/$OWNER/$REPO/issues/$PR/comments"
