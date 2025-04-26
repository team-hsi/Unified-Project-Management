import { CheckList } from "@/@types/check-list";
import { Label } from "@/@types/label";

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
  bucketId: string;
};

export type ItemDnDPayload = {
  id: string;
  bucketId: string;
  prevItemId: string | null;
  nextItemId: string | null;
};

export interface Item {
  id: string;
  name: string;
  bucket: {
    id: string;
    name: string;
    project: {
      name: string;
      ownerId: string;
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    color: string;
    createdAt: string;
    updatedAt: string;
  };
  position: number;
  priority: "low" | "medium" | "high" | null;
  status: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  checklist: CheckList[] | null;
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}
