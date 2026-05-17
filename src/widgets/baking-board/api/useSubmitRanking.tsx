'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rankingQuery, type Ranking } from '@/entities/ranking';
import type { User } from '@/entities/user';

import { postRank } from './post-rank';

export const useSubmitRanking = (
    me: User | undefined,
    onOptimisticUpdate?: (score: number) => void,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postRank,
        onMutate: async ({ score, user }) => {
            await queryClient.cancelQueries({ queryKey: rankingQuery.all() });
            const previousRankings = queryClient.getQueryData<Ranking[]>(
                rankingQuery.list().queryKey,
            );

            queryClient.setQueryData<Ranking[]>(rankingQuery.list().queryKey, (old = []) => {
                const exists = old.some((r) => r.member.id === user);
                let updated: Ranking[];
                if (exists) {
                    updated = old.map((r) =>
                        r.member.id === user ? { ...r, score: Math.max(r.score, score) } : r,
                    );
                } else if (me) {
                    updated = [
                        ...old,
                        {
                            id: Date.now(),
                            score,
                            member: { id: user, name: me.name, character: me.character.memberId },
                        },
                    ];
                } else {
                    updated = old;
                }
                return updated.sort((a, b) => b.score - a.score).slice(0, 10);
            });

            onOptimisticUpdate?.(score);

            return { previousRankings };
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(rankingQuery.list().queryKey, context?.previousRankings);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: rankingQuery.all() });
        },
    });
};
