// ============================================================
// AUTH CONTEXT
// This file manages the logged-in user's state for the whole app.
// Any component can read or change these values using the useAuth() hook.
//
// What it does:
// - login(email): creates a session and logs the user in
// - logout(): clears the session and shows the login screen
// - changeRole(role): switches between admin, manager, employee
// - switchEmployee(memberId): when role is employee, switches which person
//
// The session is saved to localStorage so the user stays logged in
// after a page refresh.
// ============================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Role, UserSession, TeamMember } from '@/types';
import { loadAuth, saveAuth, TEAM_MEMBERS } from '@/storage';

// Employees that can be selected when the Employee role is active.
// We exclude m1 (Alex Carter) because they are the admin/manager user.
const EMPLOYEE_MEMBERS: TeamMember[] = TEAM_MEMBERS.filter((m) => m.id !== 'm1');

// Build an email from a member name, e.g. "Priya Sharma" -> "priya.sharma@company.com"
function makeEmail(name: string): string {
  return name.toLowerCase().replace(' ', '.') + '@company.com';
}

// The shape of the context — what any component can access via useAuth()
interface AuthContextValue {
  isLoggedIn: boolean;
  session: UserSession | null;
  role: Role;
  employeeOptions: TeamMember[];

  login: (email: string) => void;
  logout: () => void;
  changeRole: (role: Role) => void;
  switchEmployee: (memberId: string) => void;
}

// Create the context with default empty values.
const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  session: null,
  role: 'admin',
  employeeOptions: EMPLOYEE_MEMBERS,
  login: () => {},
  logout: () => {},
  changeRole: () => {},
  switchEmployee: () => {},
});

// Custom hook so components can easily access the auth context.
export function useAuth() {
  return useContext(AuthContext);
}

// The provider wraps the whole app so every component can use useAuth().
export function AuthProvider({ children }: { children: ReactNode }) {
  // session holds the logged-in user's info.
  // We load from localStorage so the user stays logged in after refresh.
  const [session, setSession] = useState<UserSession | null>(loadAuth());

  // Save the session to localStorage whenever it changes.
  useEffect(() => {
    saveAuth(session);
  }, [session]);

  // isLoggedIn is true if the session exists.
  const isLoggedIn = session !== null;

  // role comes from the session (default to admin if not logged in).
  const role: Role = session ? session.role : 'admin';

  // Log in: create a default admin session. Any email works for this prototype.
  function login(email: string) {
    setSession({
      role: 'admin',
      name: 'Alex Carter',
      email: email || 'alex@company.com',
      memberId: 'm1',
    });
  }

  // Log out: clear the session.
  function logout() {
    setSession(null);
  }

  // Switch the user's role.
  // - admin/manager: show as Alex Carter, see all tasks
  // - employee: keep the current employee if already one, else use the first employee
  function changeRole(newRole: Role) {
    if (!session) return;

    if (newRole === 'employee') {
      // Check if the current member is already an employee
      const currentIsEmployee = EMPLOYEE_MEMBERS.some((m) => m.id === session.memberId);
      const member = currentIsEmployee
        ? EMPLOYEE_MEMBERS.find((m) => m.id === session.memberId)!
        : EMPLOYEE_MEMBERS[0];

      setSession({
        ...session,
        role: 'employee',
        name: member.name,
        email: makeEmail(member.name),
        memberId: member.id,
      });
    } else {
      // Admin or manager: show as Alex Carter
      setSession({
        ...session,
        role: newRole,
        name: 'Alex Carter',
        email: 'alex@company.com',
        memberId: 'm1',
      });
    }
  }

  // Switch which employee is active (only used when role is employee).
  function switchEmployee(memberId: string) {
    if (!session) return;
    const member = TEAM_MEMBERS.find((m) => m.id === memberId);
    if (!member) return;

    setSession({
      ...session,
      role: 'employee',
      name: member.name,
      email: makeEmail(member.name),
      memberId: member.id,
    });
  }

  // Provide all values and functions to the whole app.
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        session,
        role,
        employeeOptions: EMPLOYEE_MEMBERS,
        login,
        logout,
        changeRole,
        switchEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
