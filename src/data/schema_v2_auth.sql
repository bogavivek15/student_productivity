-- ═══════════════════════════════════════════════════════════════
-- StudyFlow v2 — Multi-user Auth Schema
-- Run this ENTIRE file in Supabase SQL Editor
-- This DROPS old tables and recreates them with user_id scoping
-- ═══════════════════════════════════════════════════════════════

-- ── 0. Clean up old policies & tables ──
DROP POLICY IF EXISTS "Allow all on tasks"       ON tasks;
DROP POLICY IF EXISTS "Allow all on daily_stats" ON daily_stats;
DROP POLICY IF EXISTS "Allow all on user_profile" ON user_profile;

DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS daily_stats CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;
DROP FUNCTION IF EXISTS update_updated_at CASCADE;
DROP FUNCTION IF EXISTS create_profile_for_user CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- 1. TASKS — scoped to auth user
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE tasks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT,
  priority     TEXT NOT NULL DEFAULT 'medium'
                 CHECK (priority IN ('low', 'medium', 'high')),
  status       TEXT NOT NULL DEFAULT 'todo'
                 CHECK (status IN ('todo', 'in-progress', 'done')),
  category     TEXT NOT NULL DEFAULT 'homework'
                 CHECK (category IN ('homework', 'study', 'project', 'exam', 'personal')),
  due_date     DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  "order"      INTEGER DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 2. DAILY STATS — one row per user per day
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE daily_stats (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  study_minutes   INTEGER DEFAULT 0,
  focus_score     INTEGER DEFAULT 0 CHECK (focus_score BETWEEN 0 AND 100),
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, date)
);

-- ═══════════════════════════════════════════════════════════════
-- 3. USER PROFILE — one per auth user
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE user_profile (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL DEFAULT 'Student',
  email      TEXT,
  avatar_url TEXT,
  daily_goal INTEGER DEFAULT 5,
  streak     INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- 4. AUTO-UPDATE updated_at TRIGGER
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════
-- 5. AUTO-CREATE PROFILE ON SIGNUP
--    When a new user signs up, create their profile row automatically
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_user();

-- ═══════════════════════════════════════════════════════════════
-- 6. ROW LEVEL SECURITY — users can only access their own data
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Tasks: full access scoped to owner
CREATE POLICY "Users manage own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Daily stats: full access scoped to owner
CREATE POLICY "Users manage own stats"
  ON daily_stats FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Profile: full access scoped to owner
CREATE POLICY "Users manage own profile"
  ON user_profile FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- DONE! Each student who signs up will:
--   1. Get an auto-created profile (via trigger)
--   2. See only their own tasks, stats, and profile (via RLS)
-- ═══════════════════════════════════════════════════════════════
