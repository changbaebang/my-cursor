#!/usr/bin/env bash
# Patch GitHub PR body from a markdown file.
# Usage: pr-body-patch.sh <pr-number> <body-markdown-file>
set -euo pipefail

PR="${1:?PR number required}"
BODY_FILE="${2:?Body markdown file required}"

if [[ ! -f "$BODY_FILE" ]]; then
  echo "error: file not found: $BODY_FILE" >&2
  exit 1
fi

OWNER_REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
PATCH_URL="repos/${OWNER_REPO}/pulls/${PR}"

run_gh() {
  if [[ -n "${GH_TOKEN:-}" ]]; then
    gh api -X PATCH "$PATCH_URL" --input - "$@"
  else
    gh api -X PATCH "$PATCH_URL" --input - "$@"
  fi
}

# If GH_TOKEN is invalid, retry without it (keyring).
if [[ -n "${GH_TOKEN:-}" ]]; then
  if ! jq -Rs '{body: .}' "$BODY_FILE" | run_gh 2>/tmp/pr-body-patch.err; then
    if grep -q 'Bad credentials' /tmp/pr-body-patch.err 2>/dev/null; then
      echo "warn: GH_TOKEN invalid, retrying with keyring" >&2
      jq -Rs '{body: .}' "$BODY_FILE" | env -u GH_TOKEN gh api -X PATCH "$PATCH_URL" --input -
      exit 0
    fi
    cat /tmp/pr-body-patch.err >&2
    exit 1
  fi
else
  jq -Rs '{body: .}' "$BODY_FILE" | gh api -X PATCH "$PATCH_URL" --input -
fi

echo "patched: https://github.com/${OWNER_REPO}/pull/${PR}"
