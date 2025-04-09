"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Bucket } from "../kanban/types";

// Define the data type to match the API response
export type Item = {
  id: string;
  name: string;
  bucket: Bucket;
  position: number;
  description: string;
  priority: string;
  status: string;
  startDate: string | null;
  dueDate: string | null;
  labels: string[];
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "bucket.name",
    header: "Bucket",
    cell: ({ row }) => {
      const bucket = row.original.bucket;
      return (
        <div className="flex items-center">
          {bucket.color && (
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: bucket.color }}
            />
          )}
          {bucket.name}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;

      if (!priority) return <span className="text-muted-foreground">-</span>;

      return (
        <Badge
          variant={
            priority === "high"
              ? "destructive"
              : priority === "medium"
              ? "secondary"
              : "default"
          }
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge variant={status === "complete" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string | null;
      if (!dueDate) return <span className="text-muted-foreground">-</span>;

      return <div>{new Date(dueDate).toLocaleDateString()}</div>;
    },
  },
];
