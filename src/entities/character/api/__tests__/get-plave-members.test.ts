jest.mock('@/shared/lib', () => ({
    httpClient: {
        get: jest.fn(),
    },
}));

import { httpClient } from '@/shared/lib';
import { getPlaveMembers } from '../get-plave-members';

const mockGet = httpClient.get as jest.Mock;

describe('getPlaveMembers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('성공 시 플레이브 멤버 목록 반환', async () => {
        const mockData = [
            {
                id: 1,
                name: 'yejun',
                comments: null,
                created_at: '2024-01-01',
                color: null,
                profile: null,
            },
            {
                id: 2,
                name: 'noah',
                comments: null,
                created_at: '2024-01-01',
                color: null,
                profile: null,
            },
        ];
        mockGet.mockResolvedValue({ data: mockData });

        const result = await getPlaveMembers();

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith('/api/plave');
    });

    test('API 실패 시 에러 throw', async () => {
        mockGet.mockRejectedValue(new Error('DB 연결 실패'));

        await expect(getPlaveMembers()).rejects.toThrow('DB 연결 실패');
    });

    test('멤버가 없으면 빈 배열 반환', async () => {
        mockGet.mockResolvedValue({ data: [] });

        const result = await getPlaveMembers();

        expect(result).toEqual([]);
    });
});
