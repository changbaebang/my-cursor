---
command: '/cb:pr-body'
category: 'Git & Version Control'
purpose: 'YourOrg PR 본문 메타데이터 섹션 자동 보강 (Jira/Tier/영향도/테스트/변경사항)'
description: >-
  PR 번호 또는 URL을 받아 HESS 템플릿의 지정 섹션만 갱신하고 gh api로 본문에 적용한다.
  코드 리뷰 판단은 하지 않는다.
argument-hint: '<pr-number|pr-url>'
---

# /cb:pr-body — PR Body Updater (YourOrg frontend)

## Goal

- Update PR body **metadata/documentation sections only**.
- Do **NOT** perform code review decisioning.
- **Always generate AND apply** concrete section patches in this run.

## Scope (only these sections)

1. `### 🗒️ 참조 문서`
2. `### 📊 Tier (등급 + 근거)`
3. `### 🔎 영향도 분석`
4. `### ✅ 테스트/검증`
5. `### 🛠️ 변경 사항`

Preserve all other sections, checklists, HESS comments, `<hr />` blocks.

## Non-Negotiable Rules

1. Never output summary/plan only (e.g. "적용 예정 값").
2. Always return actual replacement markdown for target sections.
3. Always attempt PR body apply in the same run.
4. Output language: **Korean**.
5. Section-level idempotency (safe on repeated runs).
6. No duplicate bullets; merge semantically same content.
7. If apply fails, report exact failure reason and remediation.

## Auth

1. Prefer `GH_TOKEN` env var for `gh api` (never print token).
2. If `GH_TOKEN` missing or 401: try `env -u GH_TOKEN gh ...` (keyring) as **local fallback only**; state which auth was used.
3. Never embed token literals in output.

## Arguments

- Required: PR number (e.g. `6934`) or full GitHub PR URL.
- If missing, ask once; do not guess.

## Gather context (before writing sections)

Run in repo root:

```bash
gh pr view <N> --json title,body,baseRefName,headRefName,files,commits
git fetch origin <base> <head> 2>/dev/null || true
git diff origin/<base>...origin/<head> --stat
```

Use diff/commits to write factual `### 🛠️ 변경 사항` bullets.

## Jira key (strict)

- Extract from PR title: `\b([A-Z][A-Z0-9]*-\d+)\b`
- Keep key exactly (no truncation). `PROJ-123` ≠ `CMCCF-1447`.
- Multiple keys: prefer `M29*` prefix, else longest match.
- URL: `https://user.com/browse/<JIRA_KEY>`

## Tier (strict)

- Exactly one of: `Tier1` | `Tier2` | `Tier3` | `Hotfix` (never plain `1/2/3`).
- Heuristic when unclear:
  - CTA/이동/전환 플로우 변경 → default `Tier2`
  - UI 문구/스타일 only → `Tier3`
  - 인증/결제/권한/핵심 트랜잭션 → consider `Tier1`

## Section order & format

Use this exact order in the patched region (insert missing sections):

1. `### 🗒️ 참조 문서`
2. `### 📊 Tier (등급 + 근거)` — insert after 참조 문서 if missing
3. `### 🔎 영향도 분석`
4. `### ✅ 테스트/검증`
5. `### 🛠️ 변경 사항`

- One blank line after each heading.
- One blank line between section blocks.
- Do not wrap headings in stray backticks.

### A) 참조 문서 (REPLACE content under heading)

- **Jira Ticket**: markdown link
- **Tier**: short value only (in 참조 문서 list)
- **Spec / Guide**: from diff if obvious, else brief N/A or repo path hint
- PRD / Figma: `N/A` if unknown

### B) Tier (UPSERT)

- Line 1: `TierX`
- Line 2: `근거: ...` (1–2 sentences)
- Preserve meaningful existing rationale when re-running.

### C) 영향도 분석 (UPSERT)

Must include: 영향 범위, 기대 효과, 리스크 포인트, 대응 수단.

### D) 테스트/검증 (UPSERT)

Must include: 수행 플랫폼, 핵심 시나리오, 미수행 항목·후속.

### E) 변경 사항 (REPLACE content area only)

- Fact-based bullets from actual diff.
- Remove vague/opinion noise.
- Keep Oracle / Oracle Ref / content below first `<br />` + `<hr />` in 변경 사항 section if present in template.

## Apply PR body

1. Build **full** PR body: replace/upsert only the five sections; keep everything else byte-stable where possible.
2. Apply:

```bash
jq -Rs '{body: .}' /tmp/pr-body-new.md | gh api -X PATCH "repos/{owner}/{repo}/pulls/{N}" --input -
```

- Use `owner/repo` from `gh repo view --json nameWithOwner`.
- Do not use python.

Optional helper (if present):

```bash
~/.cursor/scripts/cb/pr-body-patch.sh <pr-number> /tmp/pr-body-new.md
```

## Output format (strict)

### Apply Result

- applied: true|false
- updated_sections: [...]
- auth_used: GH_TOKEN | keyring | failed
- reason_if_not_applied: (if any)

### Applied PR Body Snapshot (Sections Only)

Paste final markdown for the five sections in order.

### PR Comment Draft (optional, one line)

> PR 본문 메타데이터 자동 보강 완료 (Jira/Tier/영향도/테스트).

## Usage

```text
/cb:pr-body 6934
/cb:pr-body https://user.com/YourOrg-Developers/your-frontend-monorepo/pull/6934
```
