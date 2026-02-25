/* ═══════════════════════════════════════════════════════════════
   MotionSidebar — Collapsible sidebar with morphing width
   ═══════════════════════════════════════════════════════════════ */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';
import { duration, easing, spring } from '../../design-system/motion';
import { useTheme } from '../../design-system/theme';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { RouteId } from '../../data/types';

interface Props {
  currentRoute: RouteId;
  onNavigate: (route: RouteId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
}

interface NavItem {
  id: RouteId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'tasks',     label: 'Tasks',     icon: <CheckSquare className="w-5 h-5" /> },
  { id: 'calendar',  label: 'Calendar',  icon: <Calendar className="w-5 h-5" /> },
  { id: 'settings',  label: 'Settings',  icon: <Settings className="w-5 h-5" /> },
];

export const MotionSidebar: React.FC<Props> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const reduced = useReducedMotion();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={reduced ? { duration: 0 } : { duration: duration.base, ease: easing.easeFluid }}
      className="
        relative flex flex-col h-screen
        bg-white dark:bg-surface-900
        border-r border-surface-200/60 dark:border-surface-800
        overflow-hidden flex-shrink-0
        z-20
      "
    >
      {/* ── Brand header ── */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <motion.div
          whileHover={reduced ? undefined : { rotate: 15, scale: 1.1 }}
          transition={spring.delight}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: duration.quick, ease: easing.easeFluid }}
              className="text-lg font-bold text-surface-900 dark:text-white whitespace-nowrap"
            >
              StudyFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation items ── */}
      <nav className="flex-1 px-2 space-y-1 mt-2">
        {navItems.map((item) => {
          const active = currentRoute === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={reduced ? undefined : { x: 2 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={spring.responsive}
              className={`
                relative flex items-center gap-3 w-full rounded-lg
                px-3 py-2.5 text-sm font-medium
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
                ${
                  active
                    ? 'text-accent-600 dark:text-accent-400'
                    : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200'
                }
              `}
            >
              {/* Active indicator pill */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-accent-50 dark:bg-accent-500/10"
                  transition={spring.gentle}
                />
              )}
              <span className="relative flex-shrink-0">{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: duration.quick, delay: 0.05 }}
                    className="relative whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Bottom controls ── */}
      <div className="px-2 pb-4 space-y-1">
        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={reduced ? undefined : { x: 2 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Log out */}
        {onLogout && (
          <motion.button
            onClick={onLogout}
            whileHover={reduced ? undefined : { x: 2 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-danger-500 hover:text-danger-600 dark:text-danger-400 dark:hover:text-danger-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* Collapse toggle */}
        <motion.button
          onClick={onToggleCollapse}
          whileHover={reduced ? undefined : { x: 2 }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};
