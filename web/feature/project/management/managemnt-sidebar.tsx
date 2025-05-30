"use client";
import { Milestone, Settings, Tag, Users } from "lucide-react";
import type React from "react";

import { Button } from "@/feature/shared/ui/button";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Separator } from "@/feature/shared/ui/separator";
import { ManagementsView } from "./types";

interface ManagementSidebarProps {
  currentView: ManagementsView;
  setCurrentView: (view: ManagementsView) => void;
}

interface SidebarItem {
  id: ManagementsView;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const ManagementSidebar = ({
  currentView,
  setCurrentView,
}: ManagementSidebarProps) => {
  const sidebarSections: SidebarSection[] = [
    {
      title: "Project Settings",
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
          id: "milestone",
          label: "Milestone",
          icon: <Milestone className="h-4 w-4" />,
        },
        {
          id: "labels",
          label: "Labels",
          icon: <Tag className="h-4 w-4" />,
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
                      item.id === "general" && currentView === "general"
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
};
