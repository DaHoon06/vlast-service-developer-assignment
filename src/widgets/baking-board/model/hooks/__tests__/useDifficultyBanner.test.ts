import { act, renderHook } from '@testing-library/react';

import { useDifficultyBanner } from '../useDifficultyBanner';

describe('useDifficultyBanner', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('초기값은 false', () => {
        const { result } = renderHook(() => useDifficultyBanner(0));
        expect(result.current).toBe(false);
    });

    test('diffLevel이 증가하면 true 반환', () => {
        const { result, rerender } = renderHook(({ level }) => useDifficultyBanner(level), {
            initialProps: { level: 0 },
        });
        act(() => {
            rerender({ level: 1 });
        });
        expect(result.current).toBe(true);
    });

    test('2500ms 후 자동으로 false 전환', () => {
        const { result, rerender } = renderHook(({ level }) => useDifficultyBanner(level), {
            initialProps: { level: 0 },
        });
        act(() => {
            rerender({ level: 1 });
        });
        act(() => {
            jest.advanceTimersByTime(2500);
        });
        expect(result.current).toBe(false);
    });

    test('같은 레벨 유지 시 변화 없음', () => {
        const { result, rerender } = renderHook(({ level }) => useDifficultyBanner(level), {
            initialProps: { level: 1 },
        });
        act(() => {
            rerender({ level: 1 });
        });
        expect(result.current).toBe(false);
    });

    test('diffLevel이 감소하면 표시 안 함', () => {
        const { result, rerender } = renderHook(({ level }) => useDifficultyBanner(level), {
            initialProps: { level: 2 },
        });
        act(() => {
            rerender({ level: 1 });
        });
        expect(result.current).toBe(false);
    });

    test('연속 레벨업 시 타이머가 초기화됨', () => {
        const { result, rerender } = renderHook(({ level }) => useDifficultyBanner(level), {
            initialProps: { level: 0 },
        });
        act(() => {
            rerender({ level: 1 });
        });
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        act(() => {
            rerender({ level: 2 });
        });
        // 두 번째 레벨업 후 2500ms 이내이므로 true
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current).toBe(true);
        // 두 번째 레벨업 후 2500ms 이후 false
        act(() => {
            jest.advanceTimersByTime(1500);
        });
        expect(result.current).toBe(false);
    });
});
