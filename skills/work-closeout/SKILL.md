---
name: work-closeout
description: >-
  Finishes a Jira work unit: git/AC check, push guidance, Jira Done, next ticket, and links
  to /cb:pr-body and /cb:critical-review. Use when the user runs /cb:work-closeout,
  asks 작업 마무리, Jira Done, or after merge what is next subtask.
disable-model-invocation: true
---

# Work closeout (personal)

Slash command: **`/cb:work-closeout <jira-key> [pr-number|url]`**

Full rules: read `~/.cursor/commands/cb/work-closeout.md` and follow exactly.

## Quick rules

- Verify AC (e.g. heartApi 0건); report git + PR state.
- Suggest `/cb:pr-body` and `/cb:critical-review` when relevant.
- Jira Done (transition 61) only after user confirms or merge confirmed.
- Commit/push only when user explicitly asks.

Hub: `~/.cursor/commands/cb/README.md`
