'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, RotateCcw } from 'lucide-react';

import { characterQuery, PlaveAvatar } from '@/entities/character';
import { rankingQuery } from '@/entities/ranking';
import { userQuery } from '@/entities/user';

import cn from '@/shared/lib/cn';
import { useGameStore } from '@/shared/model';
import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/shared/ui/dialog';

interface RankingModalProps {
    open?: boolean;
    onClose: () => void;
    onHome?: () => void;
    onRestart?: () => void;
}

export const RankingModal = ({ open = true, onClose, onHome, onRestart }: RankingModalProps) => {
    const { finalScore } = useGameStore();
    const { data: me } = useQuery(userQuery.me());
    const { data: rankings = [], isLoading, isError } = useQuery({ ...rankingQuery.list(), enabled: open });
    const { data: members = [] } = useQuery(characterQuery.members());

    const memberProfileMap = Object.fromEntries(members.map((m) => [m.id, m.profile ?? '']));

    const myRank = rankings.findIndex((r) => r.member.id === me?.id) + 1;

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <AnimatePresence>
                {open && (
                    <DialogPortal forceMount key="ranking-modal">
                        <DialogOverlay asChild forceMount>
                            <motion.div
                                className="fixed inset-0 z-50 bg-black/80"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={onClose}
                            />
                        </DialogOverlay>
                        <DialogPrimitive.Content
                            asChild
                            forceMount
                            onPointerDownOutside={onClose}
                            onEscapeKeyDown={onClose}
                        >
                            <motion.div
                                className={cn(
                                    'fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/95 p-6 shadow-xl',
                                    'max-h-[90dvh] overflow-y-auto',
                                )}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex flex-col items-center gap-4 py-2">
                                    <div className="flex flex-col items-center gap-1">
                                        <DialogTitle>
                                            <p className="mb-2 text-center text-sm font-bold text-white/80">
                                                TOP 10 랭킹
                                            </p>
                                        </DialogTitle>
                                        {me?.name && finalScore !== null && (
                                            <>
                                                <p className="text-sm text-gray-100">
                                                    {me?.name}의 최종 점수
                                                </p>
                                                <p className="text-4xl font-black text-yellow-300">
                                                    {finalScore}
                                                </p>
                                            </>
                                        )}

                                        {myRank > 0 && (
                                            <p className="text-sm font-bold text-pink-400">
                                                {myRank <= 3
                                                    ? ['🥇', '🥈', '🥉'][myRank - 1] + ' '
                                                    : ''}
                                                {myRank}위
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full rounded-xl border border-white/10 bg-white/5 p-3">
                                        <ol className="flex flex-col gap-1">
                                            {isError ? (
                                                <li className="py-4 text-center text-xs text-red-400">
                                                    랭킹을 불러올 수 없어요. 잠시 후 다시 시도해주세요.
                                                </li>
                                            ) : isLoading
                                                ? Array.from({ length: 5 }).map((_, idx) => (
                                                      <li
                                                          key={idx}
                                                          className="flex animate-pulse items-center justify-between rounded-lg px-3 py-1.5"
                                                      >
                                                          <span className="h-4 w-4 rounded bg-white/10" />
                                                          <span className="mx-1.5 h-6 w-6 rounded-full bg-white/10" />
                                                          <span className="mx-2 h-4 flex-1 rounded bg-white/10" />
                                                          <span className="h-4 w-10 rounded bg-white/10" />
                                                      </li>
                                                  ))
                                                : (
                                                    <AnimatePresence initial={false}>
                                                        {rankings.map((r, idx) => {
                                                            const isMe = r.member.id === me?.id;
                                                            const profile = memberProfileMap[r.member.character];
                                                            return (
                                                                <motion.li
                                                                    key={r.member.id}
                                                                    layout
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                                    transition={{
                                                                        layout: { type: 'spring', stiffness: 400, damping: 35 },
                                                                        opacity: { duration: 0.2 },
                                                                        scale: { duration: 0.2 },
                                                                    }}
                                                                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
                                                                        isMe
                                                                            ? 'bg-pink-500/20 font-bold text-pink-300'
                                                                            : 'text-white/70'
                                                                    }`}
                                                                >
                                                                    <span className="w-6 text-center font-bold text-white/40">
                                                                        {idx + 1}
                                                                    </span>
                                                                    {idx < 3 ? (
                                                                        <span className="mx-1.5 h-6 w-6 shrink-0 overflow-hidden rounded-full bg-white/10">
                                                                            <PlaveAvatar
                                                                                src={profile}
                                                                                alt={r.member.name}
                                                                                width={24}
                                                                                height={24}
                                                                            />
                                                                        </span>
                                                                    ) : (
                                                                        <span className="mx-1.5 w-6 shrink-0" />
                                                                    )}
                                                                    <span className="flex-1 truncate px-1">
                                                                        {r.member.name}
                                                                    </span>
                                                                    <span className="font-bold text-yellow-300">
                                                                        {r.score}
                                                                    </span>
                                                                </motion.li>
                                                            );
                                                        })}
                                                    </AnimatePresence>
                                                )}
                                            {!isLoading && !isError && rankings.length === 0 && (
                                                <li className="text-center text-xs text-white/30">
                                                    기록이 없어요, 지금 바로 1등에 도전해보세요!
                                                </li>
                                            )}
                                        </ol>
                                    </div>

                                    <div className="flex w-full gap-2">
                                        {onHome && (
                                            <motion.button
                                                type="button"
                                                onClick={onHome}
                                                whileTap={{ scale: 0.97 }}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-white/20 bg-white/10  font-bold text-white/70 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/15"
                                            >
                                                <Home className="h-4 w-4 shrink-0" aria-hidden />
                                                <span>처음으로</span>
                                            </motion.button>
                                        )}
                                        {onRestart && (
                                            <motion.button
                                                type="button"
                                                onClick={onRestart}
                                                whileTap={{ scale: 0.97 }}
                                                className="bg-linear-to-r inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-violet-300/40 from-violet-600/55 to-purple-600/55 py-3 font-bold text-violet-50 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-violet-300/55 hover:from-violet-600/70 hover:to-purple-600/70"
                                            >
                                                <RotateCcw
                                                    className="h-4 w-4 shrink-0"
                                                    aria-hidden
                                                />
                                                <span>다시 시작</span>
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPortal>
                )}
            </AnimatePresence>
        </Dialog>
    );
};
