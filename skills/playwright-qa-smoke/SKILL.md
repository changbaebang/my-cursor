---
name: playwright-qa-smoke
description: >-
  YourOrg frontend Playwright CI smoke + 수동 QA 분리 워크플로. 앱 라우트·middleware 확인 후
  비로그인 path만 spec 작성, 로그인은 runbook+Cursor 브라우저, 스크린샷은 gh-image로 PR 코멘트.
  "Playwright smoke", "E2E smoke", "nav smoke", "QA runbook", "스크린샷 PR", "gh-image",
  "비로그인 E2E", "로그인 수동 검증" 요청 시 사용.
disable-model-invocation: true
---

# Playwright QA Smoke (29CM platform)

**위치:** `~/.cursor/skills/playwright-qa-smoke/` (개인 · platform repo 커밋 X)

**관계:**

| 선행 | 병행 | 후행 |
|------|------|------|
| `e2e-test-design` (범위·P0·로그인 열) | `local-dev-run-app` | `e2e-deployed-browser-check` (§4 수동) |

Slash: **`/cb:playwright-qa-smoke`** · 상세: [reference.md](reference.md)

---

## 불변 원칙

1. **Phase 0** — 코드로 **접근 가능한 path**만 확정한 뒤 spec/runbook 작성
2. **Playwright** — **비로그인으로 열리는 path 화이트리스트만** (앱 전체 비로그인 아님)
3. **로그인·세션** — runbook §4 + Cursor 브라우저 + **사용자 로그인** + PR 코멘트 캡처
4. **스크린샷** — gitignore 로컬 저장 · **레포 PNG 커밋 금지** · PR은 `user-attachments`

---

## Phase 0 — Route discovery (MUST)

spec 한 줄 쓰기 **전에** 아래를 확인한다.

```text
apps/{app}/src/pages/     → pages/index.tsx 존재? (없으면 / smoke 금지)
apps/{app}/src/middleware.ts → matcher 제외 path = 비로그인 후보
getServerSideProps          → withRequiredAuth / withOptionalAuth
curl 또는 브라우저            → 200 + 기대 레이아웃 (404·auth redirect 기록)
```

**산출:** runbook §2 표에 `path` · `QA URL` · `로그인` · `제외 사유` 열.

| 신호 | 조치 |
|------|------|
| `pages/index` 없음 | `/` smoke **제외** (로그인 후 404만 나오는 패턴 흔함) |
| middleware matcher 포함 | 비로그인 아님 → Playwright 제외 → §4 수동 |
| catalog 등 matcher 제외 | 비로그인 화이트리스트 후보 |
| UI 변경 없음 smoke | **노출 assert** only (픽셀 diff X) |

---

## Phase 1 — Playwright (비로그인 only)

### spec

- 경로: `e2e/{app}/nav/tests/NN-*-smoke.spec.ts`
- 헬퍼: `e2e/_shared/nav-smoke.helpers.ts` (GNB·Footer·TabBar)
- 주석에 runbook SSOT path 링크

### 실행

```bash
pnpm -F {app} dev:qa          # 또는 dev:local
# 로컬 override 예:
{APP}_E2E_BASE_URL=https://local-dev.example.com:{port} \
pnpm test:e2e -- e2e/{app}/nav/tests/NN-*-smoke.spec.ts
```

- 첫 cold compile: dev 서버 warmup 또는 navigation timeout 여유
- GNB locator: `gnb-content-container` + 29CM fallback · **`.first()`** (strict mode)
- viewport 전용 시나리오: `test.skip` + runbook에 의도 명시

### 스크린샷 (로컬)

- `tests/e2e/screenshots/nav-migration-{ticket}/` (**gitignore**)
- 파일명: `{nn}-{scenario}--{project}.png`

### PR

1. `gh extension install drogers0/gh-image` (최초 1회)
2. 각 PNG → `gh image <file> --repo your-org/frontend-monorepo`
3. **PR 코멘트** 1개에 A1~An 정리 (레포 blob / `raw.githubusercontent.com` **금지** — private 404)
4. PR 본문 Test plan → 코멘트 링크만

---

## Phase 2 — Manual (로그인·세션)

Playwright에 넣지 않는다.

1. `docs/workstreams/.../*-qa-runbook.md` **§4** (M1~Mn) 시나리오 작성
2. 선행: QA 계정 · `{catalogId}` · `{orderNo}` 등 표에 명시
3. `/cb:e2e-deployed-check` 또는 Cursor Browser — **사용자가 로그인**
4. 체크리스트 PASS/FAIL + 캡처 → **동일 PR 코멘트**에 누적 (`gh-image`)

---

## 산출물 체크리스트

```text
- [ ] Phase 0: path 화이트리스트·제외 사유 (runbook §2)
- [ ] spec PASS (비로그인 path만)
- [ ] type-check (해당 app)
- [ ] PR 코멘트 스크린샷 (user-attachments)
- [ ] §4 수동: 로그인 후 spot-check (별도 티켓/게이트 가능)
```

---

## Anti-patterns

| 금지 | 이유 |
|------|------|
| `/` 루트 smoke (index 없는 서브도메인 앱) | 404·auth만 검증됨 |
| 스크린샷 레포 커밋 | diff 노이즈 · private URL 깨짐 |
| Playwright에 로그인·storage state | CI 불안정 |
| `raw.githubusercontent.com` PR 이미지 | private repo 404 |

---

## Examples

**nav-migration Ph4 (ticket Header):**

- Playwright: `/catalog/{id}` only (middleware 제외)
- 제외: `/` (index 없음)
- 수동 §4: `/ticket-order/detail/{orderNo}`, `/seat`, `/zone` …

상세·명령 모음: [reference.md](reference.md)
