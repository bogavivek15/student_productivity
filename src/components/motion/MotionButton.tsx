/* MotionButton — Spring-based button with press physics */
import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants, spring } from '../../design-system/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-accent-500 hover:bg-accent-600 text-white shadow-sm active:shadow-none',
  secondary:
    'bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700',
  ghost:
    'bg-transparent hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300',
  danger:
    'bg-danger-500 hover:bg-danger-600 text-white',
};

export const MotionButton: React.FC<Props> = ({
  variant = 'primary',
  icon,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  const reduced = useReducedMotion();

  return (
    <motion.button
      variants={reduced ? undefined : buttonVariants}
      initial="rest"
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      transition={spring.responsive}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg
        text-sm font-medium
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2
        dark:focus-visible:ring-offset-surface-900
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
      {...rest}
    >
      {icon && <span className="flex-shrink-0 w-4 h-4">{icon}</span>}
      {children}
    </motion.button>
  );
};
