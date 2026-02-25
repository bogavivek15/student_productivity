/* MotionMetricCounter — Animated count-up stat display */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Props {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Duration of count animation in ms */
  countDuration?: number;
  className?: string;
}

export const MotionMetricCounter: React.FC<Props> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  countDuration = 800,
  className = '',
}) => {
  const [display, setDisplay] = useState(0);
  const reduced = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = display;
    const delta = value - from;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / countDuration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + delta * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduced]);

  return (
    <div className={`flex flex-col ${className}`}>
      <motion.span
        key={value}
        initial={{ opacity: 0.6, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-2xl font-bold text-surface-900 dark:text-surface-50 tabular-nums"
      >
        {prefix}{display}{suffix}
      </motion.span>
      <span className="text-xs text-surface-500 font-medium mt-0.5">{label}</span>
    </div>
  );
};
