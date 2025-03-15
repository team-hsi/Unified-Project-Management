import { Priority } from "./types";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "Low":
      return "bg-cyan-500";
    case "Medium":
      return "bg-amber-500";
    case "High":
      return "bg-rose-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusColor = (columnId: string) => {
  switch (columnId) {
    case "todo":
      return "border-2 border-gray-400";
    case "progress":
      return "border-2 border-blue-400";
    case "review":
      return "border-2 border-amber-400";
    case "completed":
      return "border-2 border-green-400";
    default:
      return "border-2 border-gray-400";
  }
};
