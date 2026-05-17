'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useState } from 'react';

import { RankingModal } from './RankingModal';

export const RankingButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setOpen(true)}
                aria-label="랭킹 보기"
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
                <Trophy className="h-4 w-4 text-yellow-300" aria-hidden />
                <span>랭킹</span>
            </motion.button>
            <AnimatePresence>
                <RankingModal
                    key="ranking-modal"
                    open={open}
                    onClose={() => setOpen(false)}
                />
            </AnimatePresence>
        </>
    );
};
