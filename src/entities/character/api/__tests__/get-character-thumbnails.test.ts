jest.mock('next/cache', () => ({
    unstable_cache: (fn: () => unknown) => fn,
}));

jest.mock('../get-plave-members', () => ({
    getPlaveMembers: jest.fn(),
}));

import { getPlaveMembers } from '../get-plave-members';
import { getCharacterThumbnails } from '../get-character-thumbnails';

const mockGetPlaveMembers = getPlaveMembers as jest.Mock;

const makeMember = (overrides = {}) => ({
    id: 1,
    name: 'yejun',
    profile: 'https://img.com/1.jpg',
    color: '#FF0000',
    comments: null,
    created_at: '2024-01-01',
    ...overrides,
});

describe('getCharacterThumbnails', () => {
    beforeEach(() => jest.clearAllMocks());

    test('멤버 목록을 CharacterThumbnail 형태로 변환', async () => {
        mockGetPlaveMembers.mockResolvedValue([
            makeMember({
                id: 1,
                name: 'yejun',
                profile: 'https://img.com/1.jpg',
                color: '#FF0000',
            }),
            makeMember({ id: 2, name: 'noah', profile: 'https://img.com/2.jpg', color: null }),
        ]);

        const result = await getCharacterThumbnails();

        expect(result).toEqual([
            { memberId: 1, name: 'yejun', profile: 'https://img.com/1.jpg', color: '#FF0000' },
            { memberId: 2, name: 'noah', profile: 'https://img.com/2.jpg', color: null },
        ]);
    });

    test('profile이 null이면 빈 문자열로 대체', async () => {
        mockGetPlaveMembers.mockResolvedValue([makeMember({ profile: null })]);

        const result = await getCharacterThumbnails();

        expect(result[0].profile).toBe('');
    });

    test('color가 null이면 null 유지', async () => {
        mockGetPlaveMembers.mockResolvedValue([makeMember({ color: null })]);

        const result = await getCharacterThumbnails();

        expect(result[0].color).toBeNull();
    });

    test('memberId는 원본 id 값', async () => {
        mockGetPlaveMembers.mockResolvedValue([makeMember({ id: 42 })]);

        const result = await getCharacterThumbnails();

        expect(result[0].memberId).toBe(42);
    });

    test('멤버가 없으면 빈 배열 반환', async () => {
        mockGetPlaveMembers.mockResolvedValue([]);

        const result = await getCharacterThumbnails();

        expect(result).toEqual([]);
    });

    test('getPlaveMembers 실패 시 에러 propagate', async () => {
        mockGetPlaveMembers.mockRejectedValue(new Error('API 실패'));

        await expect(getCharacterThumbnails()).rejects.toThrow('API 실패');
    });
});
