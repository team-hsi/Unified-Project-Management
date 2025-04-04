import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { projectSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectDialogProps } from "./types";
import { z } from "zod";
import { useProjectMutation } from "@/hooks/useProjectMutation";
import { NameDescriptionForm } from "../form/name-description-form";

export const UpdateProjectDialog = ({
  project,
  onOpenChange,
}: ProjectDialogProps) => {
  const defaultValues = {
    name: project.name,
    description: project.description || "",
    id: project.id,
  };
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });
  const { updateProject } = useProjectMutation({
    successAction: () => {
      form.reset();
      onOpenChange?.(false);
    },
  });
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
      <NameDescriptionForm
        onSubmit={updateProject.mutateAsync}
        isPending={updateProject.isPending}
        label="Update"
        defaultValues={defaultValues}
      />
    </DialogContent>
  );
};
