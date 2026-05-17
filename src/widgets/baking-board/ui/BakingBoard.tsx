'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';

import type { PlaveMember } from '@/entities/character';
import { userQuery } from '@/entities/user';

import { useGameStore } from '@/shared/model';
import { BoongSlot } from '@/shared/ui';

import { useSubmitRanking } from '../api/useSubmitRanking';
import { useBakingGame } from '../model/hooks/useBakingGame';
import { useComboMilestone } from '../model/hooks/useComboMilestone';
import { useDifficultyBanner } from '../model/hooks/useDifficultyBanner';
import { useGameLifecycle } from '../model/hooks/useGameLifecycle';

import { FLOAT_TEXT_COLOR } from '../config/options';
import { ComboDisplay } from './ComboDisplay';
import { DifficultyUpPanel } from './DifficultyUpPanel';
import { StatsBar } from './StatsBar';

interface Props {
    members: PlaveMember[];
}

export const BakingBoard = ({ members }: Props) => {
    const { setFinalScore, pendingGameAction, setPendingGameAction, setActiveMember } =
        useGameStore();
    const { data: me } = useQuery(userQuery.me());
    const { mutate: submitRank } = useSubmitRanking(me, setFinalScore);

    const { state, dispatch } = useBakingGame();
    const showDiffUp = useDifficultyBanner(state.diffLevel);

    useComboMilestone({ combo: state.combo, members, setActiveMember });
    useGameLifecycle({
        over: state.over,
        score: state.score,
        dispatch,
        me,
        setFinalScore,
        submitRank,
        pendingGameAction,
        setPendingGameAction,
    });

    return (
        <div className="relative flex flex-1 flex-col items-center justify-center gap-8 rounded-3xl border border-white/20 bg-black/20 p-4 backdrop-blur-xl">
            <StatsBar
                score={state.score}
                timer={state.timer}
                speed={state.speed}
                diffLevel={state.diffLevel}
                showDiffUp={showDiffUp}
            />

            <ComboDisplay combo={state.combo} />

            <DifficultyUpPanel visible={showDiffUp} level={state.diffLevel} speed={state.speed} />

            <motion.div
                className="absolute inset-0 rounded-3xl bg-[linear-gradient(to_top,#ff4500_0%,#e85a00_30%,#b33000_60%,#3d0000_100%)]"
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            />

            <motion.div
                className="absolute inset-x-0 bottom-0 h-6 rounded-3xl bg-[radial-gradient(ellipse_at_50%_100%,#ff7700,transparent_70%)] blur-md"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
            />

            <div className="relative grid w-full grid-cols-3 gap-1 p-4">
                {state.slots.map((slot, i) => (
                    <div key={i} className="relative">
                        <BoongSlot
                            active={slot.active}
                            progress={slot.progress}
                            onClick={() => dispatch({ type: 'CLICK', index: i })}
                            label={`${i + 1}번 슬롯${slot.active ? ` (굽는 중 ${Math.round(slot.progress)}%)` : ''}`}
                        />
                        <AnimatePresence>
                            {state.floats[i] && (
                                <motion.span
                                    key={state.floats[i]!.id}
                                    initial={{ y: 0, opacity: 1 }}
                                    animate={{ y: -36, opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className={`pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 text-center text-xs font-bold drop-shadow ${FLOAT_TEXT_COLOR[state.floats[i]!.color] ?? 'text-white'}`}
                                >
                                    {state.floats[i]!.text}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};
