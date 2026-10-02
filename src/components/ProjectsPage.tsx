// ============================================================
// PROJECTS PAGE
// Shows a grid of project cards with progress bars.
// Clicking "View Details" opens a modal with full project info.
//
// Unlike before, project progress, status, and team members are
// computed dynamically from the tasks on the Kanban board.
// Admin and manager roles can add new projects with the
// "New Project" button.
// ============================================================

import { useState, useMemo } from 'react';
import { Calendar, Users, Circle, CheckCircle2, Pause, Plus } from 'lucide-react';
import type { Task, Project, StoredProject, Role } from '@/types';
import { getMemberById } from '@/storage';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import ProjectModal from '@/components/ProjectModal';

interface ProjectsPageProps {
  // The stored projects loaded from the database.
  projects: StoredProject[];
  // All tasks (from the Kanban board) used to compute progress and team.
  tasks: Task[];
  // The current user's role — only admin/manager can add projects.
  role: Role;
  // Called when a new project is created.
  onAddProject: (project: StoredProject) => void;
}

// Colors and icons for each project status.
const STATUS_STYLES: Record<Project['status'], { label: string; classes: string; icon: typeof Circle }> = {
  active: { label: 'Active', classes: 'bg-emerald-100 text-emerald-700', icon: Circle },
  'on-hold': { label: 'On Hold', classes: 'bg-amber-100 text-amber-700', icon: Pause },
  completed: { label: 'Completed', classes: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
};

function ProjectsPage({ projects, tasks, role, onAddProject }: ProjectsPageProps) {
  // selectedProject holds the project to show in the details modal, or null.
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // isProjectModalOpen controls whether the "New Project" form is visible.
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Admin and manager can add new projects.
  const canManage = role === 'admin' || role === 'manager';

  // Build the list of display projects, computing progress, status, and team
  // from the tasks. useMemo recomputes only when projects or tasks change.
  const displayProjects: Project[] = useMemo(() => {
    return projects.map((stored) => {
      // Find all tasks linked to this project.
      const projectTasks = tasks.filter((t) => t.projectId === stored.id);

      // Total tasks for this project.
      const total = projectTasks.length;
      // How many of those tasks are done.
      const done = projectTasks.filter((t) => t.status === 'done').length;

      // Progress = (done / total) * 100. If no tasks, progress is 0.
      const progress = total > 0 ? Math.round((done / total) * 100) : 0;

      // Status is computed from progress:
      //   100% = completed, 0% with tasks = on-hold, otherwise active.
      let status: Project['status'] = 'active';
      if (total === 0) {
        status = 'on-hold';
      } else if (progress === 100) {
        status = 'completed';
      }

      // Team members = unique list of assignee ids from this project's tasks.
      const teamIds = Array.from(new Set(projectTasks.map((t) => t.assigneeId)));

      return {
        id: stored.id,
        name: stored.name,
        description: stored.description,
        progress,
        status,
        team: teamIds,
        dueDate: stored.dueDate,
      };
    });
  }, [projects, tasks]);

  // Open the details modal for a project.
  function openProject(project: Project) {
    setSelectedProject(project);
  }

  return (
    <div className="space-y-6">
      {/* Page title + New Project button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {selectedProject ? selectedProject.name : 'Active Projects'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {selectedProject ? selectedProject.description : 'Track progress across all ongoing projects.'}
          </p>
        </div>
        {/* New Project button — only for admin/manager */}
        {canManage && (
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        )}
      </div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayProjects.map((project) => {
          const StatusIcon = STATUS_STYLES[project.status].icon;

          return (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') openProject(project);
              }}
              role="button"
              tabIndex={0}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-400 transition-colors cursor-pointer"
            >
              {/* Status badge + due date */}
              <div className="flex items-center justify-between mb-4">
                <span className={'flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ' + STATUS_STYLES[project.status].classes}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {STATUS_STYLES[project.status].label}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  {project.dueDate || 'No deadline'}
                </span>
              </div>

              {/* Project name + description */}
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{project.name}</h3>
              <p className="text-sm text-slate-500 mb-5">{project.description}</p>

              {/* Progress bar */}
              <div className="mb-5">
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

              {/* Team avatars + View Details button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div className="flex -space-x-2">
                    {project.team.length === 0 && (
                      <span className="text-xs text-slate-400">No members assigned</span>
                    )}
                    {project.team.map((memberId) => {
                      const member = getMemberById(memberId);
                      return (
                        <div
                          key={memberId}
                          title={member.name}
                          className={'w-8 h-8 rounded-lg bg-gradient-to-br ' + member.color + ' flex items-center justify-center text-white text-xs font-bold border-2 border-white'}
                        >
                          {member.avatar}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openProject(project);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}

        {/* Show a message if there are no projects */}
        {displayProjects.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No projects yet. {canManage && 'Click "New Project" to create one.'}
          </div>
        )}
      </div>

      {/* Project details modal — shown when a project is selected */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* New project modal — shown when the New Project button is clicked */}
      {isProjectModalOpen && (
        <ProjectModal
          onSave={onAddProject}
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
