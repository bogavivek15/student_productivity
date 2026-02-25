/* MotionTaskItem — Animated task row with status transitions, delete */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, GripVertical, Clock, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';
import { spring, duration, easing } from '../../design-system/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { priorityColor, categoryColor, formatDate } from '../../utils/helpers';
import type { Task, TaskStatus } from '../../data/types';

interface Props {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  index?: number;
}

const priorityIcons = {
  high:   <AlertTriangle className="w-3.5 h-3.5" />,
  medium: <Clock className="w-3.5 h-3.5" />,
  low:    null,
};

/** Status badge colors */
const statusBadge: Record<TaskStatus, string> = {
  'todo':        'bg-surface-100 dark:bg-surface-800 text-surface-500',
  'in-progress': 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400',
  'done':        'bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400',
};
const statusLabel: Record<TaskStatus, string> = {
  'todo': 'To Do', 'in-progress': 'Working', 'done': 'Done',
};

export const MotionTaskItem: React.FC<Props> = ({ task, onStatusChange, onDelete, index = 0 }) => {
  const reduced = useReducedMotion();
  const done = task.status === 'done';
  const isTodo = task.status === 'todo';
  const isInProgress = task.status === 'in-progress';

  // Popup for todo tasks
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup on outside click
  useEffect(() => {
    if (!showPopup) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPopup]);

  const handleCheckboxClick = () => {
    if (isTodo) {
      // Show popup: "Working" or "Completed"
      setShowPopup(true);
    } else if (isInProgress) {
      // In-progress → Done
      onStatusChange(task.id, 'done');
    } else {
      // Done → back to In-progress (undone)
      onStatusChange(task.id, 'in-progress');
    }
  };

  return (
    <motion.div
      layout
      initial={reduced ? undefined : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25, ease: easing.easeCalm } }}
      transition={{ duration: duration.base, ease: easing.easeFluid, delay: index * 0.04 }}
      whileHover={reduced ? undefined : { x: 2 }}
      className={`
        group relative flex items-start gap-3 p-3 rounded-xl
        bg-white dark:bg-surface-850
        border border-surface-200/50 dark:border-surface-700/40
        transition-colors duration-150 overflow-visible
        ${done ? 'opacity-60' : ''}
      `}
      style={{ zIndex: showPopup ? 100 : 'auto' }}
    >
      {/* Drag handle */}
      <span className="flex-shrink-0 mt-1 cursor-grab opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical className="w-4 h-4 text-surface-400" />
      </span>

      {/* Checkbox / status button */}
      <div className="relative flex-shrink-0" ref={popupRef}>
        <motion.button
          onClick={handleCheckboxClick}
          whileTap={reduced ? undefined : { scale: 0.85 }}
          transition={spring.responsive}
          className={`
            mt-0.5 w-5 h-5 rounded-md border-2
            flex items-center justify-center
            transition-colors duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
            ${done
              ? 'bg-success-500 border-success-500'
              : isInProgress
                ? 'bg-accent-500 border-accent-500'
                : 'border-surface-300 dark:border-surface-600 hover:border-accent-400'
            }
          `}
          aria-label={
            isTodo ? 'Update status' : isInProgress ? 'Mark complete' : 'Undo completion'
          }
        >
          <AnimatePresence>
            {done && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.delight}>
                <Check className="w-3 h-3 text-white" />
              </motion.span>
            )}
            {isInProgress && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={spring.delight}>
                <Play className="w-2.5 h-2.5 text-white fill-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Status popup for "todo" tasks */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 bottom-8 z-[100] w-40 py-1 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg"
            >
              <button
                onClick={() => { onStatusChange(task.id, 'in-progress'); setShowPopup(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-700 dark:text-surface-200 hover:bg-accent-50 dark:hover:bg-accent-500/10 transition-colors"
              >
                <Play className="w-4 h-4 text-accent-500" />
                Working
              </button>
              <button
                onClick={() => { onStatusChange(task.id, 'done'); setShowPopup(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-surface-700 dark:text-surface-200 hover:bg-success-50 dark:hover:bg-success-500/10 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                Completed
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium leading-snug ${
              done
                ? 'line-through text-surface-400 dark:text-surface-500'
                : 'text-surface-800 dark:text-surface-100'
            }`}
          >
            {task.title}
          </span>
          {/* Priority indicator */}
          {priorityIcons[task.priority] && (
            <span className={`flex-shrink-0 ${priorityColor(task.priority)}`}>
              {priorityIcons[task.priority]}
            </span>
          )}
        </div>

        {task.description && (
          <p className="mt-0.5 text-xs text-surface-400 dark:text-surface-500 line-clamp-1">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5">
          {/* Category badge */}
          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${categoryColor(task.category)}`}>
            {task.category}
          </span>
          {/* Status badge */}
          <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium ${statusBadge[task.status]}`}>
            {statusLabel[task.status]}
          </span>
          {/* Due date */}
          {task.dueDate && (
            <span className="text-[11px] text-surface-400">
              Due {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <motion.button
        onClick={() => onDelete(task.id)}
        whileHover={reduced ? undefined : { scale: 1.1 }}
        whileTap={reduced ? undefined : { scale: 0.9 }}
        className="
          flex-shrink-0 p-1.5 rounded-lg
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
          hover:bg-danger-500/10 text-surface-400 hover:text-danger-500
          transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400
        "
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};
