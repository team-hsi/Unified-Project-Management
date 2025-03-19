import { Task } from "@/components/task/types";

export type Edge = "top" | "right" | "bottom" | "left";
export interface Column {
  id: string;
  title: string;
  count: number;
  type: string;
  tasks: Task[];
}

export interface MoveCardParams {
  movedTaskIndexInSourceColumn: number;
  sourceColumnId: string;
  destinationColumnId: string;
  movedTaskIndexInDestinationColumn: number;
}

export interface ReorderTaskParams {
  columnId: string;
  startIndex: number;
  finishIndex: number;
}
