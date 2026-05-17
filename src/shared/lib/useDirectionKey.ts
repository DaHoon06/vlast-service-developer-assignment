'use client';

import { useEffect, useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { useClickSound } from './useClickSound';

export type UseDirectionKeyParams = {
    itemCount: number;
    setSelectedIdx: Dispatch<SetStateAction<number>>;
    canSubmit: boolean;
    onEnter: () => void;
};

export const useDirectionKey = ({
    itemCount,
    setSelectedIdx,
    canSubmit,
    onEnter,
}: UseDirectionKeyParams) => {
    const canSubmitRef = useRef(canSubmit);
    const onEnterRef = useRef(onEnter);
    const playClick = useClickSound();
    const playClickRef = useRef(playClick);

    useLayoutEffect(() => {
        canSubmitRef.current = canSubmit;
        onEnterRef.current = onEnter;
        playClickRef.current = playClick;
    }, [canSubmit, onEnter, playClick]);

    useEffect(() => {
        if (itemCount <= 0) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                playClickRef.current();
                setSelectedIdx((i) => (i - 1 + itemCount) % itemCount);
            } else if (e.key === 'ArrowRight') {
                playClickRef.current();
                setSelectedIdx((i) => (i + 1) % itemCount);
            } else if (e.key === 'Enter' && canSubmitRef.current) {
                playClickRef.current();
                onEnterRef.current();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [itemCount, setSelectedIdx]);
};
