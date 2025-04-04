"use client";

import React from "react";

import { Edit, MoreHorizontal, Plus, Share, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { Project } from "./types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProjects } from "@/actions/project-actions";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateProjectDialog } from "./create-project-dialog";
import { CustomDialogItem } from "./custom-dialog-item.tsx";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { UpdateProjectDialog } from "./update-project-dialog";

export const NavProjects = () => {
  const { data: projects } = useSuspenseQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // State for managing dropdown and dialog focus
  const [openDropdowns, setOpenDropdowns] = React.useState<
    Record<string, boolean>
  >({});
  const [hasOpenDialog, setHasOpenDialog] = React.useState<
    Record<string, boolean>
  >({});
  const dropdownTriggerRefs = React.useRef<
    Map<string, HTMLButtonElement | null>
  >(new Map());
  const focusRefs = React.useRef<Map<string, HTMLButtonElement | null>>(
    new Map()
  );

  const handleDialogItemSelect = (projectId: string) => {
    focusRefs.current.set(
      projectId,
      dropdownTriggerRefs.current.get(projectId) || null
    );
  };

  const handleDialogItemOpenChange = (projectId: string, open: boolean) => {
    setHasOpenDialog((prev) => ({ ...prev, [projectId]: open }));
    if (open === false) {
      setOpenDropdowns((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project: Project) => (
          <SidebarMenuItem key={project.id || project.name}>
            <SidebarMenuButton
              asChild
              isActive={segments.includes(project.id)}
            >
              <Link href={`/projects/${project.id}`}>
                {project.name}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu
              open={openDropdowns[project.id]}
              onOpenChange={(open) =>
                setOpenDropdowns((prev) => ({ ...prev, [project.id]: open }))
              }
            >
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  ref={(el) => {
                    dropdownTriggerRefs.current.set(project.id, el);
                  }}
                >
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                hidden={hasOpenDialog[project.id]}
                onCloseAutoFocus={(event) => {
                  const focusRef = focusRefs.current.get(project.id);
                  if (focusRef) {
                    focusRef.focus();
                    focusRefs.current.delete(project.id);
                    event.preventDefault();
                  }
                }}
              >
                <CustomDialogItem
                  triggerChildren={
                    <>
                      <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Edit Project</span>
                    </>
                  }
                  onSelect={() => handleDialogItemSelect(project.id)}
                  onOpenChange={(open) =>
                    handleDialogItemOpenChange(project.id, open)
                  }
                >
                  <UpdateProjectDialog
                    project={project}
                    onOpenChange={(open) =>
                      handleDialogItemOpenChange(project.id, open)
                    }
                  />
                </CustomDialogItem>

                <DropdownMenuItem>
                  <Share className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <CustomDialogItem
                  triggerChildren={
                    <>
                      <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Delete Project</span>
                    </>
                  }
                  onSelect={() => handleDialogItemSelect(project.id)}
                  onOpenChange={(open) =>
                    handleDialogItemOpenChange(project.id, open)
                  }
                >
                  <DeleteProjectDialog
                    project={project}
                    onOpenChange={(open) =>
                      handleDialogItemOpenChange(project.id, open)
                    }
                  />
                </CustomDialogItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <CreateProjectDialog>
            <SidebarMenuButton>
              <Plus />
              <span>Create New</span>
            </SidebarMenuButton>
          </CreateProjectDialog>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};
