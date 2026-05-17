import localfont from 'next/font/local';

export const dos = localfont({
    src: [
        {
            path: '../../../public/fonts/DOSPilgi.woff',
            style: 'normal',
        },
    ],
    display: 'swap',
    variable: '--font-dos',
});
