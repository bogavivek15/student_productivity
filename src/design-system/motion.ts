/* ═══════════════════════════════════════════════════════════════
   Cinematic Motion System
   Timing, easing, physics springs, and reusable animation variants
   ═══════════════════════════════════════════════════════════════ */
import type { Transition, Variants } from 'framer-motion';

/* ── Motion timing (seconds) ── */
export const duration = {
  instant:    0.1,
  quick:      0.16,
  base:       0.26,
  expressive: 0.42,
  cinematic:  0.6,
} as const;

/* ── Easing curves ── */
export const easing = {
  easeCalm:      [0.25, 0.1, 0.25, 1.0]  as [number, number, number, number],
  easeFluid:     [0.4, 0.0, 0.2, 1.0]    as [number, number, number, number],
  easeSnap:      [0.2, 0.0, 0.0, 1.0]    as [number, number, number, number],
  easeDecelerate:[0.0, 0.0, 0.2, 1.0]    as [number, number, number, number],
};

/* ── Spring physics presets ── */
export const spring = {
  gentle:     { type: 'spring' as const, stiffness: 120, damping: 20, mass: 1 },
  responsive: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
  delight:    { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.6 },
  bounce:     { type: 'spring' as const, stiffness: 400, damping: 25, mass: 0.5 },
};

/* ── Reusable transitions ── */
export const transition = {
  calm:       { duration: duration.base,       ease: easing.easeCalm }       as Transition,
  fluid:      { duration: duration.expressive, ease: easing.easeFluid }      as Transition,
  quick:      { duration: duration.quick,      ease: easing.easeSnap }       as Transition,
  cinematic:  { duration: duration.cinematic,  ease: easing.easeDecelerate } as Transition,
  springPop:  spring.delight as Transition,
  springSnap: spring.responsive as Transition,
};

/* ══════════════════════════════════════════════════════════════
   ANIMATION VARIANT LIBRARY
   Reusable Framer Motion variants for the entire app
   ══════════════════════════════════════════════════════════════ */

/** Fade in / out */
export const fadeVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: transition.calm },
  exit:    { opacity: 0, transition: transition.quick },
};

/** Slide up + fade (cards, list items) */
export const slideUpVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.easeFluid } },
  exit:    { opacity: 0, y: -8, transition: { duration: duration.quick, ease: easing.easeCalm } },
};

/** Scale + fade (modals, tooltips) */
export const scaleVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: spring.gentle },
  exit:    { opacity: 0, scale: 0.97, transition: { duration: duration.quick, ease: easing.easeCalm } },
};

/** Page transition — slide direction (left/right) */
export const pageVariants: Variants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: duration.expressive, ease: easing.easeFluid } },
  exit:    { opacity: 0, x: -20, transition: { duration: duration.base, ease: easing.easeCalm } },
};

/** Staggered children container */
export const staggerContainer: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

/** Staggered child item */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.easeFluid } },
};

/** Card hover lift effect */
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
  },
  hover: {
    y: -3,
    scale: 1.005,
    boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
    transition: spring.gentle,
  },
  tap: {
    scale: 0.995,
    transition: { duration: duration.instant },
  },
};

/** Button press effect */
export const buttonVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.02, transition: spring.responsive },
  tap:   { scale: 0.97, transition: { duration: duration.instant } },
};

/** Error shake feedback */
export const shakeVariants: Variants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

/** Completion celebration — subtle glow pulse */
export const celebrationVariants: Variants = {
  idle:    { boxShadow: '0 0 0px rgba(34,197,94,0)' },
  glow: {
    boxShadow: [
      '0 0 0px rgba(34,197,94,0)',
      '0 0 20px rgba(34,197,94,0.3)',
      '0 0 0px rgba(34,197,94,0)',
    ],
    transition: { duration: 1.2, ease: 'easeInOut' },
  },
};

/** Toast slide in from right */
export const toastVariants: Variants = {
  hidden:  { opacity: 0, x: 80, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: spring.delight },
  exit:    { opacity: 0, x: 80, scale: 0.95, transition: { duration: duration.base, ease: easing.easeCalm } },
};

/** Modal overlay backdrop */
export const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.quick } },
  exit:    { opacity: 0, transition: { duration: duration.instant } },
};

/** Modal body scale + fade */
export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: duration.base, ease: easing.easeFluid } },
  exit:    { opacity: 0, scale: 0.97, y: 8, transition: { duration: duration.quick, ease: easing.easeCalm } },
};

/** FAB entrance spring */
export const fabVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.6, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { ...spring.delight, delay: 0.4 } },
};
