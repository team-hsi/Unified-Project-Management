"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/feature/shared/ui/dialog";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { SettingsView } from "./types";
import { SettingsSidebar } from "./settings-sidebar";
import { SettingsContent } from "./settings-content";

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const [currentView, setCurrentView] = useState<SettingsView>("preferences");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[80vh] p-0 sm:max-w-[90vw] md:max-w-[90vw] lg:max-w-[90vw]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div className="flex h-full w-full">
          {/* Sidebar */}
          <SettingsSidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

          {/* Main content */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <SettingsContent currentView={currentView} />
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
