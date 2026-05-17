import { httpClient } from '@/shared/lib';

type PostRankParams = {
    score: number;
    user: number;
};

export type PostRankResponse = {
    id: number;
    score: number;
    member: number;
};

export const postRank = async (params: PostRankParams): Promise<PostRankResponse> => {
    const { data } = await httpClient.post<PostRankResponse>('/api/rank', params);
    return data;
};
