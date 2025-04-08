import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Loader, Palette, Plus, Trash2 } from "lucide-react";
import { NameDescriptionForm } from "../form/name-description-form";
import { CustomDialogItem } from "@/components/project/custom-dialog-item";
import { useState } from "react";
import { ColorInput } from "../ui/color-input";
import { useBucketAction } from "@/hooks/use-bucket";
import stringToColor from "@/lib/utils";
import { useItemAction } from "@/hooks/use-item";

/*
 * Add Item
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
  const { createItem } = useItemAction({
    queryKey: ["items", projectId],
  });

  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    onOpenChange?.(false);
    await createItem.mutateAsync({ ...values, id: bucketId });
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
          isPending={createItem.isPending}
          label="Add"
        />
      </DialogContent>
    </CustomDialogItem>
  );
};

/*
 * Edit bucket
 ! currently not working due to Api endpoint not being implemented for color property
 */
//Todo: add color picker and implement this component

export const EditBucket = ({
  values,
  onSelect,
  onOpenChange,
}: {
  values: { id: string; projectId: string; color?: string };
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [color, setColor] = useState<string>(
    values.color || stringToColor(values.id)
  );
  const { updateBucket } = useBucketAction({
    queryKey: ["buckets", values.projectId],
    successAction: () => {
      toast.success("Bucket updated successfully!");
      onOpenChange?.(false);
    },
  });

  return (
    <CustomDialogItem
      triggerChildren={<DropdownAction icon={Edit} label="Edit Bucket" />}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <Palette className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Change Bucket Color
            </DialogTitle>
          </DialogHeader>
        </div>
        <ColorInput onChange={setColor} defaultValue={color} />
        <DialogFooter>
          <Button
            onClick={() => {
              updateBucket.mutateAsync({
                id: values.id,
                color,
              });
            }}
            disabled={updateBucket.isPending || color === values.color}
          >
            {updateBucket.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Change Color"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialogItem>
  );
};

/*
 * Delete bucket
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
  const { deleteBucket } = useBucketAction({
    queryKey: ["buckets", projectId],
  });
  const handleDeleteBucket = async () => {
    // onOpenChange?.(false);
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
