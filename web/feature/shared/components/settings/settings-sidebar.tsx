"use client";
import { Settings, Users, UserCircle, Shield, Mail } from "lucide-react";
import type React from "react";

import { Button } from "@/feature/shared/ui/button";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Separator } from "@/feature/shared/ui/separator";
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
          id: "account",
          label: "Profile",
          icon: <UserCircle className="h-4 w-4" />,
        },
        {
          id: "preferences",
          label: "Preferences",
          icon: <Settings className="h-4 w-4" />,
        },
        {
          id: "my-invitations",
          label: "My Invitations",
          icon: <Mail className="h-4 w-4" />,
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
          id: "people",
          label: "People",
          icon: <Users className="h-4 w-4" />,
        },
        {
          id: "sent-invitations",
          label: "Sent Invitations",
          icon: <Mail className="h-4 w-4" />,
        },
        {
          id: "permissions",
          label: "Permissions",
          icon: <Shield className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <div className="w-[240px] border-r bg-muted/40">
      <ScrollArea className="h-full">
        <div className="p-4">
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
                      currentView === item.id ? "font-medium" : ""
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
