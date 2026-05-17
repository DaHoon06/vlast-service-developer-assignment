'use client';

import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './ErrorFallback';

export const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};
