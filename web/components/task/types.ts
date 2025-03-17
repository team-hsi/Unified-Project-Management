import { User } from "@/components/user/types";

export type Priority = "Low" | "Medium" | "High";
export type Status = "todo" | "progress" | "review" | "completed";

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

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}
