import { queryOptions } from '@tanstack/react-query';

import { getMe } from './get-me';

export const userQueryKeys = {
    all: 'user',
    me: 'user-me',
} as const;

export const userQuery = {
    me: () =>
        queryOptions({
            queryKey: [userQueryKeys.all, userQueryKeys.me],
            queryFn: getMe,
            staleTime: 60 * 1000 * 5,
            gcTime: 60 * 1000 * 10,
        }),
};
