"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-menu";
import { NavProjects } from "@/components/project/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "../user/team-switcher";
import { data } from "@/lib/data";
import { ProjectsSkeleton } from "../project/skeletons";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex items-center justify-between h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <TeamSwitcher teams={data.teams} />
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
