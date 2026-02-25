/* CalendarPage — Placeholder calendar view */
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../design-system/motion';
import { MotionCard } from '../components/motion/MotionCard';
import { CalendarDays } from 'lucide-react';
import type { Task } from '../data/types';
import { formatDate } from '../utils/helpers';

interface Props {
  tasks: Task[];
}

export const CalendarPage: React.FC<Props> = ({ tasks }) => {
  // Group tasks with due dates
  const upcoming = tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-3xl mx-auto"
    >
      <motion.div variants={staggerItem} className="mb-6">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Calendar</h2>
        <p className="text-sm text-surface-500 mt-0.5">
          Upcoming deadlines and due dates
        </p>
      </motion.div>

      {upcoming.length === 0 ? (
        <motion.div variants={staggerItem}>
          <MotionCard className="p-8 text-center">
            <CalendarDays className="w-10 h-10 mx-auto text-surface-300 dark:text-surface-600 mb-3" />
            <p className="text-sm text-surface-500">No upcoming deadlines — nice!</p>
          </MotionCard>
        </motion.div>
      ) : (
        <motion.div variants={staggerItem} className="space-y-3">
          {upcoming.map((task, i) => (
            <MotionCard key={task.id} delay={i * 0.05} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                    {task.title}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5 capitalize">{task.category}</p>
                </div>
                <span className="text-xs font-semibold text-accent-500 bg-accent-50 dark:bg-accent-500/10 px-2.5 py-1 rounded-full">
                  {formatDate(task.dueDate!)}
                </span>
              </div>
            </MotionCard>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
