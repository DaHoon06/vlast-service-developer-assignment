import { httpClient } from '@/shared/lib';

export type PlaveMemberResponse = {
    id: number;
    name: string;
    comments: string | null;
    created_at: string;
    color: string | null;
    profile: string | null;
};

export const getPlaveMembers = async (): Promise<PlaveMemberResponse[]> => {
    const url = '/api/plave';
    const { data } = await httpClient.get<PlaveMemberResponse[]>(url);
    return data;
};
