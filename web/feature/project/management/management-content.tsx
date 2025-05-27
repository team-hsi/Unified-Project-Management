"use client";
import type React from "react";

import { ManagementsView } from "./types";
import { LabelsView } from "./labels/labels";
import { PeopleView } from "./people";
import { GeneralView } from "./general";
import type { Project } from "@/feature/shared/@types/projects";

interface ManagementContentProps {
  currentView: ManagementsView;
  project: Project;
}

export const ManagementsContent = ({
  currentView,
  project,
}: ManagementContentProps) => {
  // Map views to components
  const viewComponents: Record<ManagementsView, React.ReactNode> = {
    general: <GeneralView project={project} />,
    people: <PeopleView />,
    labels: <LabelsView project={project} />,
  };

  return viewComponents[currentView || "general"];
};
