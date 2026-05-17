'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { useLoadingStore } from '@/shared/model';

import { LoadingOverlay } from '../../shared/ui/loading/LoadingOverlay';

const NavigationEvents = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { startLoading, stopLoading } = useLoadingStore();
    const prevKeyRef = useRef(pathname + (searchParams?.toString() ?? ''));

    useEffect(() => {
        const current = pathname + (searchParams?.toString() ?? '');
        if (prevKeyRef.current !== current) {
            prevKeyRef.current = current;
            stopLoading();
        }
    }, [pathname, searchParams, stopLoading]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (
                !href ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:')
            )
                return;

            const isExternal = href.startsWith('http') && !href.startsWith(window.location.origin);
            if (isExternal) return;

            const targetPath = href.startsWith('/') ? href : new URL(href).pathname;
            if (targetPath !== pathname) {
                startLoading();
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [pathname, startLoading]);

    return null;
}

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Suspense fallback={null}>
                <NavigationEvents />
            </Suspense>
            {children}
            <LoadingOverlay />
        </>
    );
};
