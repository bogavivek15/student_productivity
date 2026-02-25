/* StreakBadge — Animated streak display with glow on milestone */
import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { spring } from '../../design-system/motion';

interface Props {
  streak: number;
}

export const StreakBadge: React.FC<Props> = ({ streak }) => {
  const isMilestone = streak > 0 && streak % 7 === 0;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={spring.delight}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
        ${
          isMilestone
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/25'
            : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
        }
      `}
    >
      <motion.span
        animate={isMilestone ? { rotate: [0, -10, 10, -5, 5, 0] } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Flame className="w-4 h-4" />
      </motion.span>
      {streak}
    </motion.div>
  );
};
