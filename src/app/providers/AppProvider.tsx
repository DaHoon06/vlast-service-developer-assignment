import React from 'react';
import { QueryProvider } from './QueryProvider';
import { LoadingProvider } from './LoadingProvider';
import { BgmProvider } from './BgmProvider';
import { AppErrorBoundary } from '@/shared/ui';

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <AppErrorBoundary>
            <LoadingProvider>
                <QueryProvider>
                    <BgmProvider>{children}</BgmProvider>
                </QueryProvider>
            </LoadingProvider>
        </AppErrorBoundary>
    );
};
