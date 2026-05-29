#!/usr/bin/env bash
# Run gh with keyring token (ignores stale GH_TOKEN from env).
set -euo pipefail
export GH_TOKEN="$(env -u GH_TOKEN -u GITHUB_AUTH_TOKEN gh auth token)"
export GITHUB_AUTH_TOKEN="$GH_TOKEN"
exec gh "$@"
