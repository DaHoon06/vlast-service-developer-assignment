import { queryOptions } from '@tanstack/react-query';

import { getPlaveMembers } from './get-plave-members';

export const characterQueryKeys = {
    all: 'character',
    members: 'character-members',
} as const;

export const characterQuery = {
    members: () =>
        queryOptions({
            queryKey: [characterQueryKeys.all, characterQueryKeys.members],
            queryFn: getPlaveMembers,
            staleTime: Infinity,
            gcTime: 24 * 60 * 60 * 1000,
        }),
};
