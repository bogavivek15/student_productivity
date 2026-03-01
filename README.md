<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
</p>

# 📚 StudyFlow — Student Productivity Dashboard

> A beautifully animated, emotionally intelligent productivity dashboard built for students. Track tasks, visualize study habits, manage deadlines, and stay on top of your academic game — all in a fluid, motion-rich interface powered by **Supabase** for real-time persistence and multi-user authentication.

---

## ✨ Features

### 🔐 Multi-User Authentication
- Secure **email + password** sign-up / sign-in powered by Supabase Auth
- **Row-Level Security (RLS)** — every student sees only their own data
- Animated login / sign-up page with tab switching and shake error feedback

### ✅ Smart Task Management
- Create, edit, and delete tasks with **priority** (Low / Medium / High), **categories** (Homework, Study, Project, Exam, Personal), and **due dates**
- Intuitive status flow:
  - *To-Do* → click → popup: **"Working"** or **"Completed"**
  - *In-Progress* → click → **Done**
  - *Done* → undo → **In-Progress**
- Filter by status (All / To Do / In Progress / Done)

### 📊 Interactive Dashboard
- At-a-glance metric cards (total tasks, completed, streak) with animated counters
- **Bar chart** (tasks completed per day) and **Area chart** (focus score trend) via Recharts
- Animated daily goal progress ring
- Streak badge with milestone glow

### 📅 Calendar View
- Upcoming deadlines displayed in a clean, sortable list grouped by date

### ⚙️ Settings & Profile
- Update display name and set daily task goals
- Toggle between **dark** and **light** themes (persisted to localStorage)

### 🎬 Motion-First Design System
12 reusable animation components built on Framer Motion:
- `MotionCard` · `MotionButton` · `MotionInput` · `MotionModal` · `MotionFAB`
- `MotionProgressBar` · `MotionMetricCounter` · `MotionToast` · `MotionEmptyState`
- `AnimatedPageWrapper` · `MotionProvider` · `SkeletonLoader`
- Spring physics, stagger effects, page transitions, and reduced-motion accessibility support

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React + TypeScript | 18.3 / 5.6 |
| **Build Tool** | Vite | 6.4 |
| **Styling** | Tailwind CSS (custom design tokens) | 3.4 |
| **Animations** | Framer Motion (LazyMotion + domAnimation) | 11.15+ |
| **Charts** | Recharts | 2.15+ |
| **Icons** | Lucide React | 0.468+ |
| **Backend & Auth** | Supabase (PostgreSQL + Auth + RLS) | 2.97+ |

---

## 📁 Project Structure

```
student_productivity/
├── public/                          # Static assets
├── src/
│   ├── components/
│   │   ├── feedback/                # Toast, Confetti, StreakBadge
│   │   ├── layout/                  # Header, MotionSidebar
│   │   ├── motion/                  # 12 reusable animation components
│   │   └── tasks/                   # MotionTaskItem, TaskList, AddTaskForm
│   ├── data/
│   │   ├── types.ts                 # Shared TypeScript types
│   │   ├── supabaseService.ts       # Supabase CRUD (user-scoped)
│   │   ├── mockData.ts              # Fallback sample data
│   │   ├── schema.sql               # Base database schema
│   │   ├── schema_v2_auth.sql       # Multi-user schema + RLS policies
│   │   └── seed_demo.sql            # Demo data seeder
│   ├── design-system/
│   │   ├── motion.ts                # Duration, easing, spring & variant presets
│   │   └── theme.tsx                # ThemeProvider (dark / light)
│   ├── hooks/
│   │   ├── useAuth.ts               # Supabase Auth (session, signIn, signUp, signOut)
│   │   ├── useAppData.ts            # Central data hook (tasks, stats, profile CRUD)
│   │   ├── useLocalStorage.ts       # Generic localStorage hook
│   │   └── useReducedMotion.ts      # Accessibility: prefers-reduced-motion
│   ├── lib/
│   │   └── supabase.ts              # Supabase client singleton
│   ├── pages/
│   │   ├── AuthPage.tsx             # Login / Sign-up with animated tabs
│   │   ├── DashboardPage.tsx        # Metrics, charts, streak badge
│   │   ├── TasksPage.tsx            # Task CRUD + status flow
│   │   ├── CalendarPage.tsx         # Upcoming deadlines
│   │   └── SettingsPage.tsx         # Profile, theme, daily goal
│   ├── utils/                       # Helper utilities
│   ├── App.tsx                      # Auth gate + app shell
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind directives + custom styles
├── .env                             # Supabase credentials (not committed)
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [Download here](https://nodejs.org)
- **npm** ≥ 9 (comes with Node.js)
- A **Supabase** project — [supabase.com](https://supabase.com)

### 1. Clone the repository

```bash
git clone https://github.com/bogavivek15/student_productivity.git
cd student_productivity
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

Open the **Supabase SQL Editor** and run the migration scripts in order:

1. `src/data/schema.sql` — base tables (tasks, daily_stats, profiles)
2. `src/data/schema_v2_auth.sql` — adds `user_id` foreign keys, RLS policies, and auto-profile trigger on signup
3. *(Optional)* `src/data/seed_demo.sql` — inserts demo data for the showcase account

### 5. Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (or the next available port).

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| **Name** | Vivek |
| **Email** | `bogavivek15@gmail.com` |
| **Password** | `111111` |

> **Note:** Sign up with these credentials first, then run `seed_demo.sql` in Supabase SQL Editor to see pre-populated dashboard data.

---

## 🗄️ Database Schema

```
profiles     — user_id (PK → auth.users), display_name, daily_goal, streak, …
tasks        — id, user_id (FK), title, status, priority, category, due_date, order, …
daily_stats  — id, user_id (FK), date, tasks_completed, study_hours, focus_score, …
```

All tables enforce **Row-Level Security**: `auth.uid() = user_id`.

---

## 🔄 Task Status Flow

```
┌─────────┐   click   ┌────────────────────────┐
│  To-Do  │ ────────► │  Popup: Working /      │
│         │           │         Completed      │
└─────────┘           └────────────────────────┘
                            │            │
                       "Working"    "Completed"
                            ▼            ▼
                     ┌────────────┐  ┌──────────┐
                     │In-Progress │  │   Done   │
                     └────────────┘  └──────────┘
                            │            │
                       click │       undo │
                            ▼            ▼
                     ┌──────────┐  ┌────────────┐
                     │   Done   │  │In-Progress │
                     └──────────┘  └────────────┘
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 🎓 For Students & Contributors

This project is designed to be **easy to understand**:

1. **Each folder has one job** — data, design, components, pages
2. **Components are small** — each file does one thing
3. **Types are documented** — check `src/data/types.ts`
4. **Motion is centralized** — all animation rules in `src/design-system/motion.ts`
5. **Auth is isolated** — `useAuth` hook handles all authentication
6. **Data is user-scoped** — every query filters by `auth.uid()`

Start exploring from `src/App.tsx` — it's the heart of the app!

---

## 📄 License

This project is built for educational and demonstration purposes.

---

<p align="center">
  Built with ❤️ by <strong>Vivek</strong>
</p>
