import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/feature/shared/ui/dialog";
import { FolderPlus } from "lucide-react";
import { NameDescriptionForm } from "@/feature/auth/components/name-description-form";
import { useProject } from "@/feature/shared/hooks/use-project";

export function CreateProjectDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const { create } = useProject();

  const handleCreate = async (data: { name: string }) => {
    await create.mutateAsync(data);
    setOpen(false);
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
            <FolderPlus className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              Create New Project
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              Fill in the details below to create your new project.
            </DialogDescription>
          </DialogHeader>
        </div>
        <NameDescriptionForm
          onSubmit={handleCreate}
          isPending={create.isPending}
          label="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
