import { CheckList } from "@/components/kanban/types";

export type ItemPayload = {
  name?: string;
  description?: string;
  labels?: string[];
  startDate?: string;
  dueDate?: string;
  checklist?: CheckList[];
  priority?: "low" | "medium" | "high" | "";
  status?: "complete" | "incomplete";
  id: string;
};
export type BucketPayload = {
  id: string;
  name?: string;
  color?: string;
};

export type LabelPayload = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};

export type WorkspacePayload = {
  id: string;
  name: string;
  description?: string;
  visibility?: "private" | "public";
  members?: string[];
};
