'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ReactElement } from 'react';

interface ComboDisplayProps {
    combo: number;
}

export const ComboDisplay = ({ combo }: ComboDisplayProps): ReactElement => {
    return (
        <>
            <span aria-live="polite" aria-atomic="true" className="sr-only">
                {combo > 0 ? `${combo} 콤보` : ''}
            </span>
            <AnimatePresence>
                {combo > 0 && (
                    <motion.div
                        key={combo}
                        aria-hidden
                        initial={{ scale: 0.6, opacity: 0, y: -8 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'backOut' }}
                        className="pointer-events-none absolute right-4 top-14 z-20 text-xl font-bold italic text-yellow-400 drop-shadow-lg"
                    >
                        {combo} COMBO!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
