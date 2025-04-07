type Task = {
  id: string;
  task: string;
  title: string;
  status: "Todo" | "In-Progress" | "Done" | "Canceled";
  priority: "Low" | "Medium" | "High";
  assignedTo: string;
  createdAt: string; // Using ISO string format for dates
};

export const tasks: Task[] = [
  {
    id: "728ed52f",
    task: "Write documentation",
    title: "Project Proposal",
    status: "Todo",
    priority: "High",
    assignedTo: "m@example.com",
    createdAt: "2025-02-25T21:00:00.000Z",
  },
  {
    id: "489e1d42",
    task: "Review feedback",
    title: "Client Meeting Prep",
    status: "In-Progress",
    priority: "Medium",
    assignedTo: "example@gmail.com",
    createdAt: "2025-03-01T14:30:00.000Z",
  },
];
