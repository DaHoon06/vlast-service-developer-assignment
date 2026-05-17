'use client';

import React from 'react';

import { useNavigation } from '@/shared/lib';

interface NavButtonProps {
    href: string;
    asChild?: boolean;
    children: React.ReactNode;
}

export const NavButton = ({ href, asChild, children }: NavButtonProps) => {
    const { push } = useNavigation();
    const handleClick = () => push(href);

    if (asChild && React.isValidElement(children)) {
        const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>;
        const childOnClick = child.props.onClick;
        return React.cloneElement(child, {
            onClick: childOnClick
                ? async (e: React.MouseEvent<HTMLElement>) => {
                      try {
                          await (
                              childOnClick as (
                                  e: React.MouseEvent<HTMLElement>,
                              ) => Promise<void> | void
                          )(e);
                          handleClick();
                      } catch {}
                  }
                : handleClick,
        });
    }

    return <button onClick={handleClick}>{children}</button>;
};
