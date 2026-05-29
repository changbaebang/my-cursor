#!/usr/bin/env bash
# Print standard feature branch name for Jira keys.
# Usage: branch-name.sh <JIRA-KEY> <slug>
# Example: branch-name.sh PROJ-123 legacy-shared-example-api
#   → feat/PROJ-123-legacy-shared-example-api
set -euo pipefail

KEY="${1:?Jira key required (e.g. PROJ-123)}"
SLUG="${2:?Branch slug required (e.g. legacy-shared-example-api)}"

# Normalize slug: lowercase, spaces → hyphens
SLUG="$(echo "$SLUG" | tr '[:upper:]' '[:lower:]' | tr ' _/' '-')"

echo "feat/${KEY}-${SLUG}"
