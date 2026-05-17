import qs from 'qs';
import { FetchError, type ErrorObjectType } from './fetch-error';

async function rejectIfNeeded(response: Response) {
    if (!response.ok) {
        const text = await response.text();
        let data: unknown;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = text;
        }

        throw new FetchError(response, data as ErrorObjectType);
    }

    return response;
}

type RequestConfig = {
    params?: Record<string, unknown>;
    next?: {
        revalidate?: number;
    };
} & RequestInit;

interface IHttpClient {
    get<T>(url: string, config?: RequestConfig): Promise<{ data: T; headers?: Headers }>;
    post<T>(
        url: string,
        body?: unknown,
        config?: RequestConfig,
    ): Promise<{ data: T; headers?: Headers }>;
    patch<T>(
        url: string,
        body?: unknown,
        config?: RequestConfig,
    ): Promise<{ data: T; headers?: Headers }>;
    delete<T>(url: string, config?: RequestConfig): Promise<{ data: T; headers?: Headers }>;
    put<T>(
        url: string,
        body?: unknown,
        config?: RequestConfig,
    ): Promise<{ data: T; headers?: Headers }>;
}

class HttpClient implements IHttpClient {
    private baseUrl: string;

    constructor(url: string) {
        this.baseUrl = url;
    }

    public async get<T>(url: string, config: RequestConfig = {}) {
        try {
            const queryString = config?.params
                ? qs.stringify(config.params, { addQueryPrefix: true })
                : '';
            const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
                method: 'GET',
                headers: {
                    ...(config?.headers ?? {}),
                },
                signal: config.signal,
            };

            if (config?.next) {
                fetchOptions.next = config.next;
            } else {
                fetchOptions.cache = config?.cache ?? 'no-store';
            }

            const res = await fetch(this.baseUrl.concat(url, queryString), fetchOptions);

            await rejectIfNeeded(res);
            const data: T = await res.json();

            const { ok, headers } = res;
            if (ok) {
                return { data, headers };
            }

            throw data;
        } catch (e) {
            if (e instanceof FetchError) {
                const errorData = e.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    throw {
                        message: errorData.message || '알 수 없는 에러가 발생했습니다.',
                        statusCode: e.status,
                        data: errorData.data || {},
                    };
                }
                throw {
                    message: '알 수 없는 에러가 발생했습니다.',
                    statusCode: e.status,
                    data: {},
                };
            }
            throw e;
        }
    }

    public async post<T>(url: string, body?: unknown, config: RequestConfig = {}) {
        const isFormData = body instanceof FormData;

        try {
            const res = await fetch(this.baseUrl.concat(url), {
                method: 'POST',
                headers: {
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                    ...(config.headers ?? {}),
                },
                cache: config?.cache,
                signal: config.signal,
                body: isFormData ? body : body ? JSON.stringify(body) : undefined,
            });

            await rejectIfNeeded(res);
            const data: T = await res.json();

            return { data, headers: res.headers };
        } catch (e) {
            if (e instanceof FetchError) {
                const errorData = e.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    throw {
                        message: errorData.message || '알 수 없는 에러가 발생했습니다.',
                        statusCode: e.status,
                        data: errorData.data || {},
                    };
                }
                throw {
                    message: '알 수 없는 에러가 발생했습니다.',
                    statusCode: e.status,
                    data: {},
                };
            }
            throw e;
        }
    }

    public async patch<T>(url: string, body: unknown, config: RequestConfig = {}) {
        try {
            const res = await fetch(this.baseUrl.concat(url), {
                method: 'PATCH',
                headers: {
                    ...(body ? { 'Content-Type': 'application/json' } : {}),
                    ...(config.headers ?? {}),
                },
                cache: config?.cache,
                signal: config.signal,
                body: JSON.stringify(body),
            });

            await rejectIfNeeded(res);
            const data: T = await res.json();

            return { data, headers: res.headers };
        } catch (e) {
            if (e instanceof FetchError) {
                const errorData = e.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    throw {
                        message: errorData.message || '알 수 없는 에러가 발생했습니다.',
                        statusCode: e.status,
                        data: errorData.data || {},
                    };
                }
                throw {
                    message: '알 수 없는 에러가 발생했습니다.',
                    statusCode: e.status,
                    data: {},
                };
            }
            throw e;
        }
    }

    public async delete<T>(url: string, config: RequestConfig = {}) {
        const querystring = config?.params
            ? qs.stringify(config?.params, { addQueryPrefix: true })
            : '';

        try {
            const res = await fetch(this.baseUrl.concat(url, querystring), {
                method: 'DELETE',
                headers: {
                    ...(config.body ? { 'Content-Type': 'application/json' } : {}),
                    ...(config.headers ?? {}),
                },
                signal: config.signal,
                body: config.body,
            });

            await rejectIfNeeded(res);
            const data: T = await res.json();

            return { data, headers: res.headers };
        } catch (e) {
            if (e instanceof FetchError) {
                const errorData = e.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    throw {
                        message: errorData.message || '알 수 없는 에러가 발생했습니다.',
                        statusCode: e.status,
                        data: errorData.data || {},
                    };
                }
                throw {
                    message: '알 수 없는 에러가 발생했습니다.',
                    statusCode: e.status,
                    data: {},
                };
            }
            throw e;
        }
    }

    public async put<T>(url: string, body?: unknown, config: RequestConfig = {}) {
        try {
            const res = await fetch(this.baseUrl.concat(url), {
                method: 'PUT',
                headers: {
                    ...(body ? { 'Content-Type': 'application/json' } : {}),
                    ...(config.headers ?? {}),
                },
                cache: config?.cache,
                signal: config.signal,
                body: JSON.stringify(body),
            });

            await rejectIfNeeded(res);
            const data: T = await res.json();

            return { data, headers: res.headers };
        } catch (e) {
            if (e instanceof FetchError) {
                const errorData = e.data;
                if (typeof errorData === 'object' && errorData !== null) {
                    throw {
                        message: errorData.message || '알 수 없는 에러가 발생했습니다.',
                        statusCode: e.status,
                        data: errorData.data || {},
                    };
                }
                throw {
                    message: '알 수 없는 에러가 발생했습니다.',
                    statusCode: e.status,
                    data: {},
                };
            }
            throw e;
        }
    }
}

export default HttpClient;
