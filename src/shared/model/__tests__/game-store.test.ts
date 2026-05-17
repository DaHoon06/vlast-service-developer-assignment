import type { ActiveMember } from '../game-store';
import { useGameStore } from '../game-store';

const mockMember: ActiveMember = {
    id: 1,
    name: 'yejun',
    comments: '안녕하세요',
    created_at: '2026-05-17',
    color: '#FF0000',
    profile: null,
};

describe('useGameStore', () => {
    beforeEach(() => {
        useGameStore.setState({
            finalScore: null,
            pendingGameAction: null,
            activeMember: null,
            showComment: false,
        });
    });

    describe('초기 상태', () => {
        test('finalScore는 null', () => {
            expect(useGameStore.getState().finalScore).toBeNull();
        });

        test('pendingGameAction은 null', () => {
            expect(useGameStore.getState().pendingGameAction).toBeNull();
        });

        test('activeMember는 null, showComment는 false', () => {
            const { activeMember, showComment } = useGameStore.getState();
            expect(activeMember).toBeNull();
            expect(showComment).toBe(false);
        });
    });

    describe('setFinalScore', () => {
        test('finalScore를 주어진 값으로 업데이트', () => {
            useGameStore.getState().setFinalScore(300);
            expect(useGameStore.getState().finalScore).toBe(300);
        });

        test('음수 점수도 저장', () => {
            useGameStore.getState().setFinalScore(-200);
            expect(useGameStore.getState().finalScore).toBe(-200);
        });

        test('0점도 저장', () => {
            useGameStore.getState().setFinalScore(0);
            expect(useGameStore.getState().finalScore).toBe(0);
        });
    });

    describe('clearFinalScore', () => {
        test('finalScore를 null로 초기화', () => {
            useGameStore.setState({ finalScore: 500 });
            useGameStore.getState().clearFinalScore();
            expect(useGameStore.getState().finalScore).toBeNull();
        });
    });

    describe('setPendingGameAction', () => {
        test('restart 설정', () => {
            useGameStore.getState().setPendingGameAction('restart');
            expect(useGameStore.getState().pendingGameAction).toBe('restart');
        });

        test('null로 초기화', () => {
            useGameStore.setState({ pendingGameAction: 'restart' });
            useGameStore.getState().setPendingGameAction(null);
            expect(useGameStore.getState().pendingGameAction).toBeNull();
        });
    });

    describe('setActiveMember', () => {
        test('멤버 설정 및 showComment 동시 토글', () => {
            useGameStore.getState().setActiveMember(mockMember, true);
            const { activeMember, showComment } = useGameStore.getState();
            expect(activeMember).toEqual(mockMember);
            expect(showComment).toBe(true);
        });

        test('null로 멤버 초기화 및 showComment false', () => {
            useGameStore.setState({ activeMember: mockMember, showComment: true });
            useGameStore.getState().setActiveMember(null, false);
            expect(useGameStore.getState().activeMember).toBeNull();
            expect(useGameStore.getState().showComment).toBe(false);
        });

        test('show=false로 멤버만 교체', () => {
            useGameStore.getState().setActiveMember(mockMember, false);
            expect(useGameStore.getState().activeMember).toEqual(mockMember);
            expect(useGameStore.getState().showComment).toBe(false);
        });
    });
});
