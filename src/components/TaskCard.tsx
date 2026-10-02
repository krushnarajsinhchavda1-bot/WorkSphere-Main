// ============================================================
// TASK CARD
// A single task card shown inside a kanban column.
// Each card has a button to move the task to the next status:
//   To-Do      -> "Move to In Progress"
//   In Progress -> "Move to Done"
//   Done       -> "Move to To-Do"
//
// If the user can't move the task (it belongs to someone else),
// the card is dimmed and shows a read-only message instead.
// ============================================================

import { ArrowRight } from 'lucide-react';
import type { Task, TaskStatus } from '@/types';
import { getMemberById } from '@/storage';

interface TaskCardProps {
  task: Task;
  canEdit: boolean;
  canMove: boolean;
  onEdit: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}

// Colors for each priority level badge.
const PRIORITY_STYLES: Record<string, { label: string; classes: string }> = {
  critical: { label: 'Critical', classes: 'bg-red-100 text-red-700 border-red-200' },
  high: { label: 'High', classes: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Medium', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  low: { label: 'Low', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

// What is the next status for each current status, and the button label.
const NEXT_STATUS: Record<TaskStatus, { status: TaskStatus; label: string }> = {
  'todo': { status: 'in-progress', label: 'Move to In Progress' },
  'in-progress': { status: 'done', label: 'Move to Done' },
  'done': { status: 'todo', label: 'Move to To-Do' },
};

function TaskCard({ task, canEdit, canMove, onEdit, onMoveTask }: TaskCardProps) {
  // Look up who this task is assigned to.
  const assignee = getMemberById(task.assigneeId);

  // Get the priority badge style (default to medium if unknown).
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  // Get the next status info for the move button.
  const next = NEXT_STATUS[task.status];

  return (
    <div
      onClick={() => onEdit(task)}
      className={
        'group bg-white rounded-lg p-4 border border-slate-200 transition-colors ' +
        (canMove
          ? 'hover:border-blue-400 hover:bg-slate-50 cursor-pointer'
          : 'opacity-50 cursor-not-allowed')
      }
    >
      {/* Priority badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={'px-2.5 py-1 rounded-md text-xs font-semibold border ' + priorityStyle.classes}>
          {priorityStyle.label}
        </span>
      </div>

      {/* Task title */}
      <h4 className="text-slate-800 font-medium text-sm mb-1.5">{task.title}</h4>

      {/* Task description (limited to 2 lines) */}
      <p className="text-slate-500 text-xs line-clamp-2 mb-3">{task.description}</p>

      {/* Department tag + assignee name and avatar */}
      <div className="flex items-center justify-between">
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
          {task.department}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{assignee.name}</span>
          <div className={'w-7 h-7 rounded-lg bg-gradient-to-br ' + assignee.color + ' flex items-center justify-center text-white text-xs font-bold'}>
            {assignee.avatar}
          </div>
        </div>
      </div>

      {/* Move button or read-only message */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        {canMove ? (
          <button
            onClick={(e) => {
              e.stopPropagation(); // don't trigger the card's onClick
              onMoveTask(task.id, next.status);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            {next.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <p className="text-xs text-slate-400 text-center">
            {canEdit ? 'Assigned to someone else — read only' : 'View only — ask a manager to move'}
          </p>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
