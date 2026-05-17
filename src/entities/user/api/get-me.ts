import { httpClient } from '@/shared/lib';

export type MeResponse = {
    id: number;
    name: string;
    character: {
        memberId: number;
        name: string;
        label: string;
        profile: string | null;
        color: string | null;
    };
} | null;

export const getMe = async (): Promise<MeResponse> => {
    const url = '/api/users';
    const { data } = await httpClient.get<MeResponse>(url);
    return data;
};
