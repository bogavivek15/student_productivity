/* ═══════════════════════════════════════════════════════════════
   MotionProvider — Wraps the app with motion + theme context
   ═══════════════════════════════════════════════════════════════ */
import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { ThemeProvider } from '../../design-system/theme';

/**
 * Top-level provider that supplies:
 *  • Framer Motion feature bundle (tree-shakeable)
 *  • Dark/Light theme context
 */
export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyMotion features={domAnimation}>
    <ThemeProvider>{children}</ThemeProvider>
  </LazyMotion>
);
