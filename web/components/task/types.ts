import { User } from "@/components/user/types";
import { z } from "zod";
import { itemFormSchema } from "../form/schema";

export type Priority = "Low" | "Medium" | "High";
export type Status = "not-started" | "in-progress" | "review" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  type: string;
  priority: Priority;
  status: string;
  assignees: User[];
  comments: number;
  parentTaskId: string | null;
  childTasksCount?: number;
  childTasksCompleted?: number;
  completed?: boolean;
}
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type StatusOption = {
  value: string;
  label: string;
  color: string;
  dotColor: string;
  group?: string;
};

export type ItemFormValues = z.infer<typeof itemFormSchema>;
