import { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import api from "../api/axios";
import type { Task } from "../types";
import TaskDetailModal from "../components/TaskDetailModal";
import Navbar from "../components/Navbar";

// ── Lazy-load the heavy calendar widget (react-big-calendar ~100 KB) ──
// This ensures the initial bundle never pays for it on non-calendar routes.
const CalendarWidget = lazy(() => import("../components/CalendarWidget"));

// ── Lightweight skeleton while the calendar chunk loads ───────────────
function CalendarSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-16 bg-gray-100 rounded-md animate-pulse" />
          ))}
        </div>
        <div className="h-6 w-32 bg-gray-100 rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-14 bg-gray-100 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function CalendarView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tasks").then((r) => {
      setTasks(r.data);
      setLoading(false);
    });
  }, []);

  const events = useMemo(
    () =>
      tasks.map((t) => ({
        id: t.id,
        title: t.content,
        start: new Date(t.startDate),
        end: new Date(t.dueDate),
        resource: t,
      })),
    [tasks]
  );

  const deleteTask = useCallback(async (id: string) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const onSelectEvent = useCallback(
    (event: { resource: Task }) => setSelectedTask(event.resource),
    []
  );

  const closeDetail = useCallback(() => setSelectedTask(null), []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Calendar</h1>

        {loading ? (
          <CalendarSkeleton />
        ) : (
          <Suspense fallback={<CalendarSkeleton />}>
            <CalendarWidget events={events} onSelectEvent={onSelectEvent} />
          </Suspense>
        )}
      </main>

      <TaskDetailModal
        task={selectedTask}
        onClose={closeDetail}
        onDelete={selectedTask ? () => deleteTask(selectedTask.id) : undefined}
      />
    </div>
  );
}
