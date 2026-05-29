---
command: '/cb:slack-work-kickoff'
category: 'Collaboration'
purpose: 'Slack 업무 요청 링크로 맥락 수집·업무 정의·담당자 식별·시작 요청'
description: >-
  Slack permalink에서 스레드·검색·Jira를 조사해 업무를 정의하고, 담당자에게
  공손한 시작/일정 요청 메시지 초안을 만들거나(확인 후) 게시한다.
argument-hint: '<slack-permalink> [--channel <name>] [--calendar] [--post]'
---

# /cb:slack-work-kickoff

**스킬:** `~/.cursor/skills/slack-work-kickoff/SKILL.md`

## 인자

1. **`<slack-permalink>`** (필수)
2. **`--channel <name>`** (선택) — 게시 채널. 기본 `#your-team-frontend-스몰톡`
3. **`--post`** (선택) — 확인 없이 즉시 게시. 평소에는 초안만.

## 워크플로우 (요약)

1. `parse-slack-url.mjs` → `slack_read_thread`
2. `slack_search_public_and_private` + `slack_read_channel` + `slack_search_users`
3. Jira 키 있으면 Atlassian MCP
4. **업무 정의** + **담당자** + **메시지 초안** (Phase A)
5. 답변·Jira 업데이트 후 → **문서 읽기·grep·작업 준비** (Phase B)
6. 캘린더: **`gws` CLI** 권장 (`npm i -g @googleworkspace/cli` → `gws auth login`) — [calendar-setup.md](~/.cursor/skills/slack-work-kickoff/calendar-setup.md)
7. 사용자 확인 후 `slack_send_message` → message_link

## 관련

| 다음 | 명령 |
|------|------|
| Jira 초안 | `/cb:intake` |
| 작업 분해 | `/cb:work-triage` |
| PR 리뷰 | `/cb:slack-pr-review` |

## 예

```text
/cb:slack-work-kickoff https://your-org.slack.com/archives/C0000000000/p0000000000000000
/cb:slack-work-kickoff <permalink> --post
```
