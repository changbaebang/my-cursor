---
name: prd-review
description: >-
  Reviews YourOrg PRD quality (1-8 definition, A-E scores) and PRD vs implementation alignment
  from Confluence and PR diff. No speculation without document/code evidence. Use when the user
  runs /cb:prd-review, posts [your-label] PRD on a PR, asks PRD 품질, alignment, or PRD 점수.
disable-model-invocation: true
---

# PRD review (personal)

Slash command: **`/cb:prd-review [pr-number|url|--paste] [confluence-url]`**

Full rules: read `~/.cursor/commands/cb/prd-review.md` and follow exactly.

## Quick rules

- **Part A**: PRD 1~8 checklist, scores A–E, type (완성 PRD | 초안 | PRD 아님), one recommendation.
- **Part B**: only if PR diff or implementation summary exists; mapping table + gaps.
- No PRD body (link only) → **판단 불가**; do not invent scores.
- Fetch PRD via Atlassian MCP; PR via `gh pr diff --stat`.
- Post `gh pr comment` only when user asks.

Cloud trigger template: `~/.cursor/commands/cb/examples/prd-git-comment-template.md`

Legacy label: `[your-label] PRD`
