export type UpdateItemPayload = {
  name?: string;
  description?: string;
  labels?: string[];
  startDate?: string | null;
  dueDate?: string | null;
  priority?: "low" | "medium" | "high" | "";
  status?: "complete" | "incomplete";
  id: string;
};
export type UpdateBucketPayload = {
  id: string;
  name?: string;
  color?: string;
};
