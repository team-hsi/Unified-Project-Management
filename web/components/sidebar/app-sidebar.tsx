"use client";

import * as React from "react";
import { NavMain } from "@/components/sidebar/nav-menu";
import { NavProjects } from "@/components/project/nav-projects";
import { NavUser } from "@/components/user/nav-user";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/actions/project-actions";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: projects } = useSuspenseQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  console.log("projects", projects);
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
        <NavMain items={data.navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
