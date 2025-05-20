import { Button } from "@/feature/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Workspace } from "@/feature/shared/@types/space";
import { DeleteSpaceSchema, DeleteSpaceValues } from "../shared/schema";
import { useWorkspace } from "@/feature/shared/hooks/use-workspace";

export const DeleteWorkSpace = ({
  workspace,
  children,
}: {
  workspace: Workspace;
  children: React.ReactNode;
}) => {
  const form = useForm<DeleteSpaceValues>({
    resolver: zodResolver(DeleteSpaceSchema(workspace.name)),
    defaultValues: {
      name: "",
    },
  });

  const { remove } = useWorkspace();

  const onSubmit = async () => {
    await remove.mutateAsync(workspace.id);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
                &quot;{workspace.name}&quot;
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
                    <FormLabel className="px-2">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="workspace name..."
                        disabled={remove.isPending}
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
                disabled={remove.isPending}
              >
                {remove.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
