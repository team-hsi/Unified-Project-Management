"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/feature/shared/ui/sidebar";
import { ProjectsSkeleton } from "@/feature/project/shared/skeletons";
import { NavProjects } from "@/feature/project/layout/project-lists";
import { NavMain } from "./nav-menu";
import { SpaceSwitcher } from "../components/workspace/space-switcher";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex items-center justify-between h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <SpaceSwitcher />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <React.Suspense fallback={<ProjectsSkeleton />}>
          <NavProjects />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
