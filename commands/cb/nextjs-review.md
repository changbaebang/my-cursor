---
command: '/cb:nextjs-review'
category: 'Code Review'
purpose: 'Next.js monorepo 렌더링·use client·Gateway 분류 기반 리뷰'
description: >-
  Content/Gateway/Client UI 분류 후 must-NOT 적용. Gateway searchParams+redirect false positive 방지.
  Cloud: [your-label][기본] Nextjs 작성 확인.
argument-hint: '[pr-number|pr-url]'
---

# /cb:nextjs-review — Next.js review

## Gather diff

```bash
gh pr view <N> --json files,baseRefName
gh pr diff <N>
```

Output **Korean**. Post to GitHub only when asked.

---

You are performing a code review for a Next.js monorepo.

## 0) Mandatory context classification (MUST)
Before applying any "must NOT do" rule, classify the route/component intent:

- **Content Page**: user-facing content/SEO page intended for stable rendering.
- **Gateway/Bridge Page**: routing-only entrypoint (e.g. auth bridge, callback, deep-link bridge, validation + immediate redirect).
- **Client Interaction UI**: component requiring browser APIs/events/hooks.
- **Infrastructure/Glue**: utility for navigation/security normalization.

You MUST state the classification briefly in the review.

## 0.1) False-positive guard (MUST)
If code is a **Gateway/Bridge Page**, do NOT request change solely because it reads `searchParams` on server and redirects.
This pattern is acceptable when used for:
- early validation/sanitization of `next`/`fallback`
- allowlist/protocol checks (open-redirect prevention)
- immediate `redirect()` before rendering content

In this case, only request change if there is a real risk (security hole, broken redirect chain, runtime bug).

## 0.2) Security-first precedence (MUST)
When "static rendering preference" conflicts with "security/validation before navigation",
security-first server validation wins for Gateway/Bridge pages.

## 1) Rendering & "use client" (Conditional)
- Do NOT use Dynamic Rendering for **Content Pages** when project standard is static rendering.
- For **Gateway/Bridge Pages**, server-side `searchParams` parsing + redirect is allowed.
- Do NOT add `"use client"` unless needed (hooks/browser APIs/event handlers).
- Do NOT use browser-only APIs during server render without guards.

## 2) Review decision policy (MUST)
- **REQUEST_CHANGES** only for proven defects/regressions/security risks.
- **COMMENT** for architecture preference/style suggestions without concrete risk.
- Never promote a preference to REQUEST_CHANGES without explaining user impact.

## 3) Evidence requirement (MUST)
For each finding, include:
- file path
- exact behavior risk
- why current context classification makes it blocking or non-blocking

---

## Output format

## Route classifications
- `<path>` → Content | Gateway | Client UI | Glue

## Decision
- REQUEST_CHANGES | COMMENT | APPROVE

## Findings
(per finding: path, risk, blocking yes/no, classification rationale)

## Summary comment draft (Korean)
