import { httpClient } from '@/shared/lib';

type PostUserParams = {
    name: string;
    character: number;
};

export type PostUserResponse = {
    id: number;
    name: string;
    character: number;
    profileUrl: string | null;
};

export const postUser = async (params: PostUserParams): Promise<PostUserResponse> => {
    const { data } = await httpClient.post<PostUserResponse>('/api/users', params);
    return data;
};
