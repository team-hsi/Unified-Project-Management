import React, { useState } from "react"; // Import useState
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Checkbox } from "@/feature/shared/ui/checkbox";
import { Label } from "@/feature/shared/ui/label";
import type { CheckList } from "@/feature/shared/@types/check-list";
import { useItem } from "@/feature/shared/hooks/use-item";

const checkListSchema = z.object({
  description: z
    .string()
    .min(6, { message: "Description must be at least 6 characters long" }),
  isCompleted: z.boolean(),
});

type FormValues = z.infer<typeof checkListSchema>;

export const CreateCheckList = ({
  itemId,
  children,
  currentList,
  setCheckList,
  bucketId,
  projectId,
}: {
  children: React.ReactNode;
  itemId: string;
  bucketId: string;
  projectId: string;
  currentList: CheckList[] | null;
  setCheckList: (list: CheckList[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(checkListSchema),
    defaultValues: {
      description: "",
      isCompleted: false,
    },
  });
  const { update } = useItem(itemId);

  const onSubmit = async (data: FormValues) => {
    const checklist = [...(currentList ?? []), data];
    try {
      setCheckList(checklist);
      setIsOpen(false);
      await update.mutateAsync({ checklist, id: itemId, bucketId, projectId });
      reset();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Checklist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input placeholder="Description" {...field} />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Controller
              name="isCompleted"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isCompleted"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
              )}
            />
            <Label htmlFor="isCompleted">Completed</Label>{" "}
            {/* Use Label component */}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>{" "}
            {/* Optional Cancel Button */}
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
