'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps } from 'react';

import cn from '@/shared/lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTitle = DialogPrimitive.Title;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) => {
    return (
        <DialogPrimitive.Overlay
            className={cn(
                'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                className,
            )}
            {...props}
        />
    );
}

export const DialogContent = ({
    className,
    children,
    showClose = true,
    ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { showClose?: boolean }) => {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/95 p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                    className,
                )}
                {...props}
            >
                {showClose && (
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-white/40 transition-colors hover:text-white/80">
                        <X className="h-4 w-4" />
                        <span className="sr-only">닫기</span>
                    </DialogPrimitive.Close>
                )}
                {children}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}
