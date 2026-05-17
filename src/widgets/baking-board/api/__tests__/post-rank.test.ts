import { httpClient } from '@/shared/lib';
import { postRank } from '../post-rank';

jest.mock('@/shared/lib', () => ({
    httpClient: { post: jest.fn() },
}));

const mockPost = httpClient.post as jest.Mock;

describe('postRank', () => {
    beforeEach(() => jest.clearAllMocks());

    test('성공 시 랭킹 데이터 반환', async () => {
        const mockData = { id: 1, score: 500, member: 1 };
        mockPost.mockResolvedValue({ data: mockData });

        await expect(postRank({ score: 500, user: 1 })).resolves.toEqual(mockData);
        expect(mockPost).toHaveBeenCalledWith('/api/rank', { score: 500, user: 1 });
    });

    test('응답 실패 시 서버 메시지로 에러 throw', async () => {
        mockPost.mockRejectedValue(new Error('score, user는 필수입니다.'));

        await expect(postRank({ score: 0, user: 0 })).rejects.toThrow('score, user는 필수입니다.');
    });

    test('응답 본문에 error 필드가 없으면 기본 에러 메시지 사용', async () => {
        mockPost.mockRejectedValue(new Error('랭킹 저장 실패'));

        await expect(postRank({ score: 100, user: 1 })).rejects.toThrow('랭킹 저장 실패');
    });

    test('JSON 파싱 실패 시 기본 에러 메시지 사용', async () => {
        mockPost.mockRejectedValue(new Error('랭킹 저장 실패'));

        await expect(postRank({ score: 100, user: 1 })).rejects.toThrow('랭킹 저장 실패');
    });
});
