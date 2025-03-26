"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ClockOne,
  CheckCircle,
  XCircle,
  QuestionCircle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Dots,
} from "@mynaui/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"; // Adjust path based on your setup
import { Checkbox } from "@/components/ui/checkbox"; // Adjust path based on your setup

// Define the Task type
export type Task = {
  id: string;
  task: string;
  title: string;
  status: "Todo" | "In-Progress" | "Done" | "Canceled";
  priority: "Low" | "Medium" | "High";
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
    enableHiding: true, // Allow hiding this column
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center pr-6">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center pr-6">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
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
    header: () => (
      <div className="flex items-center space-x-2">
        <div className="w-6 flex justify-center" />
        <div className="min-w-[96px] flex justify-start">
          <span className="font-semibold">Status</span>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusIcons = {
        "In-Progress": ClockOne,
        Todo: QuestionCircle,
        Done: CheckCircle,
        Canceled: XCircle,
      };
      const Icon = statusIcons[status] || QuestionCircle; // Default to question mark if status is unknown
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 flex justify-center">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-[96px] flex justify-start">
            <span className="font-medium">
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("-", " ")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => (
      <div className="flex items-center space-x-2">
        <div className="w-6 flex justify-center" />
        <div className="min-w-[64px] flex justify-start">
          <span className="font-semibold">Priority</span>
        </div>
      </div>
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const priorityIcons = {
        Medium: ArrowRight,
        High: ArrowUp,
        Low: ArrowDown,
      };
      const Icon = priorityIcons[priority] || ArrowRight; // Default to right arrow if priority is unknown
      return (
        <div className="flex items-center space-x-2">
          <div className="w-6 flex justify-center">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-[64px] flex justify-start">
            <span className="font-medium">
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
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
    header: () => (
      <div className="text-right font-semibold pr-2">Created At</div>
    ),
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
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Actions</div>,
    cell: ({ row }) => {
      const taskId = row.getValue("id") as string;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md border border-transparent hover:bg-gray-800 hover:border-2 hover:border-gray-400 focus:outline-none">
                <Dots className="h-6 w-6 stroke-[2.5]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert(`Editing task ${taskId}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onClick={() => alert(`Labeling task ${taskId} as Bug`)}
                  >
                    Bug
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert(`Labeling task ${taskId} as Feature`)}
                  >
                    Feature
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      alert(`Labeling task ${taskId} as Enhancement`)
                    }
                  >
                    Enhancement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      alert(`Labeling task ${taskId} as Documentation`)
                    }
                  >
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => alert(`Deleting task ${taskId}`)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
