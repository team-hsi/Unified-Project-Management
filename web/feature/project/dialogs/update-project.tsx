import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/feature/shared/ui/dialog";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProject } from "@/hooks/use-project";
import { projectSchema } from "../shared/schema";
import { NameDescriptionForm } from "@/feature/auth/components/name-description-form";
import { ProjectDialogProps } from "../shared/types";

export const UpdateProjectDialog = ({
  project,
  onOpenChange,
}: ProjectDialogProps) => {
  const defaultValues = {
    name: project.name,
  };
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });
  const { updateProject } = useProject({
    successAction: () => {
      form.reset();
      onOpenChange?.(false);
    },
  });
  const handleSubmit = async (values: {
    name: string;
    description?: string;
  }) => {
    onOpenChange?.(false);
    await updateProject.mutateAsync({ name: values.name, id: project.id });
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
      <NameDescriptionForm
        onSubmit={handleSubmit}
        isPending={updateProject.isPending}
        label="Update"
        defaultValues={defaultValues}
      />
    </DialogContent>
  );
};
