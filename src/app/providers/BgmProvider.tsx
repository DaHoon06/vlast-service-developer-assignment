'use client';

import { useBgm } from '@/shared/lib/useBgm';

export const BgmProvider = ({ children }: { children: React.ReactNode }) => {
    useBgm();
    return <>{children}</>;
};
