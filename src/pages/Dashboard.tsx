import { useEffect, useState, useMemo, useCallback } from "react";
import api from "../api/axios";
import type { Task, Tag } from "../types";
import { useOnlineStatus } from "../hooks/usePwa";
import TaskCard from "../components/TaskCard";
import TagBadge from "../components/TagBadge";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailModal from "../components/TaskDetailModal";
import Navbar from "../components/Navbar";

// ── Skeleton shown while data is loading (lightweight → fast LCP) ─────
function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-7 w-36 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-amber-100 rounded-lg animate-pulse" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 bg-gray-50 border border-gray-200 rounded-lg mb-6 animate-pulse" />

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 bg-gray-50 border border-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const isOnline = useOnlineStatus();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, tagsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/tags"),
      ]);
      setTasks(tasksRes.data);
      setTags(tagsRes.data);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filter + sort (nearest deadline first)
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (selectedTag) {
      result = result.filter((t) => t.tagId === selectedTag);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.content.toLowerCase().includes(q) ||
          t.tag?.name.toLowerCase().includes(q)
      );
    }
    return result.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [tasks, selectedTag, searchQuery]);

  const todayStr = useMemo(() => new Date().toDateString(), []);

  const overdueTasks = useMemo(
    () => filteredTasks.filter((t) => new Date(t.dueDate) < new Date(todayStr)),
    [filteredTasks, todayStr]
  );
  const upcomingTasks = useMemo(
    () => filteredTasks.filter((t) => new Date(t.dueDate) >= new Date(todayStr)),
    [filteredTasks, todayStr]
  );

  const openCreate = useCallback(() => setCreateOpen(true), []);
  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const closeDetail = useCallback(() => setSelectedTask(null), []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Render the heading immediately (LCP target); data loads async below */}
      {loading ? (
        <DashboardSkeleton />
      ) : (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              {overdueTasks.length > 0 && (
                <span className="text-red-500"> · {overdueTasks.length} overdue</span>
              )}
            </p>
          </div>

          <button
            onClick={openCreate}
            disabled={!isOnline}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500
              rounded-lg transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isOnline ? "Cannot create tasks while offline" : "Create a new task"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Task
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900
                placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${!selectedTag ? "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/30" : "bg-gray-100 text-gray-500 hover:text-gray-900"}`}
            >
              All
            </button>
            {tags.map((tag) => (
              <TagBadge
                key={tag.id}
                tag={tag}
                selected={selectedTag === tag.id}
                onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
              />
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-700 mb-1">No tasks yet</h3>
            <p className="text-gray-400 text-sm mb-4">Create your first task to get started</p>
            <button
              onClick={openCreate}
              className="px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
            >
              + Create a task
            </button>
          </div>
        )}

        {/* Overdue section */}
        {overdueTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Overdue ({overdueTasks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {overdueTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming section */}
        {upcomingTasks.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Upcoming ({upcomingTasks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                  onDelete={() => deleteTask(task.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
      )}

      {/* Modals */}
      <CreateTaskModal
        open={createOpen}
        onClose={closeCreate}
        onCreated={fetchData}
      />
      <TaskDetailModal
        task={selectedTask}
        onClose={closeDetail}
        onDelete={selectedTask ? () => deleteTask(selectedTask.id) : undefined}
        onUpdated={(updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))}
      />

    </div>
  );
}