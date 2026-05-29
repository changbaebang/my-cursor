#!/usr/bin/env bash
# Create a private skill directory with anonymized hash path and symlink alias.
# Usage:
#   private-skill-init.sh <skill-alias>
# Example:
#   private-skill-init.sh kr-stock-analysis
set -euo pipefail

ALIAS_RAW="${1:?Skill alias is required (e.g. kr-stock-analysis)}"
CURSOR_HOME="${CURSOR_HOME:-$HOME/.cursor}"
PRIVATE_ROOT="$CURSOR_HOME/private/skills"
PUBLIC_SKILLS="$CURSOR_HOME/skills"

ALIAS="$(echo "$ALIAS_RAW" | tr '[:upper:]' '[:lower:]' | tr ' _/' '-' | tr -cd 'a-z0-9-')"
if [[ -z "$ALIAS" ]]; then
  echo "Invalid alias: $ALIAS_RAW"
  exit 1
fi

if command -v openssl >/dev/null 2>&1; then
  HASH_ID="$(openssl rand -hex 16)"
else
  HASH_ID="$(python3 - <<'PY'
import secrets
print(secrets.token_hex(16))
PY
)"
fi

TARGET_DIR="$PRIVATE_ROOT/$HASH_ID"
LINK_PATH="$PUBLIC_SKILLS/$ALIAS"
SKILL_FILE="$TARGET_DIR/SKILL.md"

mkdir -p "$TARGET_DIR" "$PUBLIC_SKILLS"

cat > "$SKILL_FILE" <<EOF
---
name: $ALIAS
description: 개인 스킬. 민감한 맥락을 다루며 repo 동기화 대상이 아니다.
disable-model-invocation: true
---

# $ALIAS

## Instructions

- 이 스킬은 private 용도다.
- 민감한 정보, 계정 정보, 내부 문맥은 외부 repo에 동기화하지 않는다.
EOF

if [[ -e "$LINK_PATH" && ! -L "$LINK_PATH" ]]; then
  echo "Path exists and is not a symlink: $LINK_PATH"
  exit 1
fi

ln -sfn "$TARGET_DIR" "$LINK_PATH"

echo "Created private skill:"
echo "  alias : $ALIAS"
echo "  target: $TARGET_DIR"
echo "  link  : $LINK_PATH"
