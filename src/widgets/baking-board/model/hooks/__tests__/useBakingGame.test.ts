jest.mock('@/shared/lib/useClickSound', () => ({
    useClickSound: jest.fn(),
}));

import { useClickSound } from '@/shared/lib/useClickSound';
import { act, renderHook } from '@testing-library/react';
import { useBakingGame } from '../useBakingGame';

const mockPlayClick = jest.fn();
const mockUseClickSound = jest.mocked(useClickSound);

describe('useBakingGame', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
        mockUseClickSound.mockReturnValue(mockPlayClick);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('초기 상태: over=false, score=0, timer=60', () => {
        const { result } = renderHook(() => useBakingGame());
        expect(result.current.state.over).toBe(false);
        expect(result.current.state.score).toBe(0);
        expect(result.current.state.timer).toBe(60);
    });

    test('50ms마다 TICK dispatch (gameTime 증가)', () => {
        const { result } = renderHook(() => useBakingGame());

        act(() => {
            jest.advanceTimersByTime(250);
        });

        expect(result.current.state.gameTime).toBeGreaterThan(0);
    });

    test('1초(1000ms) 후 gameTime이 약 20틱', () => {
        const { result } = renderHook(() => useBakingGame());

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.state.gameTime).toBe(20);
    });

    test('dispatch 함수가 반환됨', () => {
        const { result } = renderHook(() => useBakingGame());
        expect(typeof result.current.dispatch).toBe('function');
    });

    test('숫자 키 "1" 입력 시 playClick 호출', () => {
        renderHook(() => useBakingGame());

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
        });

        expect(mockPlayClick).toHaveBeenCalledTimes(1);
    });

    test('숫자 키 "9" 입력 시 playClick 호출', () => {
        renderHook(() => useBakingGame());

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '9', bubbles: true }));
        });

        expect(mockPlayClick).toHaveBeenCalledTimes(1);
    });

    test('숫자 이외의 키 입력 시 playClick 미호출', () => {
        renderHook(() => useBakingGame());

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        });

        expect(mockPlayClick).not.toHaveBeenCalled();
    });

    test('과거 float가 800ms 후 CLEAR_FLOAT로 제거', async () => {
        const { result } = renderHook(() => useBakingGame());

        // slot을 activate 시키기 위해 충분히 tick
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // 활성화된 슬롯 클릭 → float 발생 가능성
        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
        });

        const floatsBefore = result.current.state.floats.map((f) => f?.id);

        // 800ms 경과 → CLEAR_FLOAT dispatch
        act(() => {
            jest.advanceTimersByTime(800);
        });

        // float가 있었다면 제거되어 있어야 함
        result.current.state.floats.forEach((f, i) => {
            if (floatsBefore[i] !== undefined) {
                expect(f).toBeNull();
            }
        });
    });

    test('언마운트 후 키 이벤트 처리 안 함', () => {
        const { unmount } = renderHook(() => useBakingGame());

        unmount();

        act(() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
        });

        expect(mockPlayClick).not.toHaveBeenCalled();
    });

    test('RESTART dispatch 후 상태 초기화', () => {
        const { result } = renderHook(() => useBakingGame());

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        const gameTimeBefore = result.current.state.gameTime;
        expect(gameTimeBefore).toBeGreaterThan(0);

        act(() => {
            result.current.dispatch({ type: 'RESTART' });
        });

        expect(result.current.state.gameTime).toBe(0);
        expect(result.current.state.score).toBe(0);
        expect(result.current.state.over).toBe(false);
    });
});
