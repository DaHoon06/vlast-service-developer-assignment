# 위험 감지 · 방어 (p3-risk-detect)

공통 테스트 전략, 에러 처리 가이드라인

## 테스트 원칙

- **단위 테스트**: Jest + React Testing Library (RTL).
- **통합 테스트**: 실제 의존성 사용. DB·API mock 최소화.
- 테스트 파일은 테스트 대상 파일과 **같은 세그먼트 폴더 내** `__tests__/` 디렉터리에 둔다.

## 커버리지 가이드라인

- 신규 컴포넌트·hook: **핵심 인터랙션 테스트** 필수 (빈 컴포넌트 렌더 테스트는 의미 없음).
- 비즈니스 로직(model, lib 세그먼트): **엣지 케이스** 포함 필수.
- UI 스냅샷: 의도적 변경인지 판단 어렵기 때문에 **지양**.

## 에러 처리

- API 에러: TanStack Query의 `onError` / Error Boundary 조합으로 처리.
- 예상 가능한 런타임 예외: 호출부에서 처리 (전역 catch로 숨기지 않음).
- 예상 불가 예외: 가장 가까운 Error Boundary가 처리.

## PR 전 체크

```bash
pnpm test:ci       # 실패 시 PR 블로킹
pnpm check-types   # 타입 오류 0개 유지
pnpm lint          # ESLint 경고도 가능하면 해소
```

## Server / Client 컴포넌트 번들 분리

서버 컴포넌트가 클라이언트 번들에 포함되면 **데이터 유출·번들 비대화** 위험이 생긴다.

### 규칙

- **서버 컴포넌트와 클라이언트 컴포넌트를 동일한 `index.ts`에서 함께 export하지 않는다.**
- 슬라이스(또는 세그먼트) `index.ts`가 클라이언트 컴포넌트를 하나라도 포함하면, 해당 파일에 `'use client'`가 없더라도 Next.js가 전체를 클라이언트 모듈로 취급할 수 있다.

### 분리 방법

```
ui/
  component.server.tsx       # 'use server' 또는 지시어 없음
  component.client.tsx       # 'use client'
  index.server.ts           # 서버 전용 re-export
  index.cient.ts           # 클라이언트 전용 re-export
```

또는 슬라이스 루트를 두 개 진입점으로 나눈다.

```
widgets/my-widget/
  index.ts          # 'use client' 컴포넌트만 export
  index.server.ts   # 서버 컴포넌트만 export
```

### 금지 예시

```ts
// ❌ index.ts — 서버·클라이언트 혼재
export { ServerWidget } from './ui/ServerWidget'; // 서버 컴포넌트
export { ClientWidget } from './ui/ClientWidget'; // 'use client'
```

### 허용 예시

```ts
// ✅ index.server.ts — 서버 전용
export { ServerWidget } from './ui/ServerWidget';

// ✅ index.ts — 클라이언트 전용
export { ClientWidget } from './ui/ClientWidget';
```

---

## 금지 패턴

- `as any` 남용 — 타입 좁히기(narrowing)로 대체.
- `// @ts-ignore` — 불가피하면 `// @ts-expect-error` + 이유 주석.
- `console.log` 커밋 — 디버그 로그는 PR 전 제거.
