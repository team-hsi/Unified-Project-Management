import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  AddBucketItem,
  ChangeBucketColor,
  DeleteBucket,
} from "./bucket-dropdown-actions";

const BucketDropdown = ({
  bucketId,
  projectId,
  color,
}: {
  bucketId: string;
  projectId: string;
  color: string;
}) => {
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
          bucketId={bucketId}
          projectId={projectId}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        <ChangeBucketColor
          values={{
            id: bucketId,
            projectId: projectId,
            color: color,
          }}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        {/* <EditBucket
          values={{
            id: bucketId,
            projectId: projectId,
            color: color,
          }}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        /> */}
        <DropdownMenuSeparator />
        <DeleteBucket
          bucketId={bucketId}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
          projectId={projectId}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BucketDropdown;
