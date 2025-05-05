export type ManagementsView = "general" | "notifications" | "people" | "labels";

export type ProjectLabel = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};
