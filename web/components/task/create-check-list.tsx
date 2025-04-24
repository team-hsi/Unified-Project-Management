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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useItemAction } from "@/hooks/use-item";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { CheckList } from "../kanban/types";

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
}: {
  children: React.ReactNode;
  itemId: string;
  currentList: CheckList[] | null;
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
  const { id } = useParams() as { id: string };
  const { updateItemInline } = useItemAction({
    queryKey: ["items", id],
    successAction: () => {
      toast.success("Create", {
        description: "Your checklist has been created.",
      });
      setIsOpen(false);
      reset();
    },
  });

  const onSubmit = async (data: FormValues) => {
    const checklist = [...(currentList ?? []), data];
    try {
      await updateItemInline.mutateAsync({ checklist, id: itemId });
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
            <Button type="submit" disabled={updateItemInline.isPending}>
              {updateItemInline.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
