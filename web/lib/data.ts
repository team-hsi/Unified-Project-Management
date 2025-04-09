import {
  AudioWaveform,
  Bell,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Search,
  Settings,
} from "lucide-react";
export const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "/user.png",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Menus",
      url: "#",
      items: [
        {
          title: "Search",
          url: "#",
          icon: Search,
        },
        {
          title: "Notifications",
          url: "#",
          icon: Bell,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

// import { Task } from "@/components/list/columns";

// export async function getData(): Promise<Task[]> {
//   // Fetch data from your API here, or return static data for now
//   return [
//     {
//       id: "728ed52f",
//       task: "Write documentation",
//       title: "Project Proposal",
//       status: "Todo",
//       priority: "High",
//       assignedTo: "m@example.com",
//       createdAt: "2025-02-25T21:00:00.000Z",
//     },
//     {
//       id: "489e1d42",
//       task: "Review feedback",
//       title: "Client Meeting Prep",
//       status: "In-Progress",
//       priority: "Medium",
//       assignedTo: "example@gmail.com",
//       createdAt: "2025-03-01T14:30:00.000Z",
//     },
//   ];
// }
