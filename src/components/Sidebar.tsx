// ============================================================
// SIDEBAR
// The vertical navigation bar on the left side of the screen.
// Has 4 links: Kanban Board, Analytics, Team, Projects.
// Clicking a link switches the page shown in the main area.
// ============================================================

import { KanbanSquare, BarChart3, Users, FolderKanban, Briefcase } from 'lucide-react';
import type { PageName } from '@/types';

interface SidebarProps {
  activePage: PageName;
  onPageChange: (page: PageName) => void;
}

// The navigation items shown in the sidebar.
const NAV_ITEMS = [
  { id: 'kanban' as PageName, label: 'Kanban Board', icon: KanbanSquare },
  { id: 'analytics' as PageName, label: 'Analytics', icon: BarChart3 },
  { id: 'team' as PageName, label: 'Team', icon: Users },
  { id: 'projects' as PageName, label: 'Projects', icon: FolderKanban },
];

function Sidebar({ activePage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">WorkSphere</span>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          // Active link: blue background. Inactive: gray, changes on hover.
          const linkClass = isActive
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent';

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ' + linkClass}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Upgrade card at the bottom */}
      <div className="p-4">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-800 mb-1">Upgrade to Pro</p>
          <p className="text-xs text-slate-500 mb-3">
            Unlock unlimited projects and advanced analytics.
          </p>
          <button className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
