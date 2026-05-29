---
name: private-skill-init
description: >-
  Creates personal Cursor skills with anonymized private paths and symlink aliases.
  Use when creating a new private skill, handling sensitive/personal skill content,
  or when the user says private 스킬, 비식별 스킬, 해시 경로 스킬.
disable-model-invocation: true
---

# private skill init

개인 스킬은 `~/.cursor/private`에 만들고, alias만 `~/.cursor/skills`에 노출한다.

## Always

1. 실파일 경로는 `~/.cursor/private/skills/<hash>/SKILL.md`만 사용한다.
2. `<hash>`는 의미 없는 난수 문자열(권장: 32자리 hex)만 사용한다.
3. `~/.cursor/skills/<alias>`는 symlink만 사용한다.
4. `~/.cursor/private/*`를 가리키는 alias는 repo 동기화 대상에서 제외한다.

## Workflow

```bash
~/Codes/my-cursor/scripts/cb/private-skill-init.sh <skill-alias>
```

실행 후:

1. `ls -la ~/.cursor/skills/<skill-alias>`로 symlink 확인
2. `SKILL.md` 내용을 목적에 맞게 수정
3. sync 전에 `git status`로 private 유입 여부 확인

## Verification

```bash
readlink ~/.cursor/skills/<skill-alias>
```

반환 경로가 `~/.cursor/private/skills/` 하위면 정상이다.
