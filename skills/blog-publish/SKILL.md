---
name: blog-publish
description: Publish a checked blog draft to Jekyll _posts with commit/push and live URL verification.
disable-model-invocation: true
---

# Blog publish

Slash: **`/cb:blog-publish`**

Use this skill when the user explicitly asks to publish a post after `publish-check`.

## What this skill does

- Takes one draft from `~/docs/blog-drafts`
- Copies it to `~/Codes/changbaebang.github.io/_posts` using permalink date rules
- Commits and pushes to the blog repo
- Verifies live URL returns 200
- Deletes draft only after live verification succeeds

## Preconditions

- User gave explicit publish intent (`올려줘`, `발행하자`, `push해줘`)
- Draft has passed `/cb:blog publish-check`

## Guardrails

- Never delete draft before live URL 200
- If push or live check fails, stop and report blocker
- Keep Korean output with commit SHA + URL status
