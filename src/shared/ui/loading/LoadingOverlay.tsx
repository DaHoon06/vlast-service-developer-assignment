'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

import { useLoadingStore } from '@/shared/model';

import { Boong } from '../boong/Boong';

export const LoadingOverlay = () => {
    const isLoading = useLoadingStore((s) => s.isLoading);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    role="status"
                    aria-label="로딩 중"
                    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: 'rgba(3, 2, 19, 0.82)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="bg-linear-to-br h-80 w-80 from-purple-500/25 via-pink-500/25 to-orange-400/25 blur-3xl" />
                    </div>

                    <div className="relative flex flex-col items-center gap-5">
                        <div className="relative">
                            {[
                                { delay: 0, x: -44 },
                                { delay: 1.3, x: -6 },
                            ].map((bubble, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute bottom-full left-1/2 mb-1 whitespace-nowrap px-3 py-0.5 text-xs text-white/70"
                                    initial={{ opacity: 0, y: 8, x: bubble.x }}
                                    animate={{
                                        opacity: [0, 0.9, 0.9, 0],
                                        y: [8, -12, -32, -56],
                                        x: bubble.x,
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        delay: bubble.delay,
                                        ease: 'easeOut',
                                    }}
                                >
                                    붕어~
                                </motion.div>
                            ))}
                            <motion.div
                                animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
                                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Boong className="w-28" aria-hidden />
                            </motion.div>
                        </div>

                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    className="block h-2 w-2 rounded-full bg-white/50"
                                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    );
};
