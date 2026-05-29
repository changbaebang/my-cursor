---
name: slack-pr-review
description: >-
  Slack 메시지·스레드 링크와 GitHub PR을 연결해 코드 리뷰를 수행하고, 완료 시 Slack **원본
  메시지에** :eyes: / :white_check_mark: **리액션**을 남기고 스레드에 리뷰 요약을
  답글합니다. **이미 MERGED/CLOSED된 PR은 철수**(Slack·GitHub 미게시). "슬랙 PR 리뷰", "slack review", "슬랙 메시지 리뷰", "PR 리뷰 부탁",
  slack permalink, 리뷰 완료 이모지, check 리액션 요청 시 사용합니다.
---

# Slack → PR 리뷰 (개인 스킬)

**위치:** `~/.cursor/skills/slack-pr-review/` (레포 밖, 개인 전용)

Slack은 **버그 맥락·재현·리뷰 요청**의 출발점, GitHub PR diff는 **리뷰의 진실 원천**입니다.

`/cb:slack-review-request`는 파이프라인에 **리뷰 요청 메시지를 올리는** 용도이고, 이 스킬은 **요청 스레드를 받아 코드 리뷰**하는 용도입니다.

## Slack 완료 처리 — 핵심 구분

| 동작 | 대상 | 도구 | 예시 |
|------|------|------|------|
| **리액션** | **원본(부모) 메시지** | `slack-reaction.mjs` | 메시지 아래 ✅ `:white_check_mark:` |
| **답글** | **스레드** | Slack MCP `slack_send_message` | 리뷰 요약·Approve·감사 텍스트 |

> ⚠️ **댓글 본문에 `:white_check_mark:` 텍스트를 넣는 것 ≠ 리액션.**
> 사용자가 기대하는 "이모지 남기기"는 Slack UI의 **이모지 추가(리액션)** — 원본 글에 달린다.

## GitHub 인증 (`gh`)

| 항목 | 내용 |
|------|------|
| **로그인** | `gh auth login` (keyring, 계정 `changbaebang-example` 등) |
| **금지** | `.zshrc`에 만료된 `ghp_` PAT 하드코딩 — `GH_TOKEN` invalid → API Forbidden |
| **에이전트·스크립트** | 매 `gh` 호출 전 keyring 토큰 사용 (아래 패턴) |

```bash
export GH_TOKEN="$(env -u GH_TOKEN -u GITHUB_AUTH_TOKEN gh auth token)"
# 또는
~/.cursor/scripts/cb/gh-with-keyring.sh pr view 6966 --repo YourOrg-Developers/your-frontend-monorepo
```

**Approve (`gh pr review --approve`)** — requested reviewer에 본인이 없으면 Forbidden일 수 있음. 필요 시:

```bash
export GH_TOKEN="$(env -u GH_TOKEN -u GITHUB_AUTH_TOKEN gh auth token)"
gh api repos/<owner>/<repo>/pulls/<N>/requested_reviewers -f 'reviewers[]=changbaebang-example'
gh pr review <N> --repo <owner>/<repo> --approve --body "..."
```

## 사전 요건

| 도구 | 용도 |
|------|------|
| **Slack MCP** (`slack_read_thread`, `slack_send_message`) | 스레드 읽기·리뷰 요약 **답글** |
| **`gh`** + **유효 `GH_TOKEN`** (keyring) | PR 메타·diff·리뷰·Approve |
| **`SLACK_USER_TOKEN`** (권장) 또는 `SLACK_BOT_TOKEN` | **원본 메시지 리액션** (`reactions.add`) |

토큰 설정 — **상세 런북**: [`~/.cursor/docs/automation/pr-review-slack-agent.md`](../../docs/automation/pr-review-slack-agent.md#slack-app-설정-런북--pr-리뷰-리액션-phase-05) § Phase 0.5

```bash
cp ~/.cursor/skills/slack-pr-review/.env.example ~/.cursor/skills/slack-pr-review/.env
# User OAuth Token (xoxp-...) — 앱 만들기: 위 런북 참고
source ~/.cursor/skills/slack-pr-review/.env
```

Slack App **User Token Scopes**: `reactions:write`, `channels:history` (비공개 채널이면 `groups:history`).

Node **18+** 필요 (`parse-slack-url.mjs`, `slack-reaction.mjs`).

## 스크립트 경로 (고정)

```text
$HOME/.cursor/skills/slack-pr-review/scripts/
```

permalink 파싱:

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/parse-slack-url.mjs" "<permalink>"
# → channelId, messageTs
```

## 워크플로우

### 1. 시작 — 슬랙 링크 + PR 식별

1. permalink 파싱 (`parse-slack-url.mjs`)
2. **Slack MCP** `slack_read_thread` — `channel_id`, `message_ts`(부모)
3. 스레드에서 PR 번호·repo 추출: `pull/6953`, `user.com/.../pull/N` 등

### 1.2 Slack 맥락 vs PR 작성자 — **혼동 금지** (필수)

스레드에 `@멘션`·「OO님」이 있어도 **그 사람이 PR 작성자가 아닐 수 있다.** 리뷰 코멘트·감사 인사의 **대상은 GitHub PR author**다.

| 출처 | 의미 | 리뷰 문구에 쓸 때 |
|------|------|------------------|
| Slack **부모 메시지 작성자** | 리뷰 **요청자** | 필요 시 「홍동님 리뷰 요청 감사」— **작성자 호칭으로 쓰지 말 것** |
| Slack **`@멘션` / 본문 「OO님」** | 리뷰 받는 사람·CC·담당 언급일 수 있음 | **PR author로 추정하지 말 것** |
| **`gh pr view --json author`** | PR **실제 작성자** | 「{이름}님, … 감사합니다」·Approve 본문의 주소 |

**PR마다 author 확인 (복수 PR 필수):**

```bash
gh pr view <N> --repo <owner/repo> --json author,title --jq '{author: .author.login, title: .title}'
```

- `author.login` → `hongdongkim-example` 등. 표시 이름은 Slack/GitHub 프로필과 다를 수 있음.
- 호칭은 **사용자·팀이 쓰는 이름**(예: 홍동님)을 쓰되, **근거는 `author.login` + 스레드 맥락**으로만 정한다. `@Jacob`만 보고 해용님이라고 부르지 않는다.
- 요청자(홍동) ≠ 멘션(해용) ≠ 작성자(홍동)인 경우가 많다 → **작성자 = `gh author`**.

### 1.5 PR 상태 확인 — **머지됐으면 철수** (필수)

PR 맥락·diff 수집 **전에** 상태를 먼저 확인한다.

```bash
gh pr view <N> --repo <owner/repo> --json state,mergedAt,url,title
```

| `state` | 동작 |
|---------|------|
| `OPEN` | 리뷰 진행 |
| **`MERGED`** | **즉시 철수** — diff 리뷰·GitHub 코멘트·Slack 답글·리액션 모두 하지 않음 |
| `CLOSED` (머지 안 됨) | **철수** — 리뷰 불필요 |

**철수 시 에이전트가 할 일**

1. 사용자(채팅)에게만 짧게 알림 — 예: 「PR #N은 이미 머지되어 리뷰 생략했습니다」+ URL
2. **Slack/GitHub에 아무 것도 남기지 않음** (스레드 답글·리뷰·리액션 ❌)
3. `:eyes:` 리액션도 달지 않음 (아직 안 달았을 때)

> 늦게 온 리뷰 요청 스레드는 흔함. 머지된 PR에 사후 코멘트를 남기면 노이즈가 되므로 **그냥 철수**가 기본.

### 2. 리뷰 시작 (OPEN PR만)

4. **원본 메시지에 `:eyes:` 리액션** (리뷰 시작 신호)

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/slack-reaction.mjs" \
  --url "<permalink>" --emoji eyes
```

### 3. PR 컨텍스트 (OPEN PR만)

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/gather-pr-context.mjs" --pr 6953
```

대형 PR: `--stat-only` 후 파일별 `Read`.

### 4. 리뷰 작성 (한국어)

- GitHub·Slack 게시 전 **PR별 `author` 확인** (§1.2). 멘션된 사람 이름으로 감사 인사 **금지** (확인 없이).
- 복수 PR이면 PR마다 작성자·총평을 분리한다.
- **GitHub**와 **Slack 답글** 분량·톤은 다르다 (§5.2). GitHub에 상세, Slack은 짧게.

**GitHub** (`gh pr review` / comment) — 상세 기록:

```markdown
## PR #N 리뷰
### 총평 — Approve / Request changes / Comment
### 슬랙 맥락 반영 (요청자·티켓만, 작성자 추정 금지)
### 잘 된 점
### 블로커 / 제안 (🔴 / 🟡)
### QA 체크리스트
```

**Slack 스레드 답글** — §5.2 (잘 된 점 나열 금지, 팀 공유 포인트·우려만).

### 5. 게시 (사용자 확인 후)

순서:

1. **GitHub** — `gh pr review` (Approve/Comment) 또는 `gh pr comment`
2. **Slack 스레드 답글** — MCP `slack_send_message` (`thread_ts` = 부모 `message_ts`, 형식 §5.2)
   - 답글 본문에 리액션 이모지 텍스트를 넣지 **않아도 됨** (리액션은 3번에서 처리)
   - **§1.2로 호칭 확정 후 게시** — 잘못된 이름으로 보내지 말 것 (§5.1)
3. **Slack 원본 메시지 리액션** — `:white_check_mark:` (리뷰 완료 신호)

### 5.1 Slack 답글 — 호칭 오류·메타 정정 금지

Slack에는 **리뷰 결과만** 남긴다. 팀에 불필요한 내부·프로세스 설명을 하지 않는다.

| 하지 말 것 | 대신 |
|------------|------|
| 「정정합니다」「멘션과 작성자 혼동」「스킬 반영」「GitHub login」 등 **메타·사과·에이전트 내부 사정** | 게시 **전** §1.2로 `author` 확인해 **처음부터 올바른 호칭** (예: 홍동님) |
| 호칭만 틀렸는데 **추가 스레드로 정정 설명** | **첫 답글 문구**를 작성자 호칭에 맞게 쓴다 (예: 「홍동님 구매 챌린지 QA 건 리뷰 완료」) |

**이미 잘못 게시한 경우:** Slack MCP는 **메시지 수정·삭제 불가**. 메타 정정 답글을 **추가로 달지 말 것**. 사용자에게 해당 메시지 **직접 편집**(호칭만 `홍동님` 등으로 교체) 안내하거나, 동일 형식의 리뷰 요약을 **메타 없이** 한 줄만 다시 보낼지 사용자에게 확인한다.

### 5.2 Slack 답글 — 톤·분량 (Approve 기본)

Slack은 스레드에 이미 PR 링크가 있는 경우가 많다. **Approve = 보통 잘 됐다는 뜻**이므로, 뻔한 「잘 된 점」 bullet은 **쓰지 않는다.** GitHub 리뷰 본문에만 상세를 남긴다.

| 넣을 것 | 넣지 말 것 |
|---------|------------|
| **한 줄** — `{작성자}님, {티켓/맥락} 리뷰 완료 — Approve` | 잘 된 점 3~5개 bullet (코드 품질·구조 칭찬 나열) |
| **팀 공유 포인트** (0~2문장) — 「모든 팀원이 알아야 할」 동작·정책·운영 변화만 Approve **이유**로 | 구현 디테일 칭찬, 리뷰어에게 당연한 수준의 OK 나열 |
| **우려·제안** — 🟡 / 🔴, 머지 전 검증, non-blocking 제안 | 단일 PR인데 **끝에 PR URL** 반복 (부모·GitHub에 이미 있음) |

**팀 공유 포인트 예** (Slack에만 짧게):

- CI/알림 규칙이 바뀌어 ticket 팀 전원이 알림 조건을 공유해야 할 때
- Feature flag·롤아웃·장애 대응 절차가 바뀔 때
- 다른 앱/패키지 소비자가 행동을 바꿔야 할 때

**PR 개수별 형식**

| 개수 | Slack 형식 |
|------|------------|
| **1개** | 제목 한 줄 + (팀 공유 포인트) + 🟡 우려. **PR 링크·`#6974` 헤더 생략** |
| **2개 이상** | 제목 `Approve N건` + PR마다 블록: `*platform #6967*` — 한 줄 총평 + 🟡. 필요 시에만 링크 |

**단일 PR 예 (Approve):**

```text
수현님, TICKETIN-750 CI 알림 워크플로 리뷰 완료 — Approve

`app: ticket` 라벨이 붙은 PR만 Slack 알림 — ticket 팀은 이 규칙만 공유하면 됩니다.

🟡 머지 전 Test plan(라벨 토글·재부착·close/reopen) 실제 채널에서 한 번 검증 부탁드려요.
```

**복수 PR 예:**

```text
홍동님, 구매 챌린지 QA 건 리뷰 완료 — Approve 2건

*platform #6967* — join-result 리워드 키 정리 시점 OK
🟡 (해당 PR 우려만)

*framer #1287* — Notices·로깅 정리 OK
🟡 스텝 카드 once 제거 — 스크롤 impression QA 한 번 부탁
```

**Request changes** — Slack에도 🔴 블로커를 명확히. 팀 공유 포인트는 선택.

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/slack-reaction.mjs" \
  --url "<permalink>" --emoji white_check_mark
```

한 번에 (시작 eyes + 완료 check):

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/run.mjs" \
  --url "<permalink>" --pr 6953 --react-both
```

### 6. 이모지 규칙 (원본 메시지 리액션)

| 리액션 | 시점 | 의미 |
|--------|------|------|
| `:eyes:` | 리뷰 **시작** | 확인 중 |
| `:white_check_mark:` | 리뷰 **완료** | Approve·코멘트 반영 완료 |

Request changes 시 `:white_check_mark:` 대신 `:eyes:` 유지하거나 답글에만 상태를 명시 (팀 convention에 따름).

## Cursor 커맨드

`/cb:slack-pr-review <slack-permalink> [pr-number]`

## 주의

- **PR 작성자 ≠ Slack `@멘션`** — 감사·Approve 문구는 `gh pr view --json author` 기준 (§1.2).
- **Slack에 메타 정정·내부 사정 금지** — 호칭 오류는 첫 답글에서 바로잡거나 사용자 편집 (§5.1).
- **Slack Approve 답글은 짧게** — 잘 된 점 나열 대신 팀 공유 포인트 + 🟡만 (§5.2). 단일 PR 링크 반복 금지.

## 참고 — 팀 convention 메모 (리뷰에 넣지 않음)

에이전트가 스킬 안에서만 기억하는 배경 지식이다. **PR 리뷰·Slack 답글에 runner/`runs-on`을 자동으로 지적하거나 Approve 조건으로 쓰지 않는다.** (사용자가 명시적으로 runner 리뷰를 요청한 경우만 예외.)

### GitHub Actions `runs-on` (재호님 / Jake)

| | |
|--|--|
| **팀 규칙** | runner는 **YourOrg self-hosted**만 사용 (「29 self-hosted」) |
| **금지** | GitHub-hosted (`ubuntu-latest` 등) |
| **라벨 예** | `small-example`, `default-example`, `default-4xlarge-example` — 레포 기존 워크플로와 동일 계열 |

워크플로 PR을 리뷰할 때도, diff에 `ubuntu-latest`가 있어도 **리뷰 코멘트·🟡·Slack 팀 공유 포인트에 넣지 않는다.**
- **스레드 답글은 Slack MCP `slack_send_message`만 사용** — 메시지 하단 `*다음을 사용하여 보냄* @Cursor` 푸터는 Cursor 연동의 정상 표시이므로 제거·우회하지 않는다.
- **`state: MERGED`(또는 CLOSED) PR은 리뷰하지 않고 철수** — GitHub/Slack에 코멘트 남기지 않음.
- 슬랙만으로 diff 없이 리뷰하지 말 것.
- QA 계정·개인정보는 PR/슬랙에 그대로 붙이지 말 것.
- **Slack MCP는 리액션 API 미지원** — `slack-reaction.mjs` + `SLACK_USER_TOKEN`(권장) 또는 `SLACK_BOT_TOKEN`. 설정: `~/.cursor/docs/automation/pr-review-slack-agent.md` Phase 0.5 런북.
- 토큰 없이 리액션 실패 시: 사용자에게 `.env` 설정 안내. 스레드 답글만으로 완료 처리하지 말고 리액션 누락을 알릴 것.
