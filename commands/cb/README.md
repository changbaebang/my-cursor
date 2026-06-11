# cb — 개인 FE 워크플로 (Cursor)

YourOrg frontend: **Jira 정리 → 구현 → PR 리뷰** personal slash commands.  
**Repo:** https://github.com/changbaebang/my-cursor · 설치: [SETUP.md](../../SETUP.md)

**전체 목록·순서**: [`/cb:guide`](cb-guide.md) 또는 채팅에서 `/cb:guide`

---

## 파이프라인 (구현)

```text
Slack 업무 요청 링크
        ↓
   /cb:slack-work-kickoff → 맥락 수집·업무 정의·담당자·시작 요청 (선택 → intake)

Slack / Confluence / Figma
        ↓
   /cb:intake          → Jira Epic·Story·하위 작업 초안
        ↓
   /cb:work-triage     → 작업 유형·베이스 브랜치·AC·커밋 단위
        ↓
   /cb:work-start      → 브랜치 생성·범위 grep
        ↓
   (코딩 · 커밋 · 푸시 · PR)
        ↓
   /cb:work-closeout   → Jira Done·다음 티켓
   /cb:slack-review-request → #your-team-pipeline 리뷰 요청
   /cb:slack-pr-review      → 슬랙 스레드 링크 + PR diff 코드 리뷰 (:eyes: / :white_check_mark:)
   /cb:private-skill-init   → 개인 스킬을 비식별 private 경로로 생성/연결
   /cb:learn-radar           → ~/docs/learning-backlog (배울 것)
   /cb:blog-radar           → 주제 선별 (Google/Azure/React/GeekNews)
   /cb:blog                 → ~/docs/blog-drafts 회고
   /cb:my-cursor-sync       → my-cursor repo 백업 (skills/commands)
```

---

## PR 리뷰 (권장 순서)

**슬랙에 리뷰 부탁 온 스레드가 있으면** 먼저 `/cb:slack-pr-review <permalink> [pr]` (스킬: `~/.cursor/skills/slack-pr-review/`).

```text
/cb:prd-review → /cb:pr-checklist → /cb:typescript-review → /cb:nextjs-review
→ /cb:react-review → /cb:hygiene-review → /cb:critical-review
```

Cloud Agent 트리거: [`examples/review-automation-triggers.md`](examples/review-automation-triggers.md)

---

## 커맨드 전체

### Workflow

| 슬래시 | 문서 |
|--------|------|
| `/cb:guide` | [cb-guide.md](cb-guide.md) |
| `/cb:intake` | [intake.md](intake.md) |
| `/cb:work-triage` | [work-triage.md](work-triage.md) |
| `/cb:work-start` | [work-start.md](work-start.md) |
| `/cb:work-closeout` | [work-closeout.md](work-closeout.md) |
| `/cb:pr-body` | [pr-body.md](pr-body.md) |
| `/cb:ai-stats` | [ai-stats.md](ai-stats.md) |
| `/cb:slack-review-request` | [slack-review-request.md](slack-review-request.md) |
| `/cb:slack-work-kickoff` | [slack-work-kickoff.md](slack-work-kickoff.md) |
| `/cb:private-skill-init` | [private-skill-init.md](private-skill-init.md) |
| `/cb:my-cursor-sync` | [my-cursor-sync.md](my-cursor-sync.md) |
| `/cb:learn-radar` | [learn-radar.md](learn-radar.md) |
| `/cb:blog-radar` | [blog-radar.md](blog-radar.md) |
| `/cb:blog` | [blog.md](blog.md) |
| `/cb:blog-publish` | [blog-publish.md](blog-publish.md) |

### Review

| 슬래시 | 문서 | Legacy 라벨 |
|--------|------|-------------|
| `/cb:prd-review` | [prd-review.md](prd-review.md) | `[your-label] PRD` |
| `/cb:pr-checklist` | [pr-checklist.md](pr-checklist.md) | `[your-label][기본] PR template` |
| `/cb:typescript-review` | [typescript-review.md](typescript-review.md) | `[your-label][기본] Typescript` |
| `/cb:nextjs-review` | [nextjs-review.md](nextjs-review.md) | `[your-label][기본] Nextjs` |
| `/cb:react-review` | [react-review.md](react-review.md) | `[your-label][기본] React` |
| `/cb:hygiene-review` | [hygiene-review.md](hygiene-review.md) | `[your-label][커서리뷰] Hygiene` |
| `/cb:critical-review` | [critical-review.md](critical-review.md) | 심각도 확인 |
| `/cb:pr-review-notify` | [pr-review-notify.md](pr-review-notify.md) | `[your-label] PR 승인(사람만)` |

---

## 디렉터리

```text
~/.cursor/
├── commands/cb/          # 규칙 본문
├── docs/automation/      # PR 리뷰 자동화 등 설계 (미구현)
├── skills/               # Skill 진입점 (pr-body-updater, ai-stats-upload, critical-review, …)
└── scripts/cb/           # branch-name, pr-body-patch, pr-review-fetch, dedupe json
```

설계 문서: [`~/.cursor/docs/automation/`](../../docs/automation/README.md) (레포에 넣지 않음)

---

## 예시

```text
/cb:guide review
/cb:prd-review 6952
/cb:typescript-review 6952
/cb:hygiene-review 6952
/cb:critical-review 6952
/cb:pr-body 6952
/cb:work-closeout PROJ-123 6952
/cb:slack-review-request 6955
/cb:ai-stats
```

### 5) PR 올린 뒤 파이프라인 알림

```text
/cb:slack-review-request 6955
(초안 확인 후) 슬랙에 보내줘
```

Heart 에픽: [docs/your-epic-example.md](docs/your-epic-example.md)

---

## 공통 규칙

1. Jira 키 truncate 금지 (`PROJ-123`).
2. 커밋/PR은 사용자 요청 시만.
3. 출력: 한국어.
4. Skills: `disable-model-invocation: true` — `/cb:*` 또는 명시 호출 시 로드.
