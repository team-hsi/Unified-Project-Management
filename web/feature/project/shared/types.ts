import { Project } from "@/@types/projects";

export interface ProjectDialogProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}
