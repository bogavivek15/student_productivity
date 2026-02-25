/* ═══════════════════════════════════════════════════════════════
   Data Types — TypeScript interfaces for the application
   ═══════════════════════════════════════════════════════════════ */

export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type Category = 'homework' | 'study' | 'project' | 'exam' | 'personal';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  category: Category;
  dueDate?: string;        // ISO date string
  createdAt: string;
  completedAt?: string;
  order: number;
}

export interface DailyStats {
  date: string;
  tasksCompleted: number;
  studyMinutes: number;
  focusScore: number;       // 0 – 100
}

export interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
  dailyGoal: number;        // tasks per day
  streak: number;           // consecutive days meeting goal
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

/** Navigation route identifiers */
export type RouteId = 'dashboard' | 'tasks' | 'calendar' | 'settings';
