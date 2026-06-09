---
command: '/cb:e2e-local-page'
category: 'QA'
purpose: '인증서 기반 로컬 단일 페이지 E2E 검증'
description: >-
  local cert(ntest)에서 앱 1개만 띄워 페이지 하나를 검증하고 PASS/FAIL을 기록한다.
  다중 페이지 동시 검증은 하지 않는다.
argument-hint: '<app> <env> <page-url-or-route>'
---

# /cb:e2e-local-page

**스킬:** `skills/e2e-local-page-check/SKILL.md`  
**배포 후 SC-\*:** `/cb:e2e-deployed-check` — 환경 판단: [blog](https://changbaebang.github.io/2026-05-26-e2e-local-vs-deployed-browser-mcp/)

## Steps

1. cert/hosts 사전조건 확인 (`/cb:local-dev-mkcert`)
2. 기존 인스턴스 정리 후 대상 앱 1개만 기동 (`/cb:local-dev-run-app`)
3. 로그인 확인 (nqa my-page → ntest, GNB `LOGOUT`)
4. 지정 페이지 1개 진입
5. **E2E 클릭** — snapshot → scroll → click(♥ 등) → network 200 → reload 유지
6. Interaction log + PASS/FAIL 기록
7. 다음 페이지는 이전 기록 완료 후 진행

## Example

```text
/cb:e2e-local-page shop qa /store/best-items
/cb:e2e-local-page shop qa https://local-dev.example.com:3002/store/brand/36027
```
