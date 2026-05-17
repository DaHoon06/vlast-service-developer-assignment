'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, type ReactElement } from 'react';
import type { PlaveMember } from '../model/types';
import { contrastTextColor } from '@/shared/lib';

interface CommentPanelProps {
    member: PlaveMember;
}

export const CommentPanel = ({ member }: CommentPanelProps): ReactElement => {
    const textClass = useMemo(
        () => (member.color ? contrastTextColor(member.color) : 'text-white'),
        [member],
    );
    return (
        <motion.div
            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
            <div
                className="relative size-10 shrink-0 overflow-hidden rounded-full border-2"
                style={{ borderColor: member.color ?? '#a855f7' }}
            >
                {member.profile ? (
                    <Image
                        src={member.profile}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                    />
                ) : (
                    <div className="size-full" style={{ background: '#a855f7' }} />
                )}
            </div>

            <div
                className="max-w-[140px] rounded-xl border bg-[#0d001a]/90 px-3 py-2"
                style={{
                    borderColor: member.color ?? '#a855f7',
                    boxShadow: `0 0 12px #a855f7/40`,
                }}
            >
                <motion.p
                    className="mb-0.5 text-[10px] font-bold text-white"
                    style={{ color: textClass }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                >
                    {member.name}
                </motion.p>
                <p className="line-clamp-2 text-[10px] leading-tight text-white/90">
                    {member.comments ?? '파이팅!'}
                </p>
            </div>
        </motion.div>
    );
};
