// ============================================================
// HEADER
// The top bar with: role toggle, employee selector, search bar,
// notification bell, and profile dropdown.
//
// The role toggle lets the user switch between Admin, Manager,
// and Employee. When Employee is selected, a dropdown appears
// to choose which employee is active.
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, ShieldCheck } from 'lucide-react';
import type { AppNotification, Role } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onOpenSettings: (tab: 'profile' | 'settings') => void;
}

// The three role options for the toggle buttons.
const ROLES: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
];

function Header({
  searchQuery,
  onSearchChange,
  notifications,
  onMarkAllRead,
  onOpenSettings,
}: HeaderProps) {
  // Get auth state and functions from the context.
  const { session, role, changeRole, switchEmployee, employeeOptions, logout } = useAuth();

  // Track whether the dropdowns are open.
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Refs to detect clicks outside the dropdowns.
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside of them.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count how many notifications are unread (for the badge).
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get the user's initials (first letter of first and last name).
  const initials = session
    ? session.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : '??';

  // --- HANDLERS ---

  function handleSignOut() {
    setShowProfile(false);
    logout();
  }

  function handleProfileClick() {
    setShowProfile(false);
    onOpenSettings('profile');
  }

  function handleSettingsClick() {
    setShowProfile(false);
    onOpenSettings('settings');
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
      {/* LEFT: Role toggle + employee selector */}
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 border border-slate-200">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => changeRole(r.value)}
              className={
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors ' +
                (role === r.value
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white')
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Employee selector — only shown when role is employee */}
        {role === 'employee' && (
          <select
            value={session?.memberId}
            onChange={(e) => switchEmployee(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors"
          >
            {employeeOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* MIDDLE: Search bar */}
      <div className="relative flex-1 max-w-md min-w-[200px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by task title or assignee..."
          className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* RIGHT: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={
                      'px-4 py-3 border-b border-slate-100 flex gap-3 ' +
                      (notif.read ? '' : 'bg-blue-50')
                    }
                  >
                    <div
                      className={
                        'w-2 h-2 rounded-full mt-1.5 shrink-0 ' +
                        (notif.read ? 'bg-slate-300' : 'bg-blue-500')
                      }
                    />
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <span className="text-sm font-medium text-slate-800 hidden sm:block">
              {session?.name} <span className="text-slate-400">({role})</span>
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile dropdown menu */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-800">{session?.name}</p>
                <p className="text-xs text-slate-500">{session?.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-medium capitalize">
                  {role}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
              </div>
              <div className="border-t border-slate-200 py-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
