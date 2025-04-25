import { CheckList } from "@/@types/check-list";

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
