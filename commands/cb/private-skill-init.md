---
command: '/cb:private-skill-init'
category: 'Meta'
purpose: '개인 스킬을 비식별 해시 경로로 생성하고 ~/.cursor/skills에 링크'
description: >-
  private 전용 스킬을 ~/.cursor/private/skills/<hash>에 생성하고
  ~/.cursor/skills/<alias>로 symlink 연결한다. repo 동기화 대상이 아니다.
argument-hint: '<skill-alias>'
---

# /cb:private-skill-init

**스킬:** `skills/private-skill-init/SKILL.md`

## Steps

1. `~/Codes/my-cursor/scripts/cb/private-skill-init.sh <skill-alias>` 실행
2. `ls -la ~/.cursor/skills/<skill-alias>`로 symlink 확인
3. 필요 시 `SKILL.md` 내용 수정
4. `./scripts/sync-to-repo.sh` 실행 전 `git status`로 유입 여부 확인

## Example

```text
/cb:private-skill-init kr-stock-analysis
```
