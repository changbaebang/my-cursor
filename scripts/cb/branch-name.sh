#!/usr/bin/env bash
# Print standard feature branch name for 29CM Jira keys.
# Usage: branch-name.sh <JIRA-KEY> <slug>
# Example: branch-name.sh M29CMCCF-1754 legacy-shared-heart-api
#   → feat/M29CMCCF-1754-legacy-shared-heart-api
set -euo pipefail

KEY="${1:?Jira key required (e.g. M29CMCCF-1754)}"
SLUG="${2:?Branch slug required (e.g. legacy-shared-heart-api)}"

# Normalize slug: lowercase, spaces → hyphens
SLUG="$(echo "$SLUG" | tr '[:upper:]' '[:lower:]' | tr ' _/' '-')"

echo "feat/${KEY}-${SLUG}"
