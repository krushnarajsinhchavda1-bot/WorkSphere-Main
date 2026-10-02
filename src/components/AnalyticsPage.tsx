// ============================================================
// ANALYTICS PAGE
// Shows a dashboard with:
// - 4 stat cards (total, completed, in progress, critical)
// - A circular completion rate chart
// - A bar chart showing tasks by priority
//
// All numbers are calculated from the task list passed in.
// ============================================================

import { CheckCircle2, Clock, AlertOctagon, TrendingUp, ListTodo } from 'lucide-react';
import type { Task } from '@/types';

interface AnalyticsPageProps {
  tasks: Task[];
}

function AnalyticsPage({ tasks }: AnalyticsPageProps) {
  // --- CALCULATE STATS FROM THE TASK LIST ---

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const critical = tasks.filter((t) => t.priority === 'critical').length;

  // Completion rate as a percentage (avoid dividing by zero).
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // The 4 stat cards.
  const stats = [
    { icon: ListTodo, label: 'Total Tasks', value: total, color: 'bg-blue-500' },
    { icon: CheckCircle2, label: 'Completed', value: done, color: 'bg-emerald-500' },
    { icon: Clock, label: 'In Progress', value: inProgress, color: 'bg-amber-500' },
    { icon: AlertOctagon, label: 'Critical', value: critical, color: 'bg-red-500' },
  ];

  // Priority breakdown for the bar chart.
  const priorityBreakdown = [
    { label: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: 'bg-emerald-500' },
    { label: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: 'bg-amber-500' },
    { label: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: 'bg-orange-500' },
    { label: 'Critical', count: tasks.filter((t) => t.priority === 'critical').length, color: 'bg-red-500' },
  ];

  // The largest count is used to scale the bar widths.
  const maxPriority = Math.max(...priorityBreakdown.map((p) => p.count), 1);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your team's performance and task distribution.</p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className={'w-10 h-10 rounded-lg ' + stat.color + ' flex items-center justify-center'}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-slate-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Completion rate chart + Priority breakdown chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion rate card with a circular chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Completion Rate</h3>
          </div>
          <div className="flex items-center gap-6">
            {/* Circular progress chart drawn with SVG */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background ring */}
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                {/* Progress ring — length depends on completionRate */}
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#3b82f6" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionRate / 100) * 327} 327`}
                />
              </svg>
              {/* Percentage text in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{completionRate}%</span>
              </div>
            </div>
            {/* Breakdown numbers next to the chart */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Completed</span>
                <span className="text-slate-800 font-medium">{done}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">In Progress</span>
                <span className="text-slate-800 font-medium">{inProgress}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">To-Do</span>
                <span className="text-slate-800 font-medium">{todo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority breakdown bar chart */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Tasks by Priority</h3>
          <div className="space-y-4">
            {priorityBreakdown.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-700">{p.label}</span>
                  <span className="text-slate-500">{p.count}</span>
                </div>
                {/* Bar — width is proportional to the count */}
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={'h-full rounded-full ' + p.color + ' transition-all duration-500'}
                    style={{ width: `${(p.count / maxPriority) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
