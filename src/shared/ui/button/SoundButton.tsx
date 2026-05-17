'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

import { useBgmStore } from '@/shared/model/bgm-store';

export const SoundButton = () => {
    const { enabled, toggle } = useBgmStore();

    return (
        <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggle}
            aria-label={enabled ? '배경음악 끄기' : '배경음악 켜기'}
            className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
            {enabled ? (
                <Volume2 className="h-4 w-4 text-green-300" aria-hidden />
            ) : (
                <VolumeX className="h-4 w-4 text-white/50" aria-hidden />
            )}
        </motion.button>
    );
};
