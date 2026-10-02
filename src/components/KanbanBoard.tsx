// ============================================================
// KANBAN BOARD
// The main board with three columns: To-Do, In Progress, Done.
// Each column shows task cards. Tasks are moved between columns
// using buttons on each card (no drag-and-drop).
//
// Permission rules:
// - Admin and Manager: can add tasks, move all tasks
// - Employee: can only move their own tasks
// ============================================================

import { Plus } from 'lucide-react';
import type { Task, TaskStatus, Role } from '@/types';
import TaskCard from '@/components/TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  role: Role;
  currentMemberId: string | null;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
}

// The three columns on the board.
const COLUMNS = [
  { id: 'todo' as TaskStatus, title: 'To-Do', dot: 'bg-slate-400' },
  { id: 'in-progress' as TaskStatus, title: 'In Progress', dot: 'bg-blue-500' },
  { id: 'done' as TaskStatus, title: 'Done', dot: 'bg-emerald-500' },
];

function KanbanBoard({ tasks, role, currentMemberId, onAddTask, onEditTask, onMoveTask }: KanbanBoardProps) {
  // Admin and manager can add/edit/delete tasks.
  const canManage = role === 'admin' || role === 'manager';

  // Check if the current user can move a specific task.
  // Admin/manager can move any task. Employee can only move their own.
  function canMoveTask(task: Task): boolean {
    if (canManage) return true;
    return currentMemberId === task.assigneeId;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((column) => {
        // Get only the tasks that belong in this column.
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div
            key={column.id}
            className="rounded-xl p-4 bg-white border border-slate-200"
          >
            {/* Column header: colored dot, title, task count, add button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={'w-3 h-3 rounded-full ' + column.dot} />
                <h3 className="font-semibold text-slate-800">{column.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {columnTasks.length}
                </span>
              </div>
              {/* Add button — only for admin/manager */}
              {canManage && (
                <button
                  onClick={() => onAddTask(column.id)}
                  className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task cards in this column */}
            <div className="space-y-3 min-h-[200px]">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  canEdit={canManage}
                  canMove={canMoveTask(task)}
                  onEdit={onEditTask}
                  onMoveTask={onMoveTask}
                />
              ))}

              {/* Show a message if the column is empty */}
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
