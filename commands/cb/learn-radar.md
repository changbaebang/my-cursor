---
command: '/cb:learn-radar'
category: 'Writing'
purpose: '학습 백로그 — 배워야 할 영상·글·논문 목록화 및 블로그 초안 input 연결'
description: >-
  GeekNews·직접 추가 URL·기존 backlog를 스캔해 학습 후보를 선별한다.
  직접 학습 후 promote로 blog-drafts 초안 input을 만든다. blog-radar(쓸 주제)와 분리.
argument-hint: '[scan|add|pick|done|promote|open] [url-or-slug] [--area AREA]'
---

# /cb:learn-radar — Learning backlog (personal)

## SSOT (MUST)

**학습 백로그 디렉터리:**

```text
/Users/your-org/docs/learning-backlog/
├── README.md
├── YYYY-MM-DD-learn-radar.md    # 스캔 결과 (blog topic-radar와 동일 역할)
└── items/
    └── YYYY-MM-DD-<slug>.md     # 학습 항목 1개 = 파일 1개
```

**블로그 초안 (promote 출력):**

```text
/Users/your-org/docs/blog-drafts/YYYY-MM-DD-<blog-slug>.md
```

**발행 SSOT (겹침·중복 체크):**

```text
https://changbaebang.github.io/
```

`blog-drafts` = **쓸 글**. `learning-backlog` = **배울 것**. 섞지 않는다.

---

## Arguments

| 모드 | 설명 |
|------|------|
| `scan` (기본) | backlog + 시그널 소스 → `learn-radar.md` 갱신 |
| `add <url>` | 항목 1개 추가 (`items/`) |
| `pick` | 이번 주 **학습 1~2개** 추천 |
| `done <slug>` | `status: done` + 학습 메모 (사용자 확인 후) |
| `promote <slug>` | `blog-ready` → **blog-drafts 초안 skeleton** 생성 |
| `open` | 최근 radar 또는 지정 item 열기 |

- `--area AREA`: 영역 태그 (아래 표)
- `--days N`: scan 시 GeekNews 등 최근 N일 (기본 14)

---

## Learning areas (tags)

| area | 예 |
|------|-----|
| `ai-metrics` | 생산성 측정, 연구 방법론, Third Bit류 |
| `agent-ops` | MCP, harness, Cursor, 에이전트 운영 |
| `fe-platform` | React, Chrome, Web API, 성능 |
| `collaboration` | 리뷰, 티켓, 팀 워크플로 |
| `stats-methods` | 실험 설계, 인과, Goodhart (깊은 측정) |

한 항목에 area 1~2개.

---

## Item file template (MUST)

```text
/Users/your-org/docs/learning-backlog/items/YYYY-MM-DD-<slug>.md
```

```markdown
---
type: learn-item
title: "<한 줄 제목>"
source: "<url>"
source_type: video | article | paper | course | talk
area: [ai-metrics]
status: queued
added: YYYY-MM-DD
blog_slug: ""
---

# <title>

## Why learn (1~3문장)
- 블로그·실무와 연결

## Source
- [link](url)
- format: video / article / …
- estimated: ? min (알면)

## After learning (직접 본 뒤 채움)
- 핵심 takeaway:
- 내 팀에 적용:
- 아직 모르는 것:

## Blog angle (promote 시 사용)
- 제목 후보:
- 글 각도: guide | checklist | curation | retro
- blog_slug: `<kebab-slug>`
```

### status 흐름

```text
queued → in-progress → done → blog-ready
                              ↓ promote
                         blog-drafts 초안
```

**에이전트는 `done`/`blog-ready`를 사용자가 “봤다/이해했다”고 할 때만 올린다.**

---

## scan workflow

1. `learning-backlog/items/*.md` — `queued` / `in-progress` 목록
2. 최근 `blog-drafts/*-topic-radar.md` — GO인데 깊이 부족한 주제 → **STUDY** 후보
3. GeekNews `news.hada.io` — 영상·논문·긴 글 링크 (시그널, SSOT 아님)
4. changbaebang.github.io — 이미 쓴 주제 제외

### learn-radar 출력 템플릿

```markdown
---
layout: page
title: "Learn radar — YYYY-MM-DD"
date: YYYY-MM-DD HH:MM:SS +0900
tags: [learn, radar, backlog]
---

# Learn radar — YYYY-MM-DD

## TL;DR
- items: N (NOW x / STUDY y / LATER z)
- learn this week: <title>

## 이번 주 추천 (1~2)
| 항목 | area | why now | source |
|------|------|---------|--------|

## NOW (바로 학습)
| slug | title | area | status |
|------|-------|------|--------|

## STUDY (blog-radar GO ↔ 깊이 필요)
| 주제 | blog-radar | learn item / source |
|------|------------|---------------------|

## LATER
- ...

## blog 연결 대기 (done / blog-ready)
| slug | blog_slug | next |
|------|-----------|------|
```

날짜 = **KST** — `blog.md` KST 규칙 동일 (`<timestamp>` 우선).

---

## add workflow

1. URL 메타(title) 확인 (fetch title only — **본문·영상 대체 요약 금지**)
2. `items/YYYY-MM-DD-<slug>.md` 생성, `status: queued`
3. `README.md` 항목 테이블 1행 추가

---

## promote workflow (→ blog input)

**전제:** item `status` is `done` or `blog-ready`, `## Blog angle` 채워짐.

1. `blog_slug` 확정 (item front matter 또는 Blog angle)
2. `blog-drafts/YYYY-MM-DD-<blog_slug>.md` 생성:

```markdown
---
layout: post
title: "<Blog angle 제목 후보>"
date: YYYY-MM-DD HH:MM:SS +0900
tags: [...]
learn_source: /Users/your-org/docs/learning-backlog/items/<item-file>.md
---

> 학습 백로그에서 promote. 원 학습: [title](source-url)

## TL;DR
(학습 메모에서 3~4 bullet — 사용자/에이전트가 학습 후 작성)

## 배경
(Why learn + After learning)

## ...
```

3. item `status: blog-ready`, `blog_slug` 갱신
4. 출력: `/cb:blog draft` 또는 `/cb:blog publish-check` 안내

**promote는 skeleton.** 퇴고·발행은 `/cb:blog` 규칙 (KST, 사용자 push).

---

## Selection rules

### NOW (추천)

- blog-radar GO인데 본인이 “아직 모른다”고 한 주제
- 실무에 **이번 주** 적용하려면 학습이 선행되는 것 (API, 측정, 도구)
- queued 오래된 항목 중 area가 이번 글 시리즈와 맞는 것

### LATER

- 흥미만 있고 글·실무 연결 불명확
- 선행 지식 많이 필요 (stats-methods 체인)

### PASS (scan에서 제외)

- 이미 발행한 주제와 동일
- 순수 뉴스·채용·투자

---

## blog 파이프라인 연결

```text
/cb:blog-radar scan     → 쓸 주제 후보
        ↓ (깊이 부족)
/cb:learn-radar add|scan → 배울 것 backlog
        ↓ (직접 학습)
/cb:learn-radar done
        ↓
/cb:learn-radar promote → blog-drafts skeleton
        ↓
/cb:blog draft / publish-check → 발행 (사용자)
```

---

## Output (항상, Korean)

```markdown
## Result
- mode: scan | add | pick | done | promote | open
- path: ...
- items: NOW n / STUDY n / ...

## Next
- `/cb:learn-radar pick`
- `/cb:blog draft <slug>` (after promote)
```

---

## Usage

```text
/cb:learn-radar
/cb:learn-radar add https://www.youtube.com/watch?v=TlpFc7x8SHo --area ai-metrics
/cb:learn-radar pick
/cb:learn-radar done youtube-ai-metrics-xxx
/cb:learn-radar promote youtube-ai-metrics-xxx
/cb:learn-radar open
```

## Related

- [`blog-radar`](blog-radar.md)
- [`blog`](blog.md)
