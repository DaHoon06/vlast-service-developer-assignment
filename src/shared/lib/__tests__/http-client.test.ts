import HttpClient from '../http-client';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const client = new HttpClient('http://test.com');

function okResponse(data: unknown) {
    return {
        ok: true,
        json: () => Promise.resolve(data),
        headers: new Headers(),
    };
}

function errorResponse(status: number, body: string) {
    return {
        ok: false,
        status,
        statusText: 'Error',
        text: () => Promise.resolve(body),
    };
}

describe('HttpClient', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('get', () => {
        test('성공 시 data 반환', async () => {
            mockFetch.mockResolvedValue(okResponse({ value: 1 }));

            const { data } = await client.get('/path');

            expect(data).toEqual({ value: 1 });
            expect(mockFetch).toHaveBeenCalledWith(
                'http://test.com/path',
                expect.objectContaining({ method: 'GET' }),
            );
        });

        test('params가 있으면 query string 추가', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.get('/path', { params: { a: '1', b: '2' } });

            const [url] = mockFetch.mock.calls[0];
            expect(url).toContain('a=1');
            expect(url).toContain('b=2');
        });

        test('cache 기본값은 no-store', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.get('/path');

            const [, options] = mockFetch.mock.calls[0];
            expect(options.cache).toBe('no-store');
        });

        test('next 옵션이 있으면 fetchOptions.next 설정, cache 미설정', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.get('/path', { next: { revalidate: 60 } });

            const [, options] = mockFetch.mock.calls[0];
            expect(options.next).toEqual({ revalidate: 60 });
            expect(options.cache).toBeUndefined();
        });

        test('에러 응답에 message가 있으면 해당 message와 statusCode throw', async () => {
            mockFetch.mockResolvedValue(
                errorResponse(404, JSON.stringify({ message: '리소스 없음' })),
            );

            await expect(client.get('/path')).rejects.toMatchObject({
                message: '리소스 없음',
                statusCode: 404,
            });
        });

        test('에러 응답에 message 없으면 기본 메시지 throw', async () => {
            mockFetch.mockResolvedValue(
                errorResponse(500, JSON.stringify({ code: 'INTERNAL' })),
            );

            await expect(client.get('/path')).rejects.toMatchObject({
                message: '알 수 없는 에러가 발생했습니다.',
                statusCode: 500,
            });
        });

        test('에러 응답 본문이 JSON이 아니면 기본 메시지 throw', async () => {
            mockFetch.mockResolvedValue(errorResponse(503, 'Service Unavailable'));

            await expect(client.get('/path')).rejects.toMatchObject({
                message: '알 수 없는 에러가 발생했습니다.',
                statusCode: 503,
            });
        });

        test('에러 응답에 data 필드 있으면 포함', async () => {
            mockFetch.mockResolvedValue(
                errorResponse(400, JSON.stringify({ message: '오류', data: { field: 'name' } })),
            );

            await expect(client.get('/path')).rejects.toMatchObject({
                data: { field: 'name' },
            });
        });

        test('baseUrl과 path 결합', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.get('/api/test');

            const [url] = mockFetch.mock.calls[0];
            expect(url).toBe('http://test.com/api/test');
        });
    });

    describe('post', () => {
        test('성공 시 data 반환', async () => {
            mockFetch.mockResolvedValue(okResponse({ id: 1 }));

            const { data } = await client.post('/path', { name: 'test' });

            expect(data).toEqual({ id: 1 });
        });

        test('JSON body 직렬화 전송', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.post('/path', { key: 'val' });

            const [, options] = mockFetch.mock.calls[0];
            expect(options.body).toBe(JSON.stringify({ key: 'val' }));
            expect(options.headers['Content-Type']).toBe('application/json');
        });

        test('FormData이면 Content-Type 헤더 미설정', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.post('/path', new FormData());

            const [, options] = mockFetch.mock.calls[0];
            expect(options.headers['Content-Type']).toBeUndefined();
        });

        test('body 없으면 undefined 전송', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.post('/path');

            const [, options] = mockFetch.mock.calls[0];
            expect(options.body).toBeUndefined();
        });

        test('에러 응답 시 throw', async () => {
            mockFetch.mockResolvedValue(
                errorResponse(400, JSON.stringify({ message: '잘못된 요청' })),
            );

            await expect(client.post('/path', {})).rejects.toBeTruthy();
        });
    });

    describe('patch', () => {
        test('성공 시 data 반환', async () => {
            mockFetch.mockResolvedValue(okResponse({ updated: true }));

            const { data } = await client.patch('/path', { field: 'new' });

            expect(data).toEqual({ updated: true });
        });

        test('PATCH 메서드와 Content-Type 헤더로 호출', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.patch('/path', { field: 'val' });

            const [, options] = mockFetch.mock.calls[0];
            expect(options.method).toBe('PATCH');
            expect(options.headers['Content-Type']).toBe('application/json');
        });
    });

    describe('delete', () => {
        test('성공 시 data 반환', async () => {
            mockFetch.mockResolvedValue(okResponse({ deleted: true }));

            const { data } = await client.delete('/path');

            expect(data).toEqual({ deleted: true });
        });

        test('params가 있으면 query string 추가', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.delete('/path', { params: { id: '1' } });

            const [url] = mockFetch.mock.calls[0];
            expect(url).toContain('id=1');
        });

        test('DELETE 메서드로 호출', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.delete('/path');

            const [, options] = mockFetch.mock.calls[0];
            expect(options.method).toBe('DELETE');
        });
    });

    describe('put', () => {
        test('성공 시 data 반환', async () => {
            mockFetch.mockResolvedValue(okResponse({ replaced: true }));

            const { data } = await client.put('/path', { body: 'data' });

            expect(data).toEqual({ replaced: true });
        });

        test('PUT 메서드와 Content-Type 헤더로 호출', async () => {
            mockFetch.mockResolvedValue(okResponse({}));

            await client.put('/path', { body: 'data' });

            const [, options] = mockFetch.mock.calls[0];
            expect(options.method).toBe('PUT');
            expect(options.headers['Content-Type']).toBe('application/json');
        });
    });
});
