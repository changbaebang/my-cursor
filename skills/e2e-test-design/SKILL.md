---
name: e2e-test-design
description: |
  Designs page-based E2E test plans for YourOrg frontend by mapping source/target routes, environment
  (local cert, ndev, nqa), and skip criteria. Use when the user asks to structure E2E scope, split
  local single-page checks vs deployed-environment checks, or create QA/Jira checklists before test execution.
disable-model-invocation: true
---

# E2E Test Design (page map first)

## Goal

E2E를 바로 실행하지 말고 먼저 다음을 고정한다.

1. 어떤 페이지를 검증할지 (PR diff → `pages/` 라우트)
2. **실사용 여부** (코드 + 슬랙/Jira — 애매한 항목만)
3. 각 페이지 source/target·로그인·환경
4. 스킵(S*) / P0·P1·시나리오(SC-*)

## Input sources (먼저 읽기)

1. **PR diff** — `gh pr view <num> --json files` 또는 GitHub Files changed
2. **Jira Description/AC** — 티켓에 이미 있는 P0/P1/스킵
3. **코드 grep** — 변경 hook이 실제 어떤 `pages/`·컴포넌트에 연결되는지 확인
4. (예시 라우트는 팀 내부 문서 참고)

**산출물 저장:** `~/.cursor/docs/qa/<TICKET>-e2e-plan-v1.md` (platform repo 커밋 X)

**티켓 종료:** QA용 `~/.cursor/docs/qa/<TICKET>-qa-checklist.md` 작성 → Jira 코멘트·첨부 → `e2e-plan-v1.md` 등 티켓 전용 md 삭제 (e2e 스킬·`/cb:e2e-*`는 유지)

## Design workflow

### 1) Scope map (라우트 흐름)

페이지별로 아래를 채운다.

- `source`: 진입 링크/버튼/이전 페이지
- `page`: 실제 검증 대상 라우트
- `target`: 다음 페이지 또는 주요 액션 결과
- `owner`: shop/content/auth 등 앱 소유

### 2) Usage verification (코드 → 슬랙/Jira)

P0 **후보** 라우트마다 사용 여부를 판정한다. 전부 슬랙 검색할 필요는 없다.

| 신호 | 판정 | 조치 |
|------|------|------|
| hook import 0 · UI ♥ 없음 | 미사용 | S* 스킵 (코드 근거) |
| `useWebRedirect` 등 웹 dead path | 미사용 | S* + 슬랙/Jira 링크 |
| hook·UI 있음 · 진입 불명 | 확인 필요 | 슬랙·RUM·팀 스레드 또는 Jira 기존 합의 |
| Jira/Slack에 이미 스킵 합의 | 미사용 | 근거 링크만 인용, 재검색 생략 |
| hook·UI 있음 · 진입 명확 | 사용 | P0 유지 |

**슬랙 확인 시 기록:** 스레드 permalink, “진입 없음 / prod 미노출 / 앱 전용” 등 한 줄 요약.

**검색 힌트:** 라우트 경로, 기능명(온보딩, recommend-products), 관련 Jira(PROJ-200 등).

### 2.5) 코드 선행 점검 (실행 전 · 예측 가능한 제약)

P0 라우트마다 **페이지·훅·SSR**만 읽고 플랜 표에 아래 열을 채운다. (실행 중 깨달은 내용을 나중에 넣지 말 것.)

| 플랜 열 | 코드에서 읽는 것 | 예시 |
|--------|------------------|------|
| `device` | `useDeviceInfo`: `isMobile` / `isWebview` / UA | 컨시어지 list: `!isWebview && !isMobile` → PC null + redirect |
| `redirect` | `useEffect` + `router.push` / `location.href` | `CONCIERGE_REDIRECT_URL` → `env.workspace.legacy.post/14590` (content) |
| `query` | `router.query` / `useSearchParams` / SSR redirect | best-items: `category_large_code` 9자리 없으면 default redirect |
| `login_code` | `withAuth` / `withOptionalAuth`, `enabled: isLoggedIn`, ♥ 비로그인 분기 | best-items: 로그인 시 `userHeartList` 없으면 **상품 그리드 미렌더** |
| `data_env` | BFF·listing·QA 카탈로그 의존 (코드는 empty UI만 보장) | concierge list: `products.length === 0` → “선택한 필터의 검색 결과가 없습니다” |
| `env_escalation` | QA 데이터 부족 시 | `qa` 목록 0건 → **stg/prd** 또는 nqa preflight에서 상품 있는지 먼저 확인 |

**자주 나오는 패턴 (grep 키워드):**

```text
isWebview | isMobile | APP_BRAND | validateInAppWebview
CONCIERGE_REDIRECT | window.location.href
category_large_code | DEFAULT_CATEGORY
withOptionalAuth | withAuth | enabled: isLoggedIn
useUserHeartListQuery | useUserHeartProductIdListQuery
```

**컨시어지 list (`ConciergeProductsPage`) — 설계 시 고정:**

- PC(데스크톱 UA + viewport 넓음): list **렌더 안 함** → `legacy.post/14590` 이동. nqa preflight “redirect→post”는 **정상**.
- list E2E: **모바일 UA** (`mobi`) 또는 **앱 UA** (`APP_BRAND(...)` → `isWebview=true`). 예시:

  `Mozilla/5.0 (Linux; Android 14; ...) ... APP_BRAND(os=android;buildNumber=1000);`

- Cursor 데스크톱 브라우저만으로 list에 머무르려 해도, **첫 paint에서 `isMobile=false`면 redirect effect가 먼저** 날 수 있음 → UA 조정 또는 Playwright `devices['iPhone 13']` / 위 APP_BRAND UA.

**로그인·환경 (설계 시 구분):**

| 구분 | 의미 | 기록 |
|------|------|------|
| `Login (code)=Y` | ♥/개인화 API가 로그인 전제 | 코드 근거 |
| `Login verified` | 실행 시 GNB·401 확인 | nqa `/my-page` → ntest 쿠키 |
| `data_env=qa` | API·카탈로그가 qa 백엔드 | 로컬 `dev:qa` = `.env.qa` |
| `data_env=stg/prd` | qa에 상품·브랜드·컨시어지 목록 없음 | **escalation** — Heart API는 qa-api.example.com 유지, **목록/ID**만 상위 env에서 sample 확보 |

Heart 회귀는 **코드 경로**는 로컬 qa로 충분한 경우가 많고, **데이터 존재**만 qa→stg/prd(nqa/ns)로 올리는 경우를 플랜에 명시한다.

### 3) Deployed preflight (nqa / prod · 페이지 존재)

**로컬 cert 기동 전**, 배포 환경에서 라우트가 살아 있는지 확인한다. (Heart QA 아님 — 404·리다이렉트·샘플 ID 수집)

| 확인 | 방법 |
|------|------|
| HTTP 200 / 404 | `https://qa.example.com{basePath}{route}` (+ **필수 query** 있으면 코드·nqa에서 확인) |
| 리다이렉트 | 최종 URL 기록 (예: concierge → content post) |
| 샘플 ID | slug 404면 **숫자 brandId** 등 nqa에서 열리는 값을 플랜에 적기 · **coupon-collection**은 qa `id=1` 404 빈번 → Slack `coupon-collection/{id}` 검색 |
| ♥ UI 노출 | preflight는 **페이지 로드만** — 토글·network는 로컬/nqa SC에서 |

환경 URL:

- shop: `https://qa.example.com/store/...`
- content: `https://qa.example.com/content/...`
- 로그인: `https://qa.example.com/my-page`

플랜·Jira P0 표에 `nqa_sample_url` · `preflight` 열 추가.

### 4) Environment split (로컬 vs 배포)

- **로컬 단일 페이지 검증**: cert 기반 `local-dev.example.com:{port}` + 앱 1개만 기동
- **배포 환경 검증**: `ndev`/`nqa`에서 Cursor 브라우저로 플로우 확인
- Cursor 로컬 브라우저 제약으로 검증이 불가하면 **배포 요청 필요**로 분류

### 5) Login requirement (설계 시 · 코드)

P0 표에 `Login` 열: `Y` / `N` / `Y+guest`(로그인·비로그인 둘 다).

**코드에서 판단:**

- `withOptionalAuth` / `withAuth` — SSR·페이지 인증
- `useCurrentUser`, `userNo`, `enabled: !!user` — hook이 로그인 시만 동작
- 하트 mutation: 비로그인 시 로그인 유도(모달/redirect) 여부

**실행 시 확인은** `e2e-local-page-check` / `e2e-deployed-browser-check` — 테스트 **시작 전·후** GNB·♥ 동작으로 기록.

### 6) Other preconditions

- 데이터/계정 조건 (예: 찜 가능한 상품, nqa sample ID)
- feature flag / AB 조건

### 7) Checks (page 단위 · 클릭 시나리오 명시)

실행 스킬에서 **반드시 browser_click** 으로 수행할 항목을 문장으로 적는다.

예 (SH-1 brand):

1. `브랜드 좋아요` 클릭 off→on
2. (상품 있으면) 첫 상품 ♥ off→on
3. **재진입(reload)** 후 ♥ on 유지 확인 (GET만, set 재호출 없음)
4. off → **재진입** 후 off 유지
5. Network: `qa-api.example.com …/set|unset` 200

- preflight(페이지 존재) ≠ E2E PASS
- 클릭 없이 Checks를 비워두지 않는다

### 8) Skip and risk (S*)

2단계에서 **미사용**으로 판정된 항목. ID 부여 (`S1`, `S2`…).

- `skip_reason`
- 근거: `code` / `slack` / `jira` + 링크
- 대체 검증 페이지 (있으면)

### 9) Scenarios (SC-*)

단일 페이지만으로 부족하면 `SC-01` 형식으로 시나리오를 추가한다.

- `start` → `action` → `expected`
- **로컬**: 단일 페이지 또는 짧은 구간
- **nqa/ndev**: 전체 플로우 (배포 후)

예: `로그인 → /store/brand/{id} → 상단♥ → 상품♥ → 새로고침 유지`

## Output template

```markdown
## E2E Test Plan

| Page | Source | Target | Env | Login (code) | Login (verified) | Checks | Status |
|------|--------|--------|-----|--------------|------------------|--------|--------|
| /store/brand/[id] | 홈/직접 URL | 상품 반영 | local-qa | Y | TODO | 토글, 200 | TODO |

## Usage audit (점검)

| Route | Code | Slack/Jira | Verdict |
|-------|------|------------|---------|
| /store/onboarding | useWebRedirect | [Slack](…) | SKIP S2 |

## Skip (S*)
- S2 `/store/onboarding`: dead path (Slack, PROJ-200)

## Deploy-needed
- Cursor 로컬 한계로 ndev 배포 후 검증 필요: ...
```

## Rules

- **PR에 없는 페이지는 넣지 않는다** — diff·hook 연결 근거 필수.
- **애매한 P0만** 슬랙·Jira 확인 — import 0/UI 없음은 코드만으로 S* 처리.
- **Jira 스킵 합의**가 있으면 설계·실행 모두 제외 (근거 링크 유지).
- 여러 페이지를 동시에 실행하지 않는다. `한 페이지 완료 -> 기록 -> 다음 페이지`.
- 실행 단계는 별도 스킬·슬래시로 분리:
  - `/cb:e2e-local-page` → `e2e-local-page-check`
  - `/cb:e2e-deployed-check` → `e2e-deployed-browser-check`
- **로컬 기동 전** nqa preflight로 404·리다이렉트·sample ID 확정.
로컬: HTTPS dev host + 앱 1개만 기동.
