import { Priority } from "@/components/task/types";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "Low":
      return {
        badgeBg: "bg-cyan-50  text-cyan-800",
        pingBg: "bg-cyan-800",
        parentTask: " text-cyan-600",
      };
    case "Medium":
      return {
        badgeBg: "bg-amber-50  text-amber-800",
        pingBg: "bg-amber-800", // corrected 'ping' to 'pingBg' for consistency
        parentTask: " text-white",
      };
    case "High":
      return {
        badgeBg: "bg-rose-50  text-rose-800",
        pingBg: "bg-rose-800",
        parentTask: " text-red-800",
      }; // corrected 'border' to 'text' for consistency
    default:
      return {
        badgeBg: "bg-gray-50 text-gray-800",
        pingBg: "bg-gray-800",
        parentTask: " text-gray-600",
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
