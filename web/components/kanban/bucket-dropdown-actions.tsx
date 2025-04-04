import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Loader, Plus, Trash2 } from "lucide-react";
import { NameDescriptionForm } from "../form/name-description-form";
import { CustomDialogItem } from "@/components/project/custom-dialog-item";
import { useState } from "react";
import { ColorInput } from "../ui/color-input";
import { useBucketMutation } from "@/hooks/useBucketMutation";

/*
 * Add bucket component
 */
export const AddBucketItem = ({
  bucketId,
  projectId,
  onSelect,
  onOpenChange,
}: {
  bucketId: string;
  projectId: string;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { createBucketItem } = useBucketMutation({
    queryKey: ["buckets", projectId],
  });

  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    await createBucketItem.mutateAsync({ ...values, id: bucketId });
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
          isPending={createBucketItem.isPending}
          label="Add"
        />
      </DialogContent>
    </CustomDialogItem>
  );
};

/*
 * Edit bucket component
 */

export const EditBucket = ({
  onSelect,
  onOpenChange,
}: {
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
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
        <ColorInput />
        <DialogFooter>
          <Button onClick={handleEditBucket} disabled={!bucketName.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialogItem>
  );
};

/*
 * Delete bucket component
 */

export const DeleteBucket = ({
  onSelect,
  onOpenChange,
  bucketId,
  projectId,
}: {
  bucketId: string;
  projectId: string;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { deleteBucket } = useBucketMutation({
    queryKey: ["buckets", projectId],
  });
  const handleDeleteBucket = async () => {
    await deleteBucket.mutateAsync({ id: bucketId });
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
          <Button
            variant="destructive"
            className="flex-1"
            disabled={deleteBucket.isPending}
            onClick={handleDeleteBucket}
          >
            {deleteBucket.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialogItem>
  );
};

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
