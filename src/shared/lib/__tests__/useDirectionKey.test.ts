jest.mock('../useClickSound', () => ({
    useClickSound: jest.fn(),
}));

import { useClickSound } from '../useClickSound';
import { act, renderHook } from '@testing-library/react';
import { useDirectionKey } from '../useDirectionKey';

const mockPlayClick = jest.fn();
const mockUseClickSound = jest.mocked(useClickSound);

function fireKey(key: string) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('useDirectionKey', () => {
    const mockOnEnter = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseClickSound.mockReturnValue(mockPlayClick);
    });

    function renderKey(options: Parameters<typeof useDirectionKey>[0]) {
        return renderHook(() => useDirectionKey(options));
    }

    test('ArrowRight → setSelectedIdx 호출 (오른쪽 이동)', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowRight'));

        expect(setSelectedIdx).toHaveBeenCalledTimes(1);
    });

    test('ArrowRight → 인덱스 순환: (4+1)%5 = 0', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowRight'));

        const updater = setSelectedIdx.mock.calls[0][0];
        expect(updater(4)).toBe(0);
    });

    test('ArrowLeft → setSelectedIdx 호출 (왼쪽 이동)', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowLeft'));

        expect(setSelectedIdx).toHaveBeenCalledTimes(1);
    });

    test('ArrowLeft → 인덱스 역순환: (0-1+5)%5 = 4', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowLeft'));

        const updater = setSelectedIdx.mock.calls[0][0];
        expect(updater(0)).toBe(4);
    });

    test('Enter + canSubmit=true → onEnter 호출', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('Enter'));

        expect(mockOnEnter).toHaveBeenCalledTimes(1);
    });

    test('Enter + canSubmit=false → onEnter 미호출', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: false, onEnter: mockOnEnter });

        act(() => fireKey('Enter'));

        expect(mockOnEnter).not.toHaveBeenCalled();
    });

    test('방향키 입력 시 playClick 호출', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowRight'));

        expect(mockPlayClick).toHaveBeenCalled();
    });

    test('Enter 입력 시 playClick 호출', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('Enter'));

        expect(mockPlayClick).toHaveBeenCalled();
    });

    test('itemCount ≤ 0 이면 이벤트 처리 안 함', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 0, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('ArrowRight'));

        expect(setSelectedIdx).not.toHaveBeenCalled();
    });

    test('관련 없는 키는 무시', () => {
        const setSelectedIdx = jest.fn();
        renderKey({ itemCount: 5, setSelectedIdx, canSubmit: true, onEnter: mockOnEnter });

        act(() => fireKey('a'));
        act(() => fireKey('Escape'));

        expect(setSelectedIdx).not.toHaveBeenCalled();
        expect(mockOnEnter).not.toHaveBeenCalled();
    });

    test('언마운트 후 키 입력 무시', () => {
        const setSelectedIdx = jest.fn();
        const { unmount } = renderKey({
            itemCount: 5,
            setSelectedIdx,
            canSubmit: true,
            onEnter: mockOnEnter,
        });

        unmount();
        act(() => fireKey('ArrowRight'));

        expect(setSelectedIdx).not.toHaveBeenCalled();
    });
});
