---
name: e2e-local-page-check
description: |
  Runs single-page local E2E on certificate-based ntest hosts in YourOrg frontend.
  Use BEFORE deploy / for branch code only — one app, one page at a time.
  After deploy and for SC-* flows use e2e-deployed-browser-check instead.
  Invoke via /cb:e2e-local-page only (not ambient skill).
disable-model-invocation: true
---

# E2E Local Single Page Check

Slash: **`/cb:e2e-local-page`**

## 환경 선택 (먼저)

| 상황 | 스킬 |
|------|------|
| 배포 전 · checkout 브랜치 코드·UI 회귀 | **이 스킬** (로컬 ntest, 페이지 1개씩) |
| 배포 완료 · SC-* 통합·로그인 경로 | `e2e-deployed-browser-check` (`/cb:e2e-deployed-check`) |
| 로컬 목록 0건·샘플 ID 없음 | nqa/ndev에서 샘플 확보 후 로컬 재시도 |
| 로그인·2FA·캡차 | 사용자 수동 → 그다음 Browser MCP 클릭 루프 |

로컬 PASS ≠ 배포 QA PASS. 한 루프에 섞지 않는다.

## Goal

로컬에서는 앱을 하나만 띄우고, 페이지 하나씩 확인한다. **각 페이지 테스트 전에 로그인 상태를 확인**한다.

## Preconditions

- `frontend-monorepo` — 검증 브랜치 checkout (예: 에픽 브랜치)
- 인증서: `/cb:local-dev-mkcert` (`_certs/ntest.pem`, `ntest-key.pem`)
- hosts: `127.0.0.1 local-dev.example.com`
- E2E 플랜: `~/.cursor/docs/qa/<TICKET>-e2e-plan-v1.md` — `Login` 열·SH-*/CT-*

## Execution steps

### 1) Keep one app only

- **기존 dev 서버 전부 종료** (3000~3008 등)
- `/cb:local-dev-run-app <app> qa` 로만 기동
- 포트 리스닝 확인

### 2) Establish login (플랜이 Login Y일 때)

1. `https://qa.example.com/my-page` 에서 로그인 (Cursor 브라우저 권장)
2. **로그인 확인** (아래 체크리스트) — `verified: logged-in` 기록
3. `https://local-dev.example.com:{port}{basePath}/...` 검증 페이지 진입
4. 검증 페이지에서 **다시 로그인 확인** (쿠키 미공유 시 `LOGIN` 노출 → 재로그인)

쿠키가 ntest에 안 넘어가면: 해당 앱 로그인 URL 또는 nqa 동일 계정 재시도.

### 3) Login verification (매 페이지 · 필수)

플랜 `Login` 값에 맞게 **테스트 시작 전** 상태를 기록한다.

| 플랜 Login | 확인 방법 | 기대 |
|------------|-----------|------|
| **Y** | GNB에 `LOGOUT` / `MY PAGE`, `LOGIN` 없음 | logged-in |
| **Y** | ♥ 탭 전 API가 401 아님 (Network) | logged-in |
| **N** | `LOGIN` 노출, ♥ 비로그인 동작만 | guest OK |
| **Y+guest** | ① guest로 ♥ → 로그인 유도 ② 로그인 후 ♥ 토글 | 둘 다 PASS |

**UI 신호 (29CM 웹):**

- 로그인: `LOGOUT`, `MY PAGE`, 장바구니 등 개인화 GNB
- 비로그인: `LOGIN` 링크, ♥ 탭 시 로그인 페이지/모달

**코드와 불일치 시:** 플랜 `Login` 열을 수정하거나 FAIL + 이슈 기록.

### 4) Open exactly one page

- `https://local-dev.example.com:{port}{basePath}/...`
- 한 페이지씩만
- 플랜 `device`/`query` 열 확인 — **컨시어지 list** 등은 데스크톱 UA면 post로 redirect 됨 → APP_BRAND 모바일 UA 또는 Playwright 모바일 디바이스 (`e2e-test-design` §2.5)
- 플랜 `data_env` — qa에서 목록 0건이면 stg/prd(nqa)에서 sample ID·목록 존재 확인 후 동일 클릭 시나리오 재시도

### 5) UI interaction — E2E 클릭 (필수)

**페이지 존재·로그인만으로 PASS 하지 않는다.** 플랜 `Checks`에 적힌 **클릭 시나리오를 실제로 수행**한다.

#### Cursor 브라우저 절차

1. `browser_navigate` → 대상 URL (로컬 `ntest:{port}`)
2. `browser_snapshot` — ♥ 버튼·상품 카드 ref 확인
3. 가려진 요소면 `browser_scroll` (`scrollIntoView: true`) 후 클릭
4. `browser_click` — **한 액션씩** (연타 금지, mutation 완료 대기)
5. `browser_network_requests` — Heart API status 확인
6. 필요 시 `browser_snapshot` — UI on/off 변경 확인
7. **재진입(`browser_navigate` 동일 URL)** — mutation 없이 GET만으로 on/off 유지 확인 (API 200만으로 PASS 금지)
8. 상품 카드 ♥는 `browser_scroll`(`scrollIntoView: true`) 후 클릭 — 하단 GNB가 가리면 intercept

#### Heart QA 클릭 체크리스트 (페이지별)

| 대상 | 액션 | 기대 UI | 기대 Network |
|------|------|---------|--------------|
| 브랜드 ♥ | off → on → **reload** → off | filled/outline 유지·해제 | `qa-api.example.com …/brands/{id}/set\|unset` 200 · reload 시 GET만 |
| 상품 ♥ | off → on → **reload** → off | 카드 ♥ 수·아이콘 동기화 | `qa-api.example.com …/products/{itemNo}/set\|unset` 200 |
| 포스트 ♥ | 플로팅 ♥ 클릭 | on/off | post heart mutation 200 |

- **401** → Login FAIL, 클릭 결과 무효
- **5xx / mutation throw** → FAIL + 응답 body·스냅샷
- 상품 0건이면: 브랜드 ♥만 수행, 플랜에 `product ♥ N/A (no items)` 기록

#### 클릭별 기록 (Interaction log)

```markdown
| Step | Action | UI after | API | Result |
|------|--------|----------|-----|--------|
| 1 | brand ♥ on | active | POST/PUT 200 | PASS |
| 2 | brand ♥ off | inactive | DELETE 200 | PASS |
| 3 | reload | state kept | GET 200 | PASS |
```

### 6) Verify page checkpoints (요약)

- 진입/렌더링
- Login verified
- **위 Interaction log 전 step PASS**
- 새로고침 후 ♥ 상태 유지

### 7) Record and move

```markdown
### SH-1 /store/brand/36027
- Env: local qa (shop)
- Login (plan): Y
- Login (verified): logged-in | guest | FAIL (401 on heart API)
- Result: PASS | FAIL
- Interactions: brand ♥ on/off/reload PASS; product ♥ N/A (0 items)
```

다음 페이지는 기록 후 시작.

## Output template

```markdown
### Local page check - /store/best-items
- Env: local qa (shop only)
- Login (plan): Y
- Login (verified): logged-in
- Result: PASS
- Interactions:
  - [x] login GNB
  - [x] product ♥ click off → on → off
  - [x] network 200, reload 유지
```

## App ports (reference)

| app | port | basePath |
|-----|------|----------|
| shop | 3002 | `/store` |
| content | 3004 | `/content` |
| auth | 3000 | — |

## Guardrails

- 로컬 앱 1개만. Login Y인데 guest면 ♥ 테스트하지 말고 로그인부터 해결.
- cert 오류 → `/cb:local-dev-mkcert` 후 재기동.
- Cursor ntest `ERR_CONNECTION_REFUSED` → Chrome/Safari, 로그인은 nqa.
- **클릭 없이 PASS 금지** — Cursor 브라우저로 직접 클릭·Network 확인.
- **reload/재진입 없이 PASS 금지** (Heart 회귀) — 토글 후 UI·GET 상태 일치까지.
- **coupon-collection** 샘플: qa `id=1`은 often 404 → Slack·ndev URL에서 ID 확보 (예: `100001528`).
- 코드 수정 없이 검증·기록만.

## Related

- 발행 글 (환경 판단·익명 발췌): https://changbaebang.github.io/2026-05-26-e2e-local-vs-deployed-browser-mcp/
- 배포 후 시나리오: `skills/e2e-deployed-browser-check/SKILL.md`
