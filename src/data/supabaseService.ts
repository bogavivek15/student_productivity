/* ═══════════════════════════════════════════════════════════════
   Supabase Service — CRUD operations for tasks, stats, profile
   All data is scoped per-user via RLS; writes include user_id.
   ═══════════════════════════════════════════════════════════════ */
import { supabase } from '../lib/supabase';
import type { Task, DailyStats, UserProfile } from './types';

/** Get the current authenticated user's ID or throw */
async function getAuthUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

/* ─────────────── Row ↔ App type mappers ─────────────── */

// Supabase row → App Task
function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    priority: row.priority,
    status: row.status,
    category: row.category,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    order: row.order,
  };
}

// App Task → Supabase insert/update payload
function taskToRow(task: Partial<Task> & { title?: string }) {
  const row: Record<string, any> = {};
  if (task.title !== undefined) row.title = task.title;
  if (task.description !== undefined) row.description = task.description || null;
  if (task.priority !== undefined) row.priority = task.priority;
  if (task.status !== undefined) row.status = task.status;
  if (task.category !== undefined) row.category = task.category;
  if (task.dueDate !== undefined) row.due_date = task.dueDate || null;
  if (task.completedAt !== undefined) row.completed_at = task.completedAt || null;
  if (task.order !== undefined) row.order = task.order;
  return row;
}

// Supabase row → App DailyStats
function rowToStats(row: any): DailyStats {
  return {
    date: row.date,
    tasksCompleted: row.tasks_completed,
    studyMinutes: row.study_minutes,
    focusScore: row.focus_score,
  };
}

// Supabase row → App UserProfile
function rowToProfile(row: any): UserProfile {
  return {
    name: row.name,
    email: row.email ?? undefined,
    avatar: row.avatar_url ?? undefined,
    dailyGoal: row.daily_goal,
    streak: row.streak,
  };
}

/* ═════════════════════ TASKS ═════════════════════ */

/** Fetch all tasks, ordered by `order` column */
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToTask);
}

/** Insert a new task (includes user_id for RLS) */
export async function createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from('tasks')
    .insert({ ...taskToRow(task), user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return rowToTask(data);
}

/** Update a task (partial update) */
export async function updateTask(id: string, changes: Partial<Task>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(taskToRow(changes))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return rowToTask(data);
}

/** Delete a task */
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}

/* ═════════════════════ DAILY STATS ═════════════════════ */

/** Fetch weekly stats (last 7 days) */
export async function fetchWeeklyStats(): Promise<DailyStats[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fromDate = sevenDaysAgo.toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .gte('date', fromDate)
    .order('date', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(rowToStats);
}

/** Upsert today's stats (includes user_id; conflict on user_id+date) */
export async function upsertTodayStats(
  stats: Omit<DailyStats, 'date'>,
): Promise<DailyStats> {
  const userId = await getAuthUserId();
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_stats')
    .upsert(
      {
        user_id: userId,
        date: today,
        tasks_completed: stats.tasksCompleted,
        study_minutes: stats.studyMinutes,
        focus_score: stats.focusScore,
      },
      { onConflict: 'user_id,date' },
    )
    .select()
    .single();

  if (error) throw error;
  return rowToStats(data);
}

/* ═════════════════════ USER PROFILE ═════════════════════ */

/** Fetch the authenticated user's profile (returns null if not found) */
export async function fetchProfile(): Promise<UserProfile | null> {
  const userId = await getAuthUserId();
  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToProfile(data);
}

/** Create a profile for $userId (fallback if trigger didn't fire) */
export async function createProfile(userId: string, name: string, email: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profile')
    .insert({ user_id: userId, name, email })
    .select()
    .single();

  if (error) throw error;
  return rowToProfile(data);
}

/** Update the authenticated user's profile */
export async function updateProfile(
  changes: Partial<UserProfile>,
): Promise<UserProfile> {
  const userId = await getAuthUserId();

  const row: Record<string, any> = {};
  if (changes.name !== undefined) row.name = changes.name;
  if (changes.dailyGoal !== undefined) row.daily_goal = changes.dailyGoal;
  if (changes.streak !== undefined) row.streak = changes.streak;
  if (changes.avatar !== undefined) row.avatar_url = changes.avatar || null;

  const { data, error } = await supabase
    .from('user_profile')
    .update(row)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return rowToProfile(data);
}
