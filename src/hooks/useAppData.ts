/* ═══════════════════════════════════════════════════════════════
   useAppData — Central hook that loads & manages all data
   from Supabase (tasks, stats, profile)
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useCallback } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  fetchWeeklyStats,
  fetchProfile,
  createProfile,
  updateProfile,
} from '../data/supabaseService';
import type { Task, DailyStats, UserProfile, Toast } from '../data/types';
import { uid } from '../utils/helpers';

// Fallbacks while loading
const defaultProfile: UserProfile = { name: 'Student', dailyGoal: 5, streak: 0 };

export function useAppData(userId?: string | null) {
  /* ── State ── */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [user, setUser] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  /* ── Toast helpers ── */
  const addToast = useCallback((type: Toast['type'], message: string) => {
    setToasts((prev) => [...prev, { id: uid(), type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Initial data load (only when authenticated) ── */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadAll() {
      try {
        const [tasksData, statsData, profileData] = await Promise.all([
          fetchTasks(),
          fetchWeeklyStats(),
          fetchProfile(),
        ]);
        setTasks(tasksData);
        setStats(statsData);

        if (profileData) {
          setUser(profileData);
        } else {
          // Fallback: create profile if trigger didn't create one
          const created = await createProfile(userId!, 'Student', '');
          setUser(created);
        }
      } catch (err: any) {
        console.error('Failed to load data from Supabase:', err);
        addToast('error', 'Failed to load data. Check your connection.');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [userId, addToast]);

  /* ── Task operations ── */
  const handleAddTask = useCallback(
    async (task: Task) => {
      // Compute a safe order value that fits in PostgreSQL INTEGER
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) : -1;
      const taskWithOrder = { ...task, order: maxOrder + 1 };

      // Optimistic: add to local state immediately
      setTasks((prev) => [taskWithOrder, ...prev]);
      try {
        const created = await createTask(taskWithOrder);
        // Replace optimistic item with server version (has real id)
        setTasks((prev) =>
          prev.map((t) => (t.id === taskWithOrder.id ? created : t)),
        );
        addToast('success', `"${task.title}" added!`);
      } catch (err: any) {
        // Rollback on failure
        setTasks((prev) => prev.filter((t) => t.id !== taskWithOrder.id));
        addToast('error', `Failed to add task: ${err.message}`);
      }
    },
    [tasks, addToast],
  );

  const handleChangeTaskStatus = useCallback(
    async (id: string, newStatus: Task['status']) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const completedAt = newStatus === 'done' ? new Date().toISOString() : undefined;

      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, status: newStatus, completedAt }
            : t,
        ),
      );

      try {
        await updateTask(id, { status: newStatus, completedAt });
        if (newStatus === 'done') {
          addToast('success', `"${task.title}" completed! \ud83c\udf89`);
        } else if (newStatus === 'in-progress') {
          addToast('info', `"${task.title}" moved to In Progress`);
        }
      } catch (err: any) {
        // Rollback
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? task : t,
          ),
        );
        addToast('error', `Failed to update: ${err.message}`);
      }
    },
    [tasks, addToast],
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      // Optimistic remove
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        await deleteTask(id);
        addToast('info', `"${task.title}" removed`);
      } catch (err: any) {
        // Rollback
        setTasks((prev) => [...prev, task].sort((a, b) => a.order - b.order));
        addToast('error', `Failed to delete: ${err.message}`);
      }
    },
    [tasks, addToast],
  );

  /* ── Profile operations ── */
  const handleUpdateProfile = useCallback(
    async (changes: Partial<UserProfile>) => {
      const prev = user;
      setUser((u) => ({ ...u, ...changes }));

      try {
        const updated = await updateProfile(changes);
        setUser(updated);
      } catch (err: any) {
        setUser(prev);
        addToast('error', `Failed to update profile: ${err.message}`);
      }
    },
    [user, addToast],
  );

  return {
    // State
    tasks,
    stats,
    user,
    loading,
    toasts,

    // Task actions
    setTasks,
    addTask: handleAddTask,
    changeTaskStatus: handleChangeTaskStatus,
    deleteTask: handleDeleteTask,

    // Profile actions
    setUser: handleUpdateProfile,

    // Toast actions
    addToast,
    dismissToast,
  };
}
