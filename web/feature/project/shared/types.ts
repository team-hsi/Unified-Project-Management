import { Project } from "@/feature/shared/@types/projects";
import { itemFormSchema } from "@/feature/project/shared/schema";
import { z } from "zod";

export interface ProjectDialogProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}

export type ItemFormValues = z.infer<typeof itemFormSchema>;
