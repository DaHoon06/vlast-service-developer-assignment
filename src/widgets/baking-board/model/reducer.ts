import { calcHarvest } from '../lib/calc-harvest';

import {
    DIFF_SCORE_STEP,
    DIFF_SPEED_BASE,
    DIFF_SPEED_PER_LEVEL,
    DIFF_TIME_STEP,
    GAME_OVER_SCORE,
    SLOT_COUNT,
    TICKS_PER_SECOND,
    TIMER_START,
} from '../config/constants';
import type { Action, State } from './types';

let _fid = 0;

const COMBO_IDLE_TICKS = TICKS_PER_SECOND * 4;

const computeDiffLevel = (prevLevel: number, score: number, gameTime: number): number => {
    const scoreLevel = Math.floor(Math.max(score, 0) / DIFF_SCORE_STEP);
    const timeLevel = Math.floor(gameTime / DIFF_TIME_STEP);
    return Math.max(prevLevel, scoreLevel, timeLevel);
};

export const initState = (): State => {
    return {
        slots: Array.from({ length: SLOT_COUNT }, () => ({ active: false, progress: 0 })),
        floats: Array.from({ length: SLOT_COUNT }, () => null),
        score: 0,
        combo: 0,
        comboIdleTicks: 0,
        timer: TIMER_START,
        gameTime: 0,
        speed: DIFF_SPEED_BASE,
        diffLevel: 0,
        over: false,
    };
};

export const reducer = (state: State, action: Action): State => {
    if (state.over && action.type !== 'RESTART') return state;

    switch (action.type) {
        case 'CLICK': {
            const slot = state.slots[action.index];
            if (!slot.active) {
                return {
                    ...state,
                    slots: state.slots.map((s, i) =>
                        i === action.index ? { active: true, progress: 0 } : s,
                    ),
                };
            }
            const { gain, text, color, good } = calcHarvest(slot.progress, state.combo);
            const newScore = state.score + gain;
            const newCombo = good ? state.combo + 1 : 0;
            const newDiffLevel = computeDiffLevel(state.diffLevel, newScore, state.gameTime);
            return {
                ...state,
                score: newScore,
                combo: newCombo,
                comboIdleTicks: good ? COMBO_IDLE_TICKS : 0,
                diffLevel: newDiffLevel,
                speed: DIFF_SPEED_BASE + newDiffLevel * DIFF_SPEED_PER_LEVEL,
                over: newScore < GAME_OVER_SCORE,
                slots: state.slots.map((s, i) =>
                    i === action.index ? { active: false, progress: 0 } : s,
                ),
                floats: state.floats.map((f, i) =>
                    i === action.index ? { id: _fid++, text, color } : f,
                ),
            };
        }

        case 'TICK': {
            const gt = state.gameTime + 1;
            const timer = gt % TICKS_PER_SECOND === 0 ? state.timer - 1 : state.timer;

            let scoreDelta = 0;
            const newIdleTicks = state.comboIdleTicks > 0 ? state.comboIdleTicks - 1 : 0;
            let combo = newIdleTicks === 0 && state.comboIdleTicks > 0 ? 0 : state.combo;
            const floats = [...state.floats];

            const slots = state.slots.map((s, i) => {
                if (!s.active) return s;
                const p = s.progress + 0.5 * state.speed;
                if (p > 115) {
                    scoreDelta -= 100;
                    combo = 0;
                    floats[i] = { id: _fid++, text: '숯덩이ㅠㅠ', color: '#888888' };
                    return { active: false, progress: 0 };
                }
                return { ...s, progress: p };
            });

            const newScore = state.score + scoreDelta;
            const newTimer = Math.max(timer, 0);
            const newDiffLevel = computeDiffLevel(state.diffLevel, newScore, gt);

            return {
                ...state,
                gameTime: gt,
                speed: DIFF_SPEED_BASE + newDiffLevel * DIFF_SPEED_PER_LEVEL,
                diffLevel: newDiffLevel,
                timer: newTimer,
                score: newScore,
                combo,
                comboIdleTicks: newIdleTicks,
                slots,
                floats,
                over: newTimer <= 0 || newScore < GAME_OVER_SCORE,
            };
        }

        case 'CLEAR_FLOAT':
            return {
                ...state,
                floats: state.floats.map((f, i) =>
                    i === action.index && f?.id === action.id ? null : f,
                ),
            };

        case 'RESTART':
            return initState();
    }
};
