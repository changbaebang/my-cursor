---
command: '/cb:playwright-qa-smoke'
category: 'QA'
purpose: 'Playwright 비로그인 smoke + runbook/PR 스크린샷 워크플로'
description: >-
  앱 라우트·middleware 확인 후 비로그인 path만 Playwright spec 작성·실행.
  로그인 시나리오는 runbook §4 + Cursor 브라우저. 스크린샷은 gh-image로 PR 코멘트.
argument-hint: '[ticket] [app] [pr-number]'
---

# /cb:playwright-qa-smoke

**스킬:** `skills/playwright-qa-smoke/SKILL.md`

## Steps

1. **Phase 0** — `pages/` · `middleware.ts` · auth → path 화이트리스트 (runbook §2)
2. **Phase 1** — spec 작성/수정 · `pnpm test:e2e` · gitignore 스크린샷
3. **PR** — `gh-image` → 코멘트 · 본문 링크 (PNG 레포 커밋 X)
4. **Phase 2** — §4 수동 시나리오 · `/cb:e2e-deployed-check` · 사용자 로그인

## Related

- 설계 선행: `/cb:e2e-design`
- 로컬 기동: `/cb:local-dev-mkcert` → `/cb:local-dev-run-app`
- 배포 수동: `/cb:e2e-deployed-check`

## Example

```text
/cb:playwright-qa-smoke PROJ-100 ticket 7169
/cb:playwright-qa-smoke nav smoke order
```
