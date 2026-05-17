'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import type { ReactElement } from 'react';

import { CommentPanel, PlaveAvatar } from '@/entities/character';
import type { User } from '@/entities/user';
import { userQuery } from '@/entities/user';

import { cn, contrastTextColor } from '@/shared/lib';
import { useGameStore } from '@/shared/model';

interface GameHudProps {
    initialMe?: User;
}

export const GameHud = ({ initialMe }: GameHudProps): ReactElement => {
    const { activeMember, showComment } = useGameStore();
    const { data: me } = useQuery({
        ...userQuery.me(),
        initialData: initialMe ?? undefined,
    });

    const characterColor = me?.character.color ?? null;
    const labelTextClass = characterColor ? contrastTextColor(characterColor) : 'text-white';
    const borderStyle = characterColor
        ? { borderColor: characterColor, boxShadow: `0 0 12px ${characterColor}60` }
        : undefined;

    return (
        <div className="bg-linear-to-br relative flex items-center gap-4 rounded-3xl border-2 border-b-0 border-red-900 from-[#1a0505] to-[#2d0a0a] px-6 py-4">
            <div
                className={cn(
                    'relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-[3px] bg-[#1a0505]',
                    !characterColor && 'border-red-600 shadow-[0_0_12px_#DC262660]',
                )}
                style={borderStyle}
            >
                <PlaveAvatar
                    src={me?.character.profile ?? undefined}
                    width={64}
                    height={64}
                    priority
                />
            </div>

            <div className="flex flex-col gap-1 leading-tight">
                <span className="text-sm font-bold text-white">{me?.name || '소속사연습생'}</span>
                <span
                    className={cn(
                        'w-fit rounded-full border px-2.5 py-0.5 text-xs font-bold',
                        labelTextClass,
                        !characterColor && 'border-red-800 bg-red-600',
                    )}
                    style={
                        characterColor
                            ? { borderColor: characterColor, backgroundColor: characterColor }
                            : undefined
                    }
                >
                    {me?.character.label || '플둥이'}
                </span>
            </div>

            <AnimatePresence>
                {showComment && activeMember && <CommentPanel member={activeMember} />}
            </AnimatePresence>
        </div>
    );
};
