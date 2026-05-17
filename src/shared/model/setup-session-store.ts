import { create } from 'zustand';

import type { CurrentUser } from '@/entities/user';

type SetupSessionStore = {
    returningUser: CurrentUser | null;
    hasSeenReturningPanel: boolean;
    setReturningUser: (user: CurrentUser | null) => void;
    markReturningPanelSeen: () => void;
};

export const useSetupSessionStore = create<SetupSessionStore>((set) => ({
    returningUser: null,
    hasSeenReturningPanel: false,
    setReturningUser: (user) => set({ returningUser: user }),
    markReturningPanelSeen: () => set({ hasSeenReturningPanel: true }),
}));
