import { useEffect, useRef, useState } from 'react';

export const useDifficultyBanner = (diffLevel: number): boolean => {
    const [showDiffUp, setShowDiffUp] = useState(false);
    const prevDiffLevel = useRef(diffLevel);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const prev = prevDiffLevel.current;
        prevDiffLevel.current = diffLevel;
        if (diffLevel > prev) {
            setShowDiffUp(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setShowDiffUp(false), 2500);
        }
    }, [diffLevel]);

    return showDiffUp;
};
