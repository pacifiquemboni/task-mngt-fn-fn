import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "../api/axios";
import type { Tag } from "../types";
import { useOnlineStatus } from "../hooks/usePwa";
import TagBadge from "./TagBadge";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTaskModal({ open, onClose, onCreated }: Props) {
  const isOnline = useOnlineStatus();
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dueDate, setDueDate] = useState("");
  const [tagId, setTagId] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/tags").then((r) => setTags(r.data));
      setContent("");
      setStartDate(format(new Date(), "yyyy-MM-dd"));
      setDueDate("");
      setTagId(null);
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content.trim()) {
      setError("Task content is required");
      return;
    }
    if (!isOnline) {
      setError("You're offline. Please reconnect to create tasks.");
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

    setLoading(true);
    try {
      await api.post("/tasks", {
        content: content.trim(),
        startDate: new Date(startDate).toISOString(),
        dueDate: new Date(dueDate).toISOString(),
        tagId,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">New Task</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                What needs to be done?
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your task..."
                rows={3}
                autoFocus
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
                  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500
                  resize-none transition-colors"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                  Due date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Tag selection */}
            {tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Tag
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTagId(null)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
                      ${!tagId ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-500 hover:text-gray-900"}`}
                  >
                    None
                  </button>
                  {tags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      selected={tagId === tag.id}
                      onClick={() => setTagId(tag.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
