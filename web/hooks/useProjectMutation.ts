import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProject as createAction,
  deleteProject as deleteAction,
  updateProject as updateAction,
} from "@/actions/project-actions";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useProjectMutation = ({ queryKey, successAction }: HookProps) => {
  const queryClient = getQueryClient();

  const createProject = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      toast.success("Project created successfully!");
      queryClient.invalidateQueries({ queryKey: queryKey || ["projects"] });
      successAction?.();
    },
  });

  const updateProject = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: queryKey || ["projects"] });
      successAction?.();
    },
  });
  const deleteProject = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: queryKey || ["projects"] });
      successAction?.();
    },
  });

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
