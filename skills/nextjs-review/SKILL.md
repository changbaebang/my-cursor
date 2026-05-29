---
name: nextjs-review
description: >-
  Next.js monorepo review with Content/Gateway/Client classification; Gateway searchParams
  redirect false-positive guard. Use for /cb:nextjs-review, [your-label][기본] Nextjs, use client,
  or App Router review.
disable-model-invocation: true
---

# Next.js review (personal)

Slash: **`/cb:nextjs-review [pr]`**

Rules: `~/.cursor/commands/cb/nextjs-review.md`

- State route classification first.
- Gateway: server redirect OK; security-first.
- REQUEST_CHANGES only with user impact evidence.
