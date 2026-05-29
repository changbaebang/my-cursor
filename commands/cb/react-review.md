---
command: '/cb:react-review'
category: 'Code Review'
purpose: 'React must-NOT 리뷰 (보안·아키텍처·버그), 브랜치별 strictness'
description: >-
  must NOT 항목은 수정 요청, non-prod WIP/mock은 완화 가능. Cloud: [your-label][기본] React 작성 확인.
argument-hint: '[pr-number|pr-url]'
---

# /cb:react-review — React must-NOT review

## Gather diff

```bash
gh pr view <N> --json baseRefName,headRefName,files
gh pr diff <N>
```

Detect **production-bound** base: `main`, `master`, `release/*`, `production/*`.

---

You are performing a code review. Follow these rules:

1. **Review language**: Write all review comments and suggestions in **Korean**.

2. **Focus on "must NOT do"**: Prioritize identifying and flagging things that should NOT be in the codebase, such as:
   - Security issues (e.g. hardcoded secrets, unsafe user input usage)
   - Breaking architectural rules or dependency direction
   - Anti-patterns (e.g. type-unsafe casts like `as unknown as X`, unreachable code, redundant or double work)
   - Violations of project conventions (e.g. banned libraries, wrong layer usage)
   - Obvious bugs (e.g. logic errors, wrong conditions that prevent intended behavior)
   - Accessibility or correctness issues that will cause real user impact

3. **Request changes for "must NOT" items**:
   - 기본 원칙: must NOT 항목은 **수정 요청**으로 처리.
   - 단, **PR base branch가 non-production branch**(main/master/release/*/production/* 제외)이고,
     이슈가 **WIP/임시 mock** 성격이며 즉시 장애 위험이 낮고 fallback이 있는 경우:
     - `수정 요청` 대신 `개선 권장` 또는 `코멘트`로 완화 가능.
     - 이 경우 반드시 후속 조치(티켓/담당자/본선 반영 시점)를 함께 남긴다.
   - **production-bound branch**에서는 기존대로 must NOT 항목을 수정 요청으로 유지.

4. **Optional improvements**: For style, naming, or minor consistency issues that are not in the "must NOT" list, you may suggest them as optional improvements (개선 권장) and keep the tone lighter. Do not demand changes for these unless they align with explicit project rules.

5. **Be concise**: Keep each comment clear and actionable. If a change is required, state what is wrong and what should be done instead.

6. **Branch-aware strictness (new)**:
   - Production-bound branches: `main`, `master`, `release/*`, `production/*`
   - Non-production-bound branches: all others
   - Production-bound에서는 보수적으로 판단하고, non-production-bound에서는 WIP/mock 항목을 완화할 수 있다.

---

## Output format

## Context
- Base branch: … (production-bound: yes/no)

## Decision
- REQUEST_CHANGES | COMMENT | APPROVE

## Findings
- [수정 요청 | 개선 권고 | 코멘트] …

## Required follow-ups (WIP downgrade only)
- Jira / owner / target date

## Summary comment draft (Korean)
