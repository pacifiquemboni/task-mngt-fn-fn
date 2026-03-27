import { useState, useEffect } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task, Tag, TaskStatus } from "../types";
import TagBadge from "./TagBadge";
import ConfirmModal from "./ConfirmModal";
import api from "../api/axios";
import { useOnlineStatus } from "../hooks/usePwa";

interface Props {
  task: Task | null;
  onClose: () => void;
  onDelete?: () => void;
  onUpdated?: (task: Task) => void;
}

export default function TaskDetailModal({ task, onClose, onDelete, onUpdated }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isOnline = useOnlineStatus();

  // Editing state
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("PENDING");
  const [tagId, setTagId] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const due = task ? new Date(task.dueDate) : new Date();
  const start = task ? new Date(task.startDate) : new Date();
  const overdue = task ? isPast(due) && !isToday(due) : false;

  useEffect(() => {
    if (!task) return;
    setContent(task.content);
    setStartDate(format(new Date(task.startDate), "yyyy-MM-dd"));
    setDueDate(format(new Date(task.dueDate), "yyyy-MM-dd"));
    setStatus(task.status ?? "PENDING");
    setTagId(task.tagId ?? null);
  }, [task]);

  useEffect(() => {
    if (!editing) return;
    api.get("/tags").then((r) => setTags(r.data)).catch(() => setTags([]));
  }, [editing]);

  if (!task) return null;

  const statusLabel: Record<TaskStatus, string> = {
    PENDING: "Pending",
    PROGRESS: "In progress",
    DONE: "Done",
    CANCELLED: "Cancelled",
  };

  const statusPillClass: Record<TaskStatus, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    PROGRESS: "bg-amber-500/15 text-amber-600",
    DONE: "bg-gray-900 text-white",
    CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Status */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              {!editing ? (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[task.status]}`}
                >
                  {statusLabel[task.status]}
                </span>
              ) : (
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROGRESS">In progress</option>
                  <option value="DONE">Done</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
            </div>

            {overdue && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                This task is overdue
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            {!editing ? (
              <p className="text-gray-800 leading-relaxed">{task.content}</p>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                  resize-none transition-colors"
              />
            )}
          </div>

          {/* Meta */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Start Date</span>
              {!editing ? (
                <span className="text-gray-700">{format(start, "MMMM d, yyyy")}</span>
              ) : (
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                />
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Due Date</span>
              {!editing ? (
                <span className={overdue ? "text-red-500 font-medium" : "text-gray-700"}>
                  {format(due, "MMMM d, yyyy")}
                </span>
              ) : (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className={`bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 ${overdue ? "text-red-500" : ""}`}
                />
              )}
            </div>

            {(!editing && task.tag) && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tag</span>
                <TagBadge tag={task.tag} />
              </div>
            )}

            {editing && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Tag</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTagId(null)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${!tagId ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900"}`}
                  >
                    None
                  </button>
                  {tags.map((t) => (
                    <TagBadge key={t.id} tag={t} selected={tagId === t.id} onClick={() => setTagId(t.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm delete modal */}
          <ConfirmModal
            open={showConfirm}
            onConfirm={() => {
              setShowConfirm(false);
              onDelete?.();
              onClose();
            }}
            onCancel={() => setShowConfirm(false)}
          />
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 mt-4">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200">
            {onDelete && (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
            {!editing ? (
              <>
                <button
                  onClick={() => setEditing(true)}
                  disabled={!isOnline}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setEditing(false);
                    setError("");
                    // reset to original task values
                    if (task) {
                      setContent(task.content);
                      setStartDate(format(new Date(task.startDate), "yyyy-MM-dd"));
                      setDueDate(format(new Date(task.dueDate), "yyyy-MM-dd"));
                      setStatus(task.status ?? "PENDING");
                      setTagId(task.tagId ?? null);
                    }
                  }}
                  disabled={loadingSave}
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setError("");
                    if (!content.trim()) {
                      setError("Task content is required");
                      return;
                    }
                    if (!dueDate) {
                      setError("Due date is required");
                      return;
                    }
                    if (new Date(dueDate) < new Date(new Date().toDateString())) {
                      setError("Due date cannot be in the past");
                      return;
                    }
                    if (new Date(startDate) > new Date(dueDate)) {
                      setError("Start date must be before due date");
                      return;
                    }

                    if (!task) return;
                    setLoadingSave(true);
                    try {
                      const res = await api.put(`/tasks/${task.id}`, {
                        content: content.trim(),
                        startDate: new Date(startDate).toISOString(),
                        dueDate: new Date(dueDate).toISOString(),
                        tagId,
                        status,
                      });
                      setEditing(false);
                      onClose();
                      if (onUpdated) onUpdated(res.data);
                    } catch (err: unknown) {
                      const axiosErr = err as { response?: { data?: { message?: string } } };
                      setError(axiosErr.response?.data?.message || "Failed to update task");
                    } finally {
                      setLoadingSave(false);
                    }
                  }}
                  disabled={loadingSave || !isOnline}
                  className="px-4 py-2 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingSave ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
