"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/feature/shared/ui/sidebar";
import { ProjectsSkeleton } from "@/feature/project/shared/skeletons";
import { NavProjects } from "@/feature/project/layout/project-lists";
import { NavMain } from "./nav-menu";
import { SpaceSwitcher } from "../../workspace/space-switcher";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <React.Suspense fallback={<ProjectsSkeleton />}>
        <SidebarHeader>
          <SpaceSwitcher />
          <NavMain />
        </SidebarHeader>
        <SidebarContent>
          <NavProjects />
        </SidebarContent>
      </React.Suspense>
      <SidebarRail />
    </Sidebar>
  );
};
