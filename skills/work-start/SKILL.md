---
name: work-start
description: >-
  Creates feat/PROJ-{id}-{slug} branch from epic/base, runs scope grep, and prints
  start checklist. Use when the user runs /cb:work-start, asks 브랜치 만들어,
  작업 시작, or starting a Jira subtask implementation.
disable-model-invocation: true
---

# Work start (personal)

Slash command: **`/cb:work-start <jira-key> <branch-slug> [base-branch]`**

Full rules: read `~/.cursor/commands/cb/work-start.md` and follow exactly.

## Quick rules

- Branch: `feat/PROJ-123-legacy-shared-heart-api` via `~/.cursor/scripts/cb/branch-name.sh`.
- Base: epic branch for subtasks (e.g. heart 1043), not `main` unless triage says so.
- Scope grep before coding; Jira Start only if user asks.
- Do not commit/PR unless user requests.

Next: implement → `/cb:work-closeout <key> [pr]`.
