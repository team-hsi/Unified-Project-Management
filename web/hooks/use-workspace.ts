import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  createWorkspace as createAction,
  deleteWorkspace as deleteAction,
  getWorkspaceMembers,
  getWorkspaceProjects,
  updateWorkspace as updateAction,
  updateActiveWorkspace,
} from "@/actions/workspace-actions";
import { getUserWorkspaces } from "@/actions/user-actions";
import { useRouter } from "next/navigation";
import { Session, useUser } from "@/lib/auth/auth-provider";
import { toast } from "sonner";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useWorkspace = (payload?: HookProps) => {
  const queryClient = getQueryClient();

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

  const prefetchWorkspace = (workspace: string) => {
    router.prefetch(`/${workspace}/projects`);

    queryClient.prefetchQuery({
      queryKey: [session?.userId, "workspaces"],
      queryFn: getUserWorkspaces,
    });
    queryClient.prefetchQuery({
      queryKey: [workspace, "projects"],
      queryFn: getWorkspaceProjects,
    });
  };
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
    onMutate: async (payload: { activeSpace: string }) => {
      router.push(`/${payload.activeSpace}/projects`);
      await queryClient.cancelQueries({ queryKey: ["session"] });
      queryClient.setQueryData(["session"], (old: Session) => ({
        ...old,
        activeSpace: payload.activeSpace,
      }));
    },
    onError: (error) => {
      toast.warning(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  const {
    data: members,
    isPending: isPendingMembers,
    error: membersError,
  } = useQuery({
    queryKey: [session?.activeSpace, "members"],
    queryFn: getWorkspaceMembers,
    enabled: !!session?.activeSpace,
  });

  return {
    workspaces,
    prefetchWorkspace,
    isLoading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActive,
    members,
    isPendingMembers,
    membersError,
  };
};
