import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  createWorkspace as createAction,
  deleteWorkspace as deleteAction,
  getActiveWorkspace,
  updateWorkspace as updateAction,
  updateActiveWorkspace,
} from "@/actions/workspace-actions";
import { getUserWorkspaces } from "@/actions/user-actions";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/lib/auth/auth-provider";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useWorkspace = (payload?: HookProps) => {
  const queryClient = getQueryClient();
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const router = useRouter();
  const { session } = useUser();

  const {
    data: workspaces,
    isPending: isLoading,
    error: error,
  } = useSuspenseQuery({
    queryKey: [session?.userId, "workspaces"],
    queryFn: getUserWorkspaces,
  });

  const createWorkspace = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      payload?.successAction?.();
    },
  });

  const updateWorkspace = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      payload?.successAction?.();
    },
  });
  const deleteWorkspace = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      payload?.successAction?.();
    },
  });
  const setActive = useMutation({
    mutationFn: updateActiveWorkspace,
    onSuccess: (data) => {
      router.push(`/${data.data.id}/projects`);
      // queryClient.invalidateQueries({ queryKey: [workspaceId, "projects"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
      queryClient.invalidateQueries({ queryKey: ["activeSpace"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
  const { data: activeSpace } = useQuery({
    queryKey: ["activeSpace"],
    queryFn: getActiveWorkspace,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return {
    workspaces,
    isLoading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActive,
    activeSpace,
  };
};
