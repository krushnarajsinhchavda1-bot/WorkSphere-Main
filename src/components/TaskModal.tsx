// ============================================================
// TASK MODAL
// A popup form for adding a new task or editing/deleting an existing one.
//
// Fields: title, description, assignee, status, department, priority, project.
// When editing, a Delete button appears. Pressing Escape closes the modal.
// ============================================================

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Task, TaskStatus, Priority, StoredProject } from '@/types';
import { TEAM_MEMBERS } from '@/storage';

interface TaskModalProps {
  task: Task | null;        // null means we are creating a new task
  defaultStatus: TaskStatus; // which column the new task starts in
  projects: StoredProject[]; // the list of projects to choose from
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

// Priority options with their display colors.
const PRIORITY_OPTIONS: { value: Priority; label: string; classes: string }[] = [
  { value: 'low', label: 'Low', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'medium', label: 'Medium', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'high', label: 'High', classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'critical', label: 'Critical', classes: 'bg-red-100 text-red-700 border-red-200' },
];

function TaskModal({ task, defaultStatus, projects, onSave, onDelete, onClose }: TaskModalProps) {
  // Form fields. If editing, start with the task's values. If new, start empty.
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [status, setStatus] = useState<TaskStatus>(task ? task.status : defaultStatus);
  const [priority, setPriority] = useState<Priority>(task ? task.priority : 'medium');
  const [assigneeId, setAssigneeId] = useState(task ? task.assigneeId : TEAM_MEMBERS[0].id);
  const [department, setDepartment] = useState(task ? task.department : TEAM_MEMBERS[0].department);
  // The project this task belongs to. null means "no project".
  const [projectId, setProjectId] = useState<string | null>(task ? task.projectId : (projects[0]?.id ?? null));

  // Close the modal when the Escape key is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // When the assignee changes, auto-fill their department.
  function handleAssigneeChange(memberId: string) {
    setAssigneeId(memberId);
    const member = TEAM_MEMBERS.find((m) => m.id === memberId);
    if (member) setDepartment(member.department);
  }

  // Save the task. Don't save if the title is empty.
  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    const savedTask: Task = {
      id: task ? task.id : String(Date.now()), // keep id if editing, generate if new
      title: title.trim(),
      description: description.trim(),
      status: status,
      priority: priority,
      assigneeId: assigneeId,
      department: department,
      createdAt: task ? task.createdAt : Date.now(),
      projectId: projectId,
    };
    onSave(savedTask);
  }

  // Delete the task (only when editing an existing task).
  function handleDelete() {
    if (task) onDelete(task.id);
  }

  return (
    // Dark overlay — clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
    {/* Modal card — stopPropagation so clicks inside don't close it */}
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-xl border border-slate-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Project dropdown — which project this task belongs to */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project</label>
            <select
              value={projectId ?? ''}
              onChange={(e) => setProjectId(e.target.value || null)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
            <select
              value={assigneeId}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {TEAM_MEMBERS.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} — {member.role}
                </option>
              ))}
            </select>
          </div>

          {/* Status and Department side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="todo">To-Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Priority selector — clickable buttons instead of a dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={
                    'px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ' +
                    (priority === opt.value
                      ? opt.classes + ' ring-2 ring-blue-200'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100')
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            {/* Delete button — only when editing an existing task */}
            {task ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div />
            )}

            {/* Cancel and Save buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                {task ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
