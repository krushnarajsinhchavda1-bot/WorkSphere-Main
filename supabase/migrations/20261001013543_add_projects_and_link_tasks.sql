/*
# Add projects table and link tasks to projects

1. New Tables
- `projects`
  - `id` (text, primary key) — matches the app's string ids
  - `name` (text, not null) — project title
  - `description` (text, not null, default empty) — project description
  - `due_date` (text, not null, default empty) — deadline as a display string e.g. "Oct 15, 2026"
  - `created_at` (bigint, not null) — epoch millis for app compatibility

2. Modified Tables
- `tasks`
  - Add `project_id` (text, nullable) — links a task to a project. Nullable so
    existing tasks and tasks not tied to a project still work.

3. Security
- Enable RLS on `projects`.
- Allow anon + authenticated CRUD on both `projects` and `tasks` because the
  data is intentionally shared/public (no real auth in this prototype).

4. Seed Data
- Insert two starter projects ("Website Redesign", "Mobile App Launch") so the
  Projects page is not empty on first load.
*/

-- -------------------------------------------------------
-- 1. Create the projects table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  due_date text NOT NULL DEFAULT '',
  created_at bigint NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);

-- -------------------------------------------------------
-- 2. Add a project_id column to tasks (nullable)
-- -------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN project_id text;
  END IF;
END $$;

-- -------------------------------------------------------
-- 3. Seed two starter projects (idempotent)
-- -------------------------------------------------------
INSERT INTO projects (id, name, description, due_date)
VALUES
  ('p1', 'Website Redesign', 'Complete overhaul of the company website with a modern, responsive design and improved UX flow.', 'Oct 15, 2026'),
  ('p2', 'Mobile App Launch', 'Build and ship the iOS and Android apps with push notifications and offline support.', 'Nov 30, 2026')
ON CONFLICT (id) DO NOTHING;
