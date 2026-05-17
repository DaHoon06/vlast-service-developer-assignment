'use client';

import { useEffect, useReducer, useRef } from 'react';

import { useClickSound } from '@/shared/lib/useClickSound';

import { initState, reducer } from '../reducer';
import type { Action, State } from '../types';

export const useBakingGame = (): { state: State; dispatch: React.Dispatch<Action> } => {
    const [state, dispatch] = useReducer(reducer, undefined, initState);
    const prevFloats = useRef(state.floats);
    const playClick = useClickSound();

    useEffect(() => {
        state.floats.forEach((f, i) => {
            if (f && f !== prevFloats.current[i]) {
                const { id } = f;
                setTimeout(() => dispatch({ type: 'CLEAR_FLOAT', index: i, id }), 800);
            }
        });
        prevFloats.current = state.floats;
    }, [state.floats]);

    useEffect(() => {
        if (state.over) return;
        const id = setInterval(() => dispatch({ type: 'TICK' }), 50);
        return () => clearInterval(id);
    }, [state.over]);

    useEffect(() => {
        const KEY_TO_INDEX: Record<string, number> = {
            '1': 0,
            '2': 1,
            '3': 2,
            '4': 3,
            '5': 4,
            '6': 5,
            '7': 6,
            '8': 7,
            '9': 8,
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            const index = KEY_TO_INDEX[e.key];
            if (index !== undefined) {
                playClick();
                dispatch({ type: 'CLICK', index });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playClick]);

    return { state, dispatch };
};
