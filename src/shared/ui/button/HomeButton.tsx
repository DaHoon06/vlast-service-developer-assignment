'use client';

import { ROUTES } from '@/shared/routes';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { NavButton } from '@/shared/ui/button/NavButton';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useState } from 'react';

export const HomeButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setOpen(true)}
                aria-label="홈으로 돌아가기"
                className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
                <Home className="h-4 w-4" aria-hidden />
            </motion.button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent showClose={false} className="border-white/10 bg-black/95 text-center backdrop-blur-sm">
                    <DialogTitle className="text-lg font-bold text-white">홈으로 돌아갈까요?</DialogTitle>
                    <p className="mt-2 text-sm text-white/50">게임이 종료되고 진행 중인 점수는 저장되지 않아요.</p>
                    <div className="mt-6 flex gap-3">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-xl border border-white/20 bg-white/10 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/15"
                            >
                                계속 게임
                            </button>
                        </DialogClose>
                        <NavButton href={ROUTES.HOME} asChild>
                            <button
                                type="button"
                                className="bg-linear-to-r flex-1 rounded-xl from-pink-500/80 to-purple-600/80 py-2.5 text-sm font-semibold text-white transition-all hover:from-pink-500 hover:to-purple-600"
                            >
                                홈으로
                            </button>
                        </NavButton>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
