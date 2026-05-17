'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/shared/model';

export const useNavigation = () => {
    const router = useRouter();
    const { startLoading, stopLoading } = useLoadingStore();

    const push = useCallback(
        (href: string) => {
            startLoading();
            try {
                router.push(href);
            } catch {
                stopLoading();
            }
        },
        [router, startLoading, stopLoading],
    );

    return { push };
};
