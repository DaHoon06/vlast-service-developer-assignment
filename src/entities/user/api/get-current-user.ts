import type { CurrentUser } from '../model/types';
import { getMeServer } from './get-me.server';

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
    const data = await getMeServer();
    if (!data) return null;
    return {
        id: data.id,
        name: data.name,
        character: data.character.memberId,
    };
};
