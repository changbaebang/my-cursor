---
name: pr-browser-smoke-comment
description: >-
  29CM platform 로컬 ntest에서 Cursor Browser Tab으로 Header/Footer smoke 확인 후
  gh-image 업로드·PR 코멘트 보고. "local smoke PR", "브라우저 확인 PR 댓글",
  "gh-image PR", "ntest smoke 캡처", "join login 확인 PR" 요청 시 사용.
disable-model-invocation: true
---

# PR Browser Smoke Comment (29CM platform)

**위치:** `~/.cursor/skills/pr-browser-smoke-comment/` (개인 · platform repo 커밋 X)

**관계:**

| 선행 | 병행 | 후행 |
|------|------|------|
| `local-dev-run-app` / `local-dev-mkcert` | `playwright-qa-smoke` Phase 2 | `pr-body-updater` (Test plan 체크) |

Slash: **`/cb:pr-browser-smoke-comment`** · 앱별 URL 함정: [auth-routes.md](auth-routes.md)

---

## 불변 원칙

1. **스크린샷** — gitignore 로컬 저장 · **레포 PNG 커밋 금지**
2. **PR 이미지** — `gh image` → `user-attachments` URL만 · `raw.githubusercontent.com` **금지**
3. **Browser Tab** — Playwright 대체 아님 · 로그인·세션·gSSP 리다이렉트는 **사용자/브라우저 세션**으로 해결
4. **한 PR 코멘트** — 화면별 표 + 캡처 1개(또는 기존 스레드에 추가)

---

## 워크플로우

### 0. 입력 확정

```text
PR 번호 · 앱 slug · 환경(dev:qa|dev:local) · 검증 path 목록
```

예: `7191 · auth · dev:qa · /login, /join?force=true`

### 1. 로컬 기동

```bash
pnpm -F {app} dev:qa    # 또는 dev:local (mkcert)
```

포트: 앱별 package.json — auth `:3000`, ticket `:3008` 등.

### 2. Browser Tab 준비

사용자 준비 SSOT: `playwright-qa-smoke/cursor-browser-prep.md` §1 요약 전달.

- Settings → Browser Automation → **Browser Tab**
- ntest: **Show Localhost Links in Browser** ON
- 로그인 필요 시: 사용자가 Browser Tab에서 직접 로그인 → 「로그인 완료」 신호

### 3. 화면별 검증

각 path마다:

```text
browser_navigate(ntest URL)
→ browser_snapshot (타이틀·GNB·본문·Footer DOM)
→ browser_take_screenshot({filename: "{nn}-{slug}.png"})
→ (Footer 확인) browser_scroll down → 추가 캡처
```

**관찰 체크 (H/F 마이그레이션):**

- Modern GNB: Special-Order, 카테고리, MY PAGE 등
- Desktop Footer: FAQ, 사업자 정보 (레이아웃이 hideFooter 아닐 때)
- Webview: 별도 UA 시나리오는 `playwright-qa-smoke` §4 참고

### 4. gh-image 업로드

```bash
gh extension install drogers0/gh-image   # 최초 1회

mkdir -p /tmp/pr-{number}-smoke
# 스크린샷을 /tmp/pr-{number}-smoke/ 에 모음

gh image /tmp/pr-{number}-smoke/01-login-gnb.png \
  --repo your-org/frontend-monorepo
# → user-attachments URL 복사 (stdout의 ![](...) 에서 추출)
```

### 5. PR 코멘트

```bash
gh pr comment {number} --repo your-org/frontend-monorepo --body "$(cat <<'EOF'
## local smoke 확인 (ntest · {app} QA)

`pnpm -F {app} dev:qa` → `https://local-dev.example.com:{port}`

| 화면 | URL | 결과 | 확인 포인트 |
|------|-----|------|-------------|
| 로그인 | `/login` | **PASS** | Modern GNB · … |

### `/login`

![01-login-gnb](user-attachments-URL)

> 참고: auth join 등 앱별 함정은 코멘트에 1줄 명시

Test plan smoke 항목 완료.
EOF
)"
```

### 6. (선택) PR 본문 Test plan

`pr-body-updater` 또는 수동으로 `- [x] ntest smoke` 반영.

---

## 파일명 규칙

```text
{nn}-{path-slug}-{area}.png
예: 01-login-gnb.png · 02-login-footer.png · 03-join-gnb.png
```

저장: `/tmp/pr-{number}-smoke/` 또는 `tests/e2e/screenshots/` (**gitignore**)

---

## Anti-patterns

| 금지 | 이유 |
|------|------|
| 스크린샷 브랜치 커밋 | diff 노이즈 · 잘못된 패턴 재발 |
| `raw.githubusercontent.com` | private 404 |
| 로그인 상태로 `/join` smoke | gSSP 홈 리다이렉트 |
| 비밀번호·OTP 에이전트 입력 | 보안 |

---

## Examples

**PROJ-100 auth Ph5 (#7191):**

```text
/cb:pr-browser-smoke-comment 7191 auth dev:qa /login /join?force=true
```

- 비로그인 `/login` · `/join?force=true`
- 코멘트: login GNB/Footer + join GNB/약관

상세 auth URL: [auth-routes.md](auth-routes.md)
