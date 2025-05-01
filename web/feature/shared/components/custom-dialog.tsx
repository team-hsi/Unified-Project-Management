"use client";
import type * as React from "react";
import { Dialog, DialogTrigger } from "@/feature/shared/ui/dialog";
import { DropdownMenuItem } from "@/feature/shared/ui/dropdown-menu";

interface DialogItemProps {
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const CustomDialog = ({
  triggerChildren,
  children,
  onSelect,
  onOpenChange,
  ...props
}: DialogItemProps) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          {...props}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      {children}
    </Dialog>
  );
};
