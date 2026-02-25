/* ═══════════════════════════════════════════════════════════════
   TasksPage — Full task management view with add / complete / delete
   Now uses Supabase-backed callbacks from useAppData
   ═══════════════════════════════════════════════════════════════ */
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../design-system/motion';
import { TaskList } from '../components/tasks/TaskList';
import { AddTaskForm } from '../components/tasks/AddTaskForm';
import { MotionFAB } from '../components/motion/MotionFAB';
import { MotionModal } from '../components/motion/MotionModal';
import type { Task, Toast, TaskStatus } from '../data/types';

interface Props {
  tasks: Task[];
  onAdd: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  addToast: (type: Toast['type'], message: string) => void;
}

export const TasksPage: React.FC<Props> = ({ tasks, onAdd, onStatusChange, onDelete, addToast }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = useCallback(
    (task: Task) => {
      onAdd(task);
      setModalOpen(false);
    },
    [onAdd],
  );

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="p-4 sm:p-6 max-w-3xl mx-auto"
      >
        <motion.div variants={staggerItem} className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">Tasks</h2>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Manage your assignments, study goals and projects
          </p>
        </motion.div>

        <motion.div variants={staggerItem}>
          <TaskList tasks={tasks} onStatusChange={onStatusChange} onDelete={onDelete} />
        </motion.div>
      </motion.div>

      {/* FAB + Modal */}
      <MotionFAB onClick={() => setModalOpen(true)} />
      <MotionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Task">
        <AddTaskForm onAdd={handleAdd} onClose={() => setModalOpen(false)} />
      </MotionModal>
    </>
  );
};
