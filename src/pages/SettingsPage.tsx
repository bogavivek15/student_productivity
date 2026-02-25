/* SettingsPage — Theme, daily goal, and preferences */
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../design-system/motion';
import { MotionCard } from '../components/motion/MotionCard';
import { MotionButton } from '../components/motion/MotionButton';
import { useTheme } from '../design-system/theme';
import { Sun, Moon, Monitor } from 'lucide-react';
import type { UserProfile } from '../data/types';

interface Props {
  user: UserProfile;
  onUpdateProfile: (changes: Partial<UserProfile>) => void;
}

export const SettingsPage: React.FC<Props> = ({ user, onUpdateProfile }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-2xl mx-auto space-y-6"
    >
      <motion.div variants={staggerItem}>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Settings</h2>
        <p className="text-sm text-surface-500 mt-0.5">Customize your workspace</p>
      </motion.div>

      {/* Appearance */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-3">
            Appearance
          </h3>
          <div className="flex items-center gap-3">
            <MotionButton
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => theme === 'dark' && toggleTheme()}
              icon={<Sun className="w-4 h-4" />}
            >
              Light
            </MotionButton>
            <MotionButton
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => theme === 'light' && toggleTheme()}
              icon={<Moon className="w-4 h-4" />}
            >
              Dark
            </MotionButton>
          </div>
        </MotionCard>
      </motion.div>

      {/* Daily Goal */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-1">
            Daily Task Goal
          </h3>
          <p className="text-xs text-surface-500 mb-3">
            How many tasks do you want to complete each day?
          </p>
          <div className="flex items-center gap-3">
            {[3, 5, 7, 10].map((n) => (
              <button
                key={n}
                onClick={() => onUpdateProfile({ dailyGoal: n })}
                className={`
                  w-10 h-10 rounded-lg text-sm font-bold
                  transition-all duration-150 border
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400
                  ${
                    user.dailyGoal === n
                      ? 'bg-accent-500 text-white border-accent-500 shadow-glow'
                      : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-accent-300'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </MotionCard>
      </motion.div>

      {/* Profile */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-3">
            Profile
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-500/15 flex items-center justify-center text-lg font-bold text-accent-600 dark:text-accent-400">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-100">{user.name}</p>
              <p className="text-xs text-surface-500">🔥 {user.streak}-day streak</p>
            </div>
          </div>
        </MotionCard>
      </motion.div>

      {/* About */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-1">
            About StudyFlow
          </h3>
          <p className="text-xs text-surface-500 leading-relaxed">
            A calm, motion-first student productivity dashboard. Built with React, TypeScript,
            Tailwind CSS, and Framer Motion. Designed to help students feel organized,
            in control, and motivated.
          </p>
          <p className="text-xs text-surface-400 mt-2">v1.0.0</p>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
};
