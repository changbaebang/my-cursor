---
command: '/cb:e2e-deployed-check'
category: 'QA'
purpose: '배포 환경(nqa/ndev) Cursor 브라우저 E2E 검증'
description: >-
  배포 완료 후 nqa/ndev에서 Cursor 브라우저로 시나리오를 검증한다.
  로그인/2FA는 사용자 수동 개입을 요청할 수 있다.
argument-hint: '<env:nqa|ndev> [ticket-or-pr]'
---

# /cb:e2e-deployed-check

**스킬:** `skills/e2e-deployed-browser-check/SKILL.md`  
**배포 전·단일 페이지:** `/cb:e2e-local-page` — 환경 판단: [blog](https://changbaebang.github.io/2026-05-26-e2e-local-vs-deployed-browser-mcp/)

## Steps

1. 배포 완료(SHA/브랜치/환경) 확인
2. 로그인 확인 후 시나리오 URL 순차 실행
3. **E2E 클릭** — snapshot → click → network → reload (Interaction log)
4. 로그인/2FA는 사용자 수동 개입
5. PASS/FAIL/Blocker 기록
5. Jira/PR 코멘트용 결과 요약 출력

## Example

```text
/cb:e2e-deployed-check nqa PROJ-200
/cb:e2e-deployed-check ndev https://github.com/your-org/frontend-monorepo/pull/6942
```
