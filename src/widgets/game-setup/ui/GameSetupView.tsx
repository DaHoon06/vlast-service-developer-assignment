'use client';

import { ReactElement, useEffect, useMemo, useState } from 'react';

import { UserPanel } from '@/features/game-setup';

import type { CharacterWithThumbnail } from '@/entities/character';
import type { CurrentUser } from '@/entities/user';

import { useSetupSessionStore } from '@/shared/model';

import { GameSetup } from './GameSetup';

interface GameSetupViewProps {
    characters: CharacterWithThumbnail[];
    currentUser: CurrentUser | null;
}

export const GameSetupView = ({ characters, currentUser }: GameSetupViewProps): ReactElement => {
    const [showForm, setShowForm] = useState(false);
    const { returningUser, hasSeenReturningPanel, setReturningUser, markReturningPanelSeen } =
        useSetupSessionStore();

    useEffect(() => {
        if (currentUser) {
            setReturningUser(currentUser);
            markReturningPanelSeen();
        }
    }, [currentUser, setReturningUser, markReturningPanelSeen]);

    const effectiveUser = currentUser ?? returningUser;

    const matchedCharacter = useMemo(
        () =>
            effectiveUser ? characters.find((c) => c.memberId === effectiveUser.character) : null,
        [characters, effectiveUser],
    );

    const showReturningPanel = Boolean(effectiveUser && matchedCharacter && !showForm);

    if (showReturningPanel && effectiveUser && matchedCharacter) {
        return (
            <UserPanel
                user={effectiveUser}
                character={matchedCharacter}
                disableEnterAnimation={hasSeenReturningPanel}
                onChangeUser={() => setShowForm(true)}
            />
        );
    }

    return (
        <GameSetup
            characters={characters}
            onCancel={effectiveUser ? () => setShowForm(false) : undefined}
        />
    );
};
