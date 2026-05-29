# slack-work-kickoff 예시

## 예시 1 — 일정 미공유 + 빈 Jira

**입력**

```text
/cb:slack-work-kickoff https://user.com/archives/C0000000000/p1779163206882539
```

**앵커 스레드 요약**

- Satine: Eng OKR (치훈/재호), Header/Footer/GNB 통합, **목요일 치훈님 다운로드** 약속
- Jira: PROJ-123 (본문 없음)

**업무 정의 (발췌)**

| 항목 | 내용 |
|------|------|
| 한 줄 | H/F/GNB 통합 Eng OKR — 담당 일정·범위 확인 필요 |
| 담당 | 변치훈 (일정 다운로드 약속) |
| 기한 | 목요일 (오늘 기준 follow-up) |

**게시 채널:** `#29-team-frontend-스몰톡`

**메시지 초안 (발췌)**

> 치훈님, 목요일 일정 다운로드 약속 … PROJ-123 본문 비어 있음 … 오늘 일정 공유 부탁

---

## 예시 2 — 담당자 불명확

검색 후에도 오너가 2명이면:

```markdown
### 담당자 후보
| 후보 | 근거 | 확신도 |
| 치훈 | OKR 멘션, 일정 약속 | 높음 |
| 재호 | OKR 멘션 | 중간 |

오픈 질문: 일정·구현 오너가 치훈 단독인지, 재호와 분담인지?
```

→ Slack 게시 **전** 사용자에게 1문장 확인.

---

## 예시 2b — 답변 후 follow-up + 문서 준비

**입력**

```text
/cb:slack-work-kickoff https://user.com/archives/C0000000000/p1779335419029609?thread_ts=1779331841.368609
```

**스레드 답변**

- 치훈: 목요일 미룸 → **오늘 오후** 일정 / **캘린더 초대** / Jira 업데이트

**Phase B**

- Jira PROJ-123 → Confluence 3건 + `docs/workstreams/header-footer-cleanup`
- 캘린더: 사용자가 Google Calendar에서 초대 시각 확인 후 전달 (MCP 없음)
- 산출물: 작업 준비 + `/cb:work-triage PROJ-123` 제안

---

## 예시 3 — PR 리뷰 요청으로 오인

스레드에 `pull/1234`만 있고 “리뷰 부탁”이면:

- 이 스킬 중단 → `/cb:slack-pr-review <permalink> 1234` 안내
