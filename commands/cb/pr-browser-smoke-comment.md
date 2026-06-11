---
command: '/cb:pr-browser-smoke-comment'
category: 'QA'
purpose: 'Cursor Browser 로컬 smoke → gh-image → PR 코멘트'
description: >-
  ntest 로컬에서 Header/Footer 등 화면 확인 후 스크린샷을 gh-image로 올리고
  PR에 PASS/FAIL 표·캡처 댓글을 남긴다. 레포 PNG 커밋 금지.
argument-hint: '[pr-number] [app] [env] [paths...]'
---

# /cb:pr-browser-smoke-comment

**스킬:** `skills/pr-browser-smoke-comment/SKILL.md`

## Steps

1. `local-dev-run-app` / `dev:qa` 기동 확인
2. Browser Tab — path 순회 · snapshot · screenshot
3. `gh image` → user-attachments URL
4. `gh pr comment` — 표 + 이미지 1개

## Related

- Browser 준비: `playwright-qa-smoke/cursor-browser-prep.md`
- Playwright CI: `/cb:playwright-qa-smoke`
- auth URL 함정: `pr-browser-smoke-comment/auth-routes.md`

## Example

```text
/cb:pr-browser-smoke-comment 7191 auth dev:qa /login /join?force=true
```
