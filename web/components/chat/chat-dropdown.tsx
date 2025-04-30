import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { DeleteChat, LeaveChat } from "@/components/chat/chatheader-actions";

export const ChatDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);

  const handleDialogOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (!open) {
      setIsDropdownOpen(false);
    }
  };

  const handleItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger>
        <span ref={dropdownTriggerRef} className=" hover:text-muted">
          <MoreVertical size={20} />
        </span>
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
      >
        <LeaveChat
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        <DeleteChat
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
