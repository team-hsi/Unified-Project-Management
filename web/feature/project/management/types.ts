export type ManagementsView = "general" | "people" | "labels";

export type ProjectLabel = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};
