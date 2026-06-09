# Sanitization notice

This repository is a **public mirror** of a private Cursor workflow repo.

- Company-specific skills (deploy approval, standup, local monorepo dev, vendor toolkit, incident runbooks) are **omitted** or **sanitized**.
- **E2E suite** (`e2e-design`, `e2e-local-page`, `e2e-deployed-check` + matching `skills/*`) is published with hostnames replaced (`qa.example.com`, `PROJ-123`, …).
- Slack channel IDs, Jira hosts, and internal URLs are **placeholders** (`your-org`, `example.com`, `PROJ-123`, `C0000000000`).
- Before use, search for `your-`, `example.com`, `YourOrg`, and replace with your values.

Do not commit real tokens. Use `mcp.json.example` and local `.env` only.

## Verification (maintainers)

Before each publish, scan the mirror tree:

```bash
grep -rE 'musinsa|29cm\.co|M29CM|C0(?!0000000000)|xox[pab]-[A-Za-z0-9]{10,}|ghp_|github_pat_[A-Za-z0-9]{20,}|jira\.team|wiki\.team' . \
  --include='*.md' --include='*.mjs' --include='*.sh' || echo OK
```

Replace any match before pushing to GitHub.
