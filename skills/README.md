# Personal Cursor skills (changbae)

**Repo:** [changbaebang/my-cursor](https://github.com/changbaebang/my-cursor) · 설치: [SETUP.md](../SETUP.md)

**Hub**: `/cb:guide` → [`cb-guide`](../commands/cb/cb-guide.md) · [`commands/cb/README.md`](../commands/cb/README.md)

---

## Incident (장애)

| Skill | Slash |
|-------|-------|
| [incident-guide](incident-guide/SKILL.md) | `/cb:incident-guide` |
| [incident-declare](incident-declare/SKILL.md) | `/cb:incident-declare` |
| [incident-response](incident-response/SKILL.md) | `/cb:incident-response` |
| [incident-postmortem](incident-postmortem/SKILL.md) | `/cb:incident-postmortem` |

권장 순서: `declare` → `response` (진행 중 반복) → `postmortem` (해소 후)

---


## E2E / QA

| Skill | Slash | Scope |
|-------|-------|--------|
| [e2e-test-design](e2e-test-design/SKILL.md) | `/cb:e2e-design` | 페이지 흐름·환경·스킵 설계 |
| [e2e-local-page-check](e2e-local-page-check/SKILL.md) | `/cb:e2e-local-page` | cert 기반 로컬 단일 페이지 검증 |
| [e2e-deployed-browser-check](e2e-deployed-browser-check/SKILL.md) | `/cb:e2e-deployed-check` | ndev/nqa 배포환경 Cursor 브라우저 검증 |

원칙: `설계 -> 로컬 단일 페이지 -> 배포환경 검증` 순서. 여러 페이지 동시 검증 금지.

---

## Workflow

| Skill | Slash |
|-------|-------|
| [cb-guide](cb-guide/SKILL.md) | `/cb:guide` |
| [intake](intake/SKILL.md) | `/cb:intake` |
| [work-triage](work-triage/SKILL.md) | `/cb:work-triage` |
| [work-start](work-start/SKILL.md) | `/cb:work-start` |
| [work-closeout](work-closeout/SKILL.md) | `/cb:work-closeout` |
| [pr-body-updater](pr-body-updater/SKILL.md) | `/cb:pr-body` |
| [slack-review-request](slack-review-request/SKILL.md) | `/cb:slack-review-request` |
| [slack-work-kickoff](slack-work-kickoff/SKILL.md) | `/cb:slack-work-kickoff` |
| [my-cursor-sync](my-cursor-sync/SKILL.md) | `/cb:my-cursor-sync` |
| [blog-draft](blog-draft/SKILL.md) | `/cb:blog` |

---

## PR review

| Skill | Slash | Automation label |
|-------|-------|-------------------|
| [prd-review](prd-review/SKILL.md) | `/cb:prd-review` | `[your-label] PRD` |
| [pr-checklist-review](pr-checklist-review/SKILL.md) | `/cb:pr-checklist` | PR template |
| [typescript-review](typescript-review/SKILL.md) | `/cb:typescript-review` | Typescript |
| [nextjs-review](nextjs-review/SKILL.md) | `/cb:nextjs-review` | Nextjs |
| [react-review](react-review/SKILL.md) | `/cb:react-review` | React |
| [hygiene-review](hygiene-review/SKILL.md) | `/cb:hygiene-review` | Hygiene |
| [critical-review](critical-review/SKILL.md) | `/cb:critical-review` | 심각도 |
| [pr-review-notify](pr-review-notify/SKILL.md) | `/cb:pr-review-notify` | PR 승인 DM |

권장 순서 (코드 리뷰): `prd` → `pr-checklist` → `typescript` → `nextjs` → `react` → `hygiene` → `critical`

---

## Private skills (repo 미동기화)

`kr-stock-analysis`, `kr-stock-dual-strategy`, `us-daily-portfolio-check` 등은 `~/.cursor/skills/`에만 두고 `sync-to-repo.sh`가 제외합니다. 생성·연결: `/cb:private-skill-init`, 규칙: `.cursor/rules/private-skills-anonymized.mdc`.

---

## Paths

- Commands: `~/.cursor/commands/cb/*.md`
- Scripts: `~/.cursor/scripts/cb/`
- Triggers: `~/.cursor/commands/cb/examples/review-automation-triggers.md`

Invoke via **slash** or mention skill name (`disable-model-invocation: true`).
