import { ReactElement } from 'react';
import { preload } from 'react-dom';

import { getCharacterThumbnails } from '@/entities/character/index.server';
import { getCurrentUser } from '@/entities/user/index.server';

import { GameSetupView } from './GameSetupView';

export const GameSetupServer = async (): Promise<ReactElement> => {
    const [characters, currentUser] = await Promise.all([
        getCharacterThumbnails(),
        getCurrentUser(),
    ]);

    characters.forEach((character, idx) =>
        preload(character.profile, { as: 'image', fetchPriority: idx === 0 ? 'high' : 'low' }),
    );

    return <GameSetupView characters={characters} currentUser={currentUser} />;
};
