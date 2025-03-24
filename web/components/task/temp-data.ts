import { StatusOption } from "./types";

export const statusOptions: StatusOption[] = [
  {
    value: "not-started",
    label: "Not Started",
    color: "bg-gray-200 text-gray-800",
    dotColor: "bg-gray-500",
    group: "To-do",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    dotColor: "bg-blue-500",
    group: "In Progress",
  },
  {
    value: "done",
    label: "Done",
    color: "bg-green-100 text-green-700",
    dotColor: "bg-green-500",
    group: "Complete",
  },
];
