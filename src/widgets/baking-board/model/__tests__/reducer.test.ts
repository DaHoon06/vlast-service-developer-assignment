import {
    DIFF_SCORE_STEP,
    DIFF_SPEED_BASE,
    DIFF_SPEED_PER_LEVEL,
    DIFF_TIME_STEP,
    GAME_OVER_SCORE,
    SLOT_COUNT,
    TICKS_PER_SECOND,
    TIMER_START,
} from '../../config/constants';
import { initState, reducer } from '../reducer';
import type { State } from '../types';

const makeState = (overrides: Partial<State> = {}): State => {
    return { ...initState(), ...overrides };
};

describe('initState', () => {
    test('슬롯 개수가 올바름', () => {
        expect(initState().slots).toHaveLength(SLOT_COUNT);
    });

    test('모든 슬롯이 비활성 상태로 progress 0에서 시작', () => {
        initState().slots.forEach((s) => {
            expect(s.active).toBe(false);
            expect(s.progress).toBe(0);
        });
    });

    test('타이머가 TIMER_START에서 시작', () => {
        expect(initState().timer).toBe(TIMER_START);
    });

    test('점수와 콤보가 0에서 시작', () => {
        const s = initState();
        expect(s.score).toBe(0);
        expect(s.combo).toBe(0);
    });

    test('속도가 DIFF_SPEED_BASE에서 시작', () => {
        expect(initState().speed).toBe(DIFF_SPEED_BASE);
    });
});

describe('CLICK action', () => {
    test('비활성 슬롯을 활성화', () => {
        const state = makeState();
        const next = reducer(state, { type: 'CLICK', index: 2 });
        expect(next.slots[2].active).toBe(true);
        expect(next.slots[2].progress).toBe(0);
        expect(next.slots[0].active).toBe(false);
    });

    test('활성 슬롯을 비활성화하고 점수 갱신 (덜 익음, progress=10)', () => {
        const state = makeState({
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 10 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.slots[0].active).toBe(false);
        expect(next.score).toBe(-10);
    });

    test('좋은 수확 시 콤보 증가 (좋아요!, progress=60)', () => {
        const state = makeState({
            combo: 3,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 60 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.combo).toBe(4);
        expect(next.score).toBe(50);
    });

    test('PERFECT!! 시 콤보 보너스 포함 콤보 증가 (progress=80, combo=5)', () => {
        const state = makeState({
            combo: 5,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 80 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.combo).toBe(6);
        expect(next.score).toBe(150);
    });

    test('나쁜 수확 시 콤보 초기화 (타기 시작!, progress=95)', () => {
        const state = makeState({
            combo: 5,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 95 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.combo).toBe(0);
        expect(next.score).toBe(-30);
    });

    test('수확 시 플로팅 메시지 설정', () => {
        const state = makeState({
            slots: initState().slots.map((s, i) => (i === 1 ? { active: true, progress: 60 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 1 });
        expect(next.floats[1]).not.toBeNull();
        expect(next.floats[1]?.text).toBe('좋아요!');
    });

    test('점수가 GAME_OVER_SCORE 미만으로 떨어지면 게임 오버 트리거', () => {
        const state = makeState({
            score: GAME_OVER_SCORE + 80,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 100 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.over).toBe(true);
    });

    test('점수가 DIFF_SCORE_STEP을 넘으면 diffLevel 증가', () => {
        const state = makeState({
            score: DIFF_SCORE_STEP - 50,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 80 } : s)),
        });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next.diffLevel).toBeGreaterThanOrEqual(1);
        expect(next.speed).toBeGreaterThan(DIFF_SPEED_BASE);
    });
});

describe('TICK action', () => {
    test('gameTime 증가', () => {
        const state = makeState();
        const next = reducer(state, { type: 'TICK' });
        expect(next.gameTime).toBe(1);
    });

    test('시간 경계에서 난이도가 올라가면 속도 증가', () => {
        const state = makeState({ gameTime: DIFF_TIME_STEP - 1 });
        const next = reducer(state, { type: 'TICK' });
        expect(next.diffLevel).toBe(1);
        expect(next.speed).toBeCloseTo(DIFF_SPEED_BASE + DIFF_SPEED_PER_LEVEL);
    });

    test('첫 번째 난이도 임계값 전에는 기본 속도 유지', () => {
        const state = makeState({ gameTime: 0 });
        const next = reducer(state, { type: 'TICK' });
        expect(next.speed).toBeCloseTo(DIFF_SPEED_BASE);
    });

    test('TICKS_PER_SECOND 틱마다 타이머 감소', () => {
        let state = makeState({ gameTime: TICKS_PER_SECOND - 1, timer: 30 });
        state = reducer(state, { type: 'TICK' });
        expect(state.timer).toBe(29);
    });

    test('초 경계 사이에서는 타이머 감소 안 함', () => {
        const state = makeState({ gameTime: 0, timer: 30 });
        const next = reducer(state, { type: 'TICK' });
        expect(next.timer).toBe(30);
    });

    test('활성 슬롯의 progress 진행', () => {
        const state = makeState({
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 10 } : s)),
        });
        const next = reducer(state, { type: 'TICK' });
        expect(next.slots[0].progress).toBeGreaterThan(10);
    });

    test('비활성 슬롯은 TICK에서 progress 변화 없음', () => {
        const state = makeState();
        const next = reducer(state, { type: 'TICK' });
        next.slots.forEach((s) => {
            expect(s.active).toBe(false);
            expect(s.progress).toBe(0);
        });
    });

    test('progress가 115를 초과하면 슬롯 자동 탄화 (-100점)', () => {
        const state = makeState({
            score: 0,
            combo: 3,
            slots: initState().slots.map((s, i) => (i === 0 ? { active: true, progress: 115 } : s)),
        });
        const next = reducer(state, { type: 'TICK' });
        expect(next.slots[0].active).toBe(false);
        expect(next.score).toBe(-100);
        expect(next.combo).toBe(0);
        expect(next.floats[0]?.text).toBe('숯덩이ㅠㅠ');
    });

    test('타이머가 0이 되면 게임 오버', () => {
        let state = makeState({ timer: 1, gameTime: TICKS_PER_SECOND - 1 });
        state = reducer(state, { type: 'TICK' });
        expect(state.timer).toBe(0);
        expect(state.over).toBe(true);
    });

    test('타이머가 0 미만으로 내려가지 않음', () => {
        const state = makeState({ timer: 0, gameTime: TICKS_PER_SECOND - 1 });
        const next = reducer(state, { type: 'TICK' });
        expect(next.timer).toBe(0);
    });
});

describe('CLEAR_FLOAT action', () => {
    test('인덱스와 id로 플로팅 메시지 제거', () => {
        const floats = initState().floats.map((f, i) =>
            i === 2 ? { id: 42, text: 'test', color: '#fff' } : f,
        );
        const state = makeState({ floats });
        const next = reducer(state, { type: 'CLEAR_FLOAT', index: 2, id: 42 });
        expect(next.floats[2]).toBeNull();
    });

    test('id가 일치하지 않으면 플로팅 메시지 제거 안 함', () => {
        const floats = initState().floats.map((f, i) =>
            i === 2 ? { id: 42, text: 'test', color: '#fff' } : f,
        );
        const state = makeState({ floats });
        const next = reducer(state, { type: 'CLEAR_FLOAT', index: 2, id: 99 });
        expect(next.floats[2]).not.toBeNull();
    });

    test('대상 인덱스의 플로팅 메시지만 제거', () => {
        const floats = initState().floats.map((f, i) =>
            i === 1 || i === 3 ? { id: i * 10, text: 'msg', color: '#fff' } : f,
        );
        const state = makeState({ floats });
        const next = reducer(state, { type: 'CLEAR_FLOAT', index: 1, id: 10 });
        expect(next.floats[1]).toBeNull();
        expect(next.floats[3]).not.toBeNull();
    });
});

describe('RESTART action', () => {
    test('모든 상태를 초기값으로 리셋', () => {
        const state = makeState({ score: 500, combo: 10, timer: 0, over: true });
        const next = reducer(state, { type: 'RESTART' });
        expect(next).toEqual(initState());
    });

    test('게임 오버 상태에서도 RESTART 동작', () => {
        const state = makeState({ over: true, score: -1000 });
        const next = reducer(state, { type: 'RESTART' });
        expect(next.over).toBe(false);
    });
});

describe('게임 오버 가드', () => {
    test('게임 오버 시 CLICK 무시', () => {
        const state = makeState({ over: true });
        const next = reducer(state, { type: 'CLICK', index: 0 });
        expect(next).toBe(state);
    });

    test('게임 오버 시 TICK 무시', () => {
        const state = makeState({ over: true });
        const next = reducer(state, { type: 'TICK' });
        expect(next).toBe(state);
    });

    test('게임 오버 시 CLEAR_FLOAT 무시', () => {
        const floats = initState().floats.map((f, i) =>
            i === 0 ? { id: 1, text: 'msg', color: '#fff' } : f,
        );
        const state = makeState({ over: true, floats });
        const next = reducer(state, { type: 'CLEAR_FLOAT', index: 0, id: 1 });
        expect(next).toBe(state);
    });

    test('게임 오버 시 RESTART는 허용', () => {
        const state = makeState({ over: true });
        const next = reducer(state, { type: 'RESTART' });
        expect(next.over).toBe(false);
    });
});
