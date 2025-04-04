import React, { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { NameDescriptionForm } from "../form/name-description-form";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { CustomDialogItem } from "@/components/project/custom-dialog-item";
import { createItem } from "@/actions/item-actions";
import { deleteBucket } from "@/actions/bucket-actions";
const BucketDropdown = ({
  bucketId,
  projectId,
}: {
  bucketId: string;
  projectId: string;
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
        <span ref={dropdownTriggerRef}>
          <MoreHorizontal />
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
        <AddCardDialog
          bucketId={bucketId}
          projectId={projectId}
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        <EditBucketDialog
          onOpenChange={handleDialogOpenChange}
          onSelect={handleItemSelect}
        />
        <DropdownMenuSeparator />
        <DeleteBucketDialog
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

export function AddCardDialog({
  bucketId,
  projectId,
  onSelect,
  onOpenChange,
}: {
  bucketId: string;
  projectId: string;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = getQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      toast.success("Card created successfully!");
      queryClient.invalidateQueries({ queryKey: ["items", projectId] });
    },
  });

  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    await mutateAsync({ ...values, id: bucketId });
  };

  return (
    <CustomDialogItem
      triggerChildren={<DropdownAction icon={Plus} label="Add item" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Card</DialogTitle>
        </DialogHeader>
        <NameDescriptionForm
          onSubmit={handleSubmit}
          isPending={isPending}
          label="Add"
        />
      </DialogContent>
    </CustomDialogItem>
  );
}

export function EditBucketDialog({
  onSelect,
  onOpenChange,
}: {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [bucketName, setBucketName] = useState("");

  const handleEditBucket = () => {
    toast.success(`Bucket renamed to "${bucketName}"`);
    setBucketName("");
  };

  return (
    <CustomDialogItem
      triggerChildren={<DropdownAction icon={Edit} label="Edit Bucket" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bucket</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter new bucket name"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleEditBucket} disabled={!bucketName.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialogItem>
  );
}

export function DeleteBucketDialog({
  onSelect,
  onOpenChange,
  bucketId,
  projectId,
}: {
  bucketId: string;
  projectId: string;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const queryClient = getQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: deleteBucket,
    onSuccess: () => {
      toast.success("Bucket deleted!");
      queryClient.invalidateQueries({ queryKey: ["buckets", projectId] });
    },
  });

  const handleDeleteBucket = async () => {
    await mutateAsync({ id: bucketId });
  };

  return (
    <CustomDialogItem
      triggerChildren={<DropdownAction icon={Trash2} label="Delete Bucket" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to delete this bucket? This action cannot be
          undone.
        </p>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteBucket}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialogItem>
  );
}
const DropdownAction = ({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => (
  <>
    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
    <span>{label}</span>
  </>
);
