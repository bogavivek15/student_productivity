/* SkeletonLoader — Shimmer gradient loading placeholder */
import React from 'react';

interface Props {
  /** Number of skeleton rows */
  rows?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<Props> = ({ rows = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`} aria-busy="true" aria-label="Loading content">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="animate-pulse flex items-center gap-3">
        {/* Icon placeholder */}
        <div className="w-8 h-8 rounded-lg bg-surface-200 dark:bg-surface-700" />
        {/* Text lines */}
        <div className="flex-1 space-y-2">
          <div
            className="h-3 rounded-full bg-surface-200 dark:bg-surface-700 relative overflow-hidden"
            style={{ width: `${70 + (i * 10) % 30}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
          </div>
          <div
            className="h-2.5 rounded-full bg-surface-100 dark:bg-surface-800"
            style={{ width: `${40 + (i * 15) % 30}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);
