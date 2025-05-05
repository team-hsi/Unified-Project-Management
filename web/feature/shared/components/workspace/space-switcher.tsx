"use client";
import * as React from "react";
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/feature/shared/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/feature/shared/ui/sidebar";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";
import type { Workspace } from "@/feature/shared/@types/space";
import { AddSpaceDialog } from "./add-space";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";

export const SpaceSwitcher = () => {
  const { isMobile } = useSidebar();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { userWorkspaces } = useWorkspace();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false);
  const focusRef = React.useRef<HTMLElement | null>(null);
  const dropdownTriggerRef = React.useRef<HTMLButtonElement | null>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (!open) {
      setIsDropdownOpen(false);
    }
  };
  const activeWorkspace = userWorkspaces?.find(
    (space: Workspace) => space.id === workspaceId
  );
  if (!activeWorkspace) {
    return notFound();
  }
  const handleMenuItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild ref={dropdownTriggerRef}>
            <SidebarMenuButton
              size="lg"
              className="bg-background data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace.name}
                </span>
                <span className="truncate text-xs">
                  {activeWorkspace.visibility}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            hidden={hasOpenDialog}
            onCloseAutoFocus={(event) => {
              if (focusRef.current) {
                focusRef.current.focus();
                focusRef.current = null;
                event.preventDefault();
              }
            }}
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Workspace
            </DropdownMenuLabel>
            {userWorkspaces?.map((space: Workspace, index: number) => {
              return (
                <Link
                  key={space.id}
                  href={`/${space.id}/projects`}
                  prefetch={true}
                >
                  <DropdownMenuItem
                    // onMouseEnter={() => prefetchWorkspace(space.id)}
                    // onFocus={() => prefetchWorkspace(space.id)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      <GalleryVerticalEnd className="size-4 shrink-0" />
                    </div>
                    {space.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              );
            })}
            <DropdownMenuSeparator />
            <AddSpaceDialog
              onOpenChange={handleDialogOpenChange}
              onSelect={handleMenuItemSelect}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Workspace
              </div>
            </AddSpaceDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
