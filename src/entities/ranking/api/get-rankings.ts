import { httpClient } from '@/shared/lib';

export type RankingResponse = {
    id: number;
    score: number;
    member: {
        id: number;
        name: string;
        character: number;
    };
};

export const getRankings = async ({ signal }: { signal?: AbortSignal } = {}): Promise<RankingResponse[]> => {
    const { data } = await httpClient.get<RankingResponse[]>('/api/rank', { signal });
    return data;
};
