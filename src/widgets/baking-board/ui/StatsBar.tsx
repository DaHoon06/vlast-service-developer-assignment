'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';

interface StatsBarProps {
    score: number;
    timer: number;
    speed: number;
    diffLevel: number;
    showDiffUp: boolean;
}

export const StatsBar = ({
    score,
    timer,
    speed,
    diffLevel,
    showDiffUp,
}: StatsBarProps): ReactElement => {
    const mm = String(Math.floor(timer / 60)).padStart(2, '0');
    const ss = String(timer % 60).padStart(2, '0');
    const timerStr = `${mm}:${ss}`;
    const isUrgent = timer <= 10;

    return (
        <div role="region" aria-label="게임 현황" className="relative z-10 flex items-center justify-between rounded-md border-b border-red-900 bg-[#1a0505] px-6 py-3 text-white">
            <div className="flex min-w-[90px] flex-col gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-red-400/70" aria-hidden>
                    Score
                </span>
                <div className="flex items-center gap-2">
                    <span aria-label={`점수 ${score}`} className="text-lg font-black text-yellow-300">{score}</span>
                    <AnimatePresence mode="popLayout">
                        {showDiffUp ? (
                            <motion.span
                                key="diff-up"
                                className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-black text-white"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            >
                                🔥 Lv.{diffLevel} UP!
                            </motion.span>
                        ) : diffLevel > 1 ? (
                            <motion.span
                                key="diff-level"
                                className="text-[10px] font-semibold text-orange-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                Lv.{diffLevel}
                            </motion.span>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col items-center gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-red-400/70" aria-hidden>
                    Time
                </span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={isUrgent ? 'urgent' : 'normal'}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.12 }}
                        aria-label={`남은 시간 ${timerStr}${isUrgent ? ' (촉박)' : ''}`}
                        className={`text-2xl font-black tabular-nums tracking-tight ${isUrgent ? 'animate-pulse text-red-400' : 'text-white'}`}
                    >
                        {timerStr}
                    </motion.span>
                </AnimatePresence>
            </div>

            <div className="flex min-w-[90px] flex-col items-end gap-0.5">
                <span className="text-[10px] font-medium uppercase tracking-widest text-red-400/70" aria-hidden>
                    Speed
                </span>
                <span aria-label={`속도 ${speed.toFixed(1)}배`} className="text-lg font-black">
                    x<span className="text-orange-300">{speed.toFixed(1)}</span>
                </span>
            </div>
        </div>
    );
};
