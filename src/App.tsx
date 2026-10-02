// ============================================================
// APP COMPONENT
// This is the main component that ties everything together.
// It decides which page to show (kanban, analytics, team, projects)
// and manages the task list, search, notifications, and modals.
//
// Tasks are loaded from the Supabase database on startup.
// When a task is added, edited, deleted, or moved, the change
// is saved to the database immediately.
// ============================================================

import { useState, useEffect } from 'react';

import LoginScreen from '@/components/LoginScreen';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import AnalyticsPage from '@/components/AnalyticsPage';
import TeamPage from '@/components/TeamPage';
import ProjectsPage from '@/components/ProjectsPage';
import SettingsModal from '@/components/SettingsModal';

import { useAuth } from '@/context/AuthContext';
import type { Task, TaskStatus, AppNotification, PageName, StoredProject } from '@/types';
import { loadNotifications, saveNotifications, getMemberById } from '@/storage';
import { fetchTasks, insertTask, updateTask, deleteTaskRow, fetchProjects, insertProject } from '@/lib/db';

function App() {
  // --- AUTH STATE ---
  // We get the login state and current role from the auth context.
  const { isLoggedIn, session, role } = useAuth();

  // --- TASK STATE ---
  // tasks holds the full list of tasks, loaded from the database.
  const [tasks, setTasks] = useState<Task[]>([]);
  // loading is true while tasks are being fetched from the database.
  const [loading, setLoading] = useState(true);

  // --- PROJECT STATE ---
  // projects holds the list of projects, loaded from the database.
  const [projects, setProjects] = useState<StoredProject[]>([]);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- NOTIFICATION STATE ---
  // Notifications are stored in localStorage (not the database).
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifications);

  // --- PAGE NAVIGATION STATE ---
  // activePage tracks which sidebar page is shown.
  const [activePage, setActivePage] = useState<PageName>('kanban');

  // --- TASK MODAL STATE ---
  // modalTask is the task being edited, or null if creating a new one.
  const [modalTask, setModalTask] = useState<Task | null>(null);
  // modalDefaultStatus is the column a new task should start in.
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>('todo');
  // isModalOpen controls whether the task modal is visible.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- SETTINGS MODAL STATE ---
  // settingsTab is null when the settings modal is closed,
  // or 'profile' / 'settings' when open.
  const [settingsTab, setSettingsTab] = useState<'profile' | 'settings' | null>(null);

  // --- LOAD TASKS AND PROJECTS FROM DATABASE ---
  // This runs once when the app starts.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [taskData, projectData] = await Promise.all([fetchTasks(), fetchProjects()]);
        if (!cancelled) {
          setTasks(taskData);
          setProjects(projectData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // --- SAVE NOTIFICATIONS TO LOCALSTORAGE ---
  // This runs whenever notifications change.
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // --- TASK MODAL HANDLERS ---

  // Open the modal to add a new task in a specific column.
  function handleOpenAddTask(status: TaskStatus) {
    setModalTask(null);
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  }

  // Open the modal to edit an existing task.
  function handleOpenEditTask(task: Task) {
    setModalTask(task);
    setIsModalOpen(true);
  }

  // Close the task modal.
  function handleCloseModal() {
    setIsModalOpen(false);
    setModalTask(null);
  }

  // Save a task (new or edited) to the database and local state.
  async function handleSaveTask(task: Task) {
    const isEditing = tasks.some((t) => t.id === task.id);

    if (isEditing) {
      // Update existing task in local state
      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
      try { await updateTask(task); } catch (err) { console.error('Update failed:', err); }
    } else {
      // Add new task to local state
      setTasks([...tasks, task]);
      try { await insertTask(task); } catch (err) { console.error('Insert failed:', err); }
    }
    handleCloseModal();
  }

  // Delete a task from the database and local state.
  async function handleDeleteTask(taskId: string) {
    setTasks(tasks.filter((t) => t.id !== taskId));
    try { await deleteTaskRow(taskId); } catch (err) { console.error('Delete failed:', err); }
    handleCloseModal();
  }

  // Move a task to a different column (called by the move buttons).
  async function handleMoveTask(taskId: string, newStatus: TaskStatus) {
    // Update the task's status in local state
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    setTasks(updated);

    // Save the change to the database
    const task = updated.find((t) => t.id === taskId);
    if (task) {
      try { await updateTask(task); } catch (err) { console.error('Move failed:', err); }
    }
  }

  // --- PROJECT HANDLERS ---

  // Create a new project and save it to the database.
  async function handleAddProject(project: StoredProject) {
    setProjects([...projects, project]);
    try { await insertProject(project); } catch (err) { console.error('Project insert failed:', err); }
  }

  // --- NOTIFICATION HANDLERS ---

  // Mark all notifications as read.
  function handleMarkAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  }

  // --- SETTINGS HANDLERS ---

  // Open the settings modal on a specific tab.
  function handleOpenSettings(tab: 'profile' | 'settings') {
    setSettingsTab(tab);
  }

  // --- FILTERED TASKS ---
  // Decide which tasks to show based on the user's role and search query.
  function getVisibleTasks(): Task[] {
    let visible = tasks;

    // Employees only see their own tasks
    if (session && role === 'employee') {
      visible = visible.filter((t) => t.assigneeId === session.memberId);
    }

    // Filter by search query (match title or assignee name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      visible = visible.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          getMemberById(t.assigneeId).name.toLowerCase().includes(query)
      );
    }

    return visible;
  }

  // --- RENDER ---

  // If not logged in, show the login screen.
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  // Admin and manager can manage tasks (add, edit, delete).
  const canManage = role === 'admin' || role === 'manager';

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onOpenSettings={handleOpenSettings}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* KANBAN PAGE */}
          {activePage === 'kanban' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">My Workspace</h1>
                <p className="text-slate-500 text-sm mt-1">
                  {canManage
                    ? 'Use the buttons on each task to move it between columns, click to edit, or use + to add new ones.'
                    : 'Use the button on each task to move it to the next status.'}
                </p>
              </div>
              {loading ? (
                <p className="text-slate-500 text-sm">Loading tasks...</p>
              ) : (
                <KanbanBoard
                  tasks={getVisibleTasks()}
                  role={role}
                  currentMemberId={session?.memberId ?? null}
                  onAddTask={handleOpenAddTask}
                  onEditTask={handleOpenEditTask}
                  onMoveTask={handleMoveTask}
                />
              )}
            </div>
          )}

          {/* ANALYTICS PAGE */}
          {activePage === 'analytics' && <AnalyticsPage tasks={tasks} />}

          {/* TEAM PAGE */}
          {activePage === 'team' && <TeamPage tasks={tasks} />}

          {/* PROJECTS PAGE */}
          {activePage === 'projects' && (
            <ProjectsPage
              projects={projects}
              tasks={tasks}
              role={role}
              onAddProject={handleAddProject}
            />
          )}
        </main>
      </div>

      {/* TASK MODAL (add or edit) */}
      {isModalOpen && (
        <TaskModal
          task={modalTask}
          defaultStatus={modalDefaultStatus}
          projects={projects}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={handleCloseModal}
        />
      )}

      {/* SETTINGS MODAL */}
      {settingsTab && (
        <SettingsModal
          initialTab={settingsTab}
          onClose={() => setSettingsTab(null)}
        />
      )}
    </div>
  );
}

export default App;
