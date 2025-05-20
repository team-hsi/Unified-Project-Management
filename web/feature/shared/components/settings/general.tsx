"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { Button } from "@/feature/shared/ui/button";
import { Textarea } from "@/feature/shared/ui/textarea";
import { AlertCircle, Globe, Lock } from "lucide-react";
import { Workspace } from "../../@types/space";
import { DeleteWorkSpace } from "@/feature/workspace/overlays/delete-space";
import { useWorkspace } from "../../hooks/use-workspace";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/feature/shared/ui/form";
import { ActionButton } from "../action-button";

const workspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"]),
});

export function GeneralView({ workspace }: { workspace: Workspace }) {
  const { update } = useWorkspace();

  const form = useForm<z.infer<typeof workspaceSchema>>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace.name,
      description: workspace.description ?? "",
      visibility: workspace.visibility,
    },
  });

  const onSubmit = async (data: z.infer<typeof workspaceSchema>) => {
    await update.mutateAsync({
      id: workspace.id,
      ...data,
    });
  };

  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">General</DialogTitle>
        <DialogDescription>
          Manage general workspace settings.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Workspace Information</h3>

            <div className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className=" shadow-none w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your workspace..."
                        className="min-h-[100px] resize-none shadow-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full shadow-none">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="shadow-none">
                        <SelectItem
                          value="private"
                          className="flex items-center gap-2"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Private</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            Only members can access
                          </span>
                        </SelectItem>
                        <SelectItem
                          value="public"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          <span>Public</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            Anyone can view
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <ActionButton
              isLoading={update.isPending}
              label="Save Changes"
              type="submit"
            />
          </div>
        </form>
      </Form>

      <Separator className="my-6" />

      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <div className="mt-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-medium text-destructive">
                  Delete Workspace
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Permanently delete your workspace and all of its contents.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <DeleteWorkSpace workspace={workspace}>
              <Button
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Workspace
              </Button>
            </DeleteWorkSpace>
          </div>
        </div>
      </div>
    </div>
  );
}
