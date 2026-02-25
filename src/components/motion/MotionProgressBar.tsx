/* MotionProgressBar — Fluid animated progress bar */
import React from 'react';
import { motion } from 'framer-motion';
import { spring, duration, easing } from '../../design-system/motion';
import { clamp } from '../../utils/helpers';

interface Props {
  /** 0 – 100 */
  value: number;
  /** Bar height in px */
  height?: number;
  /** Color intent */
  intent?: 'primary' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

const intentGradient: Record<string, string> = {
  primary: 'from-accent-400 to-accent-600',
  success: 'from-success-400 to-success-600',
  warning: 'from-warning-400 to-warning-600',
  danger:  'from-danger-400 to-danger-600',
};

export const MotionProgressBar: React.FC<Props> = ({
  value,
  height = 8,
  intent = 'primary',
  showLabel = false,
  className = '',
}) => {
  const clamped = clamp(value, 0, 100);

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-surface-500 font-medium">Progress</span>
          <motion.span
            key={clamped}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-surface-700 dark:text-surface-300"
          >
            {Math.round(clamped)}%
          </motion.span>
        </div>
      )}

      {/* Track */}
      <div
        className="w-full rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden"
        style={{ height }}
      >
        {/* Animated fill */}
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${intentGradient[intent]}`}
          initial={{ width: '0%' }}
          animate={{ width: `${clamped}%` }}
          transition={{
            duration: duration.expressive,
            ease: easing.easeFluid,
            ...(clamped === 100 ? spring.delight : {}),
          }}
        />
      </div>
    </div>
  );
};
