import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  createProject as createAction,
  deleteProject as deleteAction,
  updateProject as updateAction,
} from "@/feature/shared/actions/project-actions";
// import { getUserProjects } from "@/actions/user-actions";
import { getWorkspaceProjects } from "@/feature/shared/actions/workspace-actions";
import { useParams } from "next/navigation";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useProject = (payload?: HookProps) => {
  const queryClient = getQueryClient();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const {
    data: projects,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: [workspaceId, "projects"],
    queryFn: getWorkspaceProjects,
  });

  const createProject = useMutation({
    mutationFn: async (data: { name: string }) =>
      await createAction({ ...data, spaceId: workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
      payload?.successAction?.();
    },
  });

  const updateProject = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
      payload?.successAction?.();
    },
  });
  const deleteProject = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "projects"],
      });
      payload?.successAction?.();
    },
  });

  return {
    projects,
    isPending,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
};
