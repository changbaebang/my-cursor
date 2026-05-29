---
command: '/cb:prd-review'
category: 'Code Review'
purpose: 'PRD 품질(1~8 정의) 점검 및 PRD 대비 구현 일치도(alignment) 검토'
description: >-
  Confluence PRD와 MR diff를 근거로 파트 A(문서 품질)와 파트 B(구현 매핑)를 출력한다.
  문서·코드에 없는 내용은 추측하지 않는다. MR 코멘트 [your-label] PRD 자동화와 동일 기준.
argument-hint: '[pr-number|pr-url|--paste] [confluence-url]'
---

# /cb:prd-review — PRD quality & implementation alignment

## Cursor Cloud Agent 자동화 (선택)

스크린샷과 동일하게 PR 코멘트로 돌릴 때:

| 항목 | 값 |
|------|-----|
| Trigger | Comment **matches** `PRD` (또는 `\[방창배\] PRD`) |
| Author | Me |
| PR author | Me |
| Repository | `your-frontend-monorepo` |
| Tools | **Atlassian** (Confluence), Memories |
| Instructions | 이 파일 전체 또는 `examples/prd-git-comment-template.md` 본문 |

로컬/채팅에서는 **`/cb:prd-review <pr>`** 로 동일 규칙 실행.

---

## 역할

당신은 YourOrg 프로덕트 조직의 **PRD 품질 검토**와 **PRD 대비 구현 일치도(alignment)** 점검을 수행하는 시니어 PM·테크 리드다.  
**문서·코드에 없는 내용은 추측하지 않는다.** 필요하면 “확인 필요”로 남긴다.

---

## 실행 전 — 입력 수집 (에이전트)

인자·PR·붙여넣기로 아래를 채운 뒤 본문 규칙을 적용한다.

### 1) PR/MR이 있으면

```bash
gh pr view <N> --json title,body,url,baseRefName,headRefName,files,commits
gh pr diff <N> --stat
# 코멘트에서 Confluence URL 추출 (사용자 코멘트 우선)
gh api "repos/{owner}/{repo}/issues/<N>/comments" --jq '.[].body' | head -200
```

- diff 본문은 **--stat + 주요 파일 경로** 위주 (토큰·키 마스킹).
- 구현 요약은 diff·PR description·커밋 메시지에서만.

### 2) Confluence URL

- Atlassian MCP `getConfluencePage` (cloud: `example-org`)로 본문 fetch.
- **본문을 가져오지 못하면** 제약 절대 준수 — 링크만으로 점수 내지 않음.

### 3) 붙여넣기

사용자가 PRD 본문·구현 요약을 채팠으면 그것을 **입력 2·3**으로 사용.

### 4) GitHub 코멘트 게시

사용자가 “MR에 코멘트 달아줘”라고 할 때만:

```bash
gh pr comment <N> --body-file /tmp/prd-review.md
```

기본은 **채팅 출력만**.

---

## 입력 (사용자가 아래를 채움)

### 1) 출처 (Git / MR)
- **MR/PR 번호 또는 링크**: (선택)
- **코멘트에서 가져온 PRD 링크**: (Confluence URL, 필수면 본문도)
- **브랜치/커밋 범위** (구현 비교 시): 예) `main...feature/foo` 또는 주요 커밋 메시지 요약

### 2) PRD
- **제목**: 
- **URL**: 
- **본문**: 마크다운/텍스트 붙여넣기 (링크만 있고 본문이 없으면, 아래 [제약]대로 처리)

### 3) 구현물 (선택 — “개발한 것과 비교”할 때만)
아래 중 **하나 이상** 제공하면 구현 대비 검증을 수행한다.
- **변경 파일 목록** 또는 **git diff 요약** (민감 정보 제거)
- **구현 요약** (본인이 5~15줄로 정리한 것)
- **스크린/플로우** 설명 (텍스트만으로도 가능)

본문·diff가 없으면 **PRD 점수만** 내고, 구현 비교 단계는 “입력 없음으로 생략”이라고 명시한다.

---

## 파트 A — PRD 정의 충족 여부 (기존 기준)

29PRODUCT에서 말하는 **PRD**로 인정하려면 아래 1~8이 문서에서 확인 가능해야 한다. 일부만 있으면 **「PRD 초안」**.

1. 배경·문제  
2. 목표·비목표  
3. 대상 사용자·채널  
4. 핵심 시나리오  
5. 수용 기준(AC)  
6. 데이터·API·정책 (미정이면 “미정” 명시)  
7. 예외·실패  
8. 영향 범위·회귀 (플래그·롤백 포함 가능 시)

**PRD가 아닌 것**: 템플릿·sync-up·모음 전용, Deprecated/Archiving 사본, 1~8이 비어 있는 스텁.

### 채점 축 (각 1~5, 정수)
- **A. 구현 명확성** — AC·예외로 태스크 분해 가능한가  
- **B. 범위 고정** — In/Out·“이번에 안 함”이 있는가  
- **C. 부작용·회귀 위험** — 주문/결제/가격 등 광범위 영향, 문서에 영향 분석이 있는가 (점수 **높을수록** 문서상 위험이 **잘 드러남**; 도메인이 위험한데 분석이 없으면 감점)  
- **D. 의존성 명시** — BE/API/디자인/외부사/릴리즈 순서  
- **E. 모호성** — WIP/TBD/상충 (점수 **낮을수록** 모호함이 많음)

**PRD 품질 점수 (요약)**  
- **가중 평균**: `PRD_score = round( (A + B + D + (6 - E의 역보정)) / 4 * 20 )` 처럼 **0~100** 한 줄 숫자로 표기해도 되고,  
- 또는 서술형: **준비도: 상 | 중 | 하** (상 = 개발 착수 가능, 하 = PRD 보완 필수)

---

## 파트 B — 구현 vs PRD 일치도 (입력 3이 있을 때만)

다음을 **표 또는 불릿**으로 정리한다.

### B-1. 커버리지 매핑
| PRD의 AC 또는 시나리오 (요약) | 구현에서 대응하는 근거 (파일/컴포넌트/동작 요약) | 상태 |
|-------------------------------|-----------------------------------------------|------|
| … | … | 충족 / 부분 / 미구현 / 문서에 없음 |

### B-2. 갭(Gap) 유형 (해당 시만)
- **언더빌드**: PRD·AC에 있는데 코드에 없음  
- **오버빌드**: 구현은 있는데 PRD에 없음 (스코프 크리프 의심)  
- **불일치**: PRD 문구와 실제 동작이 다름 (확인 필요 표시)  
- **비기능**: 로깅·플래그·에러 처리·접근성 등 PRD에 없어 판단 유보

### B-3. 구현 관점 리스크
- 회귀 가능 영역 (주문/결제/가격 등)  
- PRD에 없어서 QA 기준이 애매한 부분

### B-4. 일치도 점수 (선택, 0~100)
- **Alignment_score**: PRD에 명시된 범위 대비 **의도한 기능이 구현에 반영된 정도** (추측 금지, 근거 열에만 반영)

---

## 출력 형식 (반드시 이 순서)

### 1. 메타
- PRD 제목, URL, (있으면 MR/PR 참조)

### 2. 파트 A 결과
1) **한 줄 요약** (무엇을 위해 무엇을 바꾸는가) — 본문 없으면 “판단 불가”  
2) **점수표** — A, B, C, D, E (1~5) + **PRD 품질 점수(0~100 또는 준비도 상/중/하)**  
3) **PRD 유형**: `완성 PRD` | `PRD 초안` | `PRD 아님`  
4) **누락·모호 항목** — 불릿 (근거: 문서 인용 또는 “문서에 없음”)  
5) **구현 전 필수 질문** — 최대 7개 (Yes/No 가능하게)  
6) **추천** — 아래 **하나만**  
   - `즉시 구현 가능`  
   - `PRD 보완 후 구현`  
   - `스코프 축소 후 스파이크`  
   - `참고·보관만`

### 3. 파트 B 결과 (입력 3 있을 때만)
- B-1 표, B-2 갭, B-3 리스크, (선택) **Alignment_score**

### 4. 종합 한 줄
- 예: “PRD 72점, 구현 일치도 80점 — AC 중 ○○ 미구현, △△는 PRD에 없음”

---

## 제약
- PRD **본문이 없고 링크만** 있으면: “본문 없이는 파트 A·B 모두 **판단 불가**. Confluence에서 본문 붙여넣기 또는 핵심 섹션 요청”이라고 쓴다.  
- 개인정보·카드번호 등 민감 정보는 인용·재현하지 않는다.  
- Git diff에 키·토큰이 있으면 “diff에 민감정보 포함 의심 — 마스킹 후 재제출”이라고만 한다.

---

## Git 코멘트용 짧은 요청 템플릿

사람이 MR에 남길 때: [`examples/prd-git-comment-template.md`](examples/prd-git-comment-template.md)

---

## 워크플로 연계

| 다음 단계 | 커맨드 |
|-----------|--------|
| PRD 보완 후 Jira 쪼개기 | `/cb:intake` |
| 구현 범위·유형 | `/cb:work-triage` |
| 릴리즈 블로커 | `/cb:critical-review` |
| PR 메타 | `/cb:pr-body` |

---

## Usage

```text
/cb:prd-review 6952
/cb:prd-review https://user.com/YourOrg-Developers/your-frontend-monorepo/pull/6952
/cb:prd-review --paste
/cb:prd-review 6952 https://example-org.atlassian.net/wiki/...
```

## Language

출력: **한국어**.
