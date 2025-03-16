import { Priority } from "./types";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "Low":
      return {
        bg: "bg-cyan-50 border-cyan-100 text-cyan-800",
        bgSpan: "bg-cyan-800",
      };
    case "Medium":
      return {
        bg: "bg-amber-50 border-amber-100 text-amber-800",
        bgSpan: "bg-amber-800",
      };
    case "High":
      return {
        bg: "bg-rose-50 border-rose-100 text-rose-800",
        bgSpan: "bg-rose-800",
      }; // corrected 'border' to 'text' for consistency
    default:
      return {
        bg: "bg-gray-50 border-gray-100 text-gray-800",
        bgSpan: "bg-gray-800",
      }; // corrected 'border' to 'text' for consistency
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
