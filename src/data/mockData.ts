/* ═══════════════════════════════════════════════════════════════
   Mock Data — Realistic sample data for the dashboard
   ═══════════════════════════════════════════════════════════════ */
import type { Task, DailyStats, UserProfile } from './types';

let _id = 0;
const uid = () => `task-${++_id}`;

export const mockUser: UserProfile = {
  name: 'Vivek boga',
  dailyGoal: 5,
  streak: 7,
};

export const mockTasks: Task[] = [
  {
    id: uid(), title: 'Read Chapter 5 — Organic Chemistry',
    description: 'Focus on reaction mechanisms and practice problems 12-18',
    priority: 'high', status: 'todo', category: 'study',
    dueDate: '2026-02-25', createdAt: '2026-02-22T08:00:00Z', order: 0,
  },
  {
    id: uid(), title: 'Submit Math Assignment #4',
    description: 'Complete exercises on integration by parts',
    priority: 'high', status: 'in-progress', category: 'homework',
    dueDate: '2026-02-26', createdAt: '2026-02-21T10:00:00Z', order: 1,
  },
  {
    id: uid(), title: 'Research sources for History essay',
    priority: 'medium', status: 'todo', category: 'project',
    dueDate: '2026-02-28', createdAt: '2026-02-20T14:00:00Z', order: 2,
  },
  {
    id: uid(), title: 'Review Physics lecture notes',
    description: 'Chapters 9 & 10 — Thermodynamics',
    priority: 'medium', status: 'todo', category: 'study',
    dueDate: '2026-02-27', createdAt: '2026-02-23T09:00:00Z', order: 3,
  },
  {
    id: uid(), title: 'Prepare flashcards for Biology exam',
    priority: 'high', status: 'todo', category: 'exam',
    dueDate: '2026-03-01', createdAt: '2026-02-22T11:00:00Z', order: 4,
  },
  {
    id: uid(), title: 'Schedule study group meeting',
    priority: 'low', status: 'done', category: 'personal',
    createdAt: '2026-02-19T16:00:00Z', completedAt: '2026-02-20T18:00:00Z', order: 5,
  },
  {
    id: uid(), title: 'Organize digital notes folder',
    priority: 'low', status: 'done', category: 'personal',
    createdAt: '2026-02-18T12:00:00Z', completedAt: '2026-02-19T14:00:00Z', order: 6,
  },
  {
    id: uid(), title: 'Complete CS Programming Lab',
    description: 'Implement binary search tree operations',
    priority: 'high', status: 'in-progress', category: 'homework',
    dueDate: '2026-02-25', createdAt: '2026-02-21T08:00:00Z', order: 7,
  },
];

export const mockWeeklyStats: DailyStats[] = [
  { date: '2026-02-18', tasksCompleted: 4, studyMinutes: 120, focusScore: 72 },
  { date: '2026-02-19', tasksCompleted: 6, studyMinutes: 180, focusScore: 85 },
  { date: '2026-02-20', tasksCompleted: 3, studyMinutes: 90,  focusScore: 60 },
  { date: '2026-02-21', tasksCompleted: 5, studyMinutes: 150, focusScore: 78 },
  { date: '2026-02-22', tasksCompleted: 7, studyMinutes: 210, focusScore: 92 },
  { date: '2026-02-23', tasksCompleted: 5, studyMinutes: 160, focusScore: 80 },
  { date: '2026-02-24', tasksCompleted: 2, studyMinutes: 60,  focusScore: 55 },
];
