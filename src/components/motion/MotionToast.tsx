/* MotionToast — Slide-in notification with auto-dismiss */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { toastVariants } from '../../design-system/motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import type { Toast } from '../../data/types';

interface Props {
  toast: Toast;
  onDismiss: (id: string) => void;
  /** Auto dismiss duration in ms (0 = no auto dismiss) */
  autoDismiss?: number;
}

const icons = {
  success: <CheckCircle className="w-4 h-4 text-success-500" />,
  error:   <AlertCircle className="w-4 h-4 text-danger-500" />,
  info:    <Info className="w-4 h-4 text-accent-500" />,
};

const barColors = {
  success: 'bg-success-500',
  error:   'bg-danger-500',
  info:    'bg-accent-500',
};

export const MotionToast: React.FC<Props> = ({ toast, onDismiss, autoDismiss = 4000 }) => {
  useEffect(() => {
    if (!autoDismiss) return;
    const t = setTimeout(() => onDismiss(toast.id), autoDismiss);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss, autoDismiss]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="
        relative w-80 rounded-lg overflow-hidden
        bg-white dark:bg-surface-850
        border border-surface-200/60 dark:border-surface-700/50
        shadow-float
      "
    >
      {/* Color accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColors[toast.type]}`} />

      <div className="flex items-start gap-3 p-3 pl-4">
        <span className="mt-0.5 flex-shrink-0">{icons[toast.type]}</span>
        <p className="flex-1 text-sm text-surface-700 dark:text-surface-200 leading-snug">
          {toast.message}
        </p>
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex-shrink-0 p-0.5 rounded hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-surface-400" />
        </button>
      </div>
    </motion.div>
  );
};
