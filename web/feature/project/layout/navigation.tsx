"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/feature/shared/ui/breadcrumb";
import { Separator } from "@/feature/shared/ui/separator";
import { SidebarTrigger } from "@/feature/shared/ui/sidebar";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { NavigationControls } from "./nav-controls";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";

import { Workspace } from "@/feature/shared/@types/space";
import { NavUser } from "@/feature/user/nav-user";
import { useProject } from "@/feature/shared/hooks/use-project";
import { Project } from "@/feature/shared/@types/projects";
import { Notification } from "@/feature/notification/components/notification";
// import { ConnectionManager } from "@/feature/notification/connection-manager";

export const ProjectNavigation = () => {
  const { workspaceProjects } = useProject();
  const { userWorkspaces } = useWorkspace();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return (
    <header className="flex sticky top-0 h-12 shrink-0 items-center bg-background justify-between px-4 w-full gap-2 border-b">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <NavigationControls />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              // const isFirst = index === 0
              const isLast = index === segments.length - 1;
              // const href = `/${segments.slice(0, index + 1).join("/")}`;

              return (
                <Fragment key={index}>
                  <BreadcrumbItem className="hidden md:block">
                    {isLast ? (
                      <BreadcrumbPage className=" capitalize">
                        {workspaceProjects.find(
                          (p: Project) => p.id === segment
                        )?.name || segment}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbPage className=" capitalize">
                        {userWorkspaces.find((w: Workspace) => w.id === segment)
                          ?.name || segment}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {/* <ConnectionManager /> */}
      </div>
      <div className="flex items-center gap-2">
        <Notification />
        <NavUser />
      </div>
    </header>
  );
};
