---
command: '/cb:e2e-design'
category: 'QA'
purpose: '페이지 흐름 기반 E2E 테스트 설계 (범위/환경/스킵)'
description: >-
  E2E를 실행하기 전에 page source/target, local vs deployed 환경 분리, 스킵 기준을 정리한다.
  Jira/PR 체크리스트 초안 작성에 사용.
argument-hint: '[ticket-or-pr] [scope-hint]'
---

# /cb:e2e-design

**스킬:** `skills/e2e-test-design/SKILL.md`

## Steps

1. `gh pr view <num> --json files` + Jira Description
2. hook → `pages/` 라우트 (P0 후보)
3. **사용 여부:** 코드 → 애매하면 슬랙·Jira → audit 표
4. **nqa preflight:** P0 URL 200/404·리다이렉트·sample ID 기록
5. P0 + 스킵(S*) + SC-* + 로그인
5. `~/.cursor/docs/qa/<TICKET>-e2e-plan-v1.md` 저장 → Jira Description 동기화

## Related

- 플랜 템플릿: `skills/e2e-test-design/SKILL.md` § Output
- 로컬: HTTPS dev host + 앱 1개 기동 (팀 setup 문서 참고)

## Example

```text
/cb:e2e-design PROJ-200
/cb:e2e-design https://github.com/your-org/frontend-monorepo/pull/6942
```
