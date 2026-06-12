# Runtime investigation — Browser Tab (PR 없이)

**위치:** `~/.cursor/skills/playwright-qa-smoke/investigation-runtime.md` (개인)

Ph5 follow-up·hydration·404 **조사** 전용. PR `gh-image` 코멘트는 [pr-browser-smoke-comment](../pr-browser-smoke-comment/SKILL.md) 또는 조사 완료 후.

---

## 우선순위

| 순위 | 도구 | 용도 |
|------|------|------|
| 1 | **Cursor Browser Tab** | 로그인 세션·dev overlay·rewrite 404·gSSP 리다이렉트 |
| 2 | Playwright | 비로그인 smoke **교차검증** (headless 안정) |

Browser Tab만 실패·PW pass → Jira에 **둘 다** 기록 (BT-only flake 가능).

---

## 사전 준비

1. [cursor-browser-prep.md](cursor-browser-prep.md) §1 — Browser Tab · Show Localhost Links ON
2. `/cb:local-dev-mkcert` (HTTPS `dev:qa` 시)
3. `/cb:local-dev-run-app <app> qa` — **앱당 서버 1개** (멀티앱 조사 시 순차 기동·종료)
4. 종료: `/cb:local-dev-stop`

### ntest 로그인 (로컬 포트)

| 앱 | LOGIN (예) | LOGOUT |
|----|------------|--------|
| inbox | `https://local-dev.example.com:3012` | `:3012/LOGOUT` |
| order | `:3003` (세션 공유) | 앱별 auth flow |
| auth | `:3000/login` | guest 직접 404 |

QA VPN·`qa-auth`는 배포환경 조사 시만. **한 세션에 ntest·qa-ticket URL 섞지 않음.**

---

## Hydration / 404 조사 매트릭스

에러 (dev overlay): `Suspense boundary received an update before it finished hydrating`

### smoke URL (헬퍼 SSOT)

`e2e/_shared/nav-smoke.helpers.ts` — `*404SmokeUrl`, rewrite `/2` 등.

| 앱 | port | direct 404 | rewrite 404 | 비고 |
|----|------|------------|-------------|------|
| auth | 3000 | `/__smoke-404-not-found__` | — | guest |
| order | 3003 | `/order/__smoke-404-not-found__` | `/2` | logged-in |
| ticket | 3008 | `/catalog/__smoke-404-not-found__` | — | guest OK 사례 |
| customer | 3011 | `/customer/__smoke-404-not-found__` | `/2` | rewrite 재현 흔함 |
| inbox | 3012 | `/inbox/__smoke-404-not-found__` | `/2` | 1417 fix 후 PW 5/5 |

### 관찰 체크

- [ ] Next dev **overlay** 유무 (문구 캡처)
- [ ] GNB·Footer·404 본문 DOM (snapshot)
- [ ] logged-in vs guest (별도 행)

---

## Jira 산출 (조사 티켓)

`addCommentToJiraIssue` — 표 형식:

```markdown
## 런타임 점검 (Browser Tab · dev:qa)

| 앱 | 시나리오 | URL | 세션 | overlay | 검증 |
|----|----------|-----|------|---------|------|
| customer | rewrite | :3011/2 | guest | ✅ | BT |
```

조사 완료 → [jira-ticket-lifecycle](../jira-ticket-lifecycle/SKILL.md) **워크플로 D** (구현 leaf 분리).

---

## 정적 gap (1417 패턴 대비)

조사 시 `_app` / `NextApp` / `_error` grep — 구현 leaf description에 복사.

1. `_app.getInitialProps`: `dehydratedState ?? dehydrate(createQueryClient())`
2. `NextApp`: `Hydrate` → children only
3. `_error`: dehydrate gIP · `withErrorPageBoundary` 제거 검토

참고 PR: inbox [#7219](https://github.com/your-org/frontend-monorepo/pull/7219)
