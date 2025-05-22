"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogTrigger,
} from "@/feature/shared/ui/dialog";
import { Button } from "@/feature/shared/ui/button";
import { Input } from "@/feature/shared/ui/input";
import { Loader } from "lucide-react";
import type { Project } from "@/feature/shared/@types/projects";
import { useProject } from "@/feature/shared/hooks/use-project";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { projectSchema } from "../shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/feature/shared/ui/form";
import { DeleteProjectDialog } from "../overlays/delete-project";
import { Card } from "@/feature/shared/ui/card";

export function GeneralView({ project }: { project: Project }) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
    },
  });
  const { update } = useProject();

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    await update.mutateAsync({ name: values.name, id: project.id });
    form.reset(values);
  };
  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="text-xl font-semibold">
          Project Profile
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Manage project profile for {project.name}.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* Project Avatar and Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground">Project avatar</p>
            </div>
          </div>
        </div>

        {/* Project Details Form */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20 shadow-none">
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="px-2">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={project.name || "Enter name..."}
                            disabled={update.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      className="hover:bg-accent/5"
                      onClick={() => form.reset()}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-24 bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={update.isPending}
                    >
                      {update.isPending ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </Card>

        <div className="pt-6 border-t">
          <h3 className="text-base font-medium mb-4">Danger Zone</h3>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-red-800 mb-1">
              Delete this project
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Once you delete a project, there is no going back. Please be
              certain.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Delete project
                </Button>
              </DialogTrigger>
              <DeleteProjectDialog project={project} />
            </Dialog>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
