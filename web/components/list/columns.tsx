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
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

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

// Define label colors for styling
const labelColors: Record<string, string> = {
  Bug: "bg-red-100 text-red-800",
  Feature: "bg-blue-100 text-blue-800",
  Enhancement: "bg-green-100 text-green-800",
  Documentation: "bg-yellow-100 text-yellow-800",
};

// Define the type for the parameters passed to getColumns
interface ColumnsProps {
  setLabel: (
    taskId: string,
    label: "Bug" | "Feature" | "Enhancement" | "Documentation" | null
  ) => void;
  getLabel: (
    taskId: string
  ) => "Bug" | "Feature" | "Enhancement" | "Documentation" | null;
}

export const getColumns = ({
  setLabel,
  getLabel,
}: ColumnsProps): ColumnDef<Task>[] => [
  {
    accessorKey: "id",
    header: () => <div className="text-left font-semibold">ID</div>,
    cell: ({ row }) => (
      <div className="text-left font-mono text-sm">{row.getValue("id")}</div>
    ),
    enableHiding: true,
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
    cell: ({ row }) => {
      const taskId = row.getValue("id") as string;
      const label = getLabel(taskId);
      return (
        <div className="text-left font-medium flex items-center space-x-2">
          {label && (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                labelColors[label] || "bg-gray-100 text-gray-800"
              }`}
            >
              {label}
            </span>
          )}
          <span>{row.getValue("title")}</span>
        </div>
      );
    },
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
      const Icon = statusIcons[status] || QuestionCircle;
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
      const Icon = priorityIcons[priority] || ArrowRight;
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
      <div className="text-right font-semibold pr-4">Created At</div>
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
                <Dots className="h-6 w-6 scale-125 drop-shadow-sm text-white hover:text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert(`Editing task ${taskId}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setLabel(taskId, "Bug")}>
                    Bug
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLabel(taskId, "Feature")}>
                    Feature
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLabel(taskId, "Enhancement")}
                  >
                    Enhancement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLabel(taskId, "Documentation")}
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
