import { Button } from "@/feature/shared/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/feature/shared/ui/dialog";
import { Loader, Palette, Plus, Trash2 } from "lucide-react";
import { CustomDialog } from "@/feature/shared/components/custom-dialog";
import { useState } from "react";
import { ColorInput } from "@/feature/shared/ui/color-input";
import { useBucketAction } from "@/feature/shared/hooks/use-bucket";
import { stringToColor, cn } from "@/lib/utils";
import { useItemAction } from "@/feature/shared/hooks/use-item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/feature/shared/ui/popover";
import { Bucket } from "@/feature/shared/@types/bucket";
import { NameDescriptionForm } from "@/feature/auth/components/name-description-form";

/*
 * Add Item
 */
export const AddBucketItem = ({
  bucket,
  onSelect,
  onOpenChange,
}: {
  bucket: Bucket;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { createItem } = useItemAction({
    queryKey: [bucket.project.id, "items"],
  });

  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    onOpenChange?.(false);
    await createItem.mutateAsync({ ...values, bucketId: bucket.id });
  };

  return (
    <CustomDialog
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
    </CustomDialog>
  );
};

/*
 * Edit bucket
 */

export const ChangeBucketColor = ({
  bucket,
  onSelect,
  onOpenChange,
}: {
  bucket: Bucket;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [color, setColor] = useState<string>(
    bucket.color || stringToColor(bucket.id)
  );
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const { updateBucket } = useBucketAction({
    queryKey: [bucket.project.id, "buckets"],
  });

  return (
    <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2 py-1.5 h-auto text-sm font-normal"
          onClick={() => setColorPopoverOpen(true)}
        >
          <div className="flex items-center gap-2">
            <div
              className={cn("h-4 w-4 rounded-full")}
              style={{ backgroundColor: color }}
            />
            <span>Change Color</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-64 p-2"
        onSelect={onSelect}
      >
        <div className="space-y-2">
          <ColorInput onChange={setColor} defaultValue={color} />
          <Button
            onClick={async () => {
              onOpenChange?.(false);
              await updateBucket.mutateAsync({
                id: bucket.id,
                name: bucket.name,
                color,
              });
            }}
            disabled={updateBucket.isPending || color === bucket.color}
          >
            {updateBucket.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Change Color"
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const EditBucket = ({
  bucket,
  onSelect,
  onOpenChange,
}: {
  bucket: Bucket;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [color, setColor] = useState<string>(
    bucket.color || stringToColor(bucket.id)
  );
  const { updateBucket } = useBucketAction({
    queryKey: [bucket.project.id, "buckets"],
  });

  return (
    <CustomDialog
      triggerChildren={<DropdownAction icon={Palette} label="Change Color" />}
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
            onClick={async () => {
              onOpenChange?.(false);
              await updateBucket.mutateAsync({
                id: bucket.id,
                name: bucket.name,
                color,
              });
            }}
            disabled={updateBucket.isPending || color === bucket.color}
          >
            {updateBucket.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Change Color"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </CustomDialog>
  );
};

/*
 * Delete bucket
 */

export const DeleteBucket = ({
  onSelect,
  onOpenChange,
  bucket,
}: {
  bucket: Bucket;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}) => {
  const { deleteBucket } = useBucketAction({
    queryKey: [bucket.project.id, "buckets"],
  });
  const handleDeleteBucket = async () => {
    onOpenChange?.(false);
    await deleteBucket.mutateAsync({ id: bucket.id });
  };

  return (
    <CustomDialog
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
    </CustomDialog>
  );
};

export const DropdownAction = ({
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
