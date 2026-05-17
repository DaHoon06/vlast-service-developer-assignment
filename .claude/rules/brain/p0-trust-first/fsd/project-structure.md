# 프로젝트 구조 (FSD + Next)

- Next 라우팅은 프로젝트 루트 `app/`, 도메인 코드는 `src/` 아래 FSD 레이어에 둔다.
- 상위 규칙: @rules/brain/p0-trust-first/fsd/layer-rules.md

## API 요청 파일 컨벤션

### 파일명

- `{method}-*.ts` 형태 (예: `get-song.ts`, `create-order.ts`).
- **한 파일에 하나의 요청 함수**.

### 타입 선언

- 요청 파일 **상단**에서 params·response 타입을 함께 선언한다.
- **별도 `types.ts`로 분리하지 않는다** (요청 단위 응집).

### 서버 전용 public API (`index.server.ts`)

- `cookies()`, `headers()`, DB 직접 접근 등 **서버 런타임에서만 동작하는 코드**는 `index.ts`에 export하지 않는다.
    - `index.ts`는 클라이언트 번들에 포함될 수 있으므로, 서버 전용 모듈이 섞이면 빌드 오류 또는 런타임 오류가 발생한다.
- 서버 전용 export는 **`index.server.ts`** 에 분리한다.
    - 소비 측(pages/widgets 등 서버 컴포넌트)은 `@/{slice}/index.server` 경로로 import한다.
- `index.server.ts`에는 클라이언트 코드(React hooks, browser API 등)를 두지 않는다.
