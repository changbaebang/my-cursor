---
name: intake
description: >-
  Turns Slack, Confluence, Figma, or pasted context into structured Jira Epic/Story/subtask
  drafts with AC and scope. Use when the user runs /cb:intake, asks to 정리해줘 for Jira,
  티켓 만들기, 맥락 수집, or intake from Confluence/Slack.
disable-model-invocation: true
---

# Intake (personal)

Slash command: **`/cb:intake [jira-key|url|--paste]`**

Full rules: read `~/.cursor/commands/cb/intake.md` and follow exactly.

## Quick rules

- Output: summary, scope, subtask table, AC, Jira description paste block — **Korean**.
- Do **not** write Jira until user confirms.
- Large work → slice like example epic (`docs/your-epic-example.md`).
- Next: `/cb:work-triage <key>`.
