export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export type TaskStatus = "PENDING" | "PROGRESS" | "DONE" | "CANCELLED";

export const TASK_STATUS_OPTIONS: TaskStatus[] = ["PENDING", "PROGRESS", "DONE", "CANCELLED"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pending",
  PROGRESS: "In progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

export interface Task {
  id: string;
  content: string;
  startDate: string;
  dueDate: string;
  userId: string;
  status: TaskStatus;
  tagId: string | null;
  tag: Tag | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
