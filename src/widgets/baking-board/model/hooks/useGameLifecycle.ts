import { type Dispatch, useEffect, useRef } from 'react';

import type { User } from '@/entities/user';
import type { GameAction } from '@/shared/model';

import type { Action } from '../types';

interface Params {
    over: boolean;
    score: number;
    dispatch: Dispatch<Action>;
    me: User | undefined;
    setFinalScore: (score: number) => void;
    submitRank: (params: { score: number; user: number }) => void;
    pendingGameAction: GameAction;
    setPendingGameAction: (action: GameAction) => void;
}

export const useGameLifecycle = ({
    over,
    score,
    dispatch,
    me,
    setFinalScore,
    submitRank,
    pendingGameAction,
    setPendingGameAction,
}: Params) => {
    const hasNavigated = useRef(false);

    useEffect(() => {
        if (!over || hasNavigated.current) return;
        hasNavigated.current = true;
        if (me?.id != null) {
            submitRank({ score, user: me.id });
        } else {
            setFinalScore(score);
        }
    }, [over, score, me, setFinalScore, submitRank]);

    useEffect(() => {
        if (pendingGameAction !== 'restart') return;
        hasNavigated.current = false;
        dispatch({ type: 'RESTART' });
        setPendingGameAction(null);
    }, [pendingGameAction, dispatch, setPendingGameAction]);
};
