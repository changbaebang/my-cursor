# Cursor Browser 수동 QA — 사용자 준비 (Playwright 아님)

**위치:** `~/.cursor/skills/playwright-qa-smoke/cursor-browser-prep.md` (개인 · platform repo 커밋 X)

runbook §4(M1~M7)처럼 **로그인·세션이 필요한 수동 검증**은 Playwright가 아니라 **Cursor 내장 Browser Tab**으로 한다.  
에이전트가 이어가려면 **사용자가 아래 설정·로그인을 먼저** 해 두어야 한다.

---

## Playwright vs Cursor Browser

| | Playwright (`pnpm test:e2e`) | Cursor Browser (수동 §4) |
|---|---|---|
| 담당 | CI·비로그인 smoke (runbook §2) | 로그인·퍼널·TabBar spot-check (§4) |
| 사용자 설정 | 불필요 (터미널만) | **Browser Tab 설정 필수** |
| 로그인 | 넣지 않음 | **사용자가 Browser Tab에서 직접** |
| 산출물 | spec PASS + PR `gh-image` (A1~A4) | M1~M7 PASS/FAIL + **PR 댓글 `gh-image`** |

---

## 1) 사용자가 Cursor에서 할 설정 (최초 1회 + 세션마다)

### 1-1. Cursor IDE 설정 (최초 1회)

1. **Settings** (`Cmd+Shift+J`) → **Tools & MCP**
2. **Browser Automation** → **Browser Tab** 선택  
   - ❌ Chrome 연결 모드 — 에이전트 도구와 어긋날 수 있음  
   - ✅ **Connected to Browser Tab** 문구 확인
3. (로컬 ntest 쓸 때) **Show Localhost Links in Browser** ON

> 이 설정은 **~/.cursor / Cursor 앱** 쪽이다. platform repo 커밋과 무관.

### 1-2. Browser Tab 열기 (세션마다)

1. Command Palette (`Cmd+Shift+P`) → **Open Browser Tab**
2. 에디터에 **Browser Tab** 패널(지구본 + URL 입력창)이 보이면 OK  
   - 비어 있어도 됨. 에이전트가 `browser_navigate`로 URL을 열 수 있음  
   - 다만 탭을 미리 열어 두면 연결이 안정적

### 1-3. 네트워크·환경 (세션마다)

| 환경 | 사용자 준비 |
|------|-------------|
| **QA** `qa-ticket.example.com` | **VPN** 연결 |
| **로컬** `local-dev.example.com:3008` | `pnpm -F ticket dev:qa` + mkcert(또는 `dev:local`) |

한 번의 수동 세션에서 **QA와 로컬 URL을 섞지 않는다.**

### 1-4. 테스트 데이터 (해당 runbook §3.4)

- `{catalogId}` — 예: `2257235`
- `{orderNo}` — 본인 예매 건, URL 마지막 세그먼트  
  - 예: `https://qa-ticket.example.com/ticket-order/detail/T26051917555241-12168`  
  - → `orderNo` = `T26051917555241-12168`
- zone 회차 상품 — M4·퍼널용 (없으면 M4 SKIP)

---

## 2) 로그인 핸드오프 (에이전트 ↔ 사용자)

비밀번호·OTP는 **에이전트에 주지 않는다.** 아래 순서만 따른다.

```text
[에이전트] ① 사용자 준비 체크리스트 안내 (이 문서 §1)
[에이전트] ② Browser Tab에 qa-auth 로그인 URL 열기
            → https://qa-auth.example.com/login
[사용자]  ③ Browser Tab에서 직접 로그인 + 2FA/본인인증
[사용자]  ④ 채팅에 「로그인 완료」+ 환경·catalogId·orderNo 전송
[에이전트] ⑤ ticket URL로 이동·viewport·관찰 — runbook §4 M7→M1→…
[에이전트] ⑥ 스크린샷 → gh-image → PR 댓글에 M별 캡처·PASS/FAIL 표
```

### 사용자 재개 신호 (복붙)

```text
로그인 완료
환경: qa-ticket
catalogId: 2257235
orderNo: T26051917555241-12168
PR: 7169
runbook §4 M7부터 진행해줘
```

### 에이전트 규칙

- §1·로그인 완료 신호 **없이** `browser_navigate`로 검증 URL 들어가지 않음
- 로그인 페이지는 **열어 줄 수 있음** (사용자 입력 대기)
- 로그인 확인: ticket URL auth redirect 없음 · 예매상세 본인 주문 노출

---

## 3) PR 댓글 보고 (리뷰어용)

수동 QA 캡처는 **PR 댓글 1개(또는 스레드)**에 누적한다. 레포 PNG 커밋 금지.

```bash
gh extension install drogers0/gh-image   # 최초 1회

gh image /path/to/m7-qna-mobile.png --repo your-org/frontend-monorepo
# → user-attachments URL 복사

gh pr comment 7169 --body "$(cat <<'EOF'
## Manual QA (1298) — qa-ticket

| ID | Result | 캡처 |
|----|--------|------|
| M7 qna | PASS | ![m7-qna](user-attachments URL) |
| M1 | PASS | ![m1](...) |

환경: qa-ticket · catalogId 2257235 · orderNo T26051917555241-12168
EOF
)"
```

- Playwright A1~A4와 **같은 PR**에 올리면 리뷰어가 자동·수동을 한곳에서 확인
- `raw.githubusercontent.com` 이미지 링크 금지 (private 404)

---

## 4) 에이전트 Browser MCP 절차 (로그인 완료 후)

```text
browser_navigate(url) → browser_lock → browser_resize(390×844) → browser_snapshot
→ 관찰 → browser_take_screenshot → browser_unlock
```

- M1·M3·M4: Mobile 390×844
- TabBar 없음: `nav.fixed.bottom-0` 내 `마이페이지` 0개
- 퍼널 `/seat`·`/zone`: runbook §4.5 — 직링크 금지

---

## 5) 앱 Webview UA (M2·M6)

브라우저 UA에 `APP_BRAND(...)` 토큰이 있으면 `isWebview()`가 true → 앱 Webview와 동일 분기.

**Android 예시 (권장):**

```text
Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro Build/400) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.120 Mobile Safari/537.36 APP_BRAND(os=android;buildNumber=1000);
```

| runbook | UA 적용 효과 |
|---------|----------------|
| **M6** GNB 미노출 | `GlobalNavigationBarModule`의 `<Webview>`가 fallback(GNB) 미렌더 — **UA만으로 충분** |
| **M2** `/mobile-ticket/list` | `AppOnly` 본문 + Webview 레이아웃 spot-check |
| M3·M4·M5 | 일반 모바일 UA 유지 권장 (GNB·타이틀 검증 필요) |

### Browser MCP — CDP로 UA 설정

**페이지 이동 전** 또는 **lock 직후** 1회:

```json
{
  "method": "Emulation.setUserAgentOverride",
  "params": {
    "userAgent": "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro Build/400) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.120 Mobile Safari/537.36 APP_BRAND(os=android;buildNumber=1000);",
    "platform": "Android",
    "mobile": true
  }
}
```

이후 `Emulation.setDeviceMetricsOverride` (390×844) → navigate.

### CSS `webview:` variant (선택)

`data-example-env=webview`는 Tailwind `webview:hidden` 등에 쓰인다.  
`buildNumber≥700` Android는 `WebviewPolyfill`이 body 속성을 **주입하지 않음**(네이티브 위임). Browser Tab에서는 아래로 보완 가능:

```json
{
  "method": "Runtime.evaluate",
  "params": {
    "expression": "document.body.setAttribute('data-example-env', 'webview')"
  }
}
```

M6 GNB 숨김은 JS `useIsWebview()`라 UA만으로 PASS 가능. AppInstall 배너·safe-area 등 CSS 분기까지 맞추려면 body 속성도 설정.

### UA 전환 타이밍

| 시나리오 | UA |
|----------|-----|
| M1·M3·M4·M5·M7·퍼널 | 기본 Chrome Mobile (APP_BRAND **없음**) |
| M2·M6 | 위 APP_BRAND Android UA |
