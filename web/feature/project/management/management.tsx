"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/feature/shared/ui/dialog";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { ManagementsView } from "./types";
import { ManagementsContent } from "./management-content";
import { ManagementSidebar } from "./managemnt-sidebar";
import type { Project } from "@/feature/shared/@types/projects";

export const Management = ({
  project,
  view,
  children,
}: {
  project: Project;
  view?: ManagementsView;
  children: React.ReactNode;
}) => {
  const [currentView, setCurrentView] = useState<ManagementsView>(
    view || "general"
  );

  return (
    <Dialog>
      {children}
      <DialogContent className="flex h-[90vh] p-0 sm:max-w-[95vw]">
        <div className="flex h-full w-full">
          {/* Sidebar */}
          <ManagementSidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
          {/* Main content */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <ManagementsContent currentView={currentView} project={project} />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
