'use client';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

function makeQueryClient() {
    return new QueryClient({
        queryCache: new QueryCache(),
        mutationCache: new MutationCache(),
        defaultOptions: {
            queries: {
                retry: 1,
                gcTime: 5 * 60 * 1000,
                staleTime: 60 * 1000,
                refetchOnMount: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
                throwOnError: true,
            },
            mutations: {},
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (typeof window === 'undefined') return makeQueryClient();
    else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

const QueryDevtools = dynamic(() =>
    import('@tanstack/react-query-devtools').then(
        (mod) => mod.ReactQueryDevtools as typeof mod.ReactQueryDevtools,
    ),
);
const isProduction = process.env.NODE_ENV === 'production';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {!isProduction && <QueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
};
