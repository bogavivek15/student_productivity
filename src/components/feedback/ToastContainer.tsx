/* ToastContainer — AnimatePresence wrapper for toasts */
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { MotionToast } from '../motion/MotionToast';
import type { Toast } from '../../data/types';

interface Props {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
    <AnimatePresence>
      {toasts.map((toast) => (
        <MotionToast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);
