-- ═══════════════════════════════════════════════════════════════
-- StudyFlow Demo Seed — Run AFTER signing up as admin@studyflow.com
-- Populates the demo account with showcase-ready mock data
-- ═══════════════════════════════════════════════════════════════

DO $$
DECLARE
  demo_uid UUID;
BEGIN
  -- Find the demo user
  SELECT id INTO demo_uid
  FROM auth.users
  WHERE email = 'admin@studyflow.com'
  LIMIT 1;

  IF demo_uid IS NULL THEN
    RAISE EXCEPTION 'Demo user not found. Sign up as admin@studyflow.com first!';
  END IF;

  -- ── Update profile with showcase data ──
  UPDATE user_profile
  SET name = 'Vikram', daily_goal = 5, streak = 7
  WHERE user_id = demo_uid;

  -- ── Seed tasks ──
  DELETE FROM tasks WHERE user_id = demo_uid;

  INSERT INTO tasks (user_id, title, description, priority, status, category, due_date, "order", completed_at) VALUES
    (demo_uid, 'Read Chapter 5 — Organic Chemistry',  'Focus on reaction mechanisms and practice problems 12-18', 'high',   'todo',        'study',    '2026-02-25', 0, NULL),
    (demo_uid, 'Submit Math Assignment #4',            'Complete exercises on integration by parts',               'high',   'in-progress', 'homework', '2026-02-26', 1, NULL),
    (demo_uid, 'Research sources for History essay',    NULL,                                                       'medium', 'todo',        'project',  '2026-02-28', 2, NULL),
    (demo_uid, 'Review Physics lecture notes',          'Chapters 9 & 10 — Thermodynamics',                        'medium', 'todo',        'study',    '2026-02-27', 3, NULL),
    (demo_uid, 'Prepare flashcards for Biology exam',   NULL,                                                       'high',   'todo',        'exam',     '2026-03-01', 4, NULL),
    (demo_uid, 'Schedule study group meeting',          NULL,                                                       'low',    'done',        'personal', NULL,          5, NOW() - INTERVAL '2 days'),
    (demo_uid, 'Organize digital notes folder',         NULL,                                                       'low',    'done',        'personal', NULL,          6, NOW() - INTERVAL '1 day'),
    (demo_uid, 'Complete CS Programming Lab',           'Implement binary search tree operations',                  'high',   'in-progress', 'homework', '2026-02-25', 7, NULL);

  -- ── Seed daily stats (last 7 days) ──
  DELETE FROM daily_stats WHERE user_id = demo_uid;

  INSERT INTO daily_stats (user_id, date, tasks_completed, study_minutes, focus_score) VALUES
    (demo_uid, CURRENT_DATE - 6, 4, 120, 72),
    (demo_uid, CURRENT_DATE - 5, 6, 180, 85),
    (demo_uid, CURRENT_DATE - 4, 3, 90,  60),
    (demo_uid, CURRENT_DATE - 3, 5, 150, 78),
    (demo_uid, CURRENT_DATE - 2, 7, 210, 92),
    (demo_uid, CURRENT_DATE - 1, 5, 160, 80),
    (demo_uid, CURRENT_DATE,     2, 60,  55);

  RAISE NOTICE 'Demo data seeded for user %', demo_uid;
END $$;
