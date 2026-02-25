/* MotionCard — Hoverable card with lift, glow, and depth animation */
import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '../../design-system/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Delay for staggered reveal (seconds) */
  delay?: number;
}

export const MotionCard: React.FC<Props> = ({ children, className = '', onClick, delay = 0 }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1], delay }}
      variants={reduced ? undefined : cardHover}
      whileHover={reduced ? undefined : 'hover'}
      whileTap={reduced ? undefined : 'tap'}
      onClick={onClick}
      className={`
        relative rounded-xl
        bg-white dark:bg-surface-850
        border border-surface-200/60 dark:border-surface-700/50
        shadow-card
        transition-colors duration-200
        overflow-hidden
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle gradient glow overlay on hover (CSS driven for perf) */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent-400/5 to-transparent" />
      {children}
    </motion.div>
  );
};
