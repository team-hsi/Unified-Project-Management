"use client";
import type * as React from "react";
import { DropdownMenuItem } from "@/feature/shared/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "./alert-dialog";

interface DialogItemProps {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const CustomAlertDialog = ({
  triggerChildren,
  children,
  onSelect,
  onOpenChange,
  ...props
}: DialogItemProps) => {
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          {...props}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      {children}
    </AlertDialog>
  );
};
