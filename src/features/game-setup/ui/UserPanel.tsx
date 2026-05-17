'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import type { CharacterWithThumbnail } from '@/entities/character';
import type { CurrentUser } from '@/entities/user';
import { useLoadingStore } from '@/shared/model';
import { NavButton } from '@/shared/ui';
import Image from 'next/image';
import { ROUTES } from '@/shared/routes';

interface UserPanelProps {
    user: CurrentUser;
    character: CharacterWithThumbnail;
    onChangeUser: () => void;
    disableEnterAnimation?: boolean;
}

export const UserPanel = ({
    user,
    character,
    onChangeUser,
    disableEnterAnimation = false,
}: UserPanelProps) => {
    const { isLoading } = useLoadingStore();

    return (
        <motion.div
            initial={disableEnterAnimation ? false : { opacity: 0, scale: 0.9 }}
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

            <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-bold text-white/50">반가워요!</p>
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-5">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white/10">
                        <Image
                            width={80}
                            height={80}
                            src={character.profile}
                            alt={character.name}
                            className="size-full object-cover"
                            unselectable="on"
                            unoptimized
                            sizes="80px"
                        />
                    </div>
                    <p className="text-2xl font-black text-white">{user.name}</p>
                </div>
            </div>

            <NavButton href={ROUTES.GAME} asChild>
                <motion.button
                    disabled={isLoading}
                    whileTap={{ scale: 0.95 }}
                    className="bg-linear-to-r rounded-full border-4 border-white/30 from-pink-500 to-purple-600 px-12 py-4 text-2xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/50"
                >
                    게임 시작
                </motion.button>
            </NavButton>

            <button
                onClick={onChangeUser}
                className="text-sm font-bold text-white/40 underline underline-offset-2 hover:text-white/70"
            >
                다른 멤버로 시작하기
            </button>
        </motion.div>
    );
};
