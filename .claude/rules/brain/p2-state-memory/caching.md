# 캐싱 규칙 & 상태 흐름

## 현재 캐싱 구조 개요

이 서비스는 **3계층 캐싱**을 사용한다.

```
Browser
  └─ React Query (클라이언트 캐시)
       └─ Next.js API Route
            └─ unstable_cache (서버 메모리 캐시)
                 └─ Supabase DB
```

---

## 계층별 현재 설정

### 1. React Query 클라이언트 (QueryProvider)

| 옵션                   | 값              | 설명                         |
| ---------------------- | --------------- | ---------------------------- |
| `staleTime`            | 10,000ms (10초) | 기본값 — 쿼리별로 오버라이드 |
| `gcTime`               | 60,000ms (1분)  | 캐시 메모리 유지 시간        |
| `retry`                | 1               | 실패 시 재시도 1회           |
| `refetchOnMount`       | true            | 컴포넌트 마운트 시 재검증    |
| `refetchOnWindowFocus` | true            | 창 포커스 복귀 시 재검증     |
| `refetchOnReconnect`   | true            | 네트워크 재연결 시 재검증    |

### 2. 쿼리별 staleTime / gcTime

| 쿼리                       | staleTime | gcTime | 비고                                        |
| -------------------------- | --------- | ------ | ------------------------------------------- |
| `userQuery.me()`           | 5분       | 10분   | 사용자 생성 후 invalidate                   |
| `rankingQuery.list()`      | 5분       | 10분   | 게임 종료 후 invalidate + optimistic update |
| `characterQuery.members()` | 1시간     | 2시간  | 거의 변하지 않는 정적 데이터                |

### 3. Next.js 서버 캐시 (unstable_cache)

| 엔드포인트               | 캐시 키                          | revalidate    | tags            | 무효화 트리거                                |
| ------------------------ | -------------------------------- | ------------- | --------------- | -------------------------------------------- |
| `GET /api/plave`         | `['plave-members']`              | 86,400s (24h) | `plave-members` | 없음 (TTL only)                              |
| `GET /api/rank`          | `['rankings-list']`              | 60s           | `rankings`      | POST /api/rank → `revalidateTag('rankings')` |
| `getCharacterThumbnails` | `[characterWithThumbnailApiTag]` | 3,600s (1h)   | 동일            | 없음 (TTL only)                              |

### 4. HTTP 클라이언트 기본값

- GET: `cache: 'no-store'` (기본) — `config.next` 전달 시 Next.js revalidate로 전환
- POST/PUT/PATCH/DELETE: 캐시 없음

### 5. 서버 QueryClient

- `staleTime`: 1분 — SSR hydration 시 초기 데이터 신선도 보장

---

## 상태 흐름

### 전체 데이터 흐름

```
홈 진입 (SSR)
  └─ getMeServer()
       ├─ user_token 쿠키 없음 → 닉네임·캐릭터 입력 폼 표시
       └─ user_token 쿠키 있음
            └─ useSetupSessionStore.returningUser 설정
                 └─ hasSeenReturningPanel=false → 재방문 패널 표시 (1회만)

게임 시작
  └─ POST /api/users
       └─ user_token 쿠키 발급 (httpOnly, 1년)
            └─ invalidateQueries(userQuery.me())
                 └─ /game 페이지 이동

게임 진행 (TICK 20회/초 — useReducer)
  └─ 슬롯 · 점수 · 콤보 · 타이머 갱신 (로컬 상태)
       └─ 콤보 달성 → useGameStore.activeMember 설정 → 코멘트 표시

게임 종료 (timer=0 || score<-500)
  └─ postRank() — useSubmitRanking
       ├─ onMutate: cancelQueries + optimistic update (rankingQuery.list)
       ├─ onError: 이전 데이터로 롤백
       └─ onSettled: invalidateQueries(rankingQuery.all())
            └─ 서버: revalidateTag('rankings') → unstable_cache 무효화
  └─ setFinalScore(score) → GameOverModal 표시

재시작
  └─ setPendingGameAction('restart') + clearFinalScore()
       └─ useGameLifecycle 감지 → dispatch(RESTART) → initState()
```

### React Query 캐시 무효화 타이밍

```
POST /api/users 성공
  └─ invalidateQueries(userQuery.me())

POST /api/rank 성공 (onSettled)
  └─ invalidateQueries(rankingQuery.all())
       └─ rankingQuery.list() 포함 (계층적 무효화)
```

---

## 캐싱 정책 권장사항

### 현재 문제점

| 항목                        | 현재  | 문제                                                                         |
| --------------------------- | ----- | ---------------------------------------------------------------------------- |
| 클라이언트 기본 `staleTime` | 10초  | 너무 짧음 — windowFocus 등에 의해 불필요한 refetch 발생                      |
| 랭킹 서버 캐시 revalidate   | 60초  | React Query staleTime(5분)과 불일치 — 클라이언트는 5분 캐시, 서버는 1분 갱신 |
| `refetchOnWindowFocus`      | true  | 게임 중 창 전환 복귀 시 불필요한 API 호출                                    |
| `characterQuery` gcTime     | 2시간 | staleTime(1h)과 격차 적음 — 캐릭터 데이터는 배포 단위 정적 데이터            |

### 권장 설정

#### QueryProvider 기본값 조정

```typescript
defaultOptions: {
  queries: {
    staleTime: 60 * 1000,        // 10초 → 1분
    gcTime: 5 * 60 * 1000,       // 1분 → 5분
    refetchOnWindowFocus: false, // 게임 서비스 특성상 불필요
    retry: 1,
  },
}
```

#### 쿼리별 권장값

| 쿼리                       | 권장 staleTime | 권장 gcTime | 이유                        |
| -------------------------- | -------------- | ----------- | --------------------------- |
| `userQuery.me()`           | 10분           | 30분        | 세션 중 거의 변하지 않음    |
| `rankingQuery.list()`      | 1분            | 5분         | 서버 revalidate(60s)와 일치 |
| `characterQuery.members()` | Infinity       | 24시간      | 배포 단위 정적 데이터       |

#### 서버 캐시 revalidate 조정

```typescript
// /api/rank — React Query staleTime(1분)과 맞춤
{ revalidate: 60, tags: ['rankings'] }  // 현재 값 유지

// /api/plave — 멤버 5명 고정, 변경 수단 없음 → 현재 24h TTL 유지
{ revalidate: 86400, tags: ['plave-members'] }  // 현재 값 유지
```

#### 게임 페이지 한정 fetch 전략

```typescript
// 게임 시작 후 랭킹은 게임 종료 시점에만 필요 → enabled 조건부 사용
queryOptions({
    ...rankingQuery.list(),
    enabled: isGameOver, // 게임 중에는 쿼리 비활성화
});
```

### 우선순위 요약

| 우선순위 | 작업                                              | 효과                                        |
| -------- | ------------------------------------------------- | ------------------------------------------- |
| P1       | `refetchOnWindowFocus: false`                     | 게임 중 불필요한 API 호출 제거              |
| P1       | 기본 `staleTime` 1분으로 증가                     | 중복 요청 감소                              |
| P2       | `rankingQuery` staleTime을 60s로 서버와 일치      | 캐시 일관성 확보                            |
| P2       | `characterQuery.members()` staleTime을 Infinity로 | 캐릭터 데이터 불필요 재요청 방지            |
| P3       | 게임 중 랭킹 쿼리 `enabled: false`                | 게임 진행 중 불필요한 백그라운드 fetch 차단 |
