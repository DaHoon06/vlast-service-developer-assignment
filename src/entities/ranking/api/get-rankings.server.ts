import { unstable_cache } from 'next/cache';

import { supabase } from '@/shared/lib/supabase';

import type { RankingResponse } from './get-rankings';

export const rankingsCacheTag = 'rankings';

export const getRankingsServer = unstable_cache(
    async (): Promise<RankingResponse[]> => {
        const { data, error } = await supabase
            .from('ranking')
            .select('id, score, member!ranking_member_fkey(id, name, character)')
            .order('score', { ascending: false })
            .limit(10);

        if (error) throw new Error(error.message);
        return data as unknown as RankingResponse[];
    },
    ['rankings-list'],
    { revalidate: 60, tags: [rankingsCacheTag] },
);
