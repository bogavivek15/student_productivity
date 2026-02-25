/* ═══════════════════════════════════════════════════════════════
   Design Tokens — Single source of truth for the visual language
   ═══════════════════════════════════════════════════════════════ */

/** Spacing scale (in px) — consistent rhythm across the UI */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** Border-radius tokens */
export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
} as const;

/** Shadow tokens with depth levels (light mode defaults) */
export const shadows = {
  xs:    '0 1px 2px rgba(0,0,0,0.04)',
  sm:    '0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)',
  md:    '0 2px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
  lg:    '0 4px 16px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
  xl:    '0 8px 30px rgba(0,0,0,0.12)',
  glow:  '0 0 20px rgba(99,102,241,0.15)',
  glowLg:'0 0 40px rgba(99,102,241,0.22)',
} as const;

/** Z-index layering system */
export const zIndex = {
  base:     0,
  dropdown: 10,
  sticky:   20,
  overlay:  30,
  modal:    40,
  toast:    50,
  tooltip:  60,
} as const;

/** Color intent system — maps semantic meaning */
export const colorIntent = {
  primary:   'accent-500',
  success:   'success-500',
  warning:   'warning-500',
  danger:    'danger-500',
  neutral:   'surface-500',
} as const;

/** Type scale (rem) — clear hierarchy */
export const typeScale = {
  xs:   { size: '0.75rem',  lineHeight: '1rem',    weight: 400 },
  sm:   { size: '0.8125rem',lineHeight: '1.25rem', weight: 400 },
  base: { size: '0.875rem', lineHeight: '1.375rem',weight: 400 },
  md:   { size: '1rem',     lineHeight: '1.5rem',  weight: 500 },
  lg:   { size: '1.125rem', lineHeight: '1.625rem',weight: 600 },
  xl:   { size: '1.25rem',  lineHeight: '1.75rem', weight: 600 },
  '2xl':{ size: '1.5rem',   lineHeight: '2rem',    weight: 700 },
  '3xl':{ size: '2rem',     lineHeight: '2.5rem',  weight: 700 },
  hero: { size: '2.5rem',   lineHeight: '3rem',    weight: 800 },
} as const;
