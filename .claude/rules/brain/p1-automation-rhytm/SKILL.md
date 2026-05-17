# CI/CD

## Vercel 배포 플로우

```
git push
  └─ Vercel: ignoreCommand 평가
       ├─ src/ app/ public/ package.json pnpm-lock.yaml next.config.ts vercel.json
       │   변경 없음 → 빌드 전체 스킵 (배포 취소)
       └─ 변경 있음
            └─ pnpm install --frozen-lockfile
                 └─ buildCommand: node scripts/build-ci.mjs
                      ├─ 테스트 해시 검사 (아래 참조)
                      └─ pnpm build (Next.js 빌드)
```

---

## 테스트 해시 스킵 메커니즘 (`scripts/build-ci.mjs`)

### 해시 산출 대상

| 대상      | 경로                                              |
| --------- | ------------------------------------------------- |
| 소스 파일 | `src/**/*.{ts,tsx}` (재귀 수집, 경로순 정렬)      |
| 설정 파일 | `jest.config.ts`, `jest.setup.ts`, `package.json` |

### 플로우

```
build-ci.mjs 실행
  └─ src/**/*.{ts,tsx} + jest 설정 파일 → SHA-256 해시 산출
       └─ .next/cache/test-hash (이전 해시) 와 비교
            ├─ 일치 → "Tests skipped" — 테스트 실행 없음
            └─ 불일치
                 ├─ pnpm test:ci (NODE_ENV=test jest --ci)
                 └─ 성공 시 .next/cache/test-hash 에 현재 해시 저장
```

### 캐시 파일 위치

`.next/cache/test-hash` — Vercel이 `.next/cache/` 를 빌드 간 유지하므로 해시가 지속된다.

### 해시 스킵이 동작하는 조건

- 이전 빌드가 성공하여 `test-hash` 파일이 존재할 것
- `src/` 또는 jest 설정 파일에 변경이 없을 것
- `app/`, `public/` 변경만 있을 경우 → 테스트 스킵, 빌드만 실행

---

## 주요 스크립트 정리

| 명령               | 역할                               |
| ------------------ | ---------------------------------- |
| `pnpm test`        | 로컬 watch-ready 실행              |
| `pnpm test:ci`     | CI 전용 (`--ci` 플래그, 병렬 실행) |
| `pnpm check-types` | tsc 타입 체크                      |
| `pnpm lint`        | ESLint                             |
| `pnpm build`       | Next.js 프로덕션 빌드              |

---

## vercel.json 설정 요약

```json
{
    "buildCommand": "node scripts/build-ci.mjs",
    "installCommand": "pnpm install --frozen-lockfile",
    "ignoreCommand": "git diff --quiet HEAD~1 HEAD -- src/ app/ public/ package.json pnpm-lock.yaml next.config.ts vercel.json"
}
```

- `ignoreCommand` 가 exit 0 반환 → 변경 없음 → Vercel이 빌드 취소
- `ignoreCommand` 가 non-zero 반환 → 변경 있음 → 빌드 진행
