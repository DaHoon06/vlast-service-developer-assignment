import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { generateCode } from '@/shared/lib';
import { supabase } from '@/shared/lib/supabase';

export const GET = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;
    if (!token) return NextResponse.json(null);

    const [code, idStr] = token.split('--');
    const id = Number(idStr);
    if (!code || !id) return NextResponse.json(null);

    const { data: user } = await supabase
        .from('member')
        .select('id, name, character')
        .eq('id', id)
        .eq('code', code)
        .single();

    if (!user) return NextResponse.json(null);

    const { data: member } = await supabase
        .from('plave-member')
        .select('id, name, profile, color')
        .eq('id', user.character)
        .single();

    return NextResponse.json({
        id: user.id,
        name: user.name,
        character: {
            memberId: member?.id ?? user.character,
            name: member?.name ?? '',
            label: member?.name ?? '',
            profile: member?.profile ?? null,
            color: member?.color ?? null,
        },
    });
};

type UserInsertBody = {
    name: string;
    character: number;
};

export const POST = async (req: NextRequest) => {
    const body: UserInsertBody = await req.json();
    const { name, character } = body;

    const trimmedName = name?.trim() ?? '';
    if (!trimmedName || !character) {
        return NextResponse.json({ error: 'name, character는 필수입니다.' }, { status: 400 });
    }

    if (!/^[\p{L}\p{N}\s]{1,20}$/u.test(trimmedName)) {
        return NextResponse.json(
            { error: '닉네임은 1~20자 이내 문자/숫자/공백만 사용할 수 있어요.' },
            { status: 400 },
        );
    }

    const { data: plaveMember } = await supabase
        .from('plave-member')
        .select('id')
        .eq('id', character)
        .single();

    if (!plaveMember) {
        return NextResponse.json({ error: '유효하지 않은 캐릭터입니다.' }, { status: 400 });
    }

    const code = generateCode();

    const { data, error } = await supabase
        .from('member')
        .insert({ name: trimmedName, code, character })
        .select('id, name, character')
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: member } = await supabase
        .from('plave-member')
        .select('id, name, profile')
        .eq('id', character)
        .single();

    const profileUrl = member?.profile ?? null;

    const token = `${code}--${data.id}`;
    const res = NextResponse.json(
        { id: data.id, name: data.name, character: data.character, profileUrl },
        { status: 201 },
    );

    res.cookies.set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    });

    return res;
};
