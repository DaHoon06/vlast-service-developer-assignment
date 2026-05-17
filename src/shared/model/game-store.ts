import { create } from 'zustand';

export type GameAction = 'restart' | null;

export type ActiveMember = {
    id: number;
    name: string;
    comments: string | null;
    created_at: string;
    color: string | null;
    profile: string | null;
};

type GameStore = {
    finalScore: number | null;
    pendingGameAction: GameAction;
    activeMember: ActiveMember | null;
    showComment: boolean;
    setFinalScore: (score: number) => void;
    clearFinalScore: () => void;
    setPendingGameAction: (action: GameAction) => void;
    setActiveMember: (member: ActiveMember | null, show: boolean) => void;
};

export const useGameStore = create<GameStore>()((set) => ({
    finalScore: null,
    pendingGameAction: null,
    activeMember: null,
    showComment: false,
    setFinalScore: (score) => set({ finalScore: score }),
    clearFinalScore: () => set({ finalScore: null }),
    setPendingGameAction: (action) => set({ pendingGameAction: action }),
    setActiveMember: (member, show) => set({ activeMember: member, showComment: show }),
}));
