import { Button } from "@/feature/shared/ui/button";
import {
  DialogClose,
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
import { CircleAlert, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProject } from "@/feature/shared/hooks/use-project";
import { ProjectDialogProps } from "../shared/types";

export const DeleteProjectDialog = ({
  project,
  onOpenChange,
}: ProjectDialogProps) => {
  const projectDeleteSchema = z.object({
    name: z
      .string()
      .min(1, "Project name is required")
      .refine((value) => value === project.name, {
        message: "Project name does not match",
      }),
  });

  const form = useForm<z.infer<typeof projectDeleteSchema>>({
    resolver: zodResolver(projectDeleteSchema),
    defaultValues: {
      name: "",
    },
  });

  const { deleteProject } = useProject({
    successAction: () => {
      form.reset();
      onOpenChange?.(false);
    },
  });

  const onSubmit = async () => {
    await deleteProject.mutateAsync({ id: project.id });
  };

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
          aria-hidden="true"
        >
          <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Final confirmation
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            This action cannot be undone. To confirm, please enter
            <span className="text-foreground italic font-medium">
              &quot;{project.name}&quot;
            </span>
            .
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
                      disabled={deleteProject.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={deleteProject.isPending}
            >
              {deleteProject.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
