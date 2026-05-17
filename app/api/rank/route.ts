import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { getRankingsServer, rankingsCacheTag } from '@/entities/ranking/index.server';
import { supabase } from '@/shared/lib/supabase';

export const GET = async () => {
    try {
        const data = await getRankingsServer();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
};

type RankInsertBody = {
    score: number;
    user: number;
};

export const POST = async (req: NextRequest) => {
    const body: RankInsertBody = await req.json();
    const { score, user } = body;

    if (!Number.isFinite(score) || score < -500 || score > 100000 || !user) {
        return NextResponse.json({ error: 'score, user는 필수입니다.' }, { status: 400 });
    }

    const { data: existing } = await supabase
        .from('ranking')
        .select('id, score')
        .eq('member', user)
        .maybeSingle();

    let data, error;

    if (existing) {
        const bestScore = Math.max(existing.score, score);
        ({ data, error } = await supabase
            .from('ranking')
            .update({ score: bestScore })
            .eq('member', user)
            .select()
            .single());
    } else {
        ({ data, error } = await supabase
            .from('ranking')
            .insert({ score, member: user })
            .select()
            .single());
    }

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateTag(rankingsCacheTag);

    return NextResponse.json(data, { status: existing ? 200 : 201 });
};
