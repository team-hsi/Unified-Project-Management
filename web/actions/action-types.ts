export type UpdateItemPayload = {
  name?: string;
  description?: string;
  labels?: string[];
  startDate?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high" | "";
  status?: "complete" | "incomplete";
  id: string;
};
export type UpdateBucketPayload = {
  id: string;
  name?: string;
  color?: string;
};

export type UpdateLabelPayload = {
  name: string;
  color: string;
  projectId?: string;
  id?: string;
};
