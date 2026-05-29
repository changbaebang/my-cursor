---
command: '/cb:critical-review'
category: 'Code Review'
purpose: '릴리즈 차단급(critical) 버그만 탐지하는 심층 코드 리뷰'
description: >-
  PR 또는 현재 브랜치 diff에서 데이터 손상·크래시·인증·보안·무한루프·핵심 플로우 장애만 찾는다.
  스타일/니트는 무시. 확신 있으면 Approve, 아니면 Not Approve.
argument-hint: '[pr-number|pr-url|--diff base]'
---

# /cb:critical-review — Release-blocking bug finder

## Primary objective

Detect only **release-blocking** bugs that can cause:

- data loss/corruption
- crashes
- auth/permission bypass
- security vulnerabilities
- infinite loops/resource exhaustion
- major user-flow breakage in critical paths

If none are found, explicitly state: **"no critical bugs found"**.

## Scope and severity filter

Only report issues with a concrete, reproducible trigger scenario and meaningful blast radius.

Ignore:

- style/nit/refactor suggestions
- low-severity UX degradation
- theoretical concerns without a realistic trigger
- non-critical test gaps

## Investigation method

1. Resolve review target:
   - Argument PR number/URL → `gh pr view` + `gh pr diff`
   - No argument → current branch vs base (`gh pr view` if linked PR exists, else `git diff origin/main...HEAD`)
2. Trace full runtime path (caller → callee → downstream effects).
3. Focus on **behavioral regressions introduced by the diff**.
4. Prioritize correctness over broad coverage.

## Environment constraints

- Assume CI/runtime may not have installable dependencies.
- **Do not run type-check/build/test as a required gate.**
- Do not mention missing node_modules or inability to type-check unless explicitly asked.
- Base conclusions on **code-path analysis** and available execution evidence only.

## Decision policy (strict)

1. **Critical risk confirmed**
   - Leave blocking review comments (GitHub) with: Bug/impact, trigger, root cause, minimal fix.
   - Do **not approve**.

2. **Risky or uncertain / not confident**
   - Leave comments/questions only.
   - Do **not approve**.
   - Do not force a fix/PR.

3. **No critical risk found and confidence is high**
   - Leave short summary comment:
     - "No critical bugs found in this review scope."
     - Residual risk (if any)
   - **Approve**.

## GitHub actions (when PR is identified)

Use `GH_TOKEN` if set; on 401 retry `env -u GH_TOKEN gh ...` (keyring). Never print tokens.

- Summary / findings: `gh pr comment <N> --body "..."`
- Approve: `gh pr review <N> --approve --body "..."`
- Request changes (blocking): `gh pr review <N> --request-changes --body "..."`
- Inline (if line-accurate): `gh api` pull request review comments when confident

If user did not ask to post to GitHub, output findings in chat only and ask before submitting review.

## Output format (chat)

For each **critical** finding:

- Bug and impact
- Trigger scenario
- Root cause
- Minimal fix
- Validation evidence

If no findings:

- **"No critical bugs found"**
- Brief residual-risk note
- Approval decision (**Approve** / **Not Approve**) with reason

## Usage

```text
/cb:critical-review
/cb:critical-review 6934
/cb:critical-review https://github.com/your-org/your-repo/pull/1234
```

## Language

- Findings and PR comments: **Korean** (팀 리뷰 가독성).
- Severity labels in summary: Critical only (do not invent Medium/Low sections).
