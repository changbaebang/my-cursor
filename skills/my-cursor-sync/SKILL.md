---
name: my-cursor-sync
description: >-
  Syncs personal Cursor assets from ~/.cursor into the my-cursor git repo and
  guides commit/push. Use when updating my-cursor, syncing cursor skills,
  publishing slash commands, "커서 설정 백업", "my-cursor push", or after editing
  skills/commands in ~/.cursor.
disable-model-invocation: true
---

# my-cursor sync (personal)

**Repo:** https://github.com/your-github-user/my-cursor  
**로컬 기본 경로:** `~/Codes/my-cursor` (또는 `MY_CURSOR_REPO` env)

`~/.cursor` **전체**가 아니라 **공유 가능한 자산만** repo로 보낸다.

## 동기화 대상

| 포함 | 경로 |
|------|------|
| ✅ | `skills/*/` (`.env` 제외) |
| ✅ | `commands/cb/*.md` |
| ✅ | `scripts/cb/*` (`*-dedupe.json` 제외) |
| ✅ | `docs/` (있으면) |
| ✅ | `.cursor/rules/*.mdc` (있으면) |
| ❌ | `mcp.json`, `projects/`, `chats/`, `skills-cursor/`, `plugins/`, 토큰 |
| ❌ | private 스킬: `kr-stock-*`, `us-daily-portfolio-check/` |

## 워크플로우

### 1. 로컬 → repo 반영

```bash
cd "${MY_CURSOR_REPO:-$HOME/Codes/my-cursor}"
./scripts/sync-to-repo.sh
```

또는 에이전트가 동일 rsync 규칙으로 파일 복사.

`~/.cursor/docs`가 repo symlink가 **아닐 때** (기존 설치): automation 등 변경분을 repo로 복사한 뒤 커밋.

```bash
rsync -av "$HOME/.cursor/docs/" "${MY_CURSOR_REPO:-$HOME/Codes/my-cursor}/docs/"
```

`skills/*`는 `install.sh` symlink면 repo가 이미 SSOT — `sync-to-repo.sh`의 skills rsync는 README 등 비연결 파일만 맞춤.

### 2. 시크릿 스캔 (커밋 전 필수)

```bash
cd "${MY_CURSOR_REPO:-$HOME/Codes/my-cursor}"
git grep -E 'xoxp-|xoxb-|github_pat_[A-Za-z0-9]{10,}|ghp_[A-Za-z0-9]{20,}|GOCSPX-' \
  -- ':!*.example' ':!SETUP.md' ':!skills/slack-pr-review/SKILL.md' || true
```

매칭되면 **커밋 중단** → 제거·`.example`로 치환. 상세: repo `SETUP.md` §7.

### 3. 커밋 (Co-authored-by 필수)

**my-cursor·Cursor 설정 관련 커밋에는 항상 Cursor co-author trailer를 넣는다.**

```text
Co-authored-by: Cursor <cursoragent@cursor.com>
```

**에이전트·사용자 모두** 아래 스크립트로 커밋 (직접 `git commit -m`만 쓰지 않음):

```bash
cd "${MY_CURSOR_REPO:-$HOME/Codes/my-cursor}"
git add -A   # 또는 필요한 파일만
./scripts/commit-with-cursor.sh "sync: cursor skills/commands/scripts" "- added/updated: <name>"
```

메시지 예:

```text
sync: cursor skills/commands/scripts

- added/updated: slack-work-kickoff

Co-authored-by: Cursor <cursoragent@cursor.com>
```

수동 커밋 시에도 본문 **마지막 줄**에 위 trailer 필수. `git commit --trailer` 사용 가능:

```bash
git commit -m "sync: …" --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>"
```

### 4. push (private)

사용자가 요청했을 때만:

```bash
git push origin main
```

### 4b. public mirror (선택)

외부 공개 repo `changbaebang/my-cursor` — allowlist + sanitize:

```bash
./scripts/publish-to-public.sh
cd "${MY_CURSOR_PUBLIC:-$HOME/Codes/my-cursor-public}"
git add …  # allowlist만 또는 publish 스크립트 안내 따름
git push origin main
```

`scripts/publish-allowlist.txt` · [SANITIZATION.md](../../SANITIZATION.md) (public worktree).

### 5. 다른 Mac / 동료

```bash
git clone git@github.com:your-github-user/my-cursor.git ~/Codes/my-cursor
cd ~/Codes/my-cursor && ./install.sh
```

## 역방향 (repo → ~/.cursor)

새 머신·clone 후:

```bash
./install.sh
```

`skills/*`, `commands/cb`, `scripts/cb` → `~/.cursor` symlink.

## install.sh 후 확인

- Cursor Reload Window
- `/cb:guide` 동작
- `~/.cursor/mcp.json`은 **본인이** `mcp.json.example` 참고해 작성 (repo에 실토큰 금지)

## Git 규칙 (항상)

| 규칙 | 내용 |
|------|------|
| Co-author | `Co-authored-by: Cursor <cursoragent@cursor.com>` |
| 도구 | `./scripts/commit-with-cursor.sh` 우선 |
| 범위 | `my-cursor` repo 및 Cursor skills/commands/docs 커밋 |

## 하지 않는 것

- Co-author **없는** my-cursor 커밋
- `mcp.json` / `.env` 커밋
- `projects/`, agent transcripts, terminal logs 업로드
- `skills-cursor/` (Cursor 내장) 복사

## 관련

- [SETUP.md](../../SETUP.md) — 최초 설치
- [README.md](../../README.md) — 스킬·슬래시 목록
