/* MotionFAB — Floating action button with spring entrance */
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { fabVariants, spring } from '../../design-system/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  onClick: () => void;
  label?: string;
}

export const MotionFAB: React.FC<Props> = ({ onClick, label = 'Add task' }) => {
  const reduced = useReducedMotion();

  return (
    <motion.button
      variants={reduced ? undefined : fabVariants}
      initial="hidden"
      animate="visible"
      whileHover={reduced ? undefined : { scale: 1.08, boxShadow: '0 0 30px rgba(99,102,241,0.25)' }}
      whileTap={reduced ? undefined : { scale: 0.95 }}
      transition={spring.delight}
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-30
        w-14 h-14 rounded-2xl
        bg-accent-500 hover:bg-accent-600
        text-white shadow-lg shadow-accent-500/25
        flex items-center justify-center
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-surface-900
      "
      aria-label={label}
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </motion.button>
  );
};
