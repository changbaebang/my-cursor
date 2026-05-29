---
command: '/cb:work-start'
category: 'Git & Version Control'
purpose: 'Jira 티켓 기준 작업 브랜치 생성·범위 검증·시작 체크리스트'
description: >-
  feat/PROJ-{id}-{slug} 브랜치를 만들고 베이스·grep AC를 확인한다.
  코드 구현은 사용자 지시 후 진행한다.
argument-hint: '<jira-key> <branch-slug> [base-branch]'
---

# /cb:work-start — Branch & scope check

## Arguments

1. **Jira key** (required): `PROJ-123`
2. **branch slug** (required): `legacy-shared-example-api` (소문자·하이픈)
3. **base branch** (optional): default from `/cb:work-triage` or epic branch

Derived branch name:

```text
feat/PROJ-123-legacy-shared-example-api
```

Helper:

```bash
~/.cursor/scripts/cb/branch-name.sh PROJ-123 legacy-shared-example-api
```

## Preconditions

1. Run in **repo root** (`your-frontend-monorepo`).
2. Working tree clean or user acknowledged stash.
3. `git fetch origin` for base branch.

## Steps

### 1) Resolve base branch

| 상황 | 베이스 |
|------|--------|
| Epic 하위 (example, 순환참조) | `feat/PROJ-123-remove-example-service` 등 epic 브랜치 |
| Hotfix / 단독 | `main` or user-specified |
| Unclear | Ask once; do not guess `main` if triage said epic |

```bash
git checkout <base>
git pull origin <base>
```

### 2) Create branch

```bash
git checkout -b feat/PROJ-123-legacy-shared-example-api
```

Only run if user asked to create branch OR `/cb:work-start` explicitly includes "브랜치 만들어".

### 3) Jira → In Progress (optional)

Atlassian MCP `transitionJiraIssue` id `21` (Start) when user says to update Jira.

### 4) Scope grep (read-only)

From Jira description / triage file list:

```bash
# Example: heart migration
rg 'heartApi|HeartService' <paths from ticket> --glob '*.{ts,tsx}'
```

Record count; AC target **0** for migration.

### 5) Output checklist (Korean)

```markdown
## work-start: PROJ-123

- [ ] 브랜치: `feat/PROJ-123-legacy-shared-example-api`
- [ ] 베이스: `feat/PROJ-123-remove-example-service` @ <sha short>
- [ ] Jira: In Progress (또는 유지)
- [ ] 범위 grep: heartApi N건 → 목표 0
- [ ] 예상 파일: (list)
- [ ] 다음: 구현 후 잘게 커밋 → 푸시 → PR (베이스 epic)
```

## Type-specific reminders

**A — API migration**

- `-org/apis-heart` + `getResultData`; mutation은 `!success` throw
- `packages/*/package.json` devDependency 필요 시 추가

**B — Regression**

- 재현 브랜치/커밋 식별 먼저

**C — Mechanical**

- `git log --follow` / blame on moved symbols

## Do NOT

- Force push
- Commit without user request
- Open PR unless asked

## Usage

```text
/cb:work-start PROJ-123 legacy-shared-example-api
/cb:work-start PROJ-123 remove-example-service feat/PROJ-123-remove-example-service
```

## Next

After implementation → `/cb:work-closeout <key> [pr-number]`
