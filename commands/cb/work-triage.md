---
command: '/cb:work-triage'
category: 'Project Management'
purpose: '작업 유형 분류·Jira AC 보강·브랜치/커밋/PR 단위 설계'
description: >-
  Jira 키 또는 PR/diff를 보고 api-migration·regression·epic 등 유형을 정하고
  하위 작업·AC·베이스 브랜치·QA 깊이를 제안한다.
argument-hint: '<jira-key|pr-number|pr-url>'
---

# /cb:work-triage — Classify & slice work

## Goal

한 덩어리 요구를 **머지 가능한 Jira 단위**와 **실행 전략**으로 쪼갠다.  
코드 변경은 하지 않는다 (필요 시 read-only grep·`gh pr diff`).

## Arguments

- `PROJ-123` — Jira 중심
- `6952` or PR URL — PR 중심 (제목에서 Jira 키 추출)

## Step 1 — Gather

```bash
# PR이면
gh pr view <N> --json title,body,baseRefName,headRefName,files,commits
gh pr diff <N> --stat

# Jira면 (MCP)
getJiraIssue PROJ-xxxx
```

## Step 2 — Classify (pick one primary, optional secondary)

| Type | 코드 | 신호 | 베이스 브랜치 | 커밋 | QA |
|------|------|------|---------------|------|-----|
| API 마이그레이션 | **A** | legacy API → `-org/apis-*`, import 제거 | epic/feature 브랜치 | 앱·패키지 단위 | grep 0건 + 스팟 |
| 회귀/버그 | **B** | hotfix, 재현, 이전 PR 연관 | `main` or release | 최소 diff | 재현→수정→회귀 |
| 기계적 이동 | **C** | rename/move only | topic 브랜치 | 경로 단위 | blame·소비처 동일 |
| 문구/스타일 | **D** | copy, CSS token | topic | 작게 | 시각 스팟 |
| 작은 동작 변경 | **E** | 단일 플로우, <~20 files | topic | 기능 단위 | 시나리오 3~5 |
| 대규모 에픽 | **F** | 다수 PR, 플래그, 단계 머지 | epic 브랜치 | 하위 PR = 하위 Jira | 단계별 QA |

**Epic + A**: `F` primary, `A` secondary (heart `PROJ-123`).

## Step 3 — Output (strict, Korean)

### 분류 결과

- Primary: `A` — …
- Secondary: (있으면)
- 근거: (diff/티켓 인용 2~3줄)

### 실행 전략

- **베이스 브랜치**: e.g. `feat/PROJ-123-remove-heart-service`
- **작업 브랜치**: `feat/PROJ-123-legacy-shared-heart-api`
- **예상 PR 수**: N
- **커밋 단위 제안**: bullet (1 PR = 1~3 logical commits)

### Jira 업데이트 제안

- Parent / 현재 티켓 summary·description 보강
- AC 체크리스트 (복사용 markdown)
- 하위 작업 추가·분할 표 (신규 summary만; 키는 create 시 부여)

### 유형별 필수 AC (해당 시만)

**A — API migration**

- [ ] `heartApi` / `HeartService` import **0건** (범위 내)
- [ ] `fetch*` / `update*` Result: `!success` → **throw**
- [ ] union 응답은 **분기별** `getResultData` (narrowing)
- [ ] 공통 fetch/mutation은 SSOT 파일 1곳

**B — Regression**

- [ ] 재현 경로
- [ ] 관련 PR: #6937, #6939 등
- [ ] 수정 후 동일 시나리오 PASS

**C — Mechanical move**

- [ ] `git blame` / 원 작성자 기록
- [ ] 소비처 grep 동일 동작

**F — Epic**

- [ ] 하위 Jira ↔ 하위 PR 1:1
- [ ] epic 브랜치에 순차 머지 순서

### QA 스팟 (최소)

- 앱·화면 bullet (3~7개)

### 다음 커맨드

→ `/cb:work-start <JIRA_KEY> <slug>`

## Jira write policy

`triage` 결과를 Jira에 쓰려면 사용자가 **“지라 반영해줘”**라고 명시할 때만 MCP edit/create.

## Usage

```text
/cb:work-triage PROJ-123
/cb:work-triage 6952
/cb:work-triage https://user.com/YourOrg-Developers/your-frontend-monorepo/pull/6952
```
