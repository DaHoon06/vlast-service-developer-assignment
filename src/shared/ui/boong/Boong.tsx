'use client';

import type { CSSProperties, ReactElement, SVGProps } from 'react';
import { useClickSound } from '@/shared/lib/useClickSound';

interface BoongProps extends Omit<SVGProps<SVGSVGElement>, 'fill' | 'opacity'> {
    fillColor?: string;
    opacity?: CSSProperties['opacity'];
}

export const Boong = ({
    fillColor = '#F3E5AB',
    opacity = 1,
    style,
    onClick,
    ...props
}: BoongProps): ReactElement => {
    const playClick = useClickSound();

    const handleClick = onClick
        ? (e: React.MouseEvent<SVGSVGElement>) => {
              playClick();
              onClick(e);
          }
        : undefined;

    return (
        <svg viewBox="0 0 200 130" style={{ opacity, ...style }} onClick={handleClick} {...props}>
            {/* 몸 */}
            <path
                d="M28,65 C28,25 65,7 110,7 C150,7 172,30 172,55 L172,75 C172,100 150,123 110,123 C65,123 28,105 28,65 Z"
                style={{ fill: fillColor, transition: 'fill 50ms linear' }}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={2.5}
            />
            {/* 꼬리 */}
            <path
                d="M168,57 L196,36 L180,65 L196,94 L168,73 Z"
                style={{ fill: fillColor, transition: 'fill 50ms linear' }}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={2}
            />
            {/* 지느러미 */}
            <path
                d="M92,7 C98,-5 122,-5 128,7"
                style={{ fill: fillColor, transition: 'fill 50ms linear' }}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={1.5}
                strokeLinecap="round"
            />
            {/* 눈 */}
            <circle cx="52" cy="47" r="9" fill="#222" />
            <circle cx="49" cy="44" r="3" fill="rgba(255,255,255,0.3)" />
            {/* 입 */}
            <path
                d="M29,68 Q37,80 50,75"
                fill="none"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth={2.5}
                strokeLinecap="round"
            />
            {/* 몸 라인 */}
            <path d="M82,22 Q80,65 82,108" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={2} />
            <path
                d="M112,10 Q110,65 112,120"
                fill="none"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth={2}
            />
            <path
                d="M142,22 Q140,65 142,108"
                fill="none"
                stroke="rgba(0,0,0,0.12)"
                strokeWidth={2}
            />
        </svg>
    );
};
