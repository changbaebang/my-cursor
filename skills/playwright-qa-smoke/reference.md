# Playwright QA Smoke — reference

## Skill chain

```text
e2e-test-design (플랜·P0·Login 열)
    ↓
playwright-qa-smoke (Phase 0~1 spec + PR 스크린샷)
    ↓
e2e-deployed-browser-check (Phase 2 §4 수동·nqa)
```

## Phase 0 grep cheatsheet

```bash
# pages
ls apps/{app}/src/pages/

# middleware
rg "matcher|redirectToLogin" apps/{app}/src/middleware.ts

# auth wrappers
rg "withRequiredAuth|withOptionalAuth" apps/{app}/src/pages
```

## runbook §2 template

```markdown
### 자동 검증 항목

> **`/` 제외:** … (사유 한 줄)

| # | 시나리오 | URL | viewport |
|---|---|---|---|
| A1 | … | `https://qa-{app}.example.com/...` | desktop + mobile |
```

## spec header template

```typescript
/**
 * {app} Ph4 nav smoke ({TICKET})
 *
 * QA:  pnpm test:e2e -- e2e/{app}/nav/tests/NN-*.spec.ts
 * Local: {APP}_E2E_BASE_URL=https://local-dev.example.com:{port} pnpm test:e2e -- ...
 *
 * SSOT: docs/workstreams/.../*-qa-runbook.md (§2 auto, §4 manual)
 */
```

## gh-image PR workflow

```bash
gh extension install drogers0/gh-image

for f in tests/e2e/screenshots/nav-migration-{id}/*.png; do
  gh image "$f" --repo your-org/frontend-monorepo
done

gh pr comment {PR} --body-file /tmp/screenshots.md
gh api repos/your-org/frontend-monorepo/issues/comments/{id} -X PATCH -f body="$(cat ...)"
```

PR 본문에는 코멘트 URL만 링크. 중복 코멘트는 “통합됨” 안내로 정리.

## GNB helper (strict mode)

```typescript
export async function waitForGnb(page: Page) {
  const header = page
    .getByTestId('gnb-content-container')
    .or(page.getByRole('link', { name: '29CM' }).first())
    .first();
  await expect(header).toBeVisible({ timeout: 30_000 });
}
```

## Env vars (convention)

| App | Base override | Default QA |
|-----|---------------|------------|
| ticket | `TICKET_E2E_BASE_URL` | `https://qa-ticket.example.com` |
| (기타) | `{APP}_E2E_BASE_URL` | runbook §3 |

카탈로그 ID 등: `TICKET_CATALOG_ID`, runbook에 기본값·교체 조건 기록.

## Ticket `/` 제외 (교훈)

- `apps/ticket/src/pages/index.tsx` 없음
- `middleware.ts` matcher에 `/` 포함 → 비로그인 시 auth redirect
- 로그인 후 `NotFoundPage` + `CommonLayout` → GNB는 보이나 **진입 페이지 smoke 아님**

적용 파일:

- `e2e/ticket/nav/tests/03-ticket-ph4-nav-smoke.spec.ts`
- `e2e/legacy-nav/tests/02-legacy-nav-smoke.spec.ts` (`ticket/catalog`)
- `e2e/home/nav/tests/01-modern-nav-smoke.spec.ts` (ticket Footer)

## Phase 2 — 1298 runbook (수동 SSOT)

`docs/workstreams/header-footer-cleanup/ph4-ticket-qa-runbook.md`

| ID | 로그인 | 우선 | 비고 |
|----|--------|------|------|
| M7 | O* | 먼저 | `/catalog/{id}/qna`, `/review` — GNB 없음. *middleware는 PDP만 비로그인; subpath는 로그인 필요 |
| M1 | O | 높음 | `/ticket-order/detail/{orderNo}` — TabBar 유무 |
| M3 | O | 높음 | `/seat` — §4.5 퍼널 |
| M4 | O | 중 | `/zone` — zone 회차만 |
| M5 | 권장 | 중 | catalog 모바일 상단 배너 diff |
| M2 | Webview | 낮음 | `/mobile-ticket/list` — SKIP 가능 |
| M6 | Webview | 낮음 | 앱 GNB 미노출 — SKIP 가능 |

TabBar 판정: `nav.fixed.bottom-0` 내 `마이페이지` 링크 count = 0 → TabBar 없음.

## Cursor Browser 수동 QA (Playwright 아님)

**SSOT:** [cursor-browser-prep.md](cursor-browser-prep.md) — 사용자 Cursor 설정 · 로그인 핸드오프 · PR `gh-image` 댓글.

Phase 2 시작 전 에이전트는 prep 문서 §1을 요약해 전달하고, §2대로 qa-auth 로그인 URL을 연다.

### Browser MCP 절차 (로그인 완료 후)

```text
browser_navigate → browser_lock → browser_resize(390×844, mobile) → browser_snapshot
→ 관찰(GNB·TabBar) → browser_take_screenshot → browser_unlock
```

- **M2·M6 Webview:** CDP `Emulation.setUserAgentOverride` + `APP_BRAND(os=android;buildNumber=1000)` — [cursor-browser-prep.md §5](cursor-browser-prep.md#5-앱-webview-ua-m2m6)
- 퍼널(`/seat`, `/zone`): runbook §4.5 — 직링크 금지, PDP→session→CTA 클릭
- `browser_snapshot` ref 없음(metadata만) → 스크린샷 + 사용자 육안 또는 Playwright MCP 우회
- iframe·결제창 내부 조작 불가

### ticket orderNo URL

```text
https://qa-ticket.example.com/ticket-order/detail/{orderNo}
로컬: https://local-dev.example.com:3008/ticket-order/detail/{orderNo}
```

M1 viewport: Mobile **390×844**. TabBar: `nav.fixed.bottom-0` + `마이페이지` 링크 0개 = TabBar 없음.

### 로그인 확인 신호

| 신호 | logged-in |
|------|-----------|
| ticket URL auth redirect 없음 | OK |
| GNB `LOGIN` 없음 / 개인화 메뉴 | OK |
| 예매상세 본인 주문 노출 | OK (orderNo 유효) |

## 수동 결과 템플릿 (Jira 1382 · PR)

```markdown
## Manual QA (1298) — {환경: ntest:3008 | qa-ticket}

| ID | Result | 비고 |
|----|--------|------|
| M7 | PASS / FAIL | |
| M1 | PASS / FAIL / BLOCKED( orderNo ) | |
...
```
