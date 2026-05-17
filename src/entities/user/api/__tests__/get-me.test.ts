jest.mock('@/shared/lib', () => ({
    httpClient: { get: jest.fn() },
}));

import { httpClient } from '@/shared/lib';
import { getMe } from '../get-me';

const mockGet = httpClient.get as jest.Mock;

describe('getMe', () => {
    beforeEach(() => jest.clearAllMocks());

    test('성공 시 사용자 정보 반환', async () => {
        const mockData = {
            id: 1,
            name: 'testuser',
            character: {
                memberId: 2,
                name: 'yejun',
                label: '예준',
                profile: null,
                color: null,
            },
        };
        mockGet.mockResolvedValue({ data: mockData });

        const result = await getMe();

        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith('/api/users');
    });

    test('로그인되지 않은 경우 null 반환', async () => {
        mockGet.mockResolvedValue({ data: null });

        const result = await getMe();

        expect(result).toBeNull();
    });

    test('API 실패 시 에러 throw', async () => {
        mockGet.mockRejectedValue(new Error('인증 실패'));

        await expect(getMe()).rejects.toThrow('인증 실패');
    });

    test('/api/users 엔드포인트 호출', async () => {
        mockGet.mockResolvedValue({ data: null });

        await getMe();

        expect(mockGet).toHaveBeenCalledWith('/api/users');
        expect(mockGet).toHaveBeenCalledTimes(1);
    });
});
