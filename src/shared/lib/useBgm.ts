'use client';

import { useEffect } from 'react';

import { useBgmStore } from '@/shared/model/bgm-store';

let bgmAudio: HTMLAudioElement | null = null;
let bgmUnlocked = false;

function ensureAudio(src: string) {
    if (!bgmAudio) {
        bgmAudio = new Audio(src);
        bgmAudio.loop = true;
        bgmAudio.volume = 0.5;
    }
    return bgmAudio;
}

export const useBgm = (src = '/effects/background.mp3') => {
    const enabled = useBgmStore((s) => s.enabled);

    useEffect(() => {
        if (bgmUnlocked || !enabled) return;

        const bgm = ensureAudio(src);

        const unlock = () => {
            if (bgmUnlocked) return;
            bgmUnlocked = true;
            bgm.play().catch(() => {});
        };

        bgm.play()
            .then(() => {
                bgmUnlocked = true;
            })
            .catch(() => {
                window.addEventListener('click', unlock, { once: true });
                window.addEventListener('keydown', unlock, { once: true });
                window.addEventListener('touchstart', unlock, { once: true });
            });

        return () => {
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
        };
    }, [src, enabled]);

    useEffect(() => {
        if (!bgmUnlocked) return;
        const bgm = ensureAudio(src);
        if (enabled) {
            bgm.play().catch(() => {});
        } else {
            bgm.pause();
        }
    }, [enabled, src]);
};
