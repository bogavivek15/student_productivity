/* Utility helpers */

/** Generate a unique ID */
export const uid = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Format a date string into short readable form */
export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/** Pluralize helper */
export const pluralize = (count: number, singular: string, plural?: string): string =>
  `${count} ${count === 1 ? singular : plural ?? singular + 's'}`;

/** Clamp a number between min/max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Priority color mapping */
export const priorityColor = (p: 'low' | 'medium' | 'high') =>
  ({ low: 'text-surface-400', medium: 'text-warning-500', high: 'text-danger-500' })[p];

/** Category color mapping */
export const categoryColor = (c: string) =>
  ({
    homework: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
    study:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    project:  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    exam:     'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    personal: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  })[c] ?? 'bg-surface-100 text-surface-600';

/** Get day abbreviation from ISO date  */
export const dayAbbr = (iso: string): string => {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
};
