import { useEffect, useRef } from 'react';

import type { PlaveMember } from '@/entities/character';

import { MILESTONE_INTERVAL } from '../../config/options';

const isComboMilestone = (combo: number) =>
    combo >= 3 && (combo - 3) % MILESTONE_INTERVAL === 0;

interface Params {
    combo: number;
    members: PlaveMember[];
    setActiveMember: (member: PlaveMember | null, show: boolean) => void;
}

export const useComboMilestone = ({ combo, members, setActiveMember }: Params) => {
    const prevCombo = useRef(0);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const prev = prevCombo.current;
        prevCombo.current = combo;
        if (combo > prev && isComboMilestone(combo) && members.length > 0) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            setActiveMember(randomMember, true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setActiveMember(null, false), 2500);
        }
    }, [combo, members, setActiveMember]);
};
