import { act, renderHook } from '@testing-library/react';

import type { PlaveMember } from '@/entities/character';

import { useComboMilestone } from '../useComboMilestone';
import { MILESTONE_INTERVAL } from '@/widgets/baking-board/config/options';

const makeMember = (id: number): PlaveMember => ({
    id,
    name: `Member${id}`,
    comments: null,
    created_at: '',
    color: null,
    profile: null,
});

const members = [makeMember(1), makeMember(2), makeMember(3)];

describe('useComboMilestone', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('콤보 3 미만에서는 호출 안 함', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                initialProps: { combo: 0 },
            },
        );
        act(() => {
            rerender({ combo: 2 });
        });
        expect(setActiveMember).not.toHaveBeenCalled();
    });

    test('콤보 3에서 setActiveMember 호출', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                initialProps: { combo: 2 },
            },
        );
        act(() => {
            rerender({ combo: 3 });
        });
        expect(setActiveMember).toHaveBeenCalledWith(
            expect.objectContaining({ name: expect.any(String) }),
            true,
        );
    });

    test(`콤보 ${3 + MILESTONE_INTERVAL}에서 다시 호출 (milestone interval 준수)`, () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                initialProps: { combo: 3 + MILESTONE_INTERVAL - 1 },
            },
        );
        act(() => {
            rerender({ combo: 3 + MILESTONE_INTERVAL });
        });
        expect(setActiveMember).toHaveBeenCalledWith(
            expect.objectContaining({ name: expect.any(String) }),
            true,
        );
    });

    test('2500ms 후 setActiveMember(null, false) 호출', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                initialProps: { combo: 2 },
            },
        );
        act(() => {
            rerender({ combo: 3 });
        });
        act(() => {
            jest.advanceTimersByTime(2500);
        });
        expect(setActiveMember).toHaveBeenLastCalledWith(null, false);
    });

    test('콤보가 감소하면 호출 안 함', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                // combo: 4는 마일스톤이 아니므로 초기 렌더에서 호출 안 함
                initialProps: { combo: 4 },
            },
        );
        act(() => {
            rerender({ combo: 0 });
        });
        expect(setActiveMember).not.toHaveBeenCalled();
    });

    test('members가 비어있으면 호출 안 함', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members: [], setActiveMember }),
            {
                initialProps: { combo: 2 },
            },
        );
        act(() => {
            rerender({ combo: 3 });
        });
        expect(setActiveMember).not.toHaveBeenCalled();
    });

    test('마일스톤이 아닌 콤보 증가 시 호출 안 함', () => {
        const setActiveMember = jest.fn();
        const { rerender } = renderHook(
            ({ combo }) => useComboMilestone({ combo, members, setActiveMember }),
            {
                // combo: 4는 마일스톤이 아님 (3 이후 증가 중)
                initialProps: { combo: 4 },
            },
        );
        act(() => {
            rerender({ combo: 5 });
        });
        expect(setActiveMember).not.toHaveBeenCalled();
    });
});
