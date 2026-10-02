// ============================================================
// STORAGE & DUMMY DATA
// This file holds:
// 1. Dummy data (team members, projects, default tasks, notifications)
// 2. Helper functions to save/load from localStorage
// ============================================================

import type { TeamMember, AppNotification, UserSession } from '@/types';

// -------------------------------------------------------
// TEAM MEMBERS
// These are the people tasks can be assigned to.
// -------------------------------------------------------
export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'm1', name: 'Alex Carter', role: 'Product Manager', department: 'Product', avatar: 'AC', color: 'from-cyan-400 to-blue-600' },
  { id: 'm2', name: 'Priya Sharma', role: 'Frontend Developer', department: 'Engineering', avatar: 'PS', color: 'from-fuchsia-400 to-purple-600' },
  { id: 'm3', name: 'Marcus Chen', role: 'Backend Developer', department: 'Engineering', avatar: 'MC', color: 'from-amber-400 to-orange-600' },
  { id: 'm4', name: 'Sofia Rodriguez', role: 'UX Designer', department: 'Design', avatar: 'SR', color: 'from-emerald-400 to-teal-600' },
  { id: 'm5', name: 'James Wilson', role: 'DevOps Engineer', department: 'Engineering', avatar: 'JW', color: 'from-rose-400 to-red-600' },
];

// Look up a team member by their id.
// If not found, return a placeholder "Unassigned" member.
export function getMemberById(id: string): TeamMember {
  const member = TEAM_MEMBERS.find((m) => m.id === id);
  if (member) return member;
  return { id: 'unknown', name: 'Unassigned', role: '', department: '', avatar: '?', color: 'from-slate-500 to-slate-600' };
}

// -------------------------------------------------------
// DEFAULT NOTIFICATIONS (shown in the bell dropdown)
// -------------------------------------------------------
const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', message: 'Welcome to WorkSphere! Your workspace is ready.', time: 'Just now', read: false },
  { id: 'n2', message: 'Sofia assigned you a new task: "Design new landing page".', time: '5m ago', read: false },
  { id: 'n3', message: 'The "Set up CI/CD pipeline" task is marked as critical.', time: '1h ago', read: false },
  { id: 'n4', message: 'Marcus completed "Database migration script".', time: '3h ago', read: true },
  { id: 'n5', message: 'Weekly team standup starts in 30 minutes.', time: '5h ago', read: true },
];

// -------------------------------------------------------
// localStorage KEYS
// We use these string keys to save/load data from the
// browser's localStorage so it persists across refreshes.
// -------------------------------------------------------
const AUTH_KEY = 'worksphere_auth';
const NOTIF_KEY = 'worksphere_notifications';

// -------------------------------------------------------
// AUTH STORAGE
// -------------------------------------------------------

// Load the user session from localStorage. Returns null if not logged in.
export function loadAuth(): UserSession | null {
  const saved = localStorage.getItem(AUTH_KEY);
  if (saved) return JSON.parse(saved);
  return null;
}

// Save the user session to localStorage.
// Pass null to clear it (used when logging out).
export function saveAuth(session: UserSession | null): void {
  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

// -------------------------------------------------------
// NOTIFICATION STORAGE
// -------------------------------------------------------

// Load notifications from localStorage, or return defaults on first visit.
export function loadNotifications(): AppNotification[] {
  const saved = localStorage.getItem(NOTIF_KEY);
  if (saved) return JSON.parse(saved);
  return DEFAULT_NOTIFICATIONS;
}

// Save notifications to localStorage.
export function saveNotifications(notifications: AppNotification[]): void {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
}
