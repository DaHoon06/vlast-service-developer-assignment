import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

export const getServerQueryClient = cache(
    () =>
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                },
            },
        }),
);
