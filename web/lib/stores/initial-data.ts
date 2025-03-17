import { Column } from "../../components/kanban/types";

export const boardData: Column[] = [
  {
    id: "todo",
    title: "To-do",
    count: 3,
    type: "column",
    tasks: [
      {
        id: "task1",
        title: "Employee Details Page",
        description:
          "Create a page to display employee information and profiles",
        tags: ["Dashboard", "UI/UX"],
        type: "task",
        priority: "Medium",
        status: "todo",
        assignees: [
          { id: "user1", name: "Alex Smith", initials: "AS" },
          { id: "user2", name: "Dana Thompson", initials: "DT" },
        ],
        comments: 12,
        subtasks: [
          { id: "subtask1", title: "Design wireframes", completed: true },
          {
            id: "subtask2",
            title: "Create component structure",
            completed: false,
          },
          {
            id: "subtask3",
            title: "Implement API integration",
            completed: false,
          },
        ],
      },
      {
        id: "task2",
        title: "Dark Mode Implementation",
        description: "Add dark mode support across all application screens",
        tags: ["Mobile app", "Accessibility"],
        type: "task",
        priority: "Low",
        status: "todo",
        assignees: [{ id: "user3", name: "Jamie Lee", initials: "JL" }],
        comments: 5,
        subtasks: [
          {
            id: "subtask4",
            title: "Create color variables",
            completed: true,
          },
          {
            id: "subtask5",
            title: "Update component themes",
            completed: false,
          },
          { id: "subtask6", title: "Add theme toggle", completed: false },
        ],
      },
      {
        id: "task3",
        title: "Super Admin Role Configuration",
        description:
          "Set up permissions and access controls for super admin role",
        tags: ["Dashboard", "Security"],
        type: "task",
        priority: "High",
        status: "todo",
        assignees: [
          { id: "user4", name: "Morgan Chen", initials: "MC" },
          { id: "user5", name: "Taylor Wilson", initials: "TW" },
        ],
        comments: 8,
        subtasks: [
          {
            id: "subtask7",
            title: "Define permission schema",
            completed: false,
          },
          {
            id: "subtask8",
            title: "Create admin panel UI",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    count: 3,
    type: "column",
    tasks: [
      {
        id: "task4",
        title: "Settings Page Redesign",
        description:
          "Improve UX and add new configuration options to settings page",
        tags: ["Mobile app", "Dashboard"],
        type: "task",
        priority: "Medium",
        status: "progress",
        assignees: [
          { id: "user6", name: "Riley Johnson", initials: "RJ" },
          { id: "user7", name: "Casey Kim", initials: "CK" },
        ],
        comments: 15,
        subtasks: [
          { id: "subtask9", title: "Redesign layout", completed: true },
          {
            id: "subtask10",
            title: "Add new configuration options",
            completed: true,
          },
          {
            id: "subtask11",
            title: "Test on mobile devices",
            completed: false,
          },
        ],
      },
      {
        id: "task5",
        title: "KPI Dashboard",
        description:
          "Create interactive dashboard showing key performance indicators",
        tags: ["Dashboard", "Analytics"],
        type: "task",
        priority: "High",
        status: "progress",
        assignees: [{ id: "user8", name: "Jordan Patel", initials: "JP" }],
        comments: 7,
        subtasks: [
          {
            id: "subtask12",
            title: "Design chart components",
            completed: true,
          },
          {
            id: "subtask13",
            title: "Implement data fetching",
            completed: true,
          },
          {
            id: "subtask14",
            title: "Add filtering options",
            completed: false,
          },
          {
            id: "subtask15",
            title: "Create export functionality",
            completed: false,
          },
        ],
      },
      {
        id: "task6",
        title: "Notification System",
        description: "Implement real-time notification system with websockets",
        tags: ["Mobile app", "Backend"],
        type: "task",
        priority: "Medium",
        status: "progress",
        assignees: [
          { id: "user9", name: "Quinn Rodriguez", initials: "QR" },
          { id: "user10", name: "Avery Thomas", initials: "AT" },
        ],
        comments: 9,
        subtasks: [
          {
            id: "subtask16",
            title: "Set up websocket server",
            completed: true,
          },
          {
            id: "subtask17",
            title: "Create notification components",
            completed: true,
          },
          {
            id: "subtask18",
            title: "Implement notification preferences",
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    count: 2,
    type: "column",
    tasks: [
      {
        id: "task7",
        title: "Customer Role Management",
        description:
          "Implement role-based access control for customer accounts",
        tags: ["Dashboard", "Security"],
        type: "task",
        priority: "High",
        status: "review",
        assignees: [{ id: "user11", name: "Sam Washington", initials: "SW" }],
        comments: 11,
        subtasks: [
          {
            id: "subtask19",
            title: "Define customer permission levels",
            completed: true,
          },
          {
            id: "subtask20",
            title: "Create role assignment UI",
            completed: true,
          },
          {
            id: "subtask21",
            title: "Implement access control middleware",
            completed: true,
          },
          { id: "subtask22", title: "Write documentation", completed: false },
        ],
      },
      {
        id: "task8",
        title: "Admin Dashboard Analytics",
        description: "Add analytics and reporting features to admin dashboard",
        tags: ["Dashboard", "Analytics"],
        type: "task",
        priority: "Medium",
        status: "review",
        assignees: [
          { id: "user12", name: "Blake Miller", initials: "BM" },
          { id: "user13", name: "Cameron Garcia", initials: "CG" },
        ],
        comments: 6,
        subtasks: [
          { id: "subtask23", title: "Design analytics UI", completed: true },
          {
            id: "subtask24",
            title: "Implement data visualization",
            completed: true,
          },
          {
            id: "subtask25",
            title: "Add export functionality",
            completed: true,
          },
        ],
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    count: 3,
    type: "column",
    tasks: [
      {
        id: "task9",
        title: "Design System & Style Guide",
        description:
          "Create comprehensive design system with component library",
        tags: ["Design", "Documentation"],
        type: "task",
        priority: "Medium",
        status: "completed",
        assignees: [{ id: "user14", name: "Drew Evans", initials: "DE" }],
        comments: 14,
        subtasks: [
          { id: "subtask26", title: "Define color palette", completed: true },
          {
            id: "subtask27",
            title: "Create typography system",
            completed: true,
          },
          {
            id: "subtask28",
            title: "Design component library",
            completed: true,
          },
          {
            id: "subtask29",
            title: "Document usage guidelines",
            completed: true,
          },
        ],
      },
      {
        id: "task10",
        title: "User Authentication Flow",
        description:
          "Implement secure authentication with multi-factor support",
        tags: ["Security", "Mobile app", "Dashboard"],
        type: "task",
        priority: "High",
        status: "completed",
        assignees: [
          { id: "user15", name: "Finley Cooper", initials: "FC" },
          { id: "user16", name: "Harper Lee", initials: "HL" },
        ],
        comments: 18,
        subtasks: [
          {
            id: "subtask30",
            title: "Implement login/signup",
            completed: true,
          },
          {
            id: "subtask31",
            title: "Add password recovery",
            completed: true,
          },
          {
            id: "subtask32",
            title: "Integrate multi-factor auth",
            completed: true,
          },
          { id: "subtask33", title: "Security testing", completed: true },
        ],
      },
      {
        id: "task11",
        title: "Mobile Navigation Redesign",
        description:
          "Improve mobile navigation for better usability and accessibility",
        tags: ["Mobile app", "UI/UX", "Accessibility"],
        type: "task",
        priority: "Medium",
        status: "completed",
        assignees: [{ id: "user17", name: "Reese Morgan", initials: "RM" }],
        comments: 9,
        subtasks: [
          {
            id: "subtask34",
            title: "Research navigation patterns",
            completed: true,
          },
          { id: "subtask35", title: "Create prototypes", completed: true },
          { id: "subtask36", title: "User testing", completed: true },
          { id: "subtask37", title: "Implementation", completed: true },
        ],
      },
    ],
  },
];
