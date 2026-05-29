---
command: '/cb:blog-radar'
category: 'Writing'
purpose: '블로그 주제 선별 — Google/Azure/React/GeekNews에서 FE 관점 후보 추출'
description: >-
  Google 웹·클라우드, Azure, React, GeekNews 소스를 스캔해 블로그 주제 후보를 선별한다.
  발행 글과 겹침을 피하고 GO/MAYBE/PASS로 우선순위를 정한다.
argument-hint: '[scan|pick|open] [--days N]'
---

# /cb:blog-radar — Blog topic curation (personal)

## SSOT (MUST)

**주제 후보 디렉터리:**

```text
~/docs/blog-drafts
```

**발행 글 SSOT (겹침 체크):**

```text
https://changbaebang.github.io/
```

발행 초안(`YYYY-MM-DD-<slug>.md`)과 분리한다.  
주제 후보는 `YYYY-MM-DD-topic-radar.md`에만 저장한다.

---

## Arguments

| 모드 | 설명 |
|------|------|
| `scan` (기본) | 소스 스캔 → 주제 후보 파일 생성/갱신 |
| `pick` | 기존 radar 파일에서 **오늘 쓸 1개** 추천 |
| `open` | 최근 radar 파일 Cursor에서 열기 |

- `--days N`: 최근 N일(기본 7) 발표/기사만 본다.

---

## Sources (MUST scan across categories)

| 카테고리 | 우선 소스 |
|----------|-----------|
| Google Web/Chrome | `user.com/blog`, `user.com` |
| Google Cloud | `user.com/blog` |
| Azure | `user.com/azure`, Microsoft Build/Azure announcements |
| React | `react.dev/blog`, `user.com/facebook/react/releases` |
| GeekNews | `news.hada.io` (시그널용, SSOT 아님) |

GeekNews는 **링크 허브**로만 사용한다.  
원문(공식 블로그/릴리즈 노트)을 반드시 교차 확인한다.

---

## Selection rules (MUST)

### GO (추천)

- FE가 **이번 주 안에** 적용/실험할 수 있는 주제
- 운영·검증·인터페이스·성능·안전 경계처럼 **실천형**으로 쓸 수 있음
- 기존 글 시리즈와 연결 가능 (MCP, my-cursor, E2E, 리뷰 운영)

### MAYBE (보류)

- 발표는 있으나 아직 Preview/OT/Rollout 초기
- 주제는 좋지만 최근 발행 글과 겹침이 큼
- **본인이 아직 깊이 이해하지 못한 주제** → `/cb:learn-radar add` 후 STUDY (promote → blog)
- 커머스/인프라 비중이 커서 FE 각도 재가공 필요

### PASS (제외)

- 제품 마케팅/채용/투자 뉴스만 있는 항목
- "무엇이 나왔다" 수준 요약만 가능한 항목
- 근거 링크가 불명확하거나 원문 확인 불가

---

## Output file (MUST)

```text
~/docs/blog-drafts/YYYY-MM-DD-topic-radar.md
```

날짜 = **오늘(KST)** unless user specifies.

### Template

```markdown
---
layout: page
title: "Blog topic radar — YYYY-MM-DD"
date: YYYY-MM-DD HH:MM:SS +0900
tags: [blog, radar, topics]
---

# Blog topic radar — YYYY-MM-DD

## TL;DR
- scanned: Google Web, Google Cloud, Azure, React, GeekNews
- candidates: N (GO x / MAYBE y / PASS z)
- write today: <title suggestion>

## 오늘 추천 1개
- 제목 후보:
- 왜 지금:
- 글 각도(가이드/체크리스트/실전 시나리오):
- 예상 slug:
- 다음 명령: `/cb:blog draft <slug>`

## 후보 목록

| 우선순위 | 주제 | FE 관점 한 줄 | 글 각도 | 겹침 | 원문 |
|----------|------|---------------|---------|------|------|
| GO | ... | ... | ... | 없음/낮음 | [link](...) |

## PASS (요약)
- ...

## 기존 글과 연결
- [관련 발행 글](https://changbaebang.github.io/...)
```

---

## Workflow

### Step 1 — scan

1. 소스별 최근 `--days` 항목 수집
2. changbaebang.github.io 최근 글 제목 확인 (겹침 방지)
3. 후보 5~7개 선별 (`GO/MAYBE/PASS`)
4. `YYYY-MM-DD-topic-radar.md` 작성 또는 갱신

### Step 2 — pick

1. 최신 `*-topic-radar.md` 읽기
2. `GO` 중 1개를 **오늘 발행 추천**으로 고정
3. 제목/slug/글 각도/첫 3문장 훅 제안

### Step 3 — open

```bash
cursor "~/docs/blog-drafts/<latest-topic-radar>.md"
```

---

## Tone alignment (MUST)

사용자 블로그 톤:

- 서베이 나열 금지
- **실전 운영 기록 + 바로 실행 가능한 체크리스트**
- 도구 소개보다 **경계/검증/복구/운영 루프**

참고 시리즈:

- MCP/에이전트 운영
- my-cursor 자동화 레이어
- E2E/리뷰/협업 운영

---

## Output (항상, Korean)

```markdown
## Result
- mode: scan | pick | open
- path: ~/docs/blog-drafts/YYYY-MM-DD-topic-radar.md
- candidates: GO n / MAYBE n / PASS n
- recommended: <title>

## Next
- `/cb:blog draft <slug>`
- `/cb:blog publish-check` before publish
```

---

## Usage

```text
/cb:blog-radar
/cb:blog-radar scan --days 7
/cb:blog-radar pick
/cb:blog-radar open
```

## Related

- [`blog-radar`](blog-radar.md)
- [`learn-radar`](learn-radar.md) — 깊이 부족 시 학습 backlog
- [`blog-draft` skill](../../../skills/blog-draft/SKILL.md)
