'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';

import type { CharacterWithThumbnail } from '@/entities/character';
import { useClickSound } from '@/shared/lib';

interface CharacterSelectorProps {
    characters: CharacterWithThumbnail[];
    selectedIdx: number;
    onSelect: (idx: number) => void;
}

export const CharacterSelector = memo<CharacterSelectorProps>(
    ({ characters, selectedIdx, onSelect }) => {
        const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
        const playClick = useClickSound();

        useEffect(() => {
            itemRefs.current[selectedIdx]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }, [selectedIdx]);

        return (
            <div className="flex w-full min-w-0 flex-col items-center gap-3">
                <span className="text-sm font-bold text-white/70">
                    캐릭터 선택 <span className="text-white/40">(← →)</span>
                </span>
                <motion.div
                    className="scrollbar-none flex w-full min-w-0 touch-pan-x snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain px-4 py-3 [-ms-overflow-style:none] md:justify-center [&::-webkit-scrollbar]:hidden"
                    role="listbox"
                    aria-label="캐릭터 선택"
                >
                    {characters.map((char, idx) => {
                        const isSelected = selectedIdx === idx;

                        return (
                            <motion.div
                                key={char.memberId}
                                className="flex shrink-0 snap-center items-center justify-center px-0.5"
                                style={{ width: 88, height: 104 }}
                            >
                                <motion.button
                                    ref={(el) => {
                                        itemRefs.current[idx] = el;
                                    }}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        playClick();
                                        onSelect(idx);
                                    }}
                                    animate={{ scale: isSelected ? 1.12 : 0.92 }}
                                    whileTap={{ scale: isSelected ? 1.06 : 0.88 }}
                                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                                    className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 p-3 outline-none transition-colors [-webkit-tap-highlight-color:transparent] ${
                                        isSelected
                                            ? 'z-10 border-pink-400 bg-pink-500/20 text-white shadow-lg shadow-pink-500/25'
                                            : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                                    }`}
                                >
                                    <motion.div
                                        className="relative overflow-hidden rounded-xl bg-white/10"
                                        animate={{
                                            width: isSelected ? 64 : 56,
                                            height: isSelected ? 64 : 56,
                                        }}
                                        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                                    >
                                        <motion.img
                                            src={char.profile}
                                            alt={char.name}
                                            animate={{ scale: isSelected ? 1.1 : 1 }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 420,
                                                damping: 28,
                                            }}
                                            className="size-full object-cover"
                                            unselectable="on"
                                            loading="eager"
                                            fetchPriority={isSelected ? 'high' : 'auto'}
                                        />
                                    </motion.div>
                                    <span className="text-xs font-bold">{char.name}</span>
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </motion.div>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={selectedIdx}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-sm font-bold text-pink-300"
                    >
                        {characters[selectedIdx].name} 선택됨
                    </motion.p>
                </AnimatePresence>
            </div>
        );
    },
);

CharacterSelector.displayName = 'CharacterSelector';
