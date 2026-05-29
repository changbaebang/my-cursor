---
name: blog-draft
description: >-
  Write or polish blog posts in ~/docs/blog-drafts. Use for /cb:blog,
  블로그 초안, blog-drafts, velog 회고, curate (외부 글 큐레이션). publish-check includes
  SEO 1-minute check. After publish: delete drafts. NEVER push _posts without
  publish-check and explicit user publish approval.
disable-model-invocation: true
---

# Blog draft

Slash: **`/cb:blog`**

| 경로 | 역할 |
|------|------|
| `~/docs/blog-drafts/*.md` | **미발행** 초안만 (발행 후 삭제) |
| Jekyll 블로그 repo `_posts/` | 발행 본문 SSOT (복사·commit은 파이프라인 마지막) |

Rules: `~/.cursor/commands/cb/blog.md` — **KST** front matter · **`_posts` filename = permalink URL date** (site timezone Vancouver — KST 새벽 URL 하루 전 가능).

## 발행 파이프라인 (MUST — 순서 고정)

1. **blog-drafts**에만 초안 작성
2. **publish-check** — 결과를 사용자에게 출력 (🔴 있으면 수정 후 재검)
3. **사용자 퇴고** — OK 또는 수정 반영
4. 사용자 **명시적 발행** (“올려줘” “commit해서 발행” 등)
5. blog-drafts → `_posts` 복사 → commit/push
5b. **live URL poll** — permalink `curl` 200 (30s·60s·90s, ~2분). 404면 closeout 보류
6. **closeout** — 5b 통과 후 blog-drafts 삭제 · README 최근 발행 갱신

### MUST NOT

- blog-drafts 없이 `_posts`에 직접 작성
- publish-check·퇴고 없이 push
- “발행할 **수준**으로” “정리해줘”만으로 push (→ 초안+publish-check까지만)

주제: `/cb:blog-radar` → draft. **깊이 부족** → `/cb:learn-radar add`. 학습 후 **`promote`** → blog input. 외부 글 알림: `/cb:blog curate <slug>`.

**curate** / **Step 3 publish-check** / **Step 6 closeout** — `blog.md` 상세.
