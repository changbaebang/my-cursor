# 캘린더 연동 (slack-work-kickoff)

## 요약

| 도구 | Calendar 지원 | Cursor에서 쓰기 |
|------|---------------|-----------------|
| **gws** (Google Workspace CLI) | ✅ | Shell로 실행 — **권장** |
| Slack MCP | ❌ | 메시지만 |
| Atlassian MCP | Jira due/댓글만 | 보조 |
| Google Calendar 전용 MCP | ✅ | 별도 MCP 설치 시 |

---

## 권장: Google Workspace CLI (`gws`)

공식에 가까운 오픈소스 CLI: [googleworkspace/cli](https://github.com/googleworkspace/cli)  
문서: [Quickstart](https://googleworkspace-cli.mintlify.app/quickstart) · [Calendar commands](https://googleworkspace-cli.mintlify.app/commands/calendar)

Drive, Gmail, **Calendar**, Sheets 등 Workspace API를 터미널에서 호출한다.  
(`gcloud`는 GCP 인프라용이고, **캘린더는 `gws`** 쪽이다.)

### 1) 설치

```bash
npm install -g @googleworkspace/cli
gws --version
```

또는: [Installation](https://googleworkspace-cli.mintlify.app/installation) (Homebrew, 바이너리 등)

### 2) 인증 (최초 1회)

```bash
gws auth setup    # gcloud CLI 필요 — Cloud 프로젝트·OAuth 자동
# 실패 시:
# ~/.config/gws/client_secret.json 수동 배치 후
gws auth login
```

**회사(무신사) 계정:** Workspace 관리자가 OAuth 앱 승인을 막아 둔 경우가 많다.  
그때는 개인 `gws auth setup` 대신 **사내 승인된 Desktop OAuth 클라이언트** JSON을 받아 `client_secret.json`에 넣고 `gws auth login`.

필요 scope 예: `https://www.googleapis.com/auth/calendar.readonly` (읽기만이면 readonly)

### 3) slack-work-kickoff에서 쓸 명령

**오늘 일정 (킥오프 follow-up)**

```bash
gws calendar +agenda --today --timezone Asia/Seoul --format table
```

**기간·검색 (담당자 이름/이메일)**

```bash
# 오늘 00:00 ~ 내일 00:00 (ISO는 당일 기준으로 치환)
gws calendar events list --params '{
  "calendarId": "primary",
  "timeMin": "2026-05-21T00:00:00+09:00",
  "timeMax": "2026-05-22T00:00:00+09:00",
  "q": "치훈",
  "singleEvents": true,
  "orderBy": "startTime"
}' --format table
```

**특정 참석자 free/busy (선택)**

```bash
gws calendar freebusy query --json '{
  "timeMin": "2026-05-21T12:00:00+09:00",
  "timeMax": "2026-05-21T18:00:00+09:00",
  "timeZone": "Asia/Seoul",
  "items": [{"id": "user@example.com"}]
}'
```

에이전트 규칙:

- `gws` 미설치·미인증 → “`gws auth login` 필요”만 안내, 일정 **추측 금지**
- JSON 파싱 후 업무 정의 §「기한·약속」에 반영

### 4) 스킬 트리거

사용자 문구 예:

- “캘린더 확인해줘”
- `/cb:slack-work-kickoff <permalink> --calendar`

---

## 대안 A — 수동 (설정 없음)

Google Calendar 웹/앱에서 초대 확인 → 채팅에 시각 한 줄.

---

## 대안 B — Google Calendar MCP

Cursor MCP에 Calendar 전용 서버 + OAuth.  
팀에서 이미 쓰는 MCP가 있으면 `gws` 대신 가능. 없으면 **`gws`가 더 단순** (MCP 서버 안 만들어도 됨).

---

## 대안 C — Jira만

`getJiraIssue` due date / comment에 일정이 있으면 보조로 사용.

---

## 이번 스레드 (치훈님)

- Slack: 오늘 **오후** 일정 + 캘린더 초대
- `gws auth login` 후: `gws calendar +agenda --today --timezone Asia/Seoul`
- 또는 `events list` + `q`에 회의 제목·`chihoon` 검색
