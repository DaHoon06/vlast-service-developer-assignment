'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FallbackProps } from 'react-error-boundary';

import { ROUTES } from '@/shared/routes';

import { Boong } from '../boong/Boong';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <main className="bg-linear-to-br flex min-h-screen min-h-dvh items-center justify-center overflow-hidden from-purple-500 via-pink-500 to-orange-400">
            <div className="relative h-full max-h-[900px] w-full max-w-2xl">
                <div className="bg-linear-to-br absolute inset-0 from-purple-400/20 via-pink-400/20 to-orange-400/20 blur-3xl" />
                <div className="relative flex h-full flex-col items-center justify-center gap-8 p-4">
                    <motion.div
                        animate={{ rotate: [-8, 8, -8], y: [0, -10, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Boong className="w-32" opacity={0.9} aria-hidden />
                    </motion.div>

                    <div className="flex flex-col items-center gap-3 text-center text-white">
                        <h1 className="text-2xl font-bold tracking-tight">앗! 오류가 발생했어요</h1>
                        <p className="text-sm text-white/70">
                            잠시 후 다시 시도하거나 홈으로 돌아가 주세요.
                        </p>
                        {process.env.NODE_ENV === 'development' && error?.message && (
                            <p className="mt-1 rounded-lg bg-black/20 px-3 py-1.5 font-mono text-xs text-white/50">
                                {error.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={resetErrorBoundary}
                            className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
                        >
                            다시 시도
                        </button>
                        <Link
                            replace
                            prefetch
                            href={ROUTES.HOME}
                            className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 active:scale-95"
                        >
                            홈으로
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};
