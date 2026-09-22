# 민원팩토리 홈페이지 소개 문구 근거

확인일: 2026-09-21. 대상: `D:\Minwon_Factory_Migration`, HEAD `60d6987`.

사용자의 요청에 따라 개발 중인 저장소를 읽기 전용으로 분석하고, 홈페이지 `index.html`의 민원팩토리 소개와 업무 흐름에 반영했다. 민원팩토리 저장소에는 쓰기·설치·실행을 하지 않았다. 조회 당시 기존 변경은 `.github/workflows/notify-discord.yml` 한 건이었다.

## 소개 방향

공공기관 담당자가 민원을 입력하고 AI 답변 초안을 생성한 뒤 검토·수정해 활용하는 업무 지원 도구로 소개한다. 회사 전체의 대상은 기존처럼 사람들의 업무 시간이며, 민원팩토리의 주요 사용 맥락만 공공기관 담당자로 설명한다. 개발 중 상태와 서비스 연결 준비 상태를 명시한다.

## 문구와 현재 코드의 연결

아래 경로는 모두 분석 대상 저장소 기준이다. 문서는 탐색에 참고했고 실제 구현 경로를 대조했다.

| 홈페이지에 반영한 내용 | 코드 근거 | 표현 범위 |
| --- | --- | --- |
| 직접 입력 및 엑셀·CSV 파일 입력 | `frontend/src/screens/home/HomeLanding.tsx`, `ManualInputForm.tsx`, `FileInputForm.tsx`, `frontend/src/lib/minwonSchema.ts` | 파일은 `.xlsx`·`.csv`. 최대 건수는 설정값이므로 홍보 수치로 고정하지 않음. |
| 민원 요약·카테고리 확인 | `backend/src/queue.ts`의 `runGeneration`, `backend/src/llm/generate.ts`의 `ollamaRequestSub`, `ollamaClassifyCategory` | AI 연동이 활성화된 경우의 구현. 정확도·자동 개인정보 제거 보장 없음. |
| 답변 요지와 양식 준비 | `frontend/src/screens/SubInputScreen.tsx`, `frontend/src/screens/subInput/AnswerFormatTabs.tsx` | 담당자가 답변 방향과 양식을 준비하는 흐름. |
| 답변 초안 생성 및 진행 상황 | `backend/src/llm/generate.ts`의 `ollamaRequest`, `lawOllamaRequest`, `backend/src/queue.ts`의 `task_progress` | 실제 모델·연결 설정에 의존. 속도·동시 처리 성능을 주장하지 않음. |
| 수정·재생성 결과 비교·최종 답변 선택 | `frontend/src/screens/ResultScreen.tsx`, `frontend/src/screens/result/AnswerTabPanel.tsx`, `AnswerCompareView.tsx`, `ResultBottomBar.tsx` | 사람이 검토하는 활용 흐름을 설명. 모든 결과에 수동 확정을 강제하는 시스템이라고 표현하지 않음. |
| 복사·엑셀·CSV 내려받기 | `frontend/src/screens/result/CopyButton.tsx`, `frontend/src/components/ScreenActions.tsx`, `backend/src/routes/history.ts`, `backend/src/exportFile.ts` | 담당자가 선택한 답변의 복사·파일 내보내기. 민원 자동 발송이나 외부 민원 시스템 접수·회신 연동을 주장하지 않음. |
| 관련 법률 검색·조문 참고 | `frontend/src/screens/subInput/AnswerFormatTabs.tsx`, `frontend/src/screens/result/ResultRightPanel.tsx`, `backend/src/llm/findLaw.ts`, `mcpClient.ts` | 법령 연동 설정에 따른 참고 기능. 법률적 정확성·최신성·적용 타당성 보장 없음. |
| 내 처리 이력 조회·필터 | `frontend/src/screens/history/HistoryFilters.tsx`, `backend/src/routes/history.ts` | 자신의 기록과 기간·카테고리 기반 확인. 민원 본문 전체의 서버 검색 기능으로 소개하지 않음. |
| 생성·활용 현황, 카테고리·평가 통계 | `frontend/src/screens/static/ContentTab.tsx`, `statLabels.ts`, `backend/src/routes/static.ts`, `backend/src/staticStats.ts` | 이력 및 통계 설정에 의존. 실제 수치나 시간 절감 성과를 만들지 않음. |

## 서비스 아이콘

`frontend/public/favicon.png`는 민원팩토리의 파비콘이자 로그인 화면(`frontend/src/screens/LoginScreen.tsx`)에서 쓰는 현재 아이콘이다. 2026-09-21에 홈페이지 `assets/brand/minwon-factory-icon.png`로 원본 그대로 복사했다. 아이콘이 바뀌면 이 파일을 교체한다.

## 반영하지 않은 내용

- RAG·유사 답변: 화면/필드 흔적과 실제 연동을 구분해야 하므로 소개에서 제외했다. `generate.ts`에는 RAG 전용 경로가 범위 밖이라는 주석이 있다.
- 내부 문서의 실증 기록, 기관명, 기본 설정에 등장하는 기관: 공개 고객사·도입 성과로 전환하지 않았다.
- 폐쇄망 완전 지원, 외부 전송 없음, 보안 인증 및 규정 준수: 배포 환경과 외부 연결·검증에 의존하므로 홍보하지 않았다.
- 모델명·API 주소·내부 구조·접속 정보: 홈페이지 이용자에게 필요한 소개 정보가 아니므로 노출하지 않았다.
- 실제 민원 데이터·샘플 파일·계정·환경변수: 사용하거나 복사하지 않았다.
- 제품 화면: 기존 브랜드 그래픽을 유지하고 실제 서비스 화면이 아님을 표시했다.

## 검증의 범위

기능 근거는 소스 정적 분석이다. 민원팩토리의 DB, AI 추론, 법령 연결, 배포 상태에 대한 실행 검증이 아니다. 홈페이지에서 실제 서비스를 실행하거나 입력을 수집하지 않는다. 공개 서비스 URL·문의 수신 경로·정식 제공 범위는 추후 확정이 필요하다.

홈페이지는 빌드·스크립트 구문 검사와 로컬 HTTP 응답을 확인했다. Headless Edge에서 라이트·다크 각각 320·390·1024·1440px의 가로 넘침, 테마, 로고, 앵커, 안내창 포커스, 모션 감소 검사를 통과했고 모바일·데스크톱 이미지를 검수했다. 분석 후 민원팩토리 Git 변경 목록은 시작 시점과 동일하다.
