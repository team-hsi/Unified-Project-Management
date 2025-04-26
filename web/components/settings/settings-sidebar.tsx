"use client";
import { Bell, Settings, User, Users } from "lucide-react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SettingsView } from "./types";

interface SettingsSidebarProps {
  currentView: SettingsView;
  setCurrentView: (view: SettingsView) => void;
}

interface SidebarItem {
  id: SettingsView;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export function SettingsSidebar({
  currentView,
  setCurrentView,
}: SettingsSidebarProps) {
  // Define sidebar sections and items
  const sidebarSections: SidebarSection[] = [
    {
      title: "Account",
      items: [
        {
          id: "preferences",
          label: "Preferences",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: <Bell className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "Workspace",
      items: [
        {
          id: "general",
          label: "General",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: "space",
          label: "Space",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: "people",
          label: "People",
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="w-[240px] border-r bg-muted/40">
      <ScrollArea className="h-full">
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium">Account</h3>
            <div className="mt-2 flex items-center gap-2 rounded-md px-2 py-1.5">
              <User className="h-4 w-4" />
              <span className="text-sm">Hunde D</span>
            </div>
          </div>

          {sidebarSections.map((section, index) => (
            <div key={index}>
              {section.title && (
                <>
                  {index > 0 && <Separator className="my-4" />}
                  <h3 className="mb-2 px-2 text-sm font-medium">
                    {section.title}
                  </h3>
                </>
              )}

              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-2 ${
                      item.id === "preferences" && currentView === "preferences"
                        ? "font-medium"
                        : ""
                    }`}
                    onClick={() => setCurrentView(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
