---
command: '/cb:typescript-review'
category: 'Code Review'
purpose: 'TypeScript 타입 안전·strictness must-NOT 리뷰 (프로덕션 vs 테스트 구분)'
description: >-
  PR diff에서 any, 이중 assertion, ts-ignore, implicit any 등을 영역별 심각도로 검사한다.
  Cloud: [your-label][기본] Typescript 작성 확인.
argument-hint: '[pr-number|pr-url|--diff]'
---

# /cb:typescript-review — TypeScript must-NOT review

## Gather diff

```bash
gh pr view <N> --json baseRefName,headRefName,files
gh pr diff <N>
```

No PR → `git diff origin/<base>...HEAD`. Output in **Korean**.

Post to GitHub only when user asks.

---

When reviewing TypeScript code, apply the rules below with different severity by code area.

## Severity policy by scope

- **Production/runtime/shared code** (e.g. `src/`, app/package runtime logic):
  - Treat all items below as **must NOT do**.
  - If found, always leave a **change request (수정 요청)** in Korean.

- **Test-only code** (e.g. `*.test.ts`, `*.spec.ts`, `__tests__`, test fixtures/mocks/helpers):
  - Treat all items below as **should avoid** by default.
  - Leave **recommendations (권고)** in Korean, not change requests, unless it creates real risk:
    1) can cause runtime failures/flaky tests,
    2) hides a real type mismatch that could leak into production code,
    3) suppresses errors without justification in a way that blocks maintainability.

## Type safety – avoid bypassing the type system
- Do NOT use `any`. Use a concrete type, `unknown`, or a narrow generic. If shape is unclear, type as far as possible and narrow with type guards.
- Do NOT use `as unknown as SomeType` (or similar double assertions) to silence errors when it hides real mismatches.
- Do NOT use non-null assertion (`!`) when value can actually be `undefined`/`null`.
- Do NOT use `// @ts-ignore` or `// @ts-expect-error` without a short unavoidable-reason comment.

## Strictness and discipline
- Do NOT leave implicit `any` (e.g. untyped params, untyped catch where explicit typing/narrowing is needed).
- Do NOT use `as T` only to satisfy compiler when runtime value may not match.
- Do NOT use overly broad types (`object`, `Function`, `Record<string, any>`) when precise types are possible.

## Types and reuse
- Do NOT duplicate type definitions derivable via `typeof`, `ReturnType`, `Parameters`, `Pick`, `Omit`, or shared interfaces.
- Do NOT export/use types that leak implementation details when minimal public types suffice.

## Null, optional, and async
- Do NOT ignore `undefined`/`null` via assertions when path can hit them.
- Do NOT leave promises unhandled.
- Do NOT mark function `async` if it never `await`s and doesn’t need Promise semantics.

## Enums and runtime types
- Do NOT use a TS type/interface as a runtime value.
- Do NOT introduce enums against project style (prefer `as const` objects + unions if that is the project convention).

---

## Output format

## Decision
- REQUEST_CHANGES | COMMENT | APPROVE (no TS must-NOT in production scope)

## Findings
- [수정 요청 | 권고] `<file:line>` — issue — suggested fix

## Summary (Korean, PR comment draft)

## Branch note
- If base is non-production and issue is WIP/test-only, downgrade per react-review branch policy.
