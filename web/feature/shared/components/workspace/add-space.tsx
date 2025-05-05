import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/feature/shared/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/feature/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/feature/shared/ui/form";
import { Input } from "@/feature/shared/ui/input";
import { Textarea } from "@/feature/shared/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";
import { CustomDialog } from "../custom-dialog";

// Define the validation schema using Zod
const spaceFormSchema = z.object({
  name: z.string().min(2, {
    message: "Space name must be at least 2 characters.",
  }),
  description: z.string().optional(), // Description is optional
});

// Infer the type from the schema
type SpaceFormValues = z.infer<typeof spaceFormSchema>;

interface AddSpaceDialogProps {
  children: React.ReactNode;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function AddSpaceDialog({
  children,
  onSelect,
  onOpenChange,
}: AddSpaceDialogProps) {
  const form = useForm<SpaceFormValues>({
    resolver: zodResolver(spaceFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { create } = useWorkspace();

  async function onSubmit(values: SpaceFormValues) {
    await create.mutateAsync(values);
    form.reset();
    onOpenChange?.(false);
  }

  return (
    <CustomDialog
      triggerChildren={children}
      onOpenChange={onOpenChange}
      onSelect={onSelect}
    >
      <DialogContent className="sm:max-w-[425px] top-[40%] translate-y-[-40%]">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Fill in the details for your new space below. Click save when done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Marketing Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose or goals of this space"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Space"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </CustomDialog>
  );
}
