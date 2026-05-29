# 스킬·규칙 소유권 (요약)

Cursor 규칙 SSOT: `~/.cursor/rules/skills-ownership.mdc` (`alwaysApply: true`)

## 한 줄

**스킬 업데이트 = `~/.cursor` + `my-cursor` — 작업 레포 `.claude/skills` 아님.**

## 3계층

```
팀 영구     your-frontend-monorepo/.claude/skills, .cursor/rules
            → 팀 표준만. 개인 워크플로 넣지 않음. 왠만하면 손대지 않음.

개인 영구   ~/.cursor/{commands/cb, skills, rules, docs}
            → /cb:*, PR 리뷰, Jira, 슬랙, blog, work-verify(예정)
            → my-cursor-sync 로 백업

Vendor 임시 ~/.cursor/vendor/ + skills/*-vendor/ + vendor-lock.json
            → nav-migration 등 티켓 한정
            → teardown 후 래퍼 삭제
```

## 자주 틀린 패턴 (금지)

- `your-frontend-monorepo/.claude/skills/cb-*` 생성
- 작업 레포 `docs/automation`에 개인 슬랙·Jira 규칙
- vendor 본문 전체를 `~/.cursor/skills/`에 복사 (래퍼만)

## 관련 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/cb:my-cursor-sync` | 개인 → GitHub my-cursor |
| `/cb:vendor-skills install\|teardown` | 임시 플러그인 |
| `/cb:private-skill-init` | 비식별 private 스킬 |
