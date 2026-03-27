import { memo, useState } from "react";
import { format, isPast, isToday } from "date-fns";
import type { Task, TaskStatus } from "../types";
import { TASK_STATUS_LABELS, TASK_STATUS_OPTIONS } from "../types";
import TagBadge from "./TagBadge";
import ConfirmModal from "./ConfirmModal";

interface Props {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  disableStatusChange?: boolean;
}

export default memo(function TaskCard({ task, onClick, onDelete, onStatusChange, disableStatusChange }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const due = new Date(task.dueDate);
  const overdue = isPast(due) && !isToday(due);
  const dueToday = isToday(due);
  const statusPillClass: Record<TaskStatus, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    PROGRESS: "bg-amber-500/15 text-amber-600",
    DONE: "bg-gray-900 text-white",
    CANCELLED: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border rounded-xl p-4 cursor-pointer
        transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5
        ${overdue ? "border-red-300 bg-red-50" : dueToday ? "border-amber-300 bg-amber-50" : "border-gray-200 hover:border-amber-400/50"}
      `}
    >
      {/* Delete button */}
      <ConfirmModal
        open={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          onDelete?.();
        }}
        onCancel={() => setShowConfirm(false)}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
          text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50"
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Content */}
      <p className="text-gray-800 font-medium text-sm leading-relaxed mb-3 pr-6">
        {task.content}
      </p>

      <div className="mb-3 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[task.status]}`}
        >
          {TASK_STATUS_LABELS[task.status]}
        </span>
        {onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
            disabled={disableStatusChange}
            className="bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-900 disabled:opacity-50"
          >
            {TASK_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {task.tag && <TagBadge tag={task.tag} />}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {overdue && (
            <span className="text-red-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Overdue
            </span>
          )}
          {dueToday && !overdue && (
            <span className="text-amber-600 font-semibold">Due today</span>
          )}
          <span className={`${overdue ? "text-red-400" : "text-gray-400"}`}>
            {format(due, "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
})
