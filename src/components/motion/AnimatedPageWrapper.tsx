/* AnimatedPageWrapper — Wraps each page for enter/exit transitions */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../../design-system/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  pageKey: string;
  children: React.ReactNode;
}

export const AnimatedPageWrapper: React.FC<Props> = ({ pageKey, children }) => {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={reduced ? undefined : pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex-1 min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
