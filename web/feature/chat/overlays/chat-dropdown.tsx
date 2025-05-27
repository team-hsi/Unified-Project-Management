import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/feature/shared/ui/dropdown-menu";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { LeaveChat } from "./chat-dropdown-items";
import { useUser } from "@/lib/auth/auth-provider";
import { useParams } from "next/navigation";

export const ChatDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusRef = useRef<HTMLElement | null>(null);
  const { chatId } = useParams<{ chatId: string }>();
  const { session } = useUser();

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
        <span ref={dropdownTriggerRef} className=" hover:text-primary">
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
          id={chatId}
          userId={session?.userId as string}
        />
        {/* <DeleteChat
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
