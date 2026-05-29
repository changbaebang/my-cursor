---
command: '/cb:guide'
category: 'Help'
purpose: 'cb 개인 스킬·슬래시 커맨드 전체 목록과 PR 리뷰 시 사용 순서 안내'
description: >-
  Lists all /cb:* commands, when to use each, Cloud Agent trigger labels, and recommended
  review order for YourOrg frontend PRs. Use when user asks cb 스킬, cb 사용법, 어떤 리뷰 쓸지.
argument-hint: '[topic: workflow|review|all]'
---

# /cb:guide — cb skills hub

Read **`~/.cursor/commands/cb/README.md`** for directory layout and workflow examples.

---

## 1. 작업 파이프라인 (구현)

| 슬래시 | 언제 | Cloud 트리거 (예) |
|--------|------|-------------------|
| [`/cb:intake`](intake.md) | Slack/Confluence/Figma → Jira 초안 | (수동) |
| [`/cb:work-triage`](work-triage.md) | 에픽 쪼개기·유형·AC | (수동) |
| [`/cb:work-start`](work-start.md) | 브랜치·grep | (수동) |
| [`/cb:work-closeout`](work-closeout.md) | Done·다음 티켓 | (수동) |
| [`/cb:pr-body`](pr-body.md) | PR 본문 Tier/영향도 | (수동) |
| [`/cb:ai-stats`](ai-stats.md) | AI 통계 — registry empty commits + PR | (수동) |
| [`/cb:slack-review-request`](slack-review-request.md) | 파이프라인 슬랙 리뷰 요청 | (수동) |
| [`/cb:slack-work-kickoff`](slack-work-kickoff.md) | Slack 업무 링크 → 정의·담당자·시작 요청 | (수동) |
| [`/cb:private-skill-init`](private-skill-init.md) | 개인 스킬 비식별(private hash) 생성·연결 | (수동) |
| [`/cb:my-cursor-sync`](my-cursor-sync.md) | my-cursor repo 동기화·커밋 | (수동) |
| [`/cb:learn-radar`](learn-radar.md) | 학습 백로그 (`~/docs/learning-backlog`) | (수동) |
| [`/cb:blog-radar`](blog-radar.md) | 블로그 주제 선별 (`*-topic-radar.md`) | (수동) |
| [`/cb:blog`](blog.md) | 회고 초안·발행 점검 (`~/docs/blog-drafts`) | (수동) |

---

## 2. PR 리뷰 (권장 순서)

한 PR에 여러 관점이 필요할 때 **아래 순서**를 권장한다 (각각 독립 실행 가능).

```text
1. /cb:prd-review <pr>        ← PRD·AC·alignment (기능 PR)
2. /cb:pr-checklist <pr>      ← Hard/Soft Gate·Tier·Jira
3. /cb:typescript-review <pr> ← 타입 must-NOT
4. /cb:nextjs-review <pr>     ← App Router·Gateway 분류
5. /cb:react-review <pr>      ← must-NOT·브랜치 strictness
6. /cb:hygiene-review <pr>    ← deps·lockfile·export·중복
7. /cb:critical-review <pr>   ← 릴리즈 블로커만 (마지막 게이트)
```

| 슬래시 | 초점 | 승인 성격 | Legacy 라벨 |
|--------|------|-----------|---------------|
| [`/cb:prd-review`](prd-review.md) | PRD 1~8, alignment | 문서·스코프 | `[your-label] PRD` |
| [`/cb:pr-checklist`](pr-checklist.md) | 템플릿·테스트·Tier | APPROVE/RC/COMMENT | `[your-label][기본] PR template` |
| [`/cb:typescript-review`](typescript-review.md) | any, assert, ts-ignore | 수정 요청/권고 | `[your-label][기본] Typescript` |
| [`/cb:nextjs-review`](nextjs-review.md) | RSC, use client, Gateway | RC vs COMMENT | `[your-label][기본] Nextjs` |
| [`/cb:react-review`](react-review.md) | 보안·아키·버그 | 수정 요청 | `[your-label][기본] React` |
| [`/cb:hygiene-review`](hygiene-review.md) | deps, lockfile, dead code | APPROVE_* | `[your-label][커서리뷰] Hygiene` |
| [`/cb:critical-review`](critical-review.md) | 크래시·보안·데이터 | Approve/Not | `[your-label][커서리뷰] 심각도` |
| [`/cb:pr-review-notify`](pr-review-notify.md) | 사람 리뷰 승인 DM·수정요청 답글 | 구조화 출력 | `[your-label] PR 승인(사람만)` |

**중복 피하기**

- `critical-review` ↔ `react-review` 버그: critical는 **릴리즈 블로커만**, react는 must-NOT 전반.
- `hygiene-review` ↔ `typescript-review`: hygiene는 package/export, TS는 타입 시스템.
- `pr-checklist` ↔ `pr-body`: checklist는 **판단**, pr-body는 **본문 PATCH**.

---

## 3. Cloud Agent 매핑

각 Automation의 **Instructions**에 해당 `commands/cb/<name>.md` 전체를 붙이거나:

> `~/.cursor/commands/cb/<name>.md` 규칙을 따른다.

트리거 예시: [`examples/review-automation-triggers.md`](examples/review-automation-triggers.md)

---

## 4. 빠른 선택 (topic)

| 상황 | 커맨드 |
|------|--------|
| PRD만 링크됨 | `/cb:prd-review` |
| 머지 전 최종 | `/cb:critical-review` + `/cb:pr-checklist` |
| epic/feature 브랜치 PR | `/cb:react-review` (non-prod 완화) |
| package.json 변경 | `/cb:hygiene-review` |
| auth callback 페이지 | `/cb:nextjs-review` |
| API 마이그레이션 PR | `/cb:typescript-review` + `/cb:work-triage` |
| 리뷰 승인/수정요청 알림 | `/cb:pr-review-notify` (event/schedule) |
| PR 올린 뒤 리뷰 요청 | `/cb:slack-review-request` |
| Slack 업무 요청·일정 follow-up | `/cb:slack-work-kickoff` |
| 개인 스킬을 private hash 경로로 생성 | `/cb:private-skill-init` |
| 스킬/커맨드 수정 후 GitHub 백업 | `/cb:my-cursor-sync` |
| 블로그 주제 고르기 (주간) | `/cb:blog-radar` → `/cb:blog draft` |
| 먼저 배울 것 정리 | `/cb:learn-radar` → 학습 → `promote` → `/cb:blog` |

---

## 5. 공통

- 출력: **한국어**
- `gh pr diff` 기본; type-check 필수 아님 (각 커맨드 명시)
- GitHub 코멘트/Approve: **사용자 요청 시만**
- 전체 인덱스: `~/.cursor/skills/README.md`

## Usage

```text
/cb:guide
/cb:guide review
/cb:guide workflow
```
