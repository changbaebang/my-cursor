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

- [ ] 커밋 메시지에 `(PROJ-200)`
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

## Step 5 — Leaf PR handoff (Container 브랜치 전략)

Epic/Container 아래 **leaf PR**이 리뷰 완료된 경우 (예: Ph5 `1407` → base `1406-ph5`):

```bash
# 1) 머지 가능 여부
gh pr view <N> --json mergeable,mergeStateStatus,state,reviews,baseRefName

# 2) squash merge (repo 기본이면 --squash)
gh pr merge <N> --squash \
  --subject "PROJ-100 feat(scope): … (#<N>)" \
  --body "Squash merge PR #<N> into <container-branch>\n\nJira: PROJ-100"

# 3) 로컬 container 최신화 + 다음 leaf 브랜치
git fetch origin <container-branch>
git checkout <container-branch>
git pull origin <container-branch>
git checkout -b feat/PROJ-100-ph5-<app-slug>
```

| 확인 | 기대 |
|------|------|
| `mergeStateStatus` | `CLEAN` |
| `mergeable` | `MERGEABLE` |
| base | **container** (`feat/PROJ-100-ph5` 등), `main` 아님 |

**위험 메모:** squash는 leaf 커밋 히스토리를 1커밋으로 합침 — container에만 쌓이므로 leaf→container 흐름에서는 정상.

이어서 **Step 6 Jira** + **Step 7 work-start** (`/cb:work-start <next-key> …`) 연계.

## Step 6 — Jira (MCP, after user confirms or explicit request)

Cloud: `your-org-oneteam` · cloudId `23c14e7d-74ed-40b6-a0bb-fbc1f6351b84`

**종료 티켓 (Done):**

1. `getJiraIssue` — `customfield_12767` (Actual MD) 비어 있으면 사용자 확인 (또는 Estimate `customfield_12766` 참고, SP÷8)
2. `editJiraIssue` → `customfield_12767` 설정
3. `transitionJiraIssue` Done (`61`)
4. `addCommentToJiraIssue` — PR 링크·merge SHA·smoke 요약

**MUST NOT:** Actual MD 없이 Done.

**다음 티켓:** `transitionJiraIssue` Start (`21`) → In Progress

- Parent epic: all children Done → consider epic comment (no auto-close unless asked)

Browse URL: `https://jira.example.com/browse/<KEY>`  
(또는 `https://your-org.atlassian.net/browse/<KEY>`)

## Step 7 — Output (Korean)

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
  `feat(scope): … (PROJ-200)`
- Otherwise **do not commit**

## Usage

```text
/cb:work-closeout PROJ-200
/cb:work-closeout PROJ-200 6952
/cb:work-closeout PROJ-100 7191 --next PROJ-100
```

`--next <key>`: Jira Start + work-start 브랜치 안내까지 한 세션에 이어갈 때.

## Pipeline

`intake` → `work-triage` → `work-start` → (implement) → **`work-closeout`** → `work-start` (next leaf)
