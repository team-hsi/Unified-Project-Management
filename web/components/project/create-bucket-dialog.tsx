
"use client";

import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { z } from "zod";

// Define the schema for bucket creation
const bucketSchema = z.object({
  name: z.string().min(1, "Bucket name is required"),
  description: z.string().optional(),
});

// API function to create a bucket
const createBucket = async (data: { projectId: string; values: z.infer<typeof bucketSchema> }) => {
  const { projectId, values } = data;
  try {
    const response = await fetch(
      "https://unified-project-management-api.onrender.com/v1/buckets/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          name: values.name,
          description: values.description || "",
          projectId,
        }),
      }
    );

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create bucket");
    }

    return responseData; // Return the full response, e.g., { id, name, project, createdAt, updatedAt }
  } catch (error) {
    throw new Error((error as Error).message || "An unexpected error occurred");
  }
};

interface CreateBucketDialogProps {
  children: React.ReactNode;
  projectId: string;
}

export function CreateBucketDialog({ children, projectId }: CreateBucketDialogProps) {
  const [open, setOpen] = React.useState(false);
  const queryClient = getQueryClient();
  const form = useForm<z.infer<typeof bucketSchema>>({
    resolver: zodResolver(bucketSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof bucketSchema>) => createBucket({ projectId, values }),
    onSuccess: () => {
      toast.success("Bucket created successfully!");
      queryClient.invalidateQueries({ queryKey: ["buckets", projectId] }); 
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to create bucket: " + error.message);
    },
  });

  const onSubmit = (values: z.infer<typeof bucketSchema>) => {
    mutateAsync(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <LayoutGrid className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Create New Bucket</DialogTitle>
            <DialogDescription className="sm:text-center">
              Fill in the details below to create your new bucket.
            </DialogDescription>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="px-2">Bucket Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bucket name..." disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex flex-row gap-2 mt-5">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    <span>Creating Bucket...</span>
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}