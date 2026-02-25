/* MotionModal — Backdrop blur modal with scale entrance */
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariants, modalVariants } from '../../design-system/motion';
import { X } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const MotionModal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  const reduced = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  // Focus trap: focus the modal when it opens
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={reduced ? undefined : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          />

          {/* Modal body */}
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            variants={reduced ? undefined : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="
              relative w-full max-w-md rounded-2xl
              bg-white dark:bg-surface-850
              border border-surface-200/60 dark:border-surface-700/50
              shadow-xl overflow-hidden
              focus:outline-none
            "
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
