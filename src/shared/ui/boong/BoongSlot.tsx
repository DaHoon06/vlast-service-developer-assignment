import type { ReactElement } from 'react';

import { useClickSound } from '@/shared/lib/useClickSound';

import { Boong } from './Boong';
import { computeBodyColor } from '@/shared/lib/compute-body-color';

interface BoongSlotProps {
    active: boolean;
    progress: number;
    onClick: () => void;
    label?: string;
}

const getBarColor = (progress: number): string => {
    if (progress > 92) return 'bg-red-500';
    if (progress > 75) return 'bg-orange-400';
    return 'bg-green-500';
};

export const BoongSlot = ({ active, progress, onClick, label }: BoongSlotProps): ReactElement => {
    const fillColor = active ? computeBodyColor(progress) : '#303030';
    const barColor = getBarColor(progress);
    const playClick = useClickSound();

    const handleClick = () => {
        playClick();
        onClick();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={label}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="aspect-13/9 relative flex cursor-pointer touch-manipulation select-none flex-col items-center justify-center overflow-hidden rounded-sm bg-[#3a3a3a] transition-transform active:scale-95"
        >
            <Boong
                className="pointer-events-none h-auto w-3/4"
                fillColor={fillColor}
                opacity={1}
                aria-hidden
            />
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/50">
                    <div
                        className={`duration-50 h-full transition-all ease-linear ${barColor}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                </div>
            )}
        </div>
    );
};
