import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import {
  // getAllWorkspaces,
  getUserWorkspaces,
  getWorkspaceMembers,
} from "@/actions/api/workspace/queries";
import {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addWorkspaceMembers,
} from "@/actions/api/workspace/mutations";
import { updateUserActiveSpace } from "@/actions/api/user/mutations";
import { toast } from "sonner";

export const useWorkspace = () => {
  const queryClient = getQueryClient();
  const { session } = useUser();

  // Get user's workspaces
  const {
    data: userWorkspaces,
    isPending: isLoadingWs,
    error: errorWs,
  } = useSuspenseQuery({
    queryKey: [session?.userId, "workspaces"],
    queryFn: getUserWorkspaces,
  });

  // Get workspace members
  const {
    data: workspaceMembers,
    isPending: isLoadingWsMembers,
    error: errorWsMembers,
  } = useQuery({
    queryKey: [session?.activeSpace, "ws-members"],
    queryFn: () => getWorkspaceMembers({ id: session?.activeSpace as string }),
    enabled: !!session?.activeSpace,
  });

  // Create workspace mutation
  const create = useMutation({
    mutationFn: createWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
    },
  });

  // Update workspace mutation
  const update = useMutation({
    mutationFn: updateWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
    },
  });

  // Delete workspace mutation
  const remove = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });

  // Add workspace members mutation
  const inviteMember = useMutation({
    mutationFn: addWorkspaceMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
    },
  });

  // mutate active workspace
  const setActive = useMutation({
    mutationFn: updateUserActiveSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session"],
      });
      toast.success("Workspace changed!");
    },
  });

  // Prefetch workspace data
  const prefetchWorkspace = () => {
    queryClient.prefetchQuery({
      queryKey: [session?.userId, "workspaces"],
      queryFn: getUserWorkspaces,
    });
  };

  return {
    // Queries
    userWorkspaces,
    isLoadingWs,
    errorWs,
    workspaceMembers,
    isLoadingWsMembers,
    errorWsMembers,

    // Mutations
    create,
    update,
    remove,
    inviteMember,
    setActive,

    // Utilities
    prefetchWorkspace,
  };
};
