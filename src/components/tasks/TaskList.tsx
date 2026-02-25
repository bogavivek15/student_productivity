/* TaskList — Animated list with stagger, reorder, and filters */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { staggerContainer } from '../../design-system/motion';
import { MotionTaskItem } from './MotionTaskItem';
import { MotionEmptyState } from '../motion/MotionEmptyState';
import { ListChecks } from 'lucide-react';
import type { Task, TaskStatus } from '../../data/types';

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const filters: { label: string; value: TaskStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'To Do',       value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Done',        value: 'done' },
];

export const TaskList: React.FC<Props> = ({ tasks, onStatusChange, onDelete }) => {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)),
    [tasks, filter],
  );

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 p-1 rounded-lg bg-surface-100/60 dark:bg-surface-800/60 w-full sm:w-fit overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`
              relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
              ${
                filter === f.value
                  ? 'text-accent-600 dark:text-accent-400'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
              }
            `}
          >
            {filter === f.value && (
              <motion.div
                layoutId="task-filter-active"
                className="absolute inset-0 rounded-md bg-white dark:bg-surface-700 shadow-sm"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <LayoutGroup>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <MotionEmptyState
                key="empty"
                icon={<ListChecks className="w-8 h-8 text-surface-400" />}
                title={filter === 'done' ? 'No completed tasks' : 'No tasks here'}
                description={
                  filter === 'all'
                    ? 'Add a task to get started on your productive day!'
                    : `No tasks with status "${filter}"`
                }
              />
            ) : (
              filtered.map((task, i) => (
                <MotionTaskItem
                  key={task.id}
                  task={task}
                  index={i}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>
    </div>
  );
};
