---
name: e2e-deployed-browser-check
description: |
  Scenario E2E on nqa/ndev after deploy is confirmed. Use for SC-* flows and login/integration paths.
  Do NOT run before deploy. For branch code and single-page checks use e2e-local-page-check.
  Invoke via /cb:e2e-deployed-check only (not ambient skill).
disable-model-invocation: true
---

# E2E Deployed Environment Check (nqa/ndev)

Slash: **`/cb:e2e-deployed-check`**

## 환경 선택 (먼저)

| 상황 | 스킬 |
|------|------|
| 배포 전 · 브랜치만 검증 | `e2e-local-page-check` (`/cb:e2e-local-page`) — **이 스킬 실행 금지** |
| 배포 완료 · SHA 기록됨 · SC-* | **이 스킬** (nqa/ndev, 시나리오 순차) |
| 로컬 ntest에서 Browser 연결 실패 | 정상 — 배포 URL에서 검증 |
| 로그인·2FA·캡차 | 사용자 수동 |

배포 QA PASS ≠ 로컬 브랜치 버그 없음. 순서: 로컬 회귀 → 배포 → 이 스킬.

## Goal

로컬 한계를 넘는 플로우는 배포 후 `nqa`/`ndev`에서 Cursor 브라우저로 검증한다.

## Preconditions

**Browser 시작 전:** `playwright-qa-smoke/cursor-browser-prep.md` — Cursor Browser Tab 설정·로그인 핸드오프·「로그인 완료」 대기 (Playwright 아님).

- **배포 완료** 확인 (브랜치/커밋/환경) — 배포 전 실행 금지
- 플랜의 **SC-*** 시나리오 목록 확정 (`docs/qa/<TICKET>-e2e-plan-v1.md`)
- 환경: **`nqa` 또는 `ndev`** (로컬 `ntest:3002` 아님)
- 로그인: `https://qa.example.com/my-page` 등 — 사용자 수동 개입

## Execution steps

### 1) Confirm deployment target

- 환경: `nqa` 또는 `ndev`
- 배포된 SHA/브랜치
- 테스트 시작 시각 기록

### 2) Open one scenario at a time

- 각 시나리오는 `start page -> action -> expected page/state` 단위로 수행
- 실패 시 동일 액션 반복보다 상태 증거(스냅샷/네트워크/콘솔) 수집 우선

### 3) Login takeover & verification

- 로그인/2FA/캡차 → 사용자 수동
- 완료 후 **로그인 확인** (필수):
  - `https://qa.example.com/my-page` — GNB `LOGOUT` / `MY PAGE`
  - 시나리오 **시작 URL**에서도 동일 확인 (`LOGIN` 없어야 함, 플랜 Login Y일 때)
- 기록: `Login (verified): logged-in | guest | FAIL`

플랜 `Y+guest`: 비로그인 ♥ → 로그인 유도 확인 후, 로그인하고 SC 재개.

### 4) UI interaction — E2E 클릭 (SC-* 필수)

로컬과 동일: **시나리오에 적힌 클릭을 Cursor 브라우저로 수행**한다.

1. 시나리오 URL 오픈 (`nqa`/`ndev`)
2. `browser_snapshot` → 클릭 대상 ref
3. `browser_click` (스크롤 필요 시 `scrollIntoView`)
4. `browser_network_requests` — Heart API 200/401
5. UI 상태 변경 확인 → 필요 시 **새로고침** 후 유지

시나리오 예 (SC-01): 상단 브랜드 ♥ on → off → 상품 ♥ on → reload → 상태 유지.

각 클릭 step을 Interaction log로 남긴다 (`e2e-local-page-check` 표 참고).

### 5) Validate checkpoints

- 진입 · Login verified · **Interaction log 전부 PASS** · 플로우 전이(redirect 등)

### 6) Report to ticket/PR

- 시나리오별 PASS/FAIL
- blocker 여부
- 스킵 항목 및 근거
- 후속 액션(보강 PR/추가 배포) 제시

## Output template

```markdown
## Deployed E2E result (nqa)
- Build/Commit: ...

| Scenario | Login verified | Result | Evidence |
|----------|----------------|--------|----------|
| SC-01 brand | logged-in | PASS | clicks: brand♥ on/off, product♥, reload OK |

### Blockers
- 없음

### Follow-up
- 필요 시 ndev 재검증
```

## Guardrails

- 배포 전에는 실행하지 않는다. 필요 시 **배포 요청** 먼저.
- Cursor 브라우저는 **nqa/ndev** 에서 사용 (로컬 ntest 연결 실패 흔함).
- 4회 이상 동일 실패 반복 금지 → blocker + Jira/PR 코멘트.
- destructive 액션은 사용자 승인 없이 진행하지 않는다.
- 온보딩→auth 등 플랜 스킵(`S*`) 항목은 실행하지 않는다.

## Related

- 발행 글 (환경 판단·익명 발췌): https://changbaebang.github.io/2026-05-26-e2e-local-vs-deployed-browser-mcp/
- 배포 전 단일 페이지: `skills/e2e-local-page-check/SKILL.md`
