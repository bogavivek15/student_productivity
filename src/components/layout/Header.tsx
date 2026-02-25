/* Header — Top bar with greeting and functional search */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, X } from 'lucide-react';
import { staggerItem } from '../../design-system/motion';
import type { Task } from '../../data/types';

interface Props {
  userName: string;
  streak: number;
  email?: string;
  tasks?: Task[];
  onSearchSelect?: (taskId: string) => void;
  onNavigateToTasks?: () => void;
}

export const Header: React.FC<Props> = ({
  userName,
  streak,
  email,
  tasks = [],
  onSearchSelect,
  onNavigateToTasks,
}) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* ── Search state ── */
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredTasks = query.trim().length > 0
    ? tasks.filter((t) =>
        t.title.toLowerCase().startsWith(query.toLowerCase()) ||
        t.title.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  // Close results on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = useCallback((taskId: string) => {
    setQuery('');
    setShowResults(false);
    setMobileSearchOpen(false);
    onSearchSelect?.(taskId);
    onNavigateToTasks?.();
  }, [onSearchSelect, onNavigateToTasks]);

  const searchInput = (
    <div className="relative w-full" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
        onFocus={() => setShowResults(true)}
        placeholder="Search tasks..."
        className="
          pl-9 pr-4 py-2 w-full rounded-lg text-sm
          bg-surface-50 dark:bg-surface-800
          border border-surface-200 dark:border-surface-700
          text-surface-900 dark:text-surface-100
          placeholder:text-surface-400
          focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
          transition-all duration-150
        "
      />

      {/* Search results dropdown */}
      <AnimatePresence>
        {showResults && filteredTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg overflow-hidden max-h-64 overflow-y-auto"
          >
            {filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleSelect(task.id)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">
                    {task.title}
                  </p>
                  <p className="text-[11px] text-surface-400 capitalize">{task.category} · {task.status}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
        {showResults && query.trim().length > 0 && filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-lg p-3"
          >
            <p className="text-xs text-surface-400 text-center">No tasks found</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.header
      variants={staggerItem}
      className="relative flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-surface-100 dark:border-surface-800/60 gap-3"
    >
      {/* Greeting */}
      <div className="min-w-0 flex-shrink">
        <h1 className="text-base sm:text-xl font-bold text-surface-900 dark:text-white truncate">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-surface-500 mt-0.5 truncate">
          {streak > 0 ? `🔥 ${streak}-day streak — keep it up!` : "Let\u2019s get productive today"}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Desktop search bar */}
        <div className="relative hidden sm:block w-56">
          {searchInput}
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setMobileSearchOpen((v) => !v)}
          className="sm:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {mobileSearchOpen ? (
            <X className="w-5 h-5 text-surface-500" />
          ) : (
            <Search className="w-5 h-5 text-surface-500" />
          )}
        </button>

        {/* Notification bell */}
        <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
          <Bell className="w-5 h-5 text-surface-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
        </button>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 py-3 z-50"
          >
            {searchInput}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
