---
name: cb-guide
description: >-
  Index of all personal cb slash commands (workflow + PR reviews), recommended review order,
  and Cloud Agent trigger mapping for YourOrg frontend. Use when user asks cb 사용법, cb 스킬 목록,
  어떤 리뷰, /cb:guide, or which automation to run on a PR.
disable-model-invocation: true
---

# cb guide (personal hub)

Slash: **`/cb:guide [workflow|review|all]`**

Full index: `~/.cursor/commands/cb/cb-guide.md` and `~/.cursor/commands/cb/README.md`

## Workflow

`intake` → `work-triage` → `work-start` → (code) → `prd-review` / reviews → `pr-body` → `work-closeout`

## PR review order (typical)

`prd-review` → `pr-checklist` → `typescript-review` → `nextjs-review` → `react-review` → `hygiene-review` → `critical-review`

## Triggers

`~/.cursor/commands/cb/examples/review-automation-triggers.md`
