import { queryOptions } from '@tanstack/react-query';
import { getRankings } from './get-rankings';

export const rankingQueryKeys = {
    all: 'ranking',
    list: 'ranking-list',
};

export const rankingQuery = {
    all: () => [rankingQueryKeys.all] as const,
    list: () =>
        queryOptions({
            queryKey: [...rankingQuery.all(), rankingQueryKeys.list],
            queryFn: ({ signal }) => getRankings({ signal }),
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
        }),
};
