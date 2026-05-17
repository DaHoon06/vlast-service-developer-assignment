export const SLOT_COUNT = 9; // 붕어빵 슬롯 개수
export const TIMER_START = 60; // 게임 시작 타이머 (초)
export const GAME_OVER_SCORE = -500; // 이 점수 미만이면 즉시 게임 오버
export const TICKS_PER_SECOND = 20; // 1초당 TICK 횟수 (슬롯 progress 갱신 주기)

export const DIFF_SCORE_STEP = 1000; // 난이도 레벨업에 필요한 점수 증가분
export const DIFF_TIME_STEP = TICKS_PER_SECOND * 15; // 난이도 레벨업에 필요한 경과 틱 (15초)
export const DIFF_SPEED_BASE = 1.2; // 슬롯 진행 속도 기본값 (레벨 0)
export const DIFF_SPEED_PER_LEVEL = 0.3; // 난이도 레벨당 속도 증가량
