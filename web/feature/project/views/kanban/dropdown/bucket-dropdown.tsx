import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/feature/shared/ui/dropdown-menu";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  AddBucketItem,
  ChangeBucketColor,
  DeleteBucket,
} from "./bucket-dropdown-actions";
import { Bucket } from "@/@types/bucket";

export const BucketDropdown = ({ bucket }: { bucket: Bucket }) => {
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
          <MoreHorizontal size={16} />
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
        <AddBucketItem
          bucket={bucket}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        <ChangeBucketColor
          bucket={bucket}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        {/* <EditBucket
          bucket={bucket}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        /> */}
        <DropdownMenuSeparator />
        <DeleteBucket
          bucket={bucket}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
