"use client";

import { useState } from "react";
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
  // DropdownMenuSub,
  // DropdownMenuSubTrigger,
  // DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { EditItemModal } from "./edit-item-modal";

// Define the Item type
export type Item = {
  id: string;
  name: string;
  description: string;
  status: "Todo" | "In-Progress" | "Done" | "Canceled";
  priority: "Low" | "Medium" | "High";
  // assignedTo: string;
  startDate: string;
  dueDate: string;
  bucketId: string;
  labels: string[];
};

// Define label colors for styling
// const labelColors: Record<string, string> = {
//   Bug: "bg-red-100 text-red-800",
//   Feature: "bg-blue-100 text-blue-800",
//   Enhancement: "bg-green-100 text-green-800",
//   Documentation: "bg-yellow-100 text-yellow-800",
// };

// Define the type for the parameters passed to getColumns
interface ColumnsProps {
  // setLabel: (itemId: string, label: string | null) => void;
  // getLabel: (itemId: string) => string | null;
  onUpdateItem?: (item: Item) => void; // Trigger modal opening
  onDeleteItem?: (itemId: string) => void; // Trigger delete mutation
  onSaveItem?: (updatedItem: Item) => void; // Trigger edit mutation
}

export const getColumns = ({
  // setLabel,
  // getLabel,
  onUpdateItem,
  onDeleteItem,
  onSaveItem,
}: ColumnsProps): ColumnDef<Item>[] => [
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
    accessorKey: "name",
    header: () => <div className="text-left font-semibold">Name</div>,
    cell: ({ row }) => {
      // const itemId = row.getValue("id") as string;
      // const label = getLabel(itemId);
      return (
        <div className="text-left font-medium flex items-center space-x-2">
          {/* {label && (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                labelColors[label] || "bg-gray-100 text-gray-800"
              }`}
            >
              {label}
            </span>
          )} */}
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left font-semibold">Description</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-left font-semibold">Status</div>,
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
        <div
          className="inline-flex items-center space-x-0.5 px-2 py-1 border border-gray-700 rounded-lg"
          role="presentation"
        >
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
    header: () => <div className="text-left font-semibold">Priority</div>,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const priorityIcons = {
        Medium: ArrowRight,
        High: ArrowUp,
        Low: ArrowDown,
      };
      const Icon = priorityIcons[priority] || ArrowRight;
      return (
        <div
          className="inline-flex items-center space-x-0.5 px-2 py-1 border border-gray-700 rounded-lg"
          role="presentation"
        >
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
  // {
  //   accessorKey: "assignedTo",
  //   header: () => <div className="text-left font-semibold">Assigned To</div>,
  //   cell: ({ row }) => (
  //     <div className="text-left font-medium">{row.getValue("assignedTo")}</div>
  //   ),
  // },
  {
    accessorKey: "startDate",
    header: () => <div className="text-left font-semibold">Start Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "dueDate",
    header: () => <div className="text-left font-semibold">Due Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  // {
  //   accessorKey: "bucketId",
  //   header: () => <div className="text-left font-semibold">Bucket ID</div>,
  //   cell: ({ row }) => (
  //     <div className="text-left font-medium">{row.getValue("bucketId")}</div>
  //   ),
  // },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold"></div>,
    cell: ({ row }) => {
      const item = row.original;
      const [isModalOpen, setIsModalOpen] = useState(false);

      const handleEditClick = () => {
        if (onUpdateItem) {
          onUpdateItem(item);
        }
      };

      const handleDeleteClick = () => {
        if (onDeleteItem) {
          onDeleteItem(item.id);
        }
      };

      const handleSave = (updatedItem: Item) => {
        if (onSaveItem) {
          onSaveItem(updatedItem); // Trigger edit mutation
        }
      };

      // const handleSetLabel = async (label: string | null) => {
      //   try {
      //     const updatedLabels = label ? [label] : [];
      //     const updatedItem = { ...item, labels: updatedLabels };

      //     const response = await fetch(`/v1/items/${item.id}`, {
      //       method: "PUT",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(updatedItem),
      //     });

      //     if (!response.ok) {
      //       throw new Error(`HTTP error! status: ${response.status}`);
      //     }

      //     const result = await response.json();
      //     setLabel(item.id, label);
      //     if (onUpdateItem) {
      //       onUpdateItem(result);
      //     }
      //   } catch (error) {
      //     console.error("Failed to set label:", error);
      //     alert("Failed to set label. Please try again.");
      //   }
      // };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-md border border-transparent hover:bg-gray-800 hover:border-2 hover:border-gray-400 focus:outline-none">
                <Dots className="h-6 w-6 scale-125 drop-shadow-sm text-white hover:text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEditClick}>
                Edit
              </DropdownMenuItem>
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleSetLabel("Bug")}>
                    Bug
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSetLabel("Feature")}>
                    Feature
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSetLabel("Enhancement")}
                  >
                    Enhancement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSetLabel("Documentation")}
                  >
                    Documentation
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub> */}
              <DropdownMenuItem
                variant="destructive"
                onClick={handleDeleteClick}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditItemModal
            item={item}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </div>
      );
    },
  },
];
