'use client';

import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CharacterSelector } from '@/features/character-selection';
import { NicknameInput, postUser } from '@/features/game-setup';

import type { CharacterWithThumbnail } from '@/entities/character';
import { userQuery } from '@/entities/user';

import { useClickSound, useDirectionKey } from '@/shared/lib';
import { NavButton } from '@/shared/ui';
import { useLoadingStore } from '@/shared/model';
import { ROUTES } from '@/shared/routes';

interface GameSetupProps {
    characters: CharacterWithThumbnail[];
    onCancel?: () => void;
}

export const GameSetup = ({ characters, onCancel }: GameSetupProps) => {
    const queryClient = useQueryClient();
    const playClick = useClickSound();

    const [localNick, setLocalNick] = useState('');
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { startLoading, stopLoading, isLoading } = useLoadingStore();

    const handleStart = useCallback(async () => {
        if (!localNick.trim() || isLoading) return;
        startLoading();
        setError(null);
        try {
            const selected = characters[selectedIdx];
            await postUser({ name: localNick.trim(), character: selected.memberId });
            await queryClient.invalidateQueries({ queryKey: userQuery.me().queryKey });
        } catch (err) {
            setError((err as Error).message);
            stopLoading();
            throw err;
        }
    }, [
        localNick,
        isLoading,
        selectedIdx,
        characters,
        queryClient,
        startLoading,
        stopLoading,
    ]);

    const handleNickChange = useCallback((value: string) => setLocalNick(value), []);
    const handleSelect = useCallback((idx: number) => setSelectedIdx(idx), []);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useDirectionKey({
        itemCount: characters.length,
        setSelectedIdx,
        canSubmit: Boolean(localNick.trim()),
        onEnter: handleStart,
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-1 flex-col items-center justify-start gap-5 rounded-3xl border border-white/20 bg-black/20 p-5 pt-8 backdrop-blur-xl sm:justify-center sm:gap-8 sm:p-8"
        >
            <Link href={ROUTES.GAME} prefetch aria-hidden tabIndex={-1} className="sr-only" />
            <motion.h1
                className="text-3xl font-black text-white drop-shadow-2xl sm:text-5xl"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                붕어빵 타이쿤
            </motion.h1>
            <p className="text-xl font-bold text-white/80">PLAVE Edition</p>

            <NicknameInput value={localNick} onChange={handleNickChange} inputRef={inputRef} />

            <CharacterSelector
                characters={characters}
                selectedIdx={selectedIdx}
                onSelect={handleSelect}
            />

            <NavButton href={ROUTES.GAME} asChild>
                <motion.button
                    onClick={async () => {
                        playClick();
                        await handleStart();
                    }}
                    disabled={!localNick.trim() || isLoading}
                    whileTap={{ scale: 0.95 }}
                    className="bg-linear-to-r rounded-full border-4 border-white/30 from-pink-500 to-purple-600 px-12 py-4 text-2xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    게임 시작
                </motion.button>
            </NavButton>

            {error && <p className="text-sm font-bold text-red-400">{error}</p>}

            {onCancel && (
                <button
                    onClick={() => {
                        playClick();
                        onCancel();
                    }}
                    className="text-sm font-bold text-white/40 underline underline-offset-2 hover:text-white/70"
                >
                    돌아가기
                </button>
            )}

            <div className="space-y-1 text-center text-sm text-white/50">
                <p>💡 붕어빵을 클릭해서 뒤집으세요</p>
                <p>🎯 완벽한 타이밍 = 보너스 점수 + 콤보</p>
                <p>🔥 4초 내 연속 성공으로 콤보 유지!</p>
            </div>
        </motion.div>
    );
};
