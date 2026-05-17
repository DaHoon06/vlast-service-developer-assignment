import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getPlaveMembers } from '@/entities/character';
import { rankingQuery } from '@/entities/ranking';
import { getRankingsServer } from '@/entities/ranking/index.server';
import { getMeServer } from '@/entities/user/index.server';
import { GameOverModal } from '@/features/ranking';
import { ROUTES } from '@/shared/routes';
import { getServerQueryClient } from '@/shared/lib/query-client.server';
import { BakingBoard } from '@/widgets/baking-board';
import { GameHud } from '@/widgets/game-setup';
import { PageControls } from '@/widgets/page-controls';

export const GamePage = async () => {
    const queryClient = getServerQueryClient();

    const [me, members] = await Promise.all([
        getMeServer().catch(() => null),
        getPlaveMembers(),
        queryClient.prefetchQuery({
            queryKey: rankingQuery.list().queryKey,
            queryFn: getRankingsServer,
        }),
    ]);

    if (!me || !members) redirect(ROUTES.HOME);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="flex size-full items-center justify-center overflow-hidden">
                <div className="relative h-full max-h-[900px] w-full max-w-2xl">
                    <div className="relative flex h-full flex-col gap-4 p-4">
                        <PageControls showHomeButton />

                        <div className="flex w-full max-w-2xl flex-col gap-1">
                            <GameHud initialMe={me ?? undefined} />
                            <BakingBoard members={members} />
                        </div>
                    </div>
                </div>
                <GameOverModal />
            </main>
        </HydrationBoundary>
    );
};
