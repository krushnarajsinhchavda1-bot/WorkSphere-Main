/*
# Create tasks table (single-tenant, no real auth)

1. New Tables
- `tasks`
  - `id` (text, primary key) — matches the app's string ids
  - `title` (text, not null)
  - `description` (text, default empty)
  - `status` (text, not null) — 'todo' | 'in-progress' | 'done'
  - `priority` (text, not null) — 'low' | 'medium' | 'high' | 'critical'
  - `assignee_id` (text, not null) — links to a team member id
  - `department` (text, default empty)
  - `created_at` (bigint, not null) — epoch millis for app compatibility

2. Security
- Enable RLS on `tasks`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no real auth in this prototype).
*/

CREATE TABLE IF NOT EXISTS tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  assignee_id text NOT NULL,
  department text NOT NULL DEFAULT '',
  created_at bigint NOT NULL DEFAULT (extract(epoch from now()) * 1000)::bigint
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tasks" ON tasks;
CREATE POLICY "anon_select_tasks" ON tasks FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tasks" ON tasks;
CREATE POLICY "anon_insert_tasks" ON tasks FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tasks" ON tasks;
CREATE POLICY "anon_update_tasks" ON tasks FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tasks" ON tasks;
CREATE POLICY "anon_delete_tasks" ON tasks FOR DELETE
  TO anon, authenticated USING (true);
