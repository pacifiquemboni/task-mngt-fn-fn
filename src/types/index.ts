export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface Task {
  id: string;
  content: string;
  startDate: string;
  dueDate: string;
  userId: string;
  tagId: string | null;
  tag: Tag | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
