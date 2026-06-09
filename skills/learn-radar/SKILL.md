---
name: learn-radar
description: >-
  Builds and prioritizes a personal learning backlog (videos, articles, papers)
  separate from blog-drafts. Use for /cb:learn-radar, 배워야 할 것, study backlog,
  learning queue, or promoting learned topics to /cb:blog draft input.
disable-model-invocation: true
---

# Learn radar

Slash: **`/cb:learn-radar`**

Full rules: read `~/.cursor/commands/cb/learn-radar.md` and follow exactly.

## Quick rules

- Goal: **what to learn**, not what to publish yet.
- SSOT: `/Users/your-org/docs/learning-backlog/`
- Radar file: `YYYY-MM-DD-learn-radar.md`
- Items: `items/YYYY-MM-DD-<slug>.md` with `status: queued | in-progress | done | blog-ready`
- After learning: **`promote`** → `/cb:blog draft` input in `blog-drafts`
