import { unstable_cache } from 'next/cache';

import { getPlaveMembers } from './get-plave-members';

export type CharacterThumbnailResponse = {
    memberId: number;
    name: string;
    profile: string;
    color: string | null;
};

export const characterWithThumbnailApiTag = 'character-thumbnails' as const;

export const getCharacterThumbnails = unstable_cache(
    async (): Promise<CharacterThumbnailResponse[]> => {
        const members = await getPlaveMembers();
        return Promise.all(
            members.map(async (m) => {
                return {
                    memberId: m.id,
                    name: m.name,
                    profile: m.profile || '',
                    color: m.color,
                };
            }),
        );
    },
    [characterWithThumbnailApiTag],
    { revalidate: 3600, tags: [characterWithThumbnailApiTag] },
);
