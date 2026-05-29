---
command: '/cb:blog-publish'
category: 'Writing'
purpose: 'blog-drafts 발행본을 _posts로 커밋·푸시'
description: >-
  publish-check를 통과한 blog-drafts 글을 Jekyll _posts로 복사하고 commit/push한다.
  push 후 live URL 200을 확인하고 closeout까지 수행한다.
argument-hint: '<YYYY-MM-DD-slug.md> [--repo /abs/path/to/blog-repo] [--branch master]'
---

# /cb:blog-publish

`/cb:blog publish-check` 이후의 발행 단계를 고정 순서로 실행한다.

## 기본 경로

- drafts: `~/docs/blog-drafts`
- blog repo: `~/Codes/changbaebang.github.io`
- posts: `<blog repo>/_posts`

## 실행 순서 (MUST)

1. 입력 파일 존재 확인 (`blog-drafts/YYYY-MM-DD-slug.md`)
2. front matter `date` 확인 (`+0900` 포함)
3. permalink 날짜 계산 (repo timezone 기준: `_config.yml`)
4. `_posts/YYYY-MM-DD-slug.md`로 복사
5. `git add` → `git commit` → `git push`
6. live URL `curl` 200 확인 (최대 2분)
7. 성공 시 draft 삭제 + 결과 리포트

## 안전 규칙

- `publish-check` 미통과 상태면 중단
- `_posts` 직접 수정이 아닌 draft 원본을 복사
- push 실패 또는 URL 404 지속 시 draft 삭제 금지

## 출력 형식

```markdown
## blog publish
- source: /Users/.../docs/blog-drafts/...
- target: /Users/.../changbaebang.github.io/_posts/...
- commit: <sha>
- live: https://changbaebang.github.io/... (200)
- closeout: draft deleted
```
