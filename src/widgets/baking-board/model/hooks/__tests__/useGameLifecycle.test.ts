import { act, renderHook } from '@testing-library/react';

import type { User } from '@/entities/user';

import { useGameLifecycle } from '../useGameLifecycle';

const makeMe = (id: number): NonNullable<User> => ({
    id,
    name: 'TestUser',
    character: { memberId: 1, name: 'char', label: '', profile: null, color: null },
});

const defaultParams = {
    over: false,
    score: 0,
    dispatch: jest.fn(),
    me: makeMe(1),
    setFinalScore: jest.fn(),
    submitRank: jest.fn(),
    pendingGameAction: null as null | 'restart',
    setPendingGameAction: jest.fn(),
};

describe('useGameLifecycle — game over', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('me가 없으면 over가 true가 될 때 setFinalScore 직접 호출', () => {
        const setFinalScore = jest.fn();
        const { rerender } = renderHook(
            ({ over }) =>
                useGameLifecycle({
                    ...defaultParams,
                    over,
                    score: 300,
                    me: undefined,
                    setFinalScore,
                }),
            {
                initialProps: { over: false },
            },
        );
        act(() => {
            rerender({ over: true });
        });
        expect(setFinalScore).toHaveBeenCalledWith(300);
    });

    test('me가 있으면 submitRank 호출', () => {
        const submitRank = jest.fn();
        const { rerender } = renderHook(
            ({ over }) =>
                useGameLifecycle({
                    ...defaultParams,
                    over,
                    score: 500,
                    me: makeMe(42),
                    submitRank,
                }),
            {
                initialProps: { over: false },
            },
        );
        act(() => {
            rerender({ over: true });
        });
        expect(submitRank).toHaveBeenCalledWith({ score: 500, user: 42 });
    });

    test('me가 null이면 submitRank 호출 안 함', () => {
        const submitRank = jest.fn();
        const setFinalScore = jest.fn();
        const { rerender } = renderHook(
            ({ over }) =>
                useGameLifecycle({ ...defaultParams, over, me: null, submitRank, setFinalScore }),
            {
                initialProps: { over: false },
            },
        );
        act(() => {
            rerender({ over: true });
        });
        expect(setFinalScore).toHaveBeenCalled();
        expect(submitRank).not.toHaveBeenCalled();
    });

    test('over가 true인 채로 리렌더해도 중복 호출 안 함', () => {
        const submitRank = jest.fn();
        const { rerender } = renderHook(
            ({ score }) =>
                useGameLifecycle({ ...defaultParams, over: true, score, submitRank }),
            {
                initialProps: { score: 100 },
            },
        );
        act(() => {
            rerender({ score: 200 });
        });
        expect(submitRank).toHaveBeenCalledTimes(1);
    });
});

describe('useGameLifecycle — restart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('pendingGameAction이 restart이면 RESTART dispatch', () => {
        const dispatch = jest.fn();
        const setPendingGameAction = jest.fn();
        const { rerender } = renderHook(
            ({ pending }) =>
                useGameLifecycle({
                    ...defaultParams,
                    dispatch,
                    setPendingGameAction,
                    pendingGameAction: pending,
                }),
            {
                initialProps: { pending: null as null | 'restart' },
            },
        );
        act(() => {
            rerender({ pending: 'restart' });
        });
        expect(dispatch).toHaveBeenCalledWith({ type: 'RESTART' });
        expect(setPendingGameAction).toHaveBeenCalledWith(null);
    });

    test('restart 후 게임 오버 시 다시 submitRank 호출 가능', () => {
        const submitRank = jest.fn();
        const setFinalScore = jest.fn();
        const dispatch = jest.fn();
        const setPendingGameAction = jest.fn();

        const { rerender } = renderHook(
            ({ over, pending }) =>
                useGameLifecycle({
                    ...defaultParams,
                    over,
                    score: 200,
                    dispatch,
                    submitRank,
                    setFinalScore,
                    pendingGameAction: pending,
                    setPendingGameAction,
                }),
            {
                initialProps: { over: false, pending: null as null | 'restart' },
            },
        );

        // 첫 번째 게임 오버
        act(() => {
            rerender({ over: true, pending: null });
        });
        expect(submitRank).toHaveBeenCalledTimes(1);

        // 재시작
        act(() => {
            rerender({ over: false, pending: 'restart' });
        });

        // 두 번째 게임 오버
        act(() => {
            rerender({ over: true, pending: null });
        });
        expect(submitRank).toHaveBeenCalledTimes(2);
    });
});
