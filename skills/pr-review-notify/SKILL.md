---
name: pr-review-notify
description: >-
  Human-only PR review state (APPROVED/CHANGES_REQUESTED), Slack DM drafts, per-item reply
  blocks with rationality check, idempotent dedupe. Event or schedule batch. Use for
  /cb:pr-review-notify, [your-label] PR 승인(사람만) 시 DM, or PR review notification automation.
disable-model-invocation: true
---

# PR review notify (personal)

Slash: **`/cb:pr-review-notify [pr-number]`** · **`/cb:pr-review-notify --schedule [github-login]`**

Rules: `~/.cursor/commands/cb/pr-review-notify.md`

## Quick rules

- Human reviews only (`/reviews`, exclude bots + PR author self-review for state).
- Priority: CHANGES_REQUESTED > APPROVED > NO_REVIEW.
- APPROVED → DM only (no PR comment). CHANGES_REQUESTED → [REVIEW_REPLY] per item + DM summary.
- Always output `## Result` / `## BatchResult` + `dm_dedupe_key` for pipeline parsing.
- Korean DM/replies; never print tokens.
- Post to GitHub/Slack only when user or automation policy explicitly allows.

Dedupe: `~/.cursor/scripts/cb/pr-review-notify-dedupe.json` (optional)
