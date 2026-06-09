---
command: '/cb:work-closeout'
category: 'Project Management'
purpose: '작업 마무리 — pre-push 체크·Jira Done·다음 티켓·PR 연계'
description: >-
  구현 완료 후 grep/커밋/푸시/PR 상태를 점검하고 Jira를 정리한다.
  pr-body·critical-review와 연계한다.
argument-hint: '<jira-key> [pr-number|pr-url]'
---

# /cb:work-closeout — Finish a work unit

## Goal

하나의 **Jira 하위 작업**을 닫을 수 있는 상태인지 확인하고, 팀이 이어갈 수 있게 Jira·PR을 정리한다.

## Arguments

1. **Jira key** (required)
2. **PR number/URL** (optional) — 없으면 `gh pr list --head`로 추정 시도

## Step 1 — Git state

```bash
git branch --show-current
git status -sb
git log origin/<base>..HEAD --oneline
```

Report:

- 브랜치명에 Jira 키 포함 여부
- unpushed commits
- unintended files

## Step 2 — AC verification (read-only)

From ticket / triage type:

**A — API migration**

```bash
rg 'heartApi|from '\''@acme/apis'\''.*heart' <scope> || true
# expect 0 in scope
```

- [ ] Result throw wrapper for mutations
- [ ] No duplicate fetch without reason

**B — Regression**

- [ ] 재현 시나리오 → 수정 반영 언급

**General**

- [ ] 커밋 메시지에 `(M29CMCCF-xxxx)`
- [ ] 베이스 브랜치가 epic이면 PR base 확인

## Step 3 — Push & PR

- User asked push only → `git push -u origin HEAD`
- User opens PR → remind: base = epic branch, title includes Jira key
- If PR exists:

```bash
gh pr view <N> --json state,reviewDecision,baseRefName,url
```

## Step 4 — Linked commands (suggest, do not auto-run unless asked)

| 상황 | 커맨드 |
|------|--------|
| PR 본문 비어 있음 | `/cb:pr-body <N>` |
| 머지 전 릴리즈 리스크 | `/cb:critical-review <N>` |
| 승인·머지 완료 후 | Jira Done |

## Step 5 — Jira (MCP, after user confirms or explicit request)

Cloud: `your-org-oneteam`

- Merged & AC met → `transitionJiraIssue` Done (`61`)
- Next subtask → Start (`21`) on e.g. `PROJ-200`
- Parent epic: all children Done → consider epic comment (no auto-close unless asked)

Browse URL: `https://jira.example.com/browse/<KEY>`  
(또는 `https://your-org.atlassian.net/browse/<KEY>`)

## Step 6 — Output (Korean)

```markdown
## work-closeout: PROJ-200

### 상태
- Git: …
- PR: #6952 (open|merged) base=…
- AC: (체크 결과)

### 완료 조건
- [ ] 푸시됨
- [ ] PR 승인/머지 (또는 대기 중 명시)
- [ ] Jira Done
- [ ] 다음 티켓: PROJ-200 (제안)

### 권장 다음 액션
1. …
```

## Commit policy

- User said "커밋하고 푸시" → commit with HEREDOC message:
  `feat(scope): … (M29CMCCF-xxxx)`
- Otherwise **do not commit**

## Usage

```text
/cb:work-closeout PROJ-200
/cb:work-closeout PROJ-200 6952
```

## Pipeline

`intake` → `work-triage` → `work-start` → (implement) → **`work-closeout`**
