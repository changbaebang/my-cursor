---
name: slack-work-kickoff
description: >-
  Parses a Slack work-request permalink, searches threads and related Slack/Jira
  context to define the task, identifies the assignee, drafts or posts a polite
  work-start message, and on reply reads docs/Jira to prepare implementation.
  Use when the user shares a Slack link for an 업무 요청, follow-up after 답변,
  asks to find 담당자, define 일 from Slack, read docs and prepare work,
  request 일정/시작, or says "슬랙 업무", "work kickoff", "문서 읽고 준비".
disable-model-invocation: true
---

# Slack 업무 킥오프 (personal)

**위치:** `~/.cursor/skills/slack-work-kickoff/` · 슬래시: **`/cb:slack-work-kickoff <slack-permalink> [--channel <name>] [--post]`**

Slack 업무 요청 링크 하나로 **맥락 수집 → 업무 정의 → 담당자 식별 → (확인 후) 시작 요청 → (답변 후) 문서·Jira 읽고 작업 준비**까지 수행한다.

`intake`는 Jira **초안 작성**, `slack-pr-review`는 PR 리뷰. 이 스킬은 **킥오프·follow-up·구현 준비**를 한 흐름으로 묶는다.

## 사전 요건

| 도구 | 용도 |
|------|------|
| **Slack MCP** | `slack_read_thread`, `slack_read_channel`, `slack_search_*`, `slack_send_message` |
| **Atlassian MCP** (선택) | 스레드·검색에 Jira 키가 있으면 `getJiraIssue` |
| **`parse-slack-url.mjs`** | permalink → `channelId`, `messageTs` |

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/parse-slack-url.mjs" "<permalink>"
```

## 워크플로우

### 0. 입력 확인

- **필수:** Slack permalink (스레드 또는 채널 메시지)
- **선택:** `--channel` (게시 채널 이름, 기본은 앵커 메시지 채널)
- **선택:** `--post` — 사용자가 이미 “보내줘”라고 했을 때만 즉시 게시. 없으면 **초안만** 보여 주고 확인 후 게시.

인자가 없으면 permalink를 **한 번만** 요청한다.

### 1. 앵커 스레드 읽기

1. `parse-slack-url.mjs`로 `channel_id`, `message_ts` 추출
2. MCP `slack_read_thread` — 부모 + 전체 답글
3. 추출할 것: 요청자, 멘션된 사람, 약속·기한(목요일 일정 등), 작업명, Jira/Confluence/PR 링크, 채널명

### 2. Slack 전체 맥락 수집 (필수)

앵커만으로 끝내지 않는다. 아래를 **병렬**로 진행한다.

| 단계 | MCP / 방법 | 목적 |
|------|------------|------|
| A | `slack_search_public_and_private` — 스레드 핵심 키워드(작업명, Jira 키, Header/GNB 등) | 관련 스레드·채널 메시지 |
| B | `slack_search_public_and_private` — `from:<user_id>` + 키워드 | 담당자·요청자 발화 |
| C | `slack_read_channel` — 앵커 채널, 앵커 전후 시간대(가능하면) | 같은 채널 맥락 |
| D | `slack_search_users` — 스레드에 나온 이름·이메일 | `user_id` 확정 |
| E | `slack_search_channels` — 게시 대상 채널 | `channel_id` (예: `#29-team-frontend-스몰톡`) |

검색 쿼리 예: `PROJ-123`, `Header Footer GNB`, `Eng OKR`, `치훈 일정`.

**수집 중단 조건:** 동일 주제 스레드 2~3개 + Jira(있으면) + 담당자 후보가 명확해질 때. 모호하면 사용자에게 질문 1개만.

### 3. 외부 링크 (있을 때)

- **Jira** (`M29CM*`, `M29CMFEP-*` 등): Atlassian MCP `getJiraIssue` — cloudId `your-atlassian-cloud-id`. 제목·설명·담당자·상태·댓글. **비어 있으면** “티켓 본문 없음”을 업무 정의에 명시.
- **Confluence** (`user.com`): Atlassian MCP `getConfluencePage` — Jira description의 wiki 링크 전부 읽기.
- **Repo docs** (`docs/workstreams/…`, README): `Read` / `Glob` — Jira·Confluence에 나온 경로.
- **Figma / PR**: URL이 있으면 읽기만 (코드 리뷰는 `slack-pr-review`로 분기).

### 3.5 캘린더·일정 확인 (선택)

**Slack MCP에는 Calendar가 없다.** 우선 **`gws`(Google Workspace CLI)** 로 조회한다.

| 방법 | 연결 | 스킬에서 |
|------|------|----------|
| **B. gws CLI (권장)** | `npm i -g @googleworkspace/cli` → `gws auth login` | Shell: `gws calendar +agenda --today --timezone Asia/Seoul` 또는 `events list` + `q` |
| **A. 수동** | 웹 캘린더 확인 후 채팅에 시각 전달 | gws 미설치 시 |
| **C. Calendar MCP** | Cursor MCP + OAuth | 팀 표준이 있을 때만 |
| **D. Jira** | due / comment | 보조 |
| **E. Slack 답글** | “오늘 오후” 등 텍스트 | `slack_read_thread` |

`--calendar` 플래그 또는 “캘린더 확인해줘” → §3.5 실행.

상세: [calendar-setup.md](calendar-setup.md)

**규칙:** `gws` 실패·미인증이면 일정 **추측 금지**. “`gws auth login` 필요” 또는 수동 확인만 안내.

### 4. 업무 정의 (사용자에게 먼저 출력)

반드시 **한국어**로 아래 템플릿을 채운다. 게시 전 검토용이다.

```markdown
## 업무 정의 (Slack 킥오프)

### 한 줄 요약
[무엇을, 누가, 언제까지]

### 배경
- 앵커 링크: <permalink>
- 요청 경로: [누가 / 어떤 미팅·스레드]

### 할 일 (In scope)
- [ ] …

### 하지 않을 것 (Out of scope)
- …

### 기한·약속
- [스레드에 적힌 일정·다운로드·킥오프 시점]

### 담당자 후보
| 후보 | 근거 (Slack/Jira) | 확신도 |
|------|-------------------|--------|
| @이름 | … | 높음/중간/낮음 |

### 오픈 질문
- …

### 다음 액션 제안
- [ ] 담당자에게 시작 요청 Slack 게시
- [ ] `/cb:intake` — Jira 본문 채우기
- [ ] `/cb:work-triage` — 구현 단위 분해
```

### 5. 담당자 결정 규칙

우선순위 (위에서 매칭되면 사용):

1. 스레드에서 **일정·산출물·다운로드**를 맡겠다고 한 사람
2. Jira **Assignee** / 멘션된 구현 담당
3. Eng OKR·기능 오너로 지목된 사람
4. 불명확 → **담당자 후보 표에 2명 이하**로 좁히고 사용자에게 1문장 확인

### 6. 시작 요청 메시지 초안

톤: **매우 공손**, 짧은 사실 → 부탁 → 감사. 비난·압박 금지.

```markdown
<@USER_ID> [이름]님, 안녕하세요.

[배경 1~2문장 — 미팅/스레드에서 약속·요청된 내용, 출처 링크]

현재 [공유된 일정/티켓/문서]을(를) 찾지 못한 상태라(또는 Jira [KEY] 본문이 비어 있어) 진행 계획을 파악하기 어려운 상황입니다.

바쁘신 와중에 번거로우시겠지만, **[오늘/이번 주] 일정** 또는 가능하신 범위에서 간단한 킥오프(일정·범위·다음 액션)를 공유해 주실 수 있을지 여쭤봅니다.

감사합니다.
```

- Jira 링크는 마크다운 링크로 포함
- “제가 놓친 부분이 있을 수도” 등 **완곡한 표현** 1문장 권장
- 여러 담당자면 **한 메시지에 멘션**하거나, 역할별로 메시지 분리(사용자 선택)

### 7. 게시

| 조건 | 동작 |
|------|------|
| 사용자 **확인 전** | §4 업무 정의 + §6 메시지 초안만 출력 |
| “보내줘” / `--post` / 확인 후 | MCP `slack_send_message` — `channel_id`는 `--channel` 또는 기본 `C0000000000` (#29-team-frontend-스몰톡) |
| 게시 후 | 사용자에게 **message_link** 반드시 전달 |

**게시 채널 기본값:** `#29-team-frontend-스몰톡` (`C0000000000`). 앵커가 다른 팀 채널이면 사용자에게 확인.

### 8. 답변 follow-up (같은 스레드 permalink 재사용)

사용자가 **“답 왔어”** + 스레드 링크를 주면 §1~3을 **재실행**하고 §4 업무 정의를 **갱신**한다.

답변에서 추출:

- 일정 약속 변경 (예: 목요일 → 오늘 오후)
- Jira/Confluence 업데이트 여부
- 캘린더 초대·미팅 링크
- 본인(assignee) 변경

**감사 답글 초안** (선택, 확인 후 스레드 `thread_ts`로 게시):

```markdown
<@USER_ID> [이름]님, 공유 감사합니다. Jira 확인해 보겠습니다. 오후 일정도 캘린더에서 확인하겠습니다.
```

### 9. 문서 읽기 & 작업 준비 (답변·Jira 채워진 후)

Jira/Confluence에 내용이 생기면 **코드 수정 전** 이 단계를 수행한다.

1. **문서 읽기 (순서)**
   - Jira description의 Confluence·GitHub doc 링크 → MCP/`Read`
   - `docs/workstreams/<name>/` 등 레포 내 workstream 문서
   - 실행 도구·플러그인 README (Jira에 링크된 경우)

2. **업무 정의 갱신** — §4 템플릿에 **In scope**를 문서 기준으로 구체화 (앱·패키지·삭제 대상 등)

3. **코드베이스 스캔 (read-only)**
   - `Grep` / `Glob` — Header, Footer, GNB, workstream 키워드
   - 영향 앱·패키지 목록, 기존 마이그레이션 흔적

4. **작업 준비 산출물** (사용자에게 출력):

```markdown
## 작업 준비 (Slack 킥오프)

### 읽은 문서
- [ ] Jira PROJ-123
- [ ] Confluence …
- [ ] docs/workstreams/…

### 구현 범위 (초안)
- 앱/패키지: …
- 1차 목표: …

### 확인할 파일·디렉터리
- `packages/…`
- `apps/…`

### 리스크·의존
- …

### 제안 다음 커맨드
- `/cb:work-triage PROJ-123`
- `/cb:work-start PROJ-123 <slug>`
```

5. **자동 분기**
   - Jira 여전히 빈약 → `/cb:intake`로 AC·설명 보강 초안
   - 범위·브랜치 명확 → `/cb:work-triage` 제안
   - **코드 변경·커밋은 사용자 요청 전까지 하지 않음**

### 10. 다음 스킬 (선택)

| 상황 | 다음 |
|------|------|
| Jira 본문 비어 있음 | `/cb:intake` |
| 구현 범위·브랜치 필요 | `/cb:work-triage` → `/cb:work-start` |
| PR 리뷰 요청이었음 | `/cb:slack-pr-review` |

## 하지 않는 것

- 사용자 확인 없이 Slack **게시** (명시적 `--post`·“보내줘” 제외)
- PR diff 코드 리뷰 (`slack-pr-review` 담당)
- Jira create/edit 자동 반영 (`intake` + 사용자 “반영해줘”)
- 민감 정보(계정·토큰)를 Slack 본문에 그대로 붙이기

## 체크리스트 (에이전트용)

```
Phase A — 킥오프
- [ ] permalink 파싱
- [ ] 앵커 스레드 전체 읽기 (+ 답변 있으면 재조회)
- [ ] Slack 검색 ≥1회
- [ ] Jira / Confluence / repo docs
- [ ] 업무 정의 + 담당자
- [ ] (A만) 시작 요청 초안 · 게시는 확인 후

Phase B — 준비 (답변·Jira 업데이트 후)
- [ ] 캘린더: 수동 확인 또는 Calendar MCP
- [ ] 문서 전부 읽기
- [ ] grep/scope 스캔
- [ ] 작업 준비 산출물 + work-triage 제안
```

## 예시

**입력:** `https://user.com/archives/C0000000000/p1779163206882539`

**기대:** Eng OKR · Header/Footer/GNB · 목요일 일정 약속 · PROJ-123 빈 티켓 → 담당자 변치훈 → 스몰톡 채널에 일정 요청 초안 → 확인 후 게시.

상세: [examples.md](examples.md)
