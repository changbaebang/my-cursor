# PR 리뷰 스킬 맵 (개인 · changbae)

**SSOT:** `~/Codes/my-cursor/skills/pr-review/REVIEW-MAP.md` · `~/.cursor`는 `install.sh` symlink.

## 언제 무엇을 쓰는가

| 상황 | 스킬 / 슬래시 | diff 깊이 |
|------|----------------|-----------|
| Slack 스레드에 리뷰 요청 링크 | [`slack-pr-review`](../slack-pr-review/SKILL.md) · `/cb:slack-pr-review` | **필수** — [`diff-review-checklist.md`](../slack-pr-review/diff-review-checklist.md) |
| 「부드럽게」「가볍게」 리뷰 | 위와 동일 | 톤만 완화, §4.1 checklist **생략 금지** |
| PR 파이프라인에 리뷰 요청 올리기 | [`slack-review-request`](../slack-review-request/SKILL.md) · `/cb:slack-review-request` | 리뷰 안 함 (요청만) |
| 배포 승인 Slack 스레드 | [`slack-deploy-approval`](../slack-deploy-approval/SKILL.md) · `/cb:slack-deploy-approval` | **코드 diff 안 함** (머지·Jira·승인만) |
| PR 메타 (제목·body·Tier·라벨) | `29CM-fe` `pr-review` (vendor) · `/29CM-fe:pr` | 메타만 |
| PR template Hard/Soft Gate | [`pr-checklist-review`](../pr-checklist-review/SKILL.md) · `/cb:pr-checklist` | 체크리스트 |
| 언어별·심각도 리뷰 (IDE/Agent) | `prd-review` → `pr-checklist` → `typescript` → … → `critical` | 각 스킬 규칙 |
| 승인 후 작성자 DM·답글 초안 | [`pr-review-notify`](../pr-review-notify/SKILL.md) · `/cb:pr-review-notify` | 게시 후 |

## Slack PR 리뷰 — Approve 전 (필수)

1. `gh pr view` — `OPEN`만 (`MERGED`/`CLOSED` 철수)
2. `gh pr view --json author` — 호칭 (Slack 멘션 ≠ 작성자)
3. [`diff-review-checklist.md`](../slack-pr-review/diff-review-checklist.md) — 신호 스캔 + 논쟁 소지 1문장은 **GitHub**
4. Slack — 팀 공유 포인트 + 🟡만 ([`slack-pr-review` §5.2](../slack-pr-review/SKILL.md))

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/scan-diff-signals.mjs" \
  --repo your-org/frontend-monorepo --pr <N>
```

## 책임 분리 (팀 vs 개인)

| 계층 | 위치 | PR 리뷰 |
|------|------|---------|
| 팀 | `frontend-monorepo` `.claude/skills` | 팀 표준만 — 개인 슬랙 워크플로 넣지 않음 |
| 개인 | `~/.cursor` ↔ `my-cursor` | 본 맵의 스킬 |
| Vendor | `~/.cursor/vendor/...` | `29CM-fe` `pr-review`, `code-reviewer` |

## 관련 문서

- [pr-review-slack-agent.md](../../docs/automation/pr-review-slack-agent.md) — Slack App·리액션 런북
- [commands/cb/README.md](../../commands/cb/README.md) — 파이프라인
- [skills-ownership.md](../../docs/skills-ownership.md) — 3계층 소유권

## 사후 제보 (`이걸 승인해?`)

[`diff-review-checklist.md` § 사후 제보](../slack-pr-review/diff-review-checklist.md#사후-제보-대응) — GitHub follow-up, checklist 보강.
