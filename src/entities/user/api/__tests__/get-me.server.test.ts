jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

jest.mock('@/shared/lib', () => ({
    httpClient: { get: jest.fn() },
}));

import { cookies } from 'next/headers';
import { httpClient } from '@/shared/lib';
import { getMeServer } from '../get-me.server';

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockGet = httpClient.get as jest.Mock;

describe('getMeServer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCookies.mockResolvedValue({
            getAll: () => [],
        } as never);
    });

    test('쿠키가 있으면 Cookie 헤더에 포함하여 API 호출', async () => {
        mockCookies.mockResolvedValue({
            getAll: () => [
                { name: 'user_token', value: 'abc--1' },
                { name: 'session', value: 'xyz' },
            ],
        } as never);
        const mockData = {
            id: 1,
            name: 'test',
            character: { memberId: 1, name: 'c', label: '', profile: null, color: null },
        };
        mockGet.mockResolvedValue({ data: mockData });

        const result = await getMeServer();

        expect(mockGet).toHaveBeenCalledWith('/api/users', {
            headers: { Cookie: 'user_token=abc--1; session=xyz' },
        });
        expect(result).toEqual(mockData);
    });

    test('쿠키가 없으면 빈 Cookie 헤더로 API 호출', async () => {
        mockGet.mockResolvedValue({ data: null });

        await getMeServer();

        expect(mockGet).toHaveBeenCalledWith('/api/users', {
            headers: { Cookie: '' },
        });
    });

    test('미인증 시 null 반환', async () => {
        mockGet.mockResolvedValue({ data: null });

        const result = await getMeServer();

        expect(result).toBeNull();
    });

    test('단일 쿠키만 있으면 세미콜론 없이 전달', async () => {
        mockCookies.mockResolvedValue({
            getAll: () => [{ name: 'user_token', value: 'tok--42' }],
        } as never);
        mockGet.mockResolvedValue({ data: null });

        await getMeServer();

        expect(mockGet).toHaveBeenCalledWith('/api/users', {
            headers: { Cookie: 'user_token=tok--42' },
        });
    });
});
