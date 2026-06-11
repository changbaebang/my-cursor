# Diff 코드 리뷰 체크리스트 (Slack PR 리뷰용)

`slack-pr-review` 스킬 §4.1에서 참조한다. **PR 메타**(제목·라벨·Tier)는 `29CM-fe` `pr-review` 스킬, **코드 본문**은 여기 + diff 신호 스캔.

## Approve 전 최소 바 (rubber-stamp 방지)

다음을 **모두** 만족한 뒤에만 Approve한다. 사용자가 「부드럽게」「가볍게」를 요청해도 **동일**하다. 톤만 부드럽게, **깊이는 유지**.

| # | 확인 |
|---|------|
| 1 | `gh pr diff` 또는 로컬 `git diff`로 **변경 파일 목록**을 본다 |
| 2 | 삭제·mock 제거·스키마·공유 컴포넌트 변경이 있으면 **해당 hunk**를 읽는다 |
| 3 | 아래 **신호 스캔**을 돌리고, 걸린 항목마다 **의도 확인** 또는 GitHub 코멘트 1줄 |
| 4 | Approve 본문에 **「설명이 필요한 변경」**이 있으면 최소 1문장 남긴다 (Slack에는 요약만) |

**하지 말 것**

- PR 본문·테스트 통과만 보고 Approve
- diff가 크다고 signal scan 생략
- 팀원이 나중에 질문할 법한 한 줄 변경(`!= null`, mock 삭제)을 **코멘트 없이** 통과

## 신호 스캔 (diff)

PR diff에 대해 아래를 검색한다. 매칭되면 **해당 파일 hunk**를 읽는다.

**권장 (스크립트):**

```bash
node "$HOME/.cursor/skills/slack-pr-review/scripts/scan-diff-signals.mjs" \
  --repo 29CM-Developers/frontend-29cm-platform --pr <N>
```

**수동 (grep):**

```bash
export GH_TOKEN="$(env -u GH_TOKEN -u GITHUB_AUTH_TOKEN gh auth token)"
gh pr diff <N> --repo <owner/repo> | grep -E '^[\+\-].*(' \
  '!= null|!== null|== null|=== null|' \
  'mock|__mocks__|enrich.*Mock|deriveMock|' \
  ' as [A-Z]|as any|@ts-ignore|@ts-expect-error|' \
  'optional\(|v\.optional|default\(false\)|' \
  'ReactNode|forwardRef|공유|BrandCard|ruler' \
')' || true
```

로컬 브랜치가 있으면:

```bash
git diff origin/main...HEAD -- '*.ts' '*.tsx' | grep -E '^[\+\-].*(!= null|mock|as )' || true
```

| 신호 | 왜 짚는가 | Approve 시 GitHub에 남길 것 |
|------|-----------|---------------------------|
| `!== null` → `!= null` (또는 반대) | optional prop·API `undefined`와 혼동 소지 | 타입이 `T \| null \| undefined`면 `!= null`이 맞는지, 아니면 strict로 통일할지 **1문장** |
| mock / `__mocks__` 삭제 | 실 API·fallback 누락 시 조용한 회귀 | 대체 경로(product-detail, flag, default) 확인 여부 |
| `isBrandCartCoupon` 등 **계약 필드** 변경 | BE 스펙·다른 앱 `couponSource` 혼동 | PR 본문 Oracle과 diff 일치 여부 |
| 공유 컴포넌트 (`ruler`, `BrandCard` 등) | 옵셔널 prop 추가도 739+ 사용처 | 옵셔널·미전달 시 기존 UI 동일한지 |
| `as ProductDetail` / valibot 스키마 | unknown key strip → CSR 데이터 소실 | V5/V6 둘 다 스키마에 필드 있는지 |
| 링크·deeplink·`sort=` 변경 | QA·다른 팀이 모를 수 있음 | Slack **팀 공유 포인트** 후보 |

## 패턴별 판단 메모 (29CM frontend)

### `!= null` vs `!== null`

- prop/필드 타입이 `T | null | undefined` 또는 optional(`?:`)이면 **`!= null`은 null·undefined 둘 다 제외** — mock 제거 후 실 API 연동에서 흔한 **의도적** 변경.
- 레포 전반에 `!= null` 관용구가 이미 많음 (biome이 일괄 금지하지 않음).
- **리뷰어가 할 일**: 틀렸다고 Request changes 하기보다, **「optional API 필드라 != null로 통일한 것으로 이해」**를 GitHub에 한 줄 남겨 팀 오해를 막는다.
- 팀이 strict만 허용하면: `value !== null && value !== undefined` 또는 헬퍼 — **작성자와 합의** 후 Request changes.

### Mock 제거 PR

- [ ] mock 호출부가 **실 데이터 경로**로 바뀌었는가 (`useProductDetail`, API 스키마 등)
- [ ] enrich/transform mock 파일·테스트가 같이 삭제됐는가
- [ ] `format*` / `pickFirst*` 유틸이 **객체는 있으나 필드 null**인 BE 응답을 안전히 처리하는가
- [ ] PR 본문 Fallback·Oracle과 diff가 맞는가

### 「부드러운」 톤 (사용자 요청 시)

| 채널 | 규칙 |
|------|------|
| **GitHub** | Approve 가능해도 **논쟁 소지 1~2건은 🟡로 짧게** (칭찬 bullet 남발 금지). `!= null` 등은 「이해했습니다」 한 줄 |
| **Slack** | §5.2 유지 — 팀 공유 포인트 + 🟡만. 구현 칭찬 나열 금지 |
| **Request changes** | 부드럽게 ≠ 넘기기. 🔴 블로커는 명확히 |

## GitHub Approve 본문 템플릿 (최소)

```markdown
{작성자}님 — Approve

{한 줄 총평}

{설명이 필요한 변경 — 있으면 1~2문장, 없으면 생략}
예: `cartCouponBadge`가 optional+nullable이라 `!= null`로 undefined까지 막은 변경으로 이해했습니다.

🟡 {non-blocking — PR 본문에 비어 있는 테스트 체크리스트 등}
```

## 사후 제보 대응

팀원이 「이걸 승인해?」라고 하면:

1. 해당 diff hunk 재확인
2. 의도가 맞았으면 GitHub **follow-up comment**로 맥락 보충 (사과·메타 금지 — §5.1)
3. 스킬/체크리스트에 빠진 신호가 있으면 이 파일에 항목 추가
