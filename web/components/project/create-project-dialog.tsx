import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";
import { NameDescriptionForm } from "../form/name-description-form";
import { useProjectMutation } from "@/hooks/useProjectMutation";

export function CreateProjectDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  const { createProject } = useProjectMutation({
    successAction: () => setOpen(false),
  });

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
          onSubmit={createProject.mutateAsync}
          isPending={createProject.isPending}
          label="Create"
        />
      </DialogContent>
    </Dialog>
  );
}
