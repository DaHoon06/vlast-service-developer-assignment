'use client';

import Link from 'next/link';

import { useNavigation } from '@/shared/lib';
import { useGameStore } from '@/shared/model';
import { ROUTES } from '@/shared/routes';

import { RankingModal } from './RankingModal';

export const GameOverModal = () => {
    const { push } = useNavigation();
    const { finalScore, clearFinalScore, setPendingGameAction } = useGameStore();

    if (finalScore === null) return null;

    const handleHome = () => {
        clearFinalScore();
        push(ROUTES.HOME);
    };

    const handleRestart = () => {
        setPendingGameAction('restart');
        clearFinalScore();
    };

    return (
        <>
            <Link href={ROUTES.HOME} prefetch aria-hidden tabIndex={-1} className="sr-only" />
            <RankingModal onClose={() => {}} onHome={handleHome} onRestart={handleRestart} />
        </>
    );
};
