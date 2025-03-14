export type Edge = "top" | "right" | "bottom" | "left";
export type Priority = "Low" | "Medium" | "High";
export type Status = "todo" | "progress" | "review" | "completed";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  priority: Priority;
  status: Status;
  assignees: User[];
  comments: number;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  title: string;
  count: number;
  type: string;
  tasks: Task[];
}

export interface MoveCardParams {
  movedTaskIndexInSourceColumn: number;
  sourceColumnId: string;
  destinationColumnId: string;
  movedTaskIndexInDestinationColumn: number;
}

export interface ReorderTaskParams {
  columnId: string;
  startIndex: number;
  finishIndex: number;
}
