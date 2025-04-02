import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Loader, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { projectSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { updateProject } from "@/actions/project-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { Textarea } from "../ui/textarea";
import type { ProjectDialogProps } from "./types";
import { z } from "zod";

export const UpdateProjectDialog = ({
  project,
  onOpenChange,
}: ProjectDialogProps) => {
  const queryClient = getQueryClient();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      form.reset();
      onOpenChange?.(false);
    },
  });
  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    mutateAsync({ ...values, id: project.id });
  };

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          <Pencil className="opacity-80" size={16} strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">Edit Project</DialogTitle>
          <DialogDescription className="sm:text-center">
            Make changes to your project here.
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
                  <FormLabel className="px-2">name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=" project name..."
                      disabled={isPending}
                      {...field}
                    />
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
                  <FormLabel className="px-2">description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="project description..."
                      className="h-9 min-h-[36px] resize-y"
                      disabled={isPending}
                      {...field}
                    />
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
                  <span>Creating Project...</span>
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
