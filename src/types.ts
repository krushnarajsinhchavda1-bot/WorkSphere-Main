// ============================================================
// TYPES FILE
// This file defines the shapes of all data used in WorkSphere.
// Think of each "interface" as a blueprint — TypeScript checks
// that our data matches these blueprints.
// ============================================================

// A user's role decides what they can see and do.
// admin and manager can manage all tasks. employee can only
// see and move their own tasks.
export type Role = 'admin' | 'manager' | 'employee';

// Priority levels for tasks. Critical is the most urgent.
export type Priority = 'low' | 'medium' | 'high' | 'critical';

// The three columns on the kanban board.
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// A team member. Used for the assignee dropdown and the Team page.
export interface TeamMember {
  id: string;
  name: string;
  role: string;        // job title, e.g. "Frontend Developer"
  department: string;  // e.g. "Engineering"
  avatar: string;       // initials shown in the avatar circle
  color: string;        // gradient classes for the avatar background
}

// A task is a single work item shown on the kanban board.
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;  // links to a TeamMember id
  department: string;
  createdAt: number;    // timestamp in milliseconds
  projectId: string | null; // links to a Project id (null = no project)
}

// A project stored in the database. The Projects page computes its
// progress, status, and team dynamically from the linked tasks.
export interface StoredProject {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  createdAt: number;
}

// A notification shown in the bell dropdown in the header.
export interface AppNotification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

// A project shown on the Projects page. The progress, status, and team
// fields are computed dynamically from the tasks linked to this project.
export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;    // 0 to 100 (computed: done tasks / total tasks)
  status: 'active' | 'on-hold' | 'completed'; // computed from task progress
  team: string[];      // list of TeamMember ids assigned to tasks in this project
  dueDate: string;
}

// The pages we can navigate to from the sidebar.
export type PageName = 'kanban' | 'analytics' | 'team' | 'projects';

// The logged-in user's session info.
export interface UserSession {
  role: Role;
  name: string;
  email: string;
  memberId: string;  // which team member this user is
}
