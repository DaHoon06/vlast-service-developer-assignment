import { postUser } from '../post-user';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function mockSuccess(body: unknown) {
    mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(body),
        headers: new Headers(),
    });
}

function mockFailure(status: number, body: unknown) {
    mockFetch.mockResolvedValue({
        ok: false,
        status,
        text: () => Promise.resolve(JSON.stringify(body)),
    });
}

describe('postUser', () => {
    beforeEach(() => jest.clearAllMocks());

    test('성공 시 유저 데이터 반환', async () => {
        const mockResponse = { id: 1, name: 'testuser', character: 1, profileUrl: null };
        mockSuccess(mockResponse);

        const result = await postUser({ name: 'testuser', character: 1 });

        expect(result).toEqual(mockResponse);
    });

    test('응답 실패 시 서버 메시지로 에러 throw', async () => {
        mockFailure(400, { message: 'name, character는 필수입니다.' });

        await expect(postUser({ name: '', character: 1 })).rejects.toMatchObject({
            message: 'name, character는 필수입니다.',
        });
    });

    test('응답 본문에 message 필드가 없으면 기본 에러 메시지 사용', async () => {
        mockFailure(500, {});

        await expect(postUser({ name: 'test', character: 1 })).rejects.toMatchObject({
            message: '알 수 없는 에러가 발생했습니다.',
        });
    });

    test('POST 메서드로 올바른 경로에 요청', async () => {
        mockSuccess({ id: 1, name: 'test', character: 2, profileUrl: null });

        await postUser({ name: 'test', character: 2 });

        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/users'),
            expect.objectContaining({ method: 'POST' }),
        );
    });
});
