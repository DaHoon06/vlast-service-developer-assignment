import { cookies } from 'next/headers';

import { httpClient } from '@/shared/lib';

import type { MeResponse } from './get-me';

export const getMeServer = async (): Promise<MeResponse> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

    const { data } = await httpClient.get<MeResponse>('/api/users', {
        headers: { Cookie: cookieHeader },
    });
    return data;
};
