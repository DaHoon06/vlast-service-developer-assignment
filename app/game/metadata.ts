import type { Metadata } from 'next';

import { getMeServer } from '@/entities/user/index.server';

const getParticle = (word: string) => {
    const code = word.charCodeAt(word.length - 1);
    if (code < 0xac00 || code > 0xd7a3) return '과';
    return (code - 0xac00) % 28 === 0 ? '와' : '과';
};

export const generateMetadata = async (): Promise<Metadata> => {
    const user = await getMeServer();

    if (!user) {
        return {
            title: 'VLAST 서비스 개발자 | 사전과제',
            description: 'VLAST 서비스 개발자 | 사전과제',
        };
    }

    const memberName = user.character.name;
    const userName = user.name;
    const title = `${memberName}${getParticle(memberName)} ${userName}이 함께하는 붕어빵 타이쿤`;
    const description = `${title} | VLAST 서비스 개발자 사전 과제 | 전다훈`;

    return {
        title,
        description,
        authors: {
            name: '전다훈',
            url: 'https://github.com/DaHoon06/vlast-service-developer-assignment.git',
        },
    };
};
