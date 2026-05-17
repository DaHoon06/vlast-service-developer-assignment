import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { GameSetupServer } from '@/widgets/game-setup/ui/GameSetup.server';

import { PageControls } from '@/widgets/page-controls';

import { getServerQueryClient } from '@/shared/lib/query-client.server';
import { userQuery } from '@/entities/user';
import { getMeServer } from '@/entities/user/index.server';

export const HomePage = async () => {
    const queryClient = getServerQueryClient();

    await queryClient.prefetchQuery({
        queryKey: userQuery.me().queryKey,
        queryFn: getMeServer,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <main className="flex min-h-full w-full flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl overflow-hidden sm:h-full sm:max-h-[900px]">
                    <div className="bg-linear-to-br absolute inset-0 from-purple-400/20 via-pink-400/20 to-orange-400/20 blur-3xl" />
                    <div className="relative flex flex-col gap-4 p-4 sm:h-full">
                        <PageControls />
                        <GameSetupServer />
                    </div>
                </div>
            </main>
        </HydrationBoundary>
    );
};
