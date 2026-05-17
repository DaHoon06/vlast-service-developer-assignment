import { getMeServer } from '@/entities/user/index.server';

import { GameHud } from './GameHud';
import { ReactElement } from 'react';

export const GameHudServer = async (): Promise<ReactElement> => {
    const me = await getMeServer().catch(() => null);
    return <GameHud initialMe={me ?? undefined} />;
};
