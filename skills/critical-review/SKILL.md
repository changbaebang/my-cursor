---
name: critical-review
description: >-
  Finds release-blocking bugs only (data loss, crashes, auth bypass, security, infinite loops,
  critical flow breakage) in PR diffs. Ignores style/nits. Use when the user runs /cb:critical-review,
  asks for 심각도 확인, critical bug review, release-blocking review, or cursor 리뷰 심각도.
disable-model-invocation: true
---

# Critical review (personal)

Slash command: **`/cb:critical-review [pr-number|url]`**

Full rules: read `~/.cursor/commands/cb/critical-review.md` and follow exactly.

## Quick rules

- **Only** release-blocking issues with reproducible trigger + blast radius.
- Trace caller → callee; focus on **diff regressions**.
- No type-check/build/test gate; code-path analysis only.
- Confident & no critical → **Approve** + "no critical bugs found".
- Uncertain or critical found → **Not Approve** (comments/questions).
- Optional: post via `gh pr review` / `gh pr comment` when user expects GitHub review.

Legacy name: `[your-label][커서리뷰] 심각도 확인` → replaced by this skill/command.
