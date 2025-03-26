"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ClockIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

// Define the Task type
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
    header: () => <div className="text-left font-semibold">ID</div>,
    cell: ({ row }) => (
      <div className="text-left font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "task",
    header: () => <div className="text-left font-semibold">Task</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("task")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left font-semibold">Title</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center font-semibold">Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusIcons = {
        "in-progress": ClockIcon,
        pending: QuestionMarkCircleIcon,
        completed: CheckCircleIcon,
        canceled: XCircleIcon,
      };
      const statusStyles =
        {
          "in-progress": "text-blue-600",
          pending: "text-gray-600",
          completed: "text-green-600",
          canceled: "text-red-600",
        }[status] || "text-gray-600";
      const Icon = statusIcons[status] || QuestionMarkCircleIcon; // Default to question mark if status is unknown
      return (
        <div className="text-center flex items-center justify-center space-x-2">
          <Icon className={`h-5 w-5 ${statusStyles}`} />
          <span className={`font-medium ${statusStyles}`}>
            {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => <div className="text-center font-semibold">Priority</div>,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const priorityIcons = {
        medium: ArrowRightIcon,
        high: ArrowUpIcon,
        low: ArrowDownIcon,
      };
      const priorityStyles =
        {
          medium: "text-gray-600",
          high: "text-red-600",
          low: "text-gray-600",
        }[priority] || "text-gray-600";
      const Icon = priorityIcons[priority] || ArrowRightIcon; // Default to right arrow if priority is unknown
      return (
        <div className="text-center flex items-center justify-center space-x-2">
          <span className={`font-medium ${priorityStyles}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </span>
          <Icon className={`h-5 w-5 ${priorityStyles}`} />
        </div>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: () => <div className="text-left font-semibold">Assigned To</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("assignedTo")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right font-semibold">Created At</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
