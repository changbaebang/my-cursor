#!/usr/bin/env bash
# Install my-cursor into ~/.cursor (symlink). Safe to re-run.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
CURSOR_HOME="${CURSOR_HOME:-$HOME/.cursor}"

echo "Repo:  $REPO_ROOT"
echo "Target: $CURSOR_HOME"
echo ""

mkdir -p "$CURSOR_HOME/skills" "$CURSOR_HOME/commands" "$CURSOR_HOME/scripts"

# skills: one symlink per skill directory
for skill_dir in "$REPO_ROOT"/skills/*/; do
  name="$(basename "$skill_dir")"
  [[ "$name" == "README.md" ]] && continue
  [[ -f "$skill_dir/SKILL.md" ]] || continue
  target="$CURSOR_HOME/skills/$name"
  if [[ -e "$target" && ! -L "$target" ]]; then
    echo "SKIP skills/$name (exists and is not a symlink)"
    continue
  fi
  ln -sfn "$skill_dir" "$target"
  echo "LINK skills/$name"
done

# commands/cb
mkdir -p "$CURSOR_HOME/commands"
if [[ -e "$CURSOR_HOME/commands/cb" && ! -L "$CURSOR_HOME/commands/cb" ]]; then
  echo "WARN: $CURSOR_HOME/commands/cb exists and is not a symlink — merge manually"
else
  ln -sfn "$REPO_ROOT/commands/cb" "$CURSOR_HOME/commands/cb"
  echo "LINK commands/cb"
fi

# scripts/cb
mkdir -p "$CURSOR_HOME/scripts"
if [[ -e "$CURSOR_HOME/scripts/cb" && ! -L "$CURSOR_HOME/scripts/cb" ]]; then
  echo "WARN: $CURSOR_HOME/scripts/cb exists and is not a symlink — merge manually"
else
  ln -sfn "$REPO_ROOT/scripts/cb" "$CURSOR_HOME/scripts/cb"
  echo "LINK scripts/cb"
fi

# docs (optional symlink)
if [[ -d "$REPO_ROOT/docs" ]]; then
  if [[ ! -e "$CURSOR_HOME/docs" ]]; then
    ln -sfn "$REPO_ROOT/docs" "$CURSOR_HOME/docs"
    echo "LINK docs"
  else
    echo "KEEP existing $CURSOR_HOME/docs (merge vendor-skills.md from repo if missing)"
    for f in "$REPO_ROOT"/docs/*.md "$REPO_ROOT"/docs/qa/*.md; do
      [[ -f "$f" ]] || continue
      base="$(basename "$f")"
      dest="$CURSOR_HOME/docs/$base"
      [[ -e "$dest" ]] && continue
      mkdir -p "$(dirname "$dest")"
      cp "$f" "$dest"
      echo "COPY docs/$base"
    done
  fi
fi

# rules (*.mdc) — public: rules/ ; private SSOT: .cursor/rules/
RULES_DIR="$REPO_ROOT/.cursor/rules"
[[ -d "$RULES_DIR" ]] || RULES_DIR="$REPO_ROOT/rules"
if [[ -d "$RULES_DIR" ]]; then
  mkdir -p "$CURSOR_HOME/rules"
  for rule in "$RULES_DIR"/*.mdc; do
    [[ -f "$rule" ]] || continue
    name="$(basename "$rule")"
    target="$CURSOR_HOME/rules/$name"
    if [[ -e "$target" && ! -L "$target" ]]; then
      echo "SKIP rules/$name (exists and is not a symlink)"
      continue
    fi
    ln -sfn "$rule" "$target"
    echo "LINK rules/$name"
  done
fi

# MCP template
if [[ ! -f "$CURSOR_HOME/mcp.json" ]]; then
  cp "$REPO_ROOT/mcp.json.example" "$CURSOR_HOME/mcp.json"
  echo "COPY mcp.json.example → ~/.cursor/mcp.json (edit tokens)"
else
  echo "KEEP existing ~/.cursor/mcp.json"
fi

# Slack PR review env
if [[ -f "$REPO_ROOT/skills/slack-pr-review/.env.example" && ! -f "$REPO_ROOT/skills/slack-pr-review/.env" ]]; then
  echo "TIP: cp skills/slack-pr-review/.env.example → skills/slack-pr-review/.env (local only, not in repo)"
fi

echo ""
echo "Done. Reload Cursor window. Run: /cb:guide"
