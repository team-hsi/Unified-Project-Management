"use client";

import React from "react";

import { Edit, MoreHorizontal, Plus, Settings2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/feature/shared/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/feature/shared/ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { CustomDialog } from "@/feature/shared/ui/custom-dialog";
import { useProject } from "@/hooks/use-project";
import { Project } from "@/@types/projects";
import { UpdateProjectDialog } from "../dialogs/update-project";
import { Management } from "../management/management";
import { DeleteProjectDialog } from "../dialogs/delete-project";
import { CreateProjectDialog } from "../dialogs/create-project";

export const NavProjects = () => {
  const { projects, isPending } = useProject();
  const { isMobile } = useSidebar();
  const { workspaceId } = useParams<{ workspaceId: string }>();

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
  if (projects.data.length === 0) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <div className="p-4 text-center text-muted-foreground">
          <p>No projects found.</p>
        </div>
      </SidebarGroup>
    );
  }
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* <ProjectUrlSync /> */}
      <SidebarGroupLabel>Projects {isPending}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.data.map((project: Project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild isActive={segments.includes(project.id)}>
              <Link href={`/${workspaceId}/${project.id}`} prefetch={true}>
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
                <CustomDialog
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
                </CustomDialog>

                <CustomDialog
                  triggerChildren={
                    <>
                      <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Management</span>
                    </>
                  }
                  onSelect={() => handleDialogItemSelect(project.id)}
                  onOpenChange={(open) =>
                    handleDialogItemOpenChange(project.id, open)
                  }
                >
                  <Management project={project} />
                </CustomDialog>

                <DropdownMenuSeparator />

                <CustomDialog
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
                </CustomDialog>
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
