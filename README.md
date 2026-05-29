> **Public mirror** — sanitized from a private `my-cursor` repo. Internal deploy/standup/vendor-toolkit paths are removed; URLs and IDs are placeholders. Not affiliated with any employer.

# my-cursor

개인 Cursor 설정 — **skills**, **`/cb:*` 슬래시 커맨드**, **scripts** — 를 GitHub에 백업·공유하는 repo입니다.

- **Remote:** https://user.com/changbaebang/my-cursor
- **설치:** [SETUP.md](./SETUP.md)
- **동기화:** `/cb:my-cursor-sync` 또는 `./scripts/sync-to-repo.sh`

## 포함

| 디렉터리 | 내용 |
|----------|------|
| `skills/` | Agent Skills (`slack-work-kickoff`, `intake`, PR 리뷰, incident, vendor-skills, …) |
| `commands/cb/` | 슬래시 커맨드 정의 (`/cb:vendor-skills` 포함) |
| `scripts/cb/` | 브랜치명, PR fetch, Slack 리액션 등 |
| `docs/` | vendor-skills, QA 메모, automation 런북 |
| `.cursor/rules/` | Cursor 규칙 (`vendor-skills.mdc` 등) → `~/.cursor/rules/` |

## 제외 (`~/.cursor` 전체 X)

- `projects/`, `chats/`, 대화 로그
- `mcp.json` (실토큰) → `mcp.json.example` 만
- `skills-cursor/` (Cursor 내장)
- `.env`, dedupe JSON

## 빠른 시작

```bash
git clone git@user.com:changbaebang/my-cursor.git ~/Codes/my-cursor
cd ~/Codes/my-cursor
./install.sh
```

Cursor에서 `/cb:guide` 로 전체 목록 확인.

## Workflow hub

| 슬래시 | 용도 |
|--------|------|
| `/cb:guide` | 전체 커맨드 목록 |
| `/cb:my-cursor-sync` | 이 repo에 백업 |
| `/cb:slack-work-kickoff` | Slack 업무 → 정의·일정·준비 |
| `/cb:intake` | Jira 티켓 초안 |
| `/cb:slack-pr-review` | Slack + PR 리뷰 |
| `/cb:vendor-skills` | 외부 Claude 플러그인 임시 install/teardown |

**Vendor:** [`docs/vendor-skills.md`](docs/vendor-skills.md) — `~/.cursor/vendor/`, **platform repo 커밋 없음**

상세: `skills/README.md`, `commands/cb/README.md`

## MCP (본인 설정)

`mcp.json.example` → `~/.cursor/mcp.json` 복사 후 토큰 입력.

- Atlassian (Jira/Confluence)
- Figma
- GitHub
- Slack (Cursor 플러그인)

## Git commits

Cursor 관련 변경 커밋 시 **항상** co-author:

```text
Co-authored-by: Cursor <cursoragent@user.com>
```

```bash
./scripts/commit-with-cursor.sh "sync: your message"
```

## License

MIT — see [LICENSE](./LICENSE). Sanitized public mirror; replace placeholders with your org URLs, channels, and labels.
