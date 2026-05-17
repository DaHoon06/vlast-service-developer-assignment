'use client';

import { RankingButton } from '@/features/ranking';
import { HomeButton, SoundButton } from '@/shared/ui';
import { ReactElement } from 'react';

interface PageControlsProps {
    showHomeButton?: boolean;
}

export const PageControls = ({ showHomeButton = false }: PageControlsProps): ReactElement => (
    <header className="flex justify-between gap-2">
        {showHomeButton ? <HomeButton /> : <div />}
        <div className="flex justify-end gap-2">
            <SoundButton />
            <RankingButton />
        </div>
    </header>
);
