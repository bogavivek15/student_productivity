-- ═══════════════════════════════════════════════════════════════
-- StudyFlow Database Schema — Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. TASKS TABLE — All student tasks
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  priority    TEXT NOT NULL DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
  status      TEXT NOT NULL DEFAULT 'todo'
                CHECK (status IN ('todo', 'in-progress', 'done')),
  category    TEXT NOT NULL DEFAULT 'homework'
                CHECK (category IN ('homework', 'study', 'project', 'exam', 'personal')),
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  "order"     INTEGER DEFAULT 0,           -- keep small; do NOT use Date.now()

  -- timestamps for sync
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DAILY STATS TABLE — Daily productivity metrics
CREATE TABLE IF NOT EXISTS daily_stats (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date            DATE NOT NULL UNIQUE,
  tasks_completed INTEGER DEFAULT 0,
  study_minutes   INTEGER DEFAULT 0,
  focus_score     INTEGER DEFAULT 0 CHECK (focus_score BETWEEN 0 AND 100),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER PROFILE TABLE — User settings and streaks
CREATE TABLE IF NOT EXISTS user_profile (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT 'Student',
  avatar_url  TEXT,
  daily_goal  INTEGER DEFAULT 5,
  streak      INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Auto-update updated_at on row changes ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER user_profile_updated_at
  BEFORE UPDATE ON user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Enable Row Level Security (public access for now) ──
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (no auth for this student project)
CREATE POLICY "Allow all on tasks"      ON tasks      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on daily_stats" ON daily_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on user_profile" ON user_profile FOR ALL USING (true) WITH CHECK (true);

-- ── Seed: Insert default user profile ──
INSERT INTO user_profile (name, daily_goal, streak)
VALUES ('Alex', 5, 7)
ON CONFLICT DO NOTHING;

-- ── Seed: Insert sample daily stats ──
INSERT INTO daily_stats (date, tasks_completed, study_minutes, focus_score) VALUES
  ('2026-02-18', 4, 120, 72),
  ('2026-02-19', 6, 180, 85),
  ('2026-02-20', 3, 90,  60),
  ('2026-02-21', 5, 150, 78),
  ('2026-02-22', 7, 210, 92),
  ('2026-02-23', 5, 160, 80),
  ('2026-02-24', 2, 60,  55)
ON CONFLICT (date) DO NOTHING;

-- ── Seed: Insert sample tasks ──
INSERT INTO tasks (title, description, priority, status, category, due_date, "order") VALUES
  ('Read Chapter 5 — Organic Chemistry',    'Focus on reaction mechanisms and practice problems 12-18', 'high',   'todo',        'study',    '2026-02-25', 0),
  ('Submit Math Assignment #4',             'Complete exercises on integration by parts',               'high',   'in-progress', 'homework', '2026-02-26', 1),
  ('Research sources for History essay',     NULL,                                                       'medium', 'todo',        'project',  '2026-02-28', 2),
  ('Review Physics lecture notes',           'Chapters 9 & 10 — Thermodynamics',                        'medium', 'todo',        'study',    '2026-02-27', 3),
  ('Prepare flashcards for Biology exam',    NULL,                                                       'high',   'todo',        'exam',     '2026-03-01', 4),
  ('Schedule study group meeting',           NULL,                                                       'low',    'done',        'personal', NULL,          5),
  ('Organize digital notes folder',          NULL,                                                       'low',    'done',        'personal', NULL,          6),
  ('Complete CS Programming Lab',            'Implement binary search tree operations',                  'high',   'in-progress', 'homework', '2026-02-25', 7)
ON CONFLICT DO NOTHING;
