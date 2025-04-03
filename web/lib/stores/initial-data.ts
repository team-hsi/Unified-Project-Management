import type { Column } from "@/components/kanban/types";
import type { Task } from "@/components/task/types";

export const todo: Task[] = [
  {
    id: "task1",
    title: "Employee Details Page",
    description: "Create a page to display employee information and profiles",
    tags: ["Dashboard", "UI/UX"],
    type: "task",
    priority: "Medium",
    status: "not-started",
    assignees: [
      { id: "user1", name: "Alex Smith", initials: "AS" },
      { id: "user2", name: "Dana Thompson", initials: "DT" },
    ],
    comments: 12,
    parentTaskId: null,
    childTasksCount: 3,
    childTasksCompleted: 1,
  },
  {
    id: "subtask1",
    title: "Design wireframes",
    description: "Create initial wireframes for the employee details page",
    tags: ["Design"],
    type: "task",
    priority: "Medium",
    status: "not-started",
    assignees: [{ id: "user1", name: "Alex Smith", initials: "AS" }],
    comments: 2,
    parentTaskId: "task1",
    completed: true,
  },
  {
    id: "subtask2",
    title: "Create component structure",
    description: "Define the component hierarchy for the employee details page",
    tags: ["Development"],
    type: "task",
    priority: "Medium",
    status: "not-started",
    assignees: [{ id: "user2", name: "Dana Thompson", initials: "DT" }],
    comments: 0,
    parentTaskId: "task1",
    completed: false,
  },
];

export const inProgress: Task[] = [
  {
    id: "task2",
    title: "Dark Mode Implementation",
    description: "Add dark mode support across all application screens",
    tags: ["Mobile app", "Accessibility"],
    type: "task",
    priority: "Low",
    status: "in-progress",
    assignees: [{ id: "user3", name: "Jamie Lee", initials: "JL" }],
    comments: 5,
    parentTaskId: null,
    childTasksCount: 3,
    childTasksCompleted: 1,
  },
  {
    id: "task4",
    title: "Settings Page Redesign",
    description:
      "Improve UX and add new configuration options to settings page",
    tags: ["Mobile app", "Dashboard"],
    type: "task",
    priority: "Medium",
    status: "in-progress",
    assignees: [
      { id: "user6", name: "Riley Johnson", initials: "RJ" },
      { id: "user7", name: "Casey Kim", initials: "CK" },
    ],
    comments: 15,
    parentTaskId: null,
    childTasksCount: 3,
    childTasksCompleted: 2,
  },
];

const completed: Task[] = [
  {
    id: "task7",
    title: "Customer Role Management",
    description: "Implement role-based access control for customer accounts",
    tags: ["Dashboard", "Security"],
    type: "task",
    priority: "High",
    status: "done",
    assignees: [{ id: "user11", name: "Sam Washington", initials: "SW" }],
    comments: 11,
    parentTaskId: null,
    childTasksCount: 4,
    childTasksCompleted: 3,
  },
  {
    id: "task9",
    title: "Design System & Style Guide",
    description: "Create comprehensive design system with component library",
    tags: ["Design", "Documentation"],
    type: "task",
    priority: "Medium",
    status: "done",
    assignees: [{ id: "user14", name: "Drew Evans", initials: "DE" }],
    comments: 14,
    parentTaskId: null,
    childTasksCount: 4,
    childTasksCompleted: 4,
  },
];

export const tasks: Task[] = [...todo, ...inProgress, ...completed];

export const boardData: Column[] = [
  {
    id: "to-do",
    title: "To-do",
    count: todo.length,
    type: "column",
    tasks: todo,
  },
  {
    id: "in-progress",
    title: "In Progress",
    count: inProgress.length,
    type: "column",
    tasks: inProgress,
  },
  {
    id: "completed",
    title: "Completed",
    count: completed.length,
    type: "column",
    tasks: completed,
  },
];

const buckets = [
  {
    id: "ba0a4f00-4914-4941-9ed2-93c0051e7d75",
    name: "Not-Started",
    project: {
      name: "Marketing Website",
      ownerId: "defaultOwnerId",
      id: "825ca8cd-f37d-46e0-8d62-22f3aaad2965",
      createdAt: "2025-03-31T17:04:19.541Z",
      updatedAt: "2025-03-31T17:04:19.541Z",
    },
    createdAt: "2025-03-31T17:20:58.943Z",
    updatedAt: "2025-03-31T17:20:58.943Z",
  },
  {
    id: "21d18c65-d1cf-4dbf-af26-e3b7c99b878a",
    name: "in-progress",
    project: {
      name: "Marketing Website",
      ownerId: "defaultOwnerId",
      id: "825ca8cd-f37d-46e0-8d62-22f3aaad2965",
      createdAt: "2025-03-31T17:04:19.541Z",
      updatedAt: "2025-03-31T17:04:19.541Z",
    },
    createdAt: "2025-04-02T12:04:39.034Z",
    updatedAt: "2025-04-02T12:04:39.034Z",
  },
  {
    id: "6cccc067-881f-45d9-bcdc-9fb890349e5f",
    name: "completed",
    project: {
      name: "Marketing Website",
      ownerId: "defaultOwnerId",
      id: "825ca8cd-f37d-46e0-8d62-22f3aaad2965",
      createdAt: "2025-03-31T17:04:19.541Z",
      updatedAt: "2025-03-31T17:04:19.541Z",
    },
    createdAt: "2025-04-02T12:05:54.050Z",
    updatedAt: "2025-04-02T12:05:54.050Z",
  },
];
export const items = buckets.map((bucket) => ({
  id: crypto.randomUUID(), // Generate a unique ID
  name: `Task for ${bucket.name}`, // Example naming convention
  bucket: {
    id: bucket.id,
    name: bucket.name,
    project: bucket.project, // Copy project reference
    createdAt: bucket.createdAt,
    updatedAt: bucket.updatedAt,
  },
  description: "",
  startDate: null,
  dueDate: null,
  labels: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));
