/* Header — Top bar with greeting and search */
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { staggerItem } from '../../design-system/motion';

interface Props {
  userName: string;
  streak: number;
  email?: string;
}

export const Header: React.FC<Props> = ({ userName, streak, email }) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.header
      variants={staggerItem}
      className="flex items-center justify-between px-6 py-4 border-b border-surface-100 dark:border-surface-800/60"
    >
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">
          {greeting}, {userName} 👋
        </h1>
        <p className="text-sm text-surface-500 mt-0.5">
          {streak > 0 ? `🔥 ${streak}-day streak — keep it up!` : "Let\u2019s get productive today"}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="
              pl-9 pr-4 py-2 w-56 rounded-lg text-sm
              bg-surface-50 dark:bg-surface-800
              border border-surface-200 dark:border-surface-700
              text-surface-900 dark:text-surface-100
              placeholder:text-surface-400
              focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20
              transition-all duration-150
            "
          />
        </div>

        {/* Notification bell */}
        <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
          <Bell className="w-5 h-5 text-surface-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500" />
        </button>
      </div>
    </motion.header>
  );
};
