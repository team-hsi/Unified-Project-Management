import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProject as createAction,
  deleteProject as deleteAction,
  getProjects,
  updateProject as updateAction,
} from "@/actions/project-actions";

interface HookProps {
  queryKey?: string[];
}
export const useProjectAction = ({
  queryKey = ["projects", "user"],
}: HookProps) => {
  const queryClient = getQueryClient();

  const { data: projects } = useSuspenseQuery({
    queryKey,
    queryFn: getProjects,
  });

  const createProject = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Project created successfully!");
    },
  });

  const updateProject = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
  });
  const deleteProject = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
};
