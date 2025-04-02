export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type PartialProject = Partial<
  Pick<Project, "id" | "name" | "description">
>;

export interface ProjectDialogProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}
