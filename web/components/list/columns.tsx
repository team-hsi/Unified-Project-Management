"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type defines the shape of our task data.
export type Task = {
  id: string;
  task: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "canceled";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  createdAt: string;
};

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "task",
    header: "Task",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
