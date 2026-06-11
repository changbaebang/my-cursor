# auth 앱 — Browser smoke URL 함정

**SSOT:** `apps/auth/src/pages/` · gSSP · middleware

## 비로그인 smoke (H/F 노출)

| Path | URL | 조건 |
|------|-----|------|
| 로그인 | `https://local-dev.example.com:3000/login` | 비로그인 |
| 회원가입 | `https://local-dev.example.com:3000/join?force=true` | **비로그인** + `force=true` |

## 리다이렉트 함정

| 상태 | `/login` | `/join` |
|------|----------|---------|
| 로그인됨 | nqa `workspace.home` 307 | gSSP → 홈 리다이렉트 |
| 비로그인 | 200 로그인 UI | 기본 `/login` 리다이렉트 (`force=true` 없으면) |

**join smoke 전:** QA/nqa 세션 **로그아웃** 또는 시크릿 Browser Tab.

## CommonLayout (JoinPage)

```tsx
<CommonLayout hideMobileGlobalMenu hideMobileFooter>
```

- 데스크톱: GNB + Footer 노출
- 모바일: 글로벌 메뉴·모바일 Footer 숨김 (의도)

## 기동

```bash
pnpm -F auth dev:qa   # https://local-dev.example.com:3000
```
