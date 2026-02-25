/* MobileBottomNav — Bottom tab bar for mobile devices */
import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  LogOut,
} from 'lucide-react';
import { spring } from '../../design-system/motion';
import type { RouteId } from '../../data/types';

interface Props {
  currentRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  onLogout?: () => void;
}

const tabs: { id: RouteId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const MobileBottomNav: React.FC<Props> = ({ currentRoute, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const active = currentRoute === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`
                relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl
                transition-colors duration-150 min-w-[4rem]
                ${active
                  ? 'text-accent-600 dark:text-accent-400'
                  : 'text-surface-400 dark:text-surface-500'
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="mobile-tab-active"
                  className="absolute inset-0 rounded-xl bg-accent-50 dark:bg-accent-500/10"
                  transition={spring.gentle}
                />
              )}
              <span className="relative">{tab.icon}</span>
              <span className="relative text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
