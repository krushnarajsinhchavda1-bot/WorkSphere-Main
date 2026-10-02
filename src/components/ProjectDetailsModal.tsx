// ============================================================
// PROJECT DETAILS MODAL
// A popup that opens when the user clicks "View Details" on a
// project card. Shows the project's status, description,
// progress bar, and team members.
// ============================================================

import { useEffect } from 'react';
import { X, Calendar, Users, Circle, CheckCircle2, Pause } from 'lucide-react';
import type { Project } from '@/types';
import { getMemberById } from '@/storage';

interface ProjectDetailsModalProps {
  project: Project;
  onClose: () => void;
}

// Colors and icons for each project status (same as ProjectsPage).
const STATUS_STYLES: Record<Project['status'], { label: string; classes: string; icon: typeof Circle }> = {
  active: { label: 'Active', classes: 'bg-emerald-100 text-emerald-700', icon: Circle },
  'on-hold': { label: 'On Hold', classes: 'bg-amber-100 text-amber-700', icon: Pause },
  completed: { label: 'Completed', classes: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
};

function ProjectDetailsModal({ project, onClose }: ProjectDetailsModalProps) {
  // Close the modal when the Escape key is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const StatusIcon = STATUS_STYLES[project.status].icon;

  return (
    // Dark overlay — clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{project.name}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status badge + due date */}
          <div className="flex items-center justify-between">
            <span className={'flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ' + STATUS_STYLES[project.status].classes}>
              <StatusIcon className="w-3.5 h-3.5" />
              {STATUS_STYLES[project.status].label}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Due {project.dueDate}
            </span>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-slate-500 mb-1">Description</p>
            <p className="text-sm text-slate-700">{project.description}</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Progress</span>
              <span className="text-slate-800 font-medium">{project.progress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Team members list */}
          <div>
            <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Team Members ({project.team.length})
            </p>
            <div className="space-y-2">
              {project.team.map((memberId) => {
                const member = getMemberById(memberId);
                return (
                  <div key={memberId} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className={'w-9 h-9 rounded-lg bg-gradient-to-br ' + member.color + ' flex items-center justify-center text-white text-sm font-bold'}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsModal;
