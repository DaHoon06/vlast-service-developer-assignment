'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    visible: boolean;
    level: number;
    speed: number;
}

export const DifficultyUpPanel = ({ visible, level, speed }: Props) => {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    role="alert"
                    aria-label={`난이도 ${level} 상승, 속도 ${speed.toFixed(1)}배`}
                    className="pointer-events-none absolute left-0 top-0 z-50"
                    initial={{ x: -260, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -260, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                    <div
                        aria-hidden
                        className="rounded-2xl border-2 border-orange-600 px-5 py-4 text-center"
                        style={{
                            background: 'linear-gradient(135deg, #1a0000, #3d0000)',
                            boxShadow:
                                '0 0 24px rgba(255,69,0,0.8), 0 0 60px rgba(255,140,0,0.3), inset 0 0 20px rgba(255,69,0,0.1)',
                        }}
                    >
                        <p className="text-[10px] font-bold uppercase tracking-[3px] text-orange-500">
                            🔥 speed up
                        </p>
                        <motion.p
                            className="bg-linear-to-b mt-1 from-yellow-300 via-orange-500 to-red-600 bg-clip-text text-2xl font-black text-transparent"
                            animate={{
                                filter: [
                                    'drop-shadow(0 0 4px rgba(255,100,0,0.9))',
                                    'drop-shadow(0 0 14px rgba(255,230,0,1))',
                                ],
                            }}
                            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.5 }}
                        >
                            난이도 UP!!
                        </motion.p>
                        <p className="mt-1 text-xs font-bold text-orange-400">
                            LV {level} · x{speed.toFixed(1)}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
