---
command: '/cb:intake'
category: 'Project Management'
purpose: 'Slack/Confluence/Figma/붙여넣기 맥락을 Jira 티켓 초안으로 정리'
description: >-
  분산된 요구 정보를 읽고 Epic/Story/하위 작업 초안(설명·AC·범위·비고)을 만든다.
  Jira에 자동 반영은 사용자 확인 후 Atlassian MCP로 수행한다.
argument-hint: '[jira-key|confluence-url|slack-summary|--paste]'
---

# /cb:intake — Context → Jira draft

## Goal

누구나 **Jira만 보고 이어서 작업**할 수 있게, Slack·Confluence·Figma·회의 메모에서 빠진 맥락을 티켓 형태로 압축한다.

- **하지 않는 것**: 코드 수정, PR 생성, 릴리즈 판단
- **하는 것**: 구조화된 마크다운 초안 + (선택) Jira create/edit 제안

## Inputs (우선순위)

1. 사용자 붙여넣기 (스레드, 결정 사항, AC 후보)
2. Jira 키가 있으면 `getJiraIssue`로 기존 내용 병합
3. Confluence URL → MCP `getConfluencePage` (가능할 때)
4. Figma URL → Figma MCP `get_design_context` / 메타 (UI 스펙만)
5. Slack → 링크·요약 붙여넣기 (MCP 없으면 사용자 제공 텍스트)

인자가 없으면: **“맥락을 붙여넣거나 URL/ Jira 키를 주세요”** 한 번만 요청.

## Output structure (strict)

반드시 아래 섹션을 **한국어**로 출력.

### 1) 한 줄 요약

### 2) 배경·목표

- 왜 하는지, 성공 기준

### 3) 범위

- **In scope**: 파일·앱·API surface
- **Out of scope**: 이번 티켓에서 하지 않을 것

### 4) Epic / Story 제안

- Parent 키 (있으면)
- 제안 summary (한 줄)

### 5) 하위 작업 제안 (머지 가능 단위)

각 항목:

| 제안 키 | Summary | 범위(파일/앱) | AC (체크리스트) | 베이스 브랜치 |
|---------|---------|---------------|-----------------|---------------|
| (신규) | … | … | … | `main` / `feat/PROJ-*` |

AC는 **검증 가능**하게 (`heartApi` import 0건, QA 시나리오 3개 등).

### 6) 참고 링크

- Confluence, Figma, Slack, 관련 PR 번호

### 7) 리스크·오픈 질문

- 결정 필요 항목 bullet

### 8) Jira 반영 초안 (복사용)

Atlassian에 넣을 **Description** 필드용 마크다운 (Jira wiki/markdown 호환 간결체).

## Jira MCP (after user confirms)

Cloud: `example-org` (`23c14e7d-74ed-40b6-a0bb-fbc1f6351b84`)

- 기존 티켓 보강: `editJiraIssue`
- 하위 작업 생성: `createJiraIssue` (parent = Epic/Story)
- **사용자가 “반영해줘”라고 하기 전에는 Jira write 하지 않음**

## Quality bar

- 슬랙에만 있는 결정은 티켓 **비고**에 명시 (“2026-05-20 Slack #channel: …”)
- 애매한 범위는 Open questions로 빼고 추측 구현 범위 넣지 않음
- 대규모면 하위 작업을 **앱·패키지·API surface** 단위로 쪼갬 (heart 1750~1755 패턴)

## Examples

- heart API 에픽: [`examples/heart-migration.md`](examples/heart-migration.md)
- 순환 참조 제거: Epic + 패키지별 하위, AC에 “import 0건·빌드 그래프”

## Usage

```text
/cb:intake
/cb:intake PROJ-123
/cb:intake https://example-org.atlassian.net/wiki/...
```

## Next step

→ `/cb:work-triage <key>` 로 유형·커밋 단위 확정
