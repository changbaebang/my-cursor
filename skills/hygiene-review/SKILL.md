---
name: hygiene-review
description: >-
  PR hygiene: deps, lockfile, exports, duplication, debug residue, monorepo conventions.
  Not release-blocking (use critical-review for that). Use for /cb:hygiene-review,
  [your-label][커서리뷰] Hygiene, or hygiene automation.
disable-model-invocation: true
---

# Hygiene review (personal)

Slash: **`/cb:hygiene-review [pr]`**

Rules: `~/.cursor/commands/cb/hygiene-review.md`

- MUST_FIX → COMMENT (no approve).
- Only SHOULD_FIX/NIT → APPROVE_WITH_COMMENTS.
