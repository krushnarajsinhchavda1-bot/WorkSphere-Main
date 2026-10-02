// ============================================================
// DATABASE LAYER
// Simple functions to save, load, update, and delete tasks and
// projects using Supabase (a cloud database).
//
// Our app uses camelCase names (assigneeId, createdAt) but the
// database uses snake_case (assignee_id, created_at).
// The toRow and fromRow functions convert between the two.
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Task, StoredProject } from '@/types';

// -------------------------------------------------------
// TASKS
// -------------------------------------------------------

// Convert a Task object into the shape the database expects (snake_case).
function taskToRow(task: Task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignee_id: task.assigneeId,
    department: task.department,
    created_at: task.createdAt,
    project_id: task.projectId,
  };
}

// Convert a database row (snake_case) back into our Task shape (camelCase).
function taskFromRow(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    status: row.status,
    priority: row.priority,
    assigneeId: row.assignee_id,
    department: row.department || '',
    createdAt: row.created_at,
    projectId: row.project_id ?? null,
  };
}

// Load all tasks from the database, ordered by creation time.
export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(taskFromRow);
}

// Insert a new task into the database.
export async function insertTask(task: Task): Promise<void> {
  const { error } = await supabase.from('tasks').insert(taskToRow(task));
  if (error) throw error;
}

// Update an existing task in the database.
export async function updateTask(task: Task): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update(taskToRow(task))
    .eq('id', task.id);
  if (error) throw error;
}

// Delete a task from the database by its id.
export async function deleteTaskRow(taskId: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId);
  if (error) throw error;
}

// -------------------------------------------------------
// PROJECTS
// -------------------------------------------------------

// Convert a StoredProject object into the shape the database expects (snake_case).
function projectToRow(project: StoredProject) {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    due_date: project.dueDate,
    created_at: project.createdAt,
  };
}

// Convert a database row (snake_case) back into our StoredProject shape (camelCase).
function projectFromRow(row: any): StoredProject {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    dueDate: row.due_date || '',
    createdAt: row.created_at,
  };
}

// Load all projects from the database, ordered by creation time.
export async function fetchProjects(): Promise<StoredProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(projectFromRow);
}

// Insert a new project into the database.
export async function insertProject(project: StoredProject): Promise<void> {
  const { error } = await supabase.from('projects').insert(projectToRow(project));
  if (error) throw error;
}

// Delete a project from the database by its id.
export async function deleteProjectRow(projectId: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', projectId);
  if (error) throw error;
}
