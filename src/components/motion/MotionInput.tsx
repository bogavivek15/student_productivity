/* MotionInput — Animated focus halo + floating label */
import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { duration, easing } from '../../design-system/motion';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const MotionInput: React.FC<Props> = ({
  label,
  error,
  className = '',
  value,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const hasValue = value !== undefined && value !== '';
  const isFloating = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      {/* Floating label */}
      {label && (
        <motion.label
          htmlFor={id}
          animate={{
            y: isFloating ? -22 : 0,
            scale: isFloating ? 0.85 : 1,
            color: focused
              ? 'rgb(99,102,241)'
              : error
                ? 'rgb(239,68,68)'
                : 'rgb(113,113,122)',
          }}
          transition={{ duration: duration.quick, ease: easing.easeFluid }}
          className="absolute left-3 top-2.5 origin-left pointer-events-none text-sm"
        >
          {label}
        </motion.label>
      )}

      <input
        id={id}
        value={value}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        className={`
          w-full px-3 pt-2.5 pb-2 rounded-lg text-sm
          bg-surface-50 dark:bg-surface-800
          border transition-colors duration-150
          text-surface-900 dark:text-surface-100
          placeholder:text-surface-400
          focus:outline-none
          ${
            error
              ? 'border-danger-400 dark:border-danger-500'
              : focused
                ? 'border-accent-400 dark:border-accent-500'
                : 'border-surface-200 dark:border-surface-700'
          }
        `}
        {...rest}
      />

      {/* Animated focus ring / halo */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          boxShadow: focused
            ? '0 0 0 3px rgba(99,102,241,0.15)'
            : '0 0 0 0px rgba(99,102,241,0)',
        }}
        transition={{ duration: duration.quick }}
      />

      {/* Error message with shake */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, x: 0 }}
            animate={{ opacity: 1, y: 0, x: [0, -4, 4, -2, 2, 0] }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="mt-1 text-xs text-danger-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};
