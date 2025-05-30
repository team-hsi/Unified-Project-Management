"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Milestone } from "@/feature/shared/@types/milestone";

interface DeleteMilestoneProps {
  milestone: Milestone;
  open: boolean;
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function DeleteMilestone({
  milestone,
  open,
  onDelete,
  onOpenChange,
  onClose,
}: DeleteMilestoneProps) {
  const handleDelete = async () => {
    onDelete();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Milestone</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the milestone &quot;{milestone.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
