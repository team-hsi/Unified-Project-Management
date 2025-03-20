import { Priority } from "@/components/task/types";

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "Low":
      return {
        badgeBg: "bg-gray-50  text-gray-800",
        pingBg: "bg-gray-800",
        parentTask: " text-gray-800",
      };
    case "Medium":
      return {
        badgeBg: "bg-cyan-50  text-cyan-800",
        pingBg: "bg-cyan-800", // corrected 'ping' to 'pingBg' for consistency
        parentTask: " text-cyan-800",
      };
    case "High":
      return {
        badgeBg: "bg-red-50  text-red-800",
        pingBg: "bg-red-800",
        parentTask: " text-red-800",
      }; // corrected 'border' to 'text' for consistency
    default:
      return {
        badgeBg: "bg-gray-50 text-gray-800",
        pingBg: "bg-gray-800",
        parentTask: " text-gray-800",
      }; // corrected 'border' to 'text' for consistency
  }
};

export const getStatusColor = (columnId: string) => {
  switch (columnId) {
    case "to-do":
      return "border-2 border-gray-400";
    case "in-progress":
      return "border-2 border-blue-400";
    case "completed":
      return "border-2 border-green-400";
    default:
      return "border-2 border-gray-400";
  }
};
