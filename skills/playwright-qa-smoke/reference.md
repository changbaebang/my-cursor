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
