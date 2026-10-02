// ============================================================
// TEAM PAGE
// Shows a grid of team member cards.
// Each card shows the member's avatar, name, role, department,
// email, and how many tasks are assigned to them.
// ============================================================

import { Mail, Briefcase, Building2 } from 'lucide-react';
import { TEAM_MEMBERS } from '@/storage';
import type { Task } from '@/types';

interface TeamPageProps {
  tasks: Task[];
}

function TeamPage({ tasks }: TeamPageProps) {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Team Members</h1>
        <p className="text-slate-500 text-sm mt-1">Meet the people behind the work.</p>
      </div>

      {/* Team member cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM_MEMBERS.map((member) => {
          // Count how many tasks are assigned to this member.
          const taskCount = tasks.filter((t) => t.assigneeId === member.id).length;

          return (
            <div key={member.id} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 transition-colors">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 mb-4">
                <div className={'w-14 h-14 rounded-xl bg-gradient-to-br ' + member.color + ' flex items-center justify-center text-white text-lg font-bold'}>
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{member.name}</h3>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase className="w-4 h-4" />
                  {member.role}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Building2 className="w-4 h-4" />
                  {member.department}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-4 h-4" />
                  {member.name.toLowerCase().replace(' ', '.')}@company.com
                </div>
              </div>

              {/* Task count badge */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Assigned Tasks</span>
                <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
                  {taskCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamPage;
