jest.mock('../post-rank', () => ({
    postRank: jest.fn(),
}));

import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement, type ReactNode } from 'react';

import { rankingQuery, type Ranking } from '@/entities/ranking';
import type { User } from '@/entities/user';

import { postRank } from '../post-rank';
import { useSubmitRanking } from '../useSubmitRanking';

const mockPostRank = postRank as jest.Mock;

function makeWrapper(queryClient: QueryClient) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return createElement(QueryClientProvider, { client: queryClient }, children);
    };
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
}

const mockMe: NonNullable<User> = {
    id: 1,
    name: 'TestUser',
    character: { memberId: 2, name: 'char', label: '', profile: null, color: null },
};

const initialRankings: Ranking[] = [
    { id: 100, score: 500, member: { id: 1, name: 'TestUser', character: 2 } },
    { id: 101, score: 300, member: { id: 2, name: 'Other', character: 1 } },
];

describe('useSubmitRanking', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = makeQueryClient();
        queryClient.setQueryData(rankingQuery.list().queryKey, [...initialRankings]);
        jest.clearAllMocks();
    });

    afterEach(() => {
        queryClient.clear();
    });

    test('기존 유저의 점수를 optimistic update로 갱신 (높은 점수)', async () => {
        mockPostRank.mockResolvedValue(undefined);

        const { result } = renderHook(() => useSubmitRanking(mockMe), {
            wrapper: makeWrapper(queryClient),
        });

        result.current.mutate({ score: 800, user: 1 });

        await waitFor(() => {
            const updated = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(updated?.find((r) => r.member.id === 1)?.score).toBe(800);
        });
    });

    test('기존 유저의 새 점수가 낮으면 기존 최고 점수를 유지 (optimistic)', async () => {
        mockPostRank.mockResolvedValue(undefined);

        const { result } = renderHook(() => useSubmitRanking(mockMe), {
            wrapper: makeWrapper(queryClient),
        });

        result.current.mutate({ score: 300, user: 1 });

        await waitFor(() => {
            const updated = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(updated?.find((r) => r.member.id === 1)?.score).toBe(500);
        });
    });

    test('신규 유저이면 회원 정보로 랭킹에 추가 (optimistic)', async () => {
        mockPostRank.mockResolvedValue(undefined);

        const newMe: NonNullable<User> = {
            id: 99,
            name: 'NewUser',
            character: { memberId: 3, name: 'char3', label: '', profile: null, color: null },
        };

        const { result } = renderHook(() => useSubmitRanking(newMe), {
            wrapper: makeWrapper(queryClient),
        });

        result.current.mutate({ score: 600, user: 99 });

        await waitFor(() => {
            const updated = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(updated?.some((r) => r.member.id === 99)).toBe(true);
        });
    });

    test('회원 데이터가 없고 신규 유저이면 추가하지 않음', async () => {
        mockPostRank.mockResolvedValue(undefined);

        const { result } = renderHook(() => useSubmitRanking(undefined), {
            wrapper: makeWrapper(queryClient),
        });

        result.current.mutate({ score: 600, user: 99 });

        await waitFor(() => {
            const updated = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(updated?.some((r) => r.member.id === 99)).toBe(false);
        });
    });

    test('랭킹은 점수 내림차순 정렬 (optimistic)', async () => {
        mockPostRank.mockResolvedValue(undefined);

        const newMe: NonNullable<User> = {
            id: 99,
            name: 'TopUser',
            character: { memberId: 3, name: 'char3', label: '', profile: null, color: null },
        };

        const { result } = renderHook(() => useSubmitRanking(newMe), {
            wrapper: makeWrapper(queryClient),
        });

        result.current.mutate({ score: 1000, user: 99 });

        await waitFor(() => {
            const updated = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(updated?.[0].score).toBe(1000);
        });
    });

    test('API 오류 시 이전 데이터로 롤백', async () => {
        mockPostRank.mockRejectedValue(new Error('서버 오류'));

        const { result } = renderHook(() => useSubmitRanking(mockMe), {
            wrapper: makeWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutate({ score: 9999, user: 1 });
        });

        await waitFor(() => {
            const rankings = queryClient.getQueryData<Ranking[]>(rankingQuery.list().queryKey);
            expect(rankings).toEqual(initialRankings);
        });
    });

    test('성공 후 rankingQuery invalidate (재요청 트리거)', async () => {
        mockPostRank.mockResolvedValue(undefined);
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

        const { result } = renderHook(() => useSubmitRanking(mockMe), {
            wrapper: makeWrapper(queryClient),
        });

        await act(async () => {
            result.current.mutate({ score: 800, user: 1 });
        });

        await waitFor(() => {
            expect(invalidateSpy).toHaveBeenCalledWith(
                expect.objectContaining({ queryKey: rankingQuery.all() }),
            );
        });
    });
});
