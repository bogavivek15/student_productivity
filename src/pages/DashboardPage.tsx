/* ═══════════════════════════════════════════════════════════════
   DashboardPage — Main landing page with metrics, charts & tasks
   ═══════════════════════════════════════════════════════════════ */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid,
} from 'recharts';
import {
  CheckCircle2, Clock, Target, TrendingUp,
} from 'lucide-react';
import { staggerContainer, staggerItem, cardHover } from '../design-system/motion';
import { MotionCard } from '../components/motion/MotionCard';
import { MotionMetricCounter } from '../components/motion/MotionMetricCounter';
import { MotionProgressBar } from '../components/motion/MotionProgressBar';
import { StreakBadge } from '../components/feedback/StreakBadge';
import { dayAbbr } from '../utils/helpers';
import type { Task, DailyStats, UserProfile } from '../data/types';

interface Props {
  tasks: Task[];
  stats: DailyStats[];
  user: UserProfile;
}

export const DashboardPage: React.FC<Props> = ({ tasks, stats, user }) => {
  /* ── Derived metrics ── */
  const totalTasks = tasks.length;
  const completedToday = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'todo').length;
  const completionRate = totalTasks > 0 ? Math.round((completedToday / totalTasks) * 100) : 0;
  const dailyGoalProgress = Math.min(Math.round((completedToday / user.dailyGoal) * 100), 100);

  // Average focus score
  const avgFocus = useMemo(
    () => Math.round(stats.reduce((s, d) => s + d.focusScore, 0) / (stats.length || 1)),
    [stats],
  );

  // Chart data with day labels
  const chartData = useMemo(
    () => stats.map((d) => ({ ...d, day: dayAbbr(d.date) })),
    [stats],
  );

  /* ── Metric cards config ── */
  const metrics = [
    { label: 'Completed',   value: completedToday, icon: <CheckCircle2 className="w-5 h-5 text-success-500" />, color: 'from-success-400/10 to-transparent' },
    { label: 'In Progress',  value: inProgress,     icon: <Clock className="w-5 h-5 text-accent-500" />,        color: 'from-accent-400/10 to-transparent' },
    { label: 'Pending',      value: pending,         icon: <Target className="w-5 h-5 text-warning-500" />,       color: 'from-warning-400/10 to-transparent' },
    { label: 'Focus Score',  value: avgFocus,        icon: <TrendingUp className="w-5 h-5 text-violet-500" />,    color: 'from-violet-400/10 to-transparent', suffix: '%' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 max-w-6xl mx-auto"
    >
      {/* ── Row 1: Greeting & Streak ── */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard</h2>
          <p className="text-sm text-surface-500 mt-0.5">Here's your productivity snapshot</p>
        </div>
        <StreakBadge streak={user.streak} />
      </motion.div>

      {/* ── Row 2: Metric cards ── */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MotionCard key={m.label} delay={i * 0.06} className="p-4 group">
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${m.color} opacity-60`} />
            <div className="relative flex items-start justify-between">
              <MotionMetricCounter value={m.value} label={m.label} suffix={m.suffix} />
              <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800">
                {m.icon}
              </div>
            </div>
          </MotionCard>
        ))}
      </motion.div>

      {/* ── Row 3: Daily goal progress ── */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Daily Goal</h3>
              <p className="text-xs text-surface-500 mt-0.5">
                {completedToday} of {user.dailyGoal} tasks completed
              </p>
            </div>
            <motion.span
              key={dailyGoalProgress}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-accent-500"
            >
              {dailyGoalProgress}%
            </motion.span>
          </div>
          <MotionProgressBar
            value={dailyGoalProgress}
            height={10}
            intent={dailyGoalProgress >= 100 ? 'success' : 'primary'}
          />
          {dailyGoalProgress >= 100 && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-success-500 font-medium"
            >
              🎉 Goal achieved! Keep the momentum going!
            </motion.p>
          )}
        </MotionCard>
      </motion.div>

      {/* ── Row 4: Charts side by side ── */}
      <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tasks completed chart */}
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-4">
            Tasks Completed This Week
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="tasksCompleted" fill="#6366f1" radius={[6, 6, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>

        {/* Focus score trend chart */}
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-4">
            Focus Score Trend
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#a1a1aa' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 10,
                    fontSize: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="focusScore"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#focusGradient)"
                  name="Focus %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>
      </motion.div>

      {/* ── Row 5: Completion rate overview ── */}
      <motion.div variants={staggerItem}>
        <MotionCard className="p-5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-1">
            Overall Completion Rate
          </h3>
          <p className="text-xs text-surface-500 mb-3">
            {completedToday} of {totalTasks} total tasks
          </p>
          <MotionProgressBar value={completionRate} height={8} intent="success" showLabel />
        </MotionCard>
      </motion.div>
    </motion.div>
  );
};
