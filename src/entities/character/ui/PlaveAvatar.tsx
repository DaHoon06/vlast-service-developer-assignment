import Image, { ImageProps } from 'next/image';
import { ReactElement } from 'react';

import { cn } from '@/shared/lib';

const DEFAULT_SIZE = 80;
const DEFAULT_SRC = '/images/bomby.gif';

interface PlaveAvatarProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}

export const PlaveAvatar = ({
    src,
    alt,
    width,
    height,
    className,
    ...rest
}: PlaveAvatarProps): ReactElement => {
    return (
        <Image
            {...rest}
            src={src || DEFAULT_SRC}
            alt={alt || 'avatar'}
            width={width || DEFAULT_SIZE}
            height={height || DEFAULT_SIZE}
            loading="eager"
            sizes={`${width || DEFAULT_SIZE}px`}
            className={cn('h-full w-full object-cover', className)}
        />
    );
};
