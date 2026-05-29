---
command: '/cb:slack-pr-review'
category: 'Collaboration'
purpose: 'Slack 스레드 맥락 + GitHub PR diff 기반 코드 리뷰 (개인)'
description: >-
  Slack permalink와 PR 번호로 리뷰하고, 요약을 스레드에 남기며 :eyes: /
  :white_check_mark: 리액션을 달 수 있습니다. ~/.cursor 전용.
argument-hint: <slack-permalink> [pr-number]
---

# /cb:slack-pr-review

**개인 경로:** `~/.cursor/skills/slack-pr-review/`, `~/.cursor/commands/cb/slack-pr-review.md`

Slack 리뷰 **요청 스레드** + GitHub PR diff로 코드 리뷰합니다. (`/cb:slack-review-request`와 반대 방향)

## 인자

1. **`<slack-permalink>`** (필수)
2. **`[pr-number]`** (선택) — 없으면 `slack_read_thread`에서 `pull/NNNN` 추출

## 워크플로우

1. **스킬** — `~/.cursor/skills/slack-pr-review/SKILL.md` 전체 적용

2. **파싱**

   ```bash
   node "$HOME/.cursor/skills/slack-pr-review/scripts/parse-slack-url.mjs" "<permalink>"
   ```

3. **스레드** — MCP `slack_read_thread`

4. **PR 상태 확인** — `gh pr view ... --json state`

   - `MERGED` / `CLOSED` → **철수** (리뷰·Slack·GitHub 코멘트 없음, 사용자에게만 알림)
   - `OPEN` → 계속

5. **시작 리액션** (OPEN만, `SLACK_USER_TOKEN`)

   ```bash
   node "$HOME/.cursor/skills/slack-pr-review/scripts/slack-reaction.mjs" \
     --url "<permalink>" --emoji eyes
   ```

6. **PR 컨텍스트** (OPEN만)

   ```bash
   node "$HOME/.cursor/skills/slack-pr-review/scripts/gather-pr-context.mjs" --pr <N>
   ```

7. **리뷰** — 스킬 템플릿, 한국어, 사용자에게 먼저 표시

8. **게시** (확인 후) — `gh pr comment` / Slack MCP 스레드 답글

9. **완료**

   ```bash
   node "$HOME/.cursor/skills/slack-pr-review/scripts/slack-reaction.mjs" \
     --url "<permalink>" --emoji white_check_mark
   ```

## 예

```text
/cb:slack-pr-review https://user.com/archives/C0000000000/p1779264244219899 6953
```

## 환경

**Slack 리액션** — `SLACK_USER_TOKEN` (권장) 또는 `SLACK_BOT_TOKEN`

- 템플릿: `~/.cursor/skills/slack-pr-review/.env.example`
- **앱 만들기 런북**: `~/.cursor/docs/automation/pr-review-slack-agent.md` § Phase 0.5
