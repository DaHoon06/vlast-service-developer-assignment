jest.mock('@/shared/lib', () => ({
    httpClient: { get: jest.fn() },
}));

import { httpClient } from '@/shared/lib';
import { getRankings } from '../get-rankings';

const mockGet = httpClient.get as jest.Mock;

describe('getRankings', () => {
    beforeEach(() => jest.clearAllMocks());

    test('성공 시 랭킹 목록 반환', async () => {
        const mockData = [
            { id: 1, score: 1000, member: { id: 1, name: 'user1', character: 1 } },
            { id: 2, score: 800, member: { id: 2, name: 'user2', character: 2 } },
        ];
        mockGet.mockResolvedValue({ data: mockData });

        const result = await getRankings();

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith('/api/rank', { signal: undefined });
    });

    test('랭킹이 없으면 빈 배열 반환', async () => {
        mockGet.mockResolvedValue({ data: [] });

        const result = await getRankings();

        expect(result).toEqual([]);
    });

    test('API 실패 시 에러 throw', async () => {
        mockGet.mockRejectedValue(new Error('랭킹 조회 실패'));

        await expect(getRankings()).rejects.toThrow('랭킹 조회 실패');
    });

    test('/api/rank 엔드포인트 호출', async () => {
        mockGet.mockResolvedValue({ data: [] });

        await getRankings();

        expect(mockGet).toHaveBeenCalledWith('/api/rank', { signal: undefined });
        expect(mockGet).toHaveBeenCalledTimes(1);
    });
});
