# 상태 · 메모리 (p2-state-memory)

이 프로젝트의 상태는 **쿠키(인증)**, **Zustand(전역)**, **useReducer(게임 로컬)**, **React Query(서버)** 네 계층으로 나뉜다.

---

## 쿠키

| 키           | 형태           | 설정 시점                            | 만료 |
| ------------ | -------------- | ------------------------------------ | ---- |
| `user_token` | `{code}--{id}` | POST `/api/users` (사용자 생성 성공) | 1년  |

- `httpOnly: true` — JS에서 직접 접근 불가.
- 서버에서 사용자 식별: `user_token`을 분리해 `code`, `id`로 DB 조회.
- 클라이언트 → 서버 전달: `getMeServer()`가 `cookies()`로 읽어 `Cookie` 헤더에 직접 주입.

---

## Zustand 전역 상태 (`shared/model`)

### `useGameStore`

게임 종료·재시작·캐릭터 코멘트 흐름을 제어하는 핵심 스토어.

| 상태                | 타입                   | 역할                                      |
| ------------------- | ---------------------- | ----------------------------------------- |
| `finalScore`        | `number \| null`       | null이 아니면 `GameOverModal` 표시 트리거 |
| `pendingGameAction` | `'restart' \| null`    | 재시작 의도를 `useGameLifecycle`에 전달   |
| `activeMember`      | `ActiveMember \| null` | 콤보 달성 시 코멘트를 표시할 캐릭터       |
| `showComment`       | `boolean`              | 캐릭터 코멘트 표시 여부                   |

### `useBgmStore`

| 상태      | 타입      | 역할          |
| --------- | --------- | ------------- |
| `enabled` | `boolean` | BGM 재생 토글 |

### `useLoadingStore`

| 상태        | 타입      | 역할                                  |
| ----------- | --------- | ------------------------------------- |
| `isLoading` | `boolean` | 사용자 생성 API 호출 중 버튼 비활성화 |

### `useSetupSessionStore`

홈 화면에서 재방문 사용자를 한 번만 감지해 패널을 표시하는 세션 스토어.

| 상태                    | 타입                  | 역할                                            |
| ----------------------- | --------------------- | ----------------------------------------------- |
| `returningUser`         | `CurrentUser \| null` | 쿠키에서 읽은 기존 사용자 정보                  |
| `hasSeenReturningPanel` | `boolean`             | 재방문 패널을 이미 봤으면 true (중복 표시 방지) |

---

## 게임 로컬 상태 (`widgets/baking-board/model`)

`useReducer` 기반. 게임 진행 중 모든 상태를 단일 `State`로 관리.

| 상태             | 타입          | 역할                                       |
| ---------------- | ------------- | ------------------------------------------ |
| `slots`          | `SlotData[9]` | 각 슬롯의 `active`, `progress(0~115)`      |
| `floats`         | `FloatMsg[9]` | 슬롯별 플로팅 피드백 텍스트                |
| `score`          | `number`      | 현재 점수 (−500 미만이면 즉시 종료)        |
| `combo`          | `number`      | 연속 성공 횟수                             |
| `comboIdleTicks` | `number`      | 콤보 유지 틱 카운트 (4초 = 80틱)           |
| `timer`          | `number`      | 남은 시간(초), 60부터 감소                 |
| `gameTime`       | `number`      | 경과 틱 (20틱 = 1초)                       |
| `speed`          | `number`      | 슬롯 진행 속도 (기본 1.2, 난이도당 +0.3)   |
| `diffLevel`      | `number`      | 난이도 레벨 (점수·경과 시간으로 자동 상승) |
| `over`           | `boolean`     | `timer ≤ 0` 또는 `score < −500` 이면 true  |

**액션**: `CLICK` · `TICK` · `CLEAR_FLOAT` · `RESTART`

---

## React Query 서버 상태

| 쿼리 키               | 데이터                            | 갱신 시점                                                       |
| --------------------- | --------------------------------- | --------------------------------------------------------------- |
| `userQuery.me()`      | 현재 로그인 사용자 (`MeResponse`) | 사용자 생성 후 `invalidateQueries`                              |
| `rankingQuery.list()` | TOP 10 랭킹                       | 게임 종료 후 `postRank` optimistic update → `invalidateQueries` |

---

## 게임 흐름과 상태 전환

```
홈 진입
  └─ getMeServer() → user_token 쿠키 확인
       ├─ 있음 → useSetupSessionStore.returningUser 설정 → 재방문 패널
       └─ 없음 → 닉네임·캐릭터 입력 폼

게임 시작
  └─ POST /api/users → user_token 쿠키 발급 → /game 이동

게임 진행 (TICK 20회/초)
  └─ useReducer(State) 로 슬롯·점수·콤보·타이머 갱신

게임 종료 (timer=0 || score<-500)
  └─ useGameLifecycle → postRank → setFinalScore(score)
       └─ finalScore !== null → GameOverModal 표시

재시작
  └─ GameOverModal → setPendingGameAction('restart') + clearFinalScore
       └─ useGameLifecycle 감지 → dispatch(RESTART) → initState()
```
