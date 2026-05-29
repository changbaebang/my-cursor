---
name: pr-checklist-review
description: >-
  YourOrg PR template Hard/Soft Gates, Tier1-3/Hotfix, Jira key, branch-aware APPROVE decision.
  Use for /cb:pr-checklist, [your-label][기본] PR template 리뷰, or PR quality gate review.
disable-model-invocation: true
---

# PR checklist review (personal)

Slash: **`/cb:pr-checklist [pr]`**

Rules: `~/.cursor/commands/cb/pr-checklist.md`

- No invented evidence.
- Hard Gate fail on production-bound → REQUEST_CHANGES.
- WIP on feature branch → COMMENT + follow-up Jira/owner/date.
