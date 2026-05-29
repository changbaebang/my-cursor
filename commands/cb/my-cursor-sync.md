---
command: '/cb:my-cursor-sync'
category: 'Meta'
purpose: '~/.cursor 개인 설정을 my-cursor repo에 동기화하고 커밋/푸시'
description: >-
  skills, commands/cb, scripts/cb를 GitHub my-cursor에 반영한다. 시크릿 스캔 후
  커밋. 사용자가 push 요청 시에만 push.
argument-hint: '[--push]'
---

# /cb:my-cursor-sync

**스킬:** `skills/my-cursor-sync/SKILL.md`  
**Repo:** https://github.com/changbaebang/my-cursor

## Steps

1. `MY_CURSOR_REPO=~/Codes/my-cursor` (또는 clone 경로)
2. `./scripts/sync-to-repo.sh`
3. `git grep` 시크릿 스캔 (스킬 참고)
4. `git status` → 사용자에게 diff 요약
5. 사용자 확인 후 `git commit`
6. `--push` 또는 사용자 요청 시에만 `git push`

## Example

```text
/cb:my-cursor-sync
/cb:my-cursor-sync --push
```
