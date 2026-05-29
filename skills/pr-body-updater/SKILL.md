---
name: pr-body-updater
description: >-
  Updates YourOrg GitHub PR body metadata sections (Jira, Tier, impact, test, changes) via gh api.
  Use when the user runs /cb:pr-body, asks to fill PR body metadata, Tier, 영향도, or HESS sections.
disable-model-invocation: true
---

# PR Body Updater (personal)

Slash command: **`/cb:pr-body <pr-number|url>`**

Full rules: read `~/.cursor/commands/cb/pr-body.md` and follow exactly.

Quick reminders:

- Only 5 sections; preserve checklists and HESS blocks.
- Jira from PR title; Tier2 default for API/heart/navigation behavior changes.
- Always PATCH in same run; Korean output.
- `GH_TOKEN` preferred; keyring fallback if 401.

Apply helper: `~/.cursor/scripts/cb/pr-body-patch.sh`
