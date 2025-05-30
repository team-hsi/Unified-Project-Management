import { CheckList } from "@/feature/shared/@types/check-list";
import { Label } from "@/feature/shared/@types/label";
import { User } from "./user";

export type ItemPayload = {
  name: string;
  description: string;
  labels: string[];
  startDate: string;
  dueDate: string;
  checklist: CheckList[];
  priority: "low" | "medium" | "high" | "";
  status: string;
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
  activities?: Activity[];
  assignees?: User[];
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemById extends Item {
  activities: Activity[];
}

export type Activity = {
  id: string;
  actor: Omit<User, "activeSpace">;
  activityType: "created" | "updated" | "deleted" | "commented" | "reply";
  timestamp: string;
  metadata: Record<string, string>;
};
