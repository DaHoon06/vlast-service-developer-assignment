import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import { supabase } from '@/shared/lib/supabase';

export type PlaveMember = {
    id: number;
    name: string;
    comments: string | null;
    created_at: string;
    color: string | null;
};

const fetchPlaveMembers = unstable_cache(
    async (): Promise<PlaveMember[]> => {
        const { data, error } = await supabase.from('plave-member').select('*');
        if (error) throw new Error(error.message);
        return data as PlaveMember[];
    },
    ['plave-members'],
    { revalidate: 86400, tags: ['plave-members'] },
);

export const GET = async () => {
    try {
        const data = await fetchPlaveMembers();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
