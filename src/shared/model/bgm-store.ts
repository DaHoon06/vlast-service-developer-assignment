import { create } from 'zustand';

type BgmStore = {
    enabled: boolean;
    toggle: () => void;
};

export const useBgmStore = create<BgmStore>((set) => ({
    enabled: false,
    toggle: () => set((s) => ({ enabled: !s.enabled })),
}));
