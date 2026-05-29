# SETUP — my-cursor

Clone 후 **5~15분** 안에 Cursor 개인 워크플로를 쓸 수 있게 하는 가이드입니다.

## 1. Clone

```bash
git clone git@user.com:changbaebang/my-cursor.git ~/Codes/my-cursor
cd ~/Codes/my-cursor
```

HTTPS:

```bash
git clone https://user.com/changbaebang/my-cursor.git ~/Codes/my-cursor
```

## 2. Install into `~/.cursor`

```bash
chmod +x install.sh scripts/sync-to-repo.sh
./install.sh
```

동작:

- `skills/<name>` → `~/.cursor/skills/<name>` (symlink)
- `commands/cb` → `~/.cursor/commands/cb` (symlink)
- `scripts/cb` → `~/.cursor/scripts/cb` (symlink)
- `docs` → `~/.cursor/docs` (없을 때만 symlink)
- `mcp.json` 없으면 `mcp.json.example` 복사

**Cursor:** Command Palette → **Developer: Reload Window**

## 3. Prerequisites

| 도구 | 필수 | 용도 |
|------|------|------|
| [Cursor](https://user.com) | ✅ | IDE |
| **Node 18+** (`fnm` 권장 22) | ✅ | `gws`, 일부 스크립트 |
| **`gh`** | ✅ | PR·리뷰 스킬 |
| **Slack MCP** | ✅ | Cursor Slack 플러그인 |
| **Atlassian MCP** | 권장 | Jira/Confluence |
| **`gws`** | 선택 | Calendar (`slack-work-kickoff`) |

### fnm + gws (Calendar)

```bash
eval "$(fnm env)" && fnm use 22
npm install -g @googleworkspace/cli
# ~/.config/gws/client_secret.json + gws auth login
# → skills/slack-work-kickoff/calendar-setup.md
```

### GitHub CLI

```bash
gh auth login
```

## 4. MCP (`~/.cursor/mcp.json`)

```bash
cp mcp.json.example ~/.cursor/mcp.json
# GitHub PAT, Atlassian OAuth 등 본인 값으로 수정 — 커밋 금지
```

| Server | 설정 |
|--------|------|
| atlassian | SSE `https://user.com/v1/mcp` (Cursor에서 연결) |
| Figma | `https://user.com/mcp` |
| github | Copilot MCP + `github_pat_...` |
| Slack | Cursor **Plugins → Slack** (별도 mcp.json 항목 아님) |

## 5. Slack PR 리뷰 리액션 (선택)

```bash
cp skills/slack-pr-review/.env.example skills/slack-pr-review/.env
# SLACK_USER_TOKEN=xoxp-...  (로컬만, git 제외)
source skills/slack-pr-review/.env
```

런북: `docs/automation/pr-review-slack-agent.md`

## 6. 검증

```text
/cb:guide
/cb:my-cursor-sync
/cb:slack-work-kickoff <slack-permalink>
```

## 7. 커밋 금지 & 커밋 전 체크

**절대 커밋하지 않음**

| 경로 | 이유 |
|------|------|
| `mcp.json` | MCP 실토큰 |
| `.env`, `credentials.json`, `client_secret.json` | API·OAuth 시크릿 |
| `scripts/cb/*-dedupe.json` | 개인 런타임 상태 |
| `skills/kr-stock-*`, `skills/us-daily-portfolio-check/` | 개인 private 스킬 |
| `~/.cursor/private/`, `projects/`, `chats/` | private·대화 로그 |

**커밋 전 (필수)**

```bash
cd ~/Codes/my-cursor
git grep -E 'xoxp-|xoxb-|github_pat_[A-Za-z0-9]{10,}|ghp_[A-Za-z0-9]{20,}|GOCSPX-' \
  -- ':!*.example' ':!SETUP.md' ':!skills/slack-pr-review/SKILL.md' || true
```

매칭되면 커밋 중단 → 플레이스홀더(`.example`)로 치환하거나 로컬만 보관.

**팀에 repo 공유 시** (시크릿과 별개): GitHub login, `[your-label]` 리뷰 라벨, 사내 Slack/Jira URL은 본인 값으로 치환.

## 8. 설정 변경 후 repo 백업

`~/.cursor`에서 스킬·커맨드를 수정했다면:

```bash
cd ~/Codes/my-cursor
./scripts/sync-to-repo.sh
git add -A
./scripts/commit-with-cursor.sh "sync: your summary"
git push
```

선택 — 이 repo에서 커밋 템플릿:

```bash
cd ~/Codes/my-cursor
git config commit.template .gitmessage
```

또는 Cursor에서 `/cb:my-cursor-sync` (push는 요청 시에만).

## Troubleshooting

| 문제 | 해결 |
|------|------|
| `gws: command not found` | `fnm use 22` 후 재시도 |
| 슬래시 안 보임 | `commands/cb` symlink 확인, Reload Window |
| MCP 안 됨 | `mcp.json` 토큰·Atlassian/Slack 연결 상태 |
| symlink 충돌 | 기존 `~/.cursor/skills/foo` 디렉터리 백업 후 `install.sh` 재실행 |

## Repo layout

```text
my-cursor/
├── README.md
├── SETUP.md
├── install.sh
├── mcp.json.example
├── skills/
├── commands/cb/
├── scripts/cb/
├── scripts/sync-to-repo.sh
└── docs/
```
