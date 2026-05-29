---
name: work-triage
description: >-
  Classifies FE work (api-migration, regression, mechanical-move, epic, etc.) and proposes
  Jira AC, base branch, commit/PR slices. Use when the user runs /cb:work-triage,
  asks 작업 나누기, 유형 분류, epic 쪼개기, or how to split PROJ tickets.
disable-model-invocation: true
---

# Work triage (personal)

Slash command: **`/cb:work-triage <jira-key|pr-number|pr-url>`**

Full rules: read `~/.cursor/commands/cb/work-triage.md` and follow exactly.

## Quick rules

- Types: A api-migration, B regression, C mechanical, D copy-style, E small-behavior, F epic.
- Output: classification, strategy, Jira AC paste, QA spots — **Korean**.
- Read-only grep/`gh pr diff`; no code commits unless asked.
- Next: `/cb:work-start <key> <slug>`.

Hub: `~/.cursor/commands/cb/README.md`
