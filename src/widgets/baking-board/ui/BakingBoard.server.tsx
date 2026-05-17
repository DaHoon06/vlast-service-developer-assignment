import { getPlaveMembers } from '@/entities/character';

import { BakingBoard } from './BakingBoard';
import { ReactElement } from 'react';

export const BakingBoardServer = async (): Promise<ReactElement> => {
    const members = await getPlaveMembers().catch(() => []);
    return <BakingBoard members={members} />;
};
