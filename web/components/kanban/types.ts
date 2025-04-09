import { Task } from "@/components/task/types";

export type Edge = "top" | "right" | "bottom" | "left";
export interface Column {
  id: string;
  title: string;
  count: number;
  type: string;
  tasks: Task[];
}
export interface Bucket {
  id: string;
  name: string;
  project: {
    name: string;
    ownerId: string;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  // TODO: Add these new properties to the API it doesn't have them yet
  // color: string;
}
export interface Item {
  id: string;
  name: string;
  bucket?: {
    id: string;
    name: string;
    project: {
      name: string;
      ownerId: string;
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  priority: "low" | "medium" | "high" | null;
  status: string;
  description: string;
  startDate: string | null;
  dueDate: string | null;
  labels: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MoveCardParams {
  movedTaskIndexInSourceColumn: number;
  sourceColumnId: string;
  destinationColumnId: string;
  movedTaskIndexInDestinationColumn: number;
}

export interface ReorderBucketParams {
  bucketId: string;
  startIndex: number;
  finishIndex: number;
}
