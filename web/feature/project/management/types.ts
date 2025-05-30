export type ManagementsView = "general" | "people" | "labels" | "milestone";

export type ProjectLabel = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};
