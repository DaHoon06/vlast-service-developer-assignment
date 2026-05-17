'use client';

import { useCallback, useEffect, useRef } from 'react';

let sharedCtx: AudioContext | null = null;
const bufferCache = new Map<string, AudioBuffer>();

const getCtx = () => {
    if (!sharedCtx || sharedCtx.state === 'closed') {
        sharedCtx = new AudioContext();
    }
    return sharedCtx;
};

export const __resetForTesting__ = () => {
    sharedCtx = null;
    bufferCache.clear();
};

export const useClickSound = (src = '/effects/click.mp3') => {
    const bufferRef = useRef<AudioBuffer | null>(bufferCache.get(src) ?? null);

    useEffect(() => {
        if (bufferCache.has(src)) {
            bufferRef.current = bufferCache.get(src)!;
        } else {
            const ctx = getCtx();
            fetch(src)
                .then((res) => res.arrayBuffer())
                .then((raw) => ctx.decodeAudioData(raw))
                .then((decoded) => {
                    bufferCache.set(src, decoded);
                    bufferRef.current = decoded;
                })
                .catch(() => {});
        }

        return () => {
            if (sharedCtx) {
                sharedCtx.close();
                sharedCtx = null;
            }
        };
    }, [src]);

    return useCallback(() => {
        const ctx = getCtx();
        const buffer = bufferRef.current ?? bufferCache.get(src);
        if (!buffer) return;

        if (ctx.state === 'suspended') void ctx.resume();

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = 0.15;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
    }, [src]);
};
