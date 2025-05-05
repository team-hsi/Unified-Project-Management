"use client";
import * as React from "react";
import { Project } from "@/lib/stores/project-store";
import ProjectTabs from "./view-tabs";
import { CreateBucket } from "../views/kanban/dropdown/create-bucket-dialog";

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="flex flex-col rounded-lg">
      <div className="flex items-center justify-between w-full p-4 pb-3 mx-auto">
        <div className="flex items-center gap-3">
          <div className="border-2 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold">
            {project?.name?.[0]?.toUpperCase()}
          </div>
          <h1 className="text-2xl font-semibold">{project?.name}</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row max-w-7xl justify-between items-start sm:items-center p-4 pt-3 gap-4">
        <ProjectTabs />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CreateBucket projectId={project?.id || ""} />
        </div>
      </div>
    </div>
  );
};
