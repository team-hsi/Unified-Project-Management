"use client";
import * as React from "react";
import ProjectTabs from "./view-tabs";
import { CreateBucket } from "../views/kanban/dropdown/create-bucket-dialog";
import { Dialog, DialogTrigger } from "@/feature/shared/ui/dialog";
import { PlusCircle, Settings } from "lucide-react";
import { Button } from "@/feature/shared/ui/button";
import { useViewStore } from "@/lib/stores/view-store";
import { NewDocument } from "@/feature/documentation/overlays/new-doc";
import { Management } from "../management/management";
import { Project } from "@/feature/shared/@types/projects";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/feature/shared/ui/tooltip";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const { activeView } = useViewStore();
  return (
    <div className="flex flex-col rounded-lg">
      <div className="flex items-center justify-between w-full p-4 pb-3 mx-auto">
        <div className="flex items-center gap-3">
          <div className="border-2 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold">
            {project?.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-semibold">{project?.name}</h1>
        </div>
        <div>
          <Management project={project} view="people">
            <DialogTrigger asChild>
              <Button variant="outline">Add Member</Button>
            </DialogTrigger>
          </Management>
          <Management project={project}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="ghost">
                    <Settings />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Project Settings</TooltipContent>
            </Tooltip>
          </Management>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row max-w-7xl justify-between items-start sm:items-center p-4 pt-3 gap-4">
        <ProjectTabs />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeView === "documents" ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </DialogTrigger>
              <NewDocument projectId={project?.id || ""} />
            </Dialog>
          ) : (
            <CreateBucket projectId={project?.id || ""} />
          )}
        </div>
      </div>
    </div>
  );
};
