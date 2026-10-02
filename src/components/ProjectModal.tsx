// ============================================================
// PROJECT MODAL
// A simple popup form for creating a new project.
// Fields: name, description, deadline (due date as text).
// Only admin and manager roles can open this modal.
// Pressing Escape closes the modal.
// ============================================================

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { StoredProject } from '@/types';

interface ProjectModalProps {
  onSave: (project: StoredProject) => void;
  onClose: () => void;
}

function ProjectModal({ onSave, onClose }: ProjectModalProps) {
  // Form fields for a new project. All start empty.
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Close the modal when the Escape key is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Save the project. Don't save if the name is empty.
  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    const newProject: StoredProject = {
      id: String(Date.now()), // generate a unique id from the current time
      name: name.trim(),
      description: description.trim(),
      dueDate: dueDate.trim(),
      createdAt: Date.now(),
    };
    onSave(newProject);
  }

  return (
    // Dark overlay — clicking it closes the modal.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      {/* Modal card — stopPropagation so clicks inside don't close it */}
      <div
        className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">New Project</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Project name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
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
              placeholder="Enter project description"
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Deadline</label>
            <input
              type="text"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="e.g. Oct 15, 2026"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;
