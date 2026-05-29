---
name: typescript-review
description: >-
  Reviews TypeScript PR diffs for any, double assertions, ts-ignore, implicit any with
  production vs test severity. Use for /cb:typescript-review, [your-label][기본] Typescript,
  TypeScript 작성 확인, or TS type safety review.
disable-model-invocation: true
---

# TypeScript review (personal)

Slash: **`/cb:typescript-review [pr|--diff]`**

Rules: `~/.cursor/commands/cb/typescript-review.md`

- Production `src/`: **수정 요청** on must-NOT.
- Test files: **권고** unless leak/flaky risk.
- Korean output.
