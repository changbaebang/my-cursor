# Git MR 코멘트 — PRD 리뷰 요청 (복사용)

PR에 아래만 남기면 Cloud Agent(또는 `/cb:prd-review <pr>`)가 동일 기준으로 돌린다.

```markdown
[your-label] PRD

## PRD
- URL: https://example-org.atlassian.net/wiki/spaces/.../pages/...
- (선택) 본문 일부 붙여넣기

## 구현 참고
- PRD 대비 구현 일치도도 봐주세요.
```

**최소**: Confluence URL + `[your-label] PRD` 또는 `PRD` 키워드.  
**권장**: AC가 긴 PRD는 핵심 AC 섹션만 붙여넣기 (Confluence fetch 실패 대비).

---

## Agent Instructions에 넣을 한 줄 (Cloud)

> `~/.cursor/commands/cb/prd-review.md` 규칙을 따르고, 이 코멘트의 Confluence URL과 PR diff로 파트 A·B를 출력한다. 본문 없으면 판단 불가.
