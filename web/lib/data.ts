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
export type Data = typeof data;
