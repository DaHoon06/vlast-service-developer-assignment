import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: 'VLAST 서비스 개발자 | 사전과제',
    description: 'VLAST 서비스 개발자 | 사전과제',
    authors: {
        name: '전다훈',
        url: 'https://github.com/DaHoon06/vlast-service-developer-assignment.git',
    },
};

export const viewport: Viewport = {
    themeColor: '#a855f7',
    viewportFit: 'cover',
    width: 'device-width',
    initialScale: 1,
};
