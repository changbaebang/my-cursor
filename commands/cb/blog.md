---
command: '/cb:blog'
category: 'Writing'
purpose: '블로그 회고 초안 — docs/blog-drafts 저장·식별자+SEO 점검·퇴고'
description: >-
  작업/에픽 회고 또는 외부 글 큐레이션을 Jekyll front matter 형식으로 blog-drafts에 저장한다.
  curate는 번역 없이 소개+요약+원문 링크. publish-check로 회사 식별+SEO 1분 체크.
argument-hint: '[draft|curate|publish-check|open|closeout] [slug-or-path] [--from-work-closeout]'
---

# /cb:blog — Blog drafts (personal)

## SSOT (MUST)

**원고 디렉터리 (단일):**

```text
~/docs/blog-drafts
```

`~/.cursor/blog/`는 **이전 경로** — 새 글은 `blog-drafts`에만 쓴다.

점검표: `~/docs/blog-drafts/PUBLISH-C0000000000.md`

---

## Arguments

| 모드 | 설명 |
|------|------|
| `draft` (기본) | 새 회고 초안 생성 또는 기존 파일 보강 |
| `curate` | **외부 글 큐레이션** — 소개 + 한 줄 요약 + 원문 링크 (전문 번역 X) |
| `publish-check` | 회사 식별 스캔 + SEO 1분 체크 + 퇴고 제안 (`.internal.md` ↔ 발행본 분리) |
| `open` | 최근/지정 파일을 Cursor에서 열기 (`cursor <path>`) |
| `closeout` | 발행 마무리 — Step 6 (초안·internal 삭제) |

- `slug`: `example-api-migration-skills` → 파일명 `YYYY-MM-DD-<slug>.md`
- `--from-work-closeout`: 직전 대화의 Jira·PR·배운 점을 초안에 반영

---

## File naming (MUST)

```text
~/docs/blog-drafts/YYYY-MM-DD-<slug>.md           # 발행용
~/docs/blog-drafts/YYYY-MM-DD-<slug>.internal.md  # 내부 링크·티켓
```

날짜 = **오늘(KST)** unless user specifies. → 아래 **KST 날짜 규칙** 필수.

기존 시리즈 톤 참고: 같은 폴더의 `2026-05-20-ai-review-cost-retro-v2.md` 등 front matter.

---

## KST 날짜 규칙 (MUST)

에이전트 세션의 “오늘”은 **신뢰하지 않는다.** 사용자가 직접 날짜를 확인하는 경우가 많다.

### 우선순위

1. 사용자 메시지의 `<timestamp>` (있으면 **이것이 SSOT**)
2. 사용자가 말한 “오늘/내일” + 확인된 KST 날짜
3. 셸: `TZ=Asia/Seoul date '+%Y-%m-%d %H:%M:%S %z'`
4. **확실하지 않으면 한 줄 질문:** “KST 발행일 `YYYY-MM-DD` 맞나요?”

### `_posts` 파일명 ↔ permalink (MUST — Jekyll)

블로그 `_config.yml`의 `timezone: America/Vancouver` 때문에 **permalink 날짜 ≠ front matter KST 날짜**일 수 있다.

| 항목 | 규칙 |
|------|------|
| **front matter `date`** | KST `+0900` — 글에 표시되는 발행 시각 |
| **`_posts/YYYY-MM-DD-slug.md` prefix** | **실제 permalink URL의 `YYYY-MM-DD`** 와 일치 |
| **내부 링크** | 파일명·KST 날짜 추측 금지 — **live URL** 또는 permalink 기준 |

새벽 KST(00:00~08:59) 발행은 Vancouver 변환으로 URL이 **하루 전**이 될 수 있다.  
예: `date: 2026-05-25 01:44 +0900` → URL `/2026-05-24-.../`

### blog-drafts (초안)

```text
blog-drafts/2026-05-23-slug.md
         ↓ KST 날짜 (작성일)
date: 2026-05-23 21:00:00 +0900
```

`_posts`로 옮길 때 **파일명 prefix를 permalink 날짜로 조정**한다 (front matter KST는 유지 가능).

### publish-check 날짜·링크 항목

- `_posts` filename prefix = **예상 permalink** `YYYY-MM-DD`: OK | **불일치**
- front matter `date` timezone `+0900`: OK | 누락
- 내부 `your-username.github.io/YYYY-MM-DD-` 링크: **404 없음** (기존 발행글 URL 기준)

---

## GitHub `_posts` push (MUST NOT 기본)

**기본:** `blog-drafts`에 초안만 둔다. **`_posts`는 발행 파이프라인 마지막 단계.**

### 발행 파이프라인 (MUST — 순서 고정)

에이전트는 **아래 순서를 건너뛰지 않는다.**

| Step | 동작 | 완료 조건 |
|------|------|-----------|
| 1 | `blog-drafts/YYYY-MM-DD-<slug>.md` 작성·보강 | 파일이 **blog-drafts에만** 존재 |
| 2 | `/cb:blog publish-check <file>` | 🔴 0건 또는 사용자가 수정 수락 |
| 3 | **사용자 퇴고** | 사용자가 직접 수정 · “퇴고해줘” 반영 · “OK” |
| 4 | 사용자 **명시적 발행 지시** | “올려줘” “commit해서 발행” “push” 등 |
| 5 | blog-drafts → `_posts` 복사 | blog-drafts 내용 = 복사 원본 |
| 6 | `git commit` + `git push` (블로그 repo) | push 완료 |
| 6b | **live URL 확인** (Step 5b) | permalink `curl` **200** (최대 ~2분) |
| 7 | Step 6 closeout | 6b 통과 후 blog-drafts 초안 **삭제** · README 최근 발행 갱신 |

### MUST NOT (발행)

- **blog-drafts 없이** `_posts`에 직접 `Write`
- **publish-check 없이** `_posts` push
- **사용자 퇴고·승인 없이** `_posts` push
- 아래 표현만으로 Step 4 생략:
  - “발행할 **수준**으로”
  - “정리해줘”
  - “만들어보는 것은?”
  → 이 경우 **Step 1~3까지만** (초안 + publish-check + 퇴고 대기)

### Step 4로 인정되는 발행 지시 (예)

- “올려줘” / “발행해” / “commit해서 발행” / “push해줘”
- publish-check·퇴고 **이후** “이대로 올리자”

### `_posts` push 시 추가 확인

- publish-check 결과 🔴 반영 완료
- `_posts` filename prefix = **permalink URL**의 `YYYY-MM-DD` (Vancouver — KST 새벽이면 하루 전 URL 가능)
- front matter `date`는 KST `+0900`
- push 직후 **closeout 하지 않는다** → Step 5b 통과 후 closeout

**하지 않는 것:** publish-check·퇴고·명시적 발행 지시 없이 `_posts` 자동 push

### Step 5b — live URL 확인 후 closeout (MUST)

agent가 push했거나, 사용자가 “올렸어”라고 한 **뒤** — 초안 삭제·README 갱신 **전에** permalink가 살아 있는지 확인한다.

1. URL = `https://your-username.github.io` + front matter `permalink` (없으면 `/_posts` 파일명 slug로 추정하지 말고 front matter·발행본에서 확인)
2. `curl -s -o /dev/null -w "%{http_code}" -L "<url>"` — **200**일 때까지 대기
3. 폴링 간격: **30s → 60s → 90s** (합계 ~2분). 200이면 즉시 다음 단계
4. 200이면 → Step 6 closeout + `blog-drafts/README.md` 최근 발행 표에 URL 한 줄 추가
5. 404 지속이면 → closeout **보류**, 사용자에게 “GitHub Pages 빌드 대기 중” + URL 보고

**하지 않는 것:** push만 하고 404인데 blog-drafts 초안 삭제

---

## Step 1 — draft: front matter

```yaml
---
layout: post
title: "<한 줄 제목>"
date: YYYY-MM-DD HH:MM:SS +0900
tags: [cursor, retrospective, ...]
---
```

본문 첫 블록 (기존 글과 동일 톤):

```markdown
> 내부 private repo 작업을 바탕으로 썼다.
> 외부 접근이 불가한 저장소라 링크 없이, 번호·익명화 중심으로 정리한다.
```

---

## Step 2 — draft: 본문 구조 (권장)

1. **한 줄 요약** / TL;DR
2. **배경·문제**
3. **접근** (에픽 쪼개기, 브랜치, grep AC 등 — **사실만**)
4. **도구** (`/cb:*`, Cursor MCP — 스킬은 `~/.cursor/commands/cb` 참조)
5. **배운 것** (3~5개)
6. (선택) 부록 — 공개 가능한 스킬 규칙 요약

**하지 않는 것**: 과장, 없는 수치, 팀원 실명 비판

---

## Step 2b — curate: 큐레이션 (MUST when `curate`)

외부 글·논문·발표를 **알리는** 짧은 포스트. 회고(`draft`)와 파일 규칙은 동일.

### 하지 않는 것 (MUST NOT)

- 원문 **전문 번역**·재게시 (저작권·SEO·차별화)
- 원문 없이 **권위 있는 해설**처럼 장문 논평
- 12개 항목 **전부 장문 각색** (그건 `draft`로 별도 글)

### 하는 것 (MUST)

- 제목에 **큐레이션/읽을거리** 성격이 드러나게 (또는 본문 첫 인용에 명시)
- **원문 URL**을 상단·하단 **2회** 이상 (canonical)
- 본문 맨 아래: `이 포스트는 원문의 번역·재게시가 아닙니다.`
- 작성자·출처·날짜 (알 수 있으면)

### 권장 구조

```markdown
> 번역 글이 아니다. 읽어볼 가치가 있는 글을 알리는 메모다.

## 왜 북마크했는가
(1~3문단, 개인 직감·실무 연결 — 해설가 톤 금지)

**원문:** [title](url)

## N가지 — 한 줄씩만 (요약)
1. **제목** — 한 줄
...

## 마치며
한 줄 결 + 원문 링크 재확인

## 읽을 거리
- 원문 (필수)
- 내 블로그 관련 글 1~2개 (내부 링크)
```

### slug 예

`twelve-ways-wrong-ai-coding-curation`, `webauthn-immediate-ui-reading-note`

### publish-check (curate 추가)

- 원문 링크 2회+: OK | 보완
- “번역·재게시 아님” 문구: OK | **필수 추가**
- 한 줄 요약만 있고 원문 장문 인용 없음: OK

---

## Step 3 — publish-check (MUST read checklist)

**`_posts` push 전 필수.** publish-check 없이 발행하지 않는다.

`PUBLISH-C0000000000.md` 기준으로 현재 파일 스캔.
회사 식별 + SEO + **맞춤법·용어**(예: 착륙/착수) 항목을 함께 확인한다.

출력:

```markdown
## publish-check: <filename>

### 🔴 수정 필요 (N건)
- L42: internal-slack-host → 삭제
- ...

### 🟡 검토 (N건)
- -org/apis-heart → @ae/... 여부

### 🟢 OK

### 🔵 SEO 1분 체크
- title 키워드: OK | 보완
- 첫 문단 키워드: OK | 보완
- **날짜:** filename `YYYY-MM-DD` = front matter `date` (KST +0900): OK | **불일치**
- 내부 링크 2~3개: OK | 보완
- 외부 레퍼런스 2개+: OK | 보완

### ✏️ 문장·용어 (publish-check 추가)
- 동음/유사어 오타 (착륙/착수, 선언/선포 문맥 등): OK | **수정**
- “우리 회사” 등 특정 조직 암시 → 일반화 필요: OK | **수정**

### 제안
- `.internal.md`에 링크·Jira 이동
- 발행본에서 PR #6955 → "마지막 PR"
```

사용자가 "퇴고해줘"면 발행본에 반영 (internal은 유지).

---

## Step 4 — open

```bash
cursor "~/docs/blog-drafts/<latest-or-given>.md"
```

`open` without path → `ls -t` 최신 `*.md` (`.internal.md` 제외 우선).

---

## Step 5 — work-closeout 연계

`work-closeout` 직후 사용자가 "블로그 쓰자" / `/cb:blog` →

- 에픽·티켓·PR 목록은 **internal** 파일에
- 발행용은 마스킹 버전 자동 생성 제안

---

## Step 6 — 발행 마무리 (MUST)

**전제:** Step 5b에서 live URL **200** 확인 (agent push 또는 사용자 “올렸어” 모두 동일).

본문 SSOT는 **블로그 repo** — `blog-drafts` 초안은 임시이므로 **삭제**한다.

### 6.1 초안 삭제 (MUST)

아래 파일을 **삭제**한다 (Step 5b 통과 후 — 사용자 확인 없이 진행해도 됨):

```text
~/docs/blog-drafts/YYYY-MM-DD-<slug>.md
~/docs/blog-drafts/YYYY-MM-DD-<slug>.internal.md
```

**하지 않는 것**: 발행본을 `blog-drafts`에 “보관”으로 남기기 — 중복·식별자 유출 위험.

### 6.2 출력

```markdown
## blog closeout
- live: https://your-username.github.io/... (HTTP 200)
- deleted: <slug>.md, <slug>.internal.md
- body SSOT: Jekyll blog repo
```

---

## Output (항상, Korean)

## Result
- mode: draft | curate | publish-check | open | closeout
- path: ~/docs/blog-drafts/...
- action: created | updated | scanned | opened | deleted-drafts

## Next
- **발행 전:** publish-check → 사용자 퇴고 → 명시적 “올려줘” 후에만 `_posts`
- velog 붙여넣기 전 front matter `title`/`tags` 확인

---

## Usage

```text
/cb:blog
/cb:blog curate twelve-ways-wrong-ai-coding-curation
/cb:blog draft example-api-migration-skills
/cb:blog publish-check 2026-05-20-example-api-migration-skills.md
/cb:blog open
/cb:blog open 2026-05-20-example-api-migration-skills.md
/cb:blog closeout example-api-migration-skills --url https://your-username.github.io/...
```

## Related

- [`blog-radar`](blog-radar.md)
- [`learn-radar`](learn-radar.md)
- [`work-closeout`](work-closeout.md)
- [`docs/your-epic-example.md`](docs/your-epic-example.md) — 에픽 회고 소스
- [`cb-guide`](cb-guide.md)
