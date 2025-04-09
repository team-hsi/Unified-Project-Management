export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  startDate?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
};

export type PartialProject = Partial<
  Pick<
    Project,
    | "id"
    | "name"
    | "description"
    | "startDate"
    | "dueDate"
    | "priority"
    | "status"
  >
>;

export interface ProjectDialogProps {
  project: Project;
  onOpenChange?: (open: boolean) => void;
}
