/* MotionEmptyState — Gentle floating illustration with encouragement */
import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const MotionEmptyState: React.FC<Props> = ({
  title = 'Nothing here yet',
  description = 'Start by adding your first task!',
  icon,
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    {/* Floating icon */}
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="mb-4 p-4 rounded-2xl bg-surface-100 dark:bg-surface-800"
    >
      {icon ?? <Inbox className="w-8 h-8 text-surface-400" />}
    </motion.div>

    <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-200 mb-1">
      {title}
    </h3>
    <p className="text-sm text-surface-400 max-w-xs mb-4">{description}</p>
    {action}
  </motion.div>
);
