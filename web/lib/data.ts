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

import { Item } from "@/components/list/columns";

export async function getData(): Promise<Item[]> {
  // Fetch data from your API here, or return static data for now
  return [
    {
      id: "728ed52f",
      name: "Write documentation",
      description: "Project Proposal",
      status: "Todo",
      priority: "High",
      startDate: "2023-10-01",
      dueDate: "2023-10-15",
      bucketId: "1",
      labels: ["Documentation", "Proposal"],
    },
    {
      id: "489e1d42",
      name: "Write documentation",
      description: "Project Proposal",
      status: "In-Progress",
      priority: "Medium",
      startDate: "2023-10-01",
      dueDate: "2023-10-15",
      bucketId: "1",
      labels: ["Documentation", "Proposal"],
    },
  ];
}
