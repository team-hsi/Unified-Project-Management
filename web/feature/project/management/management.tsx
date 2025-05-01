"use client";
import { useState } from "react";
import { DialogContent } from "@/feature/shared/ui/dialog";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { ManagementsView } from "./types";
import { ManagementsContent } from "./management-content";
import { ManagementSidebar } from "./managemnt-sidebar";
import type { Project } from "@/feature/shared/@types/projects";

export const Management = ({ project }: { project: Project }) => {
  const [currentView, setCurrentView] = useState<ManagementsView>("general");

  return (
    <DialogContent className="flex h-[80vh] p-0 sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw]">
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
  );
};
