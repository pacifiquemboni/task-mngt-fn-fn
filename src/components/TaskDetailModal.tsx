import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task } from "../types";
import TagBadge from "./TagBadge";
import ConfirmModal from "./ConfirmModal";

interface Props {
  task: Task | null;
  onClose: () => void;
  onDelete?: () => void;
}

export default function TaskDetailModal({ task, onClose, onDelete }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!task) return null;

  const due = new Date(task.dueDate);
  const start = new Date(task.startDate);
  const overdue = isPast(due) && !isToday(due);

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
          {overdue && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              This task is overdue
            </div>
          )}

          {/* Content */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800 leading-relaxed">{task.content}</p>
          </div>

          {/* Meta */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Start Date</span>
              <span className="text-gray-700">{format(start, "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Due Date</span>
              <span className={overdue ? "text-red-500 font-medium" : "text-gray-700"}>
                {format(due, "MMMM d, yyyy")}
              </span>
            </div>
            {task.tag && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Tag</span>
                <TagBadge tag={task.tag} />
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
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-black bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
