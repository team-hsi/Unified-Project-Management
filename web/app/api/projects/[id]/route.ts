import { NextResponse } from "next/server";

import type { Column } from "@/components/kanban/types";
import type { Task } from "@/components/task/types";

const todo: Task[] = [
  {
    id: "task1",
    title: "Employee Details Page",
    description: "Create a page to display employee information and profiles",
    tags: ["Dashboard", "UI/UX"],
    type: "task",
    priority: "Medium",
    status: "to-do",
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
    status: "to-do",
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
    status: "to-do",
    assignees: [{ id: "user2", name: "Dana Thompson", initials: "DT" }],
    comments: 0,
    parentTaskId: "task1",
    completed: false,
  },
];

const inProgress: Task[] = [
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
    status: "completed",
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
    status: "completed",
    assignees: [{ id: "user14", name: "Drew Evans", initials: "DE" }],
    comments: 14,
    parentTaskId: null,
    childTasksCount: 4,
    childTasksCompleted: 4,
  },
];

const boardData: Column[] = [
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

export async function GET() {
  try {
    // Simulate a slight delay to mimic a real API
    // await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(boardData, { status: 200 });
  } catch (error) {
    console.error("Error fetching board data:", error);
    return NextResponse.json(
      { error: "Failed to fetch board data" },
      { status: 500 }
    );
  }
}
