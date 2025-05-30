import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import {
  getUserWorkspaces,
  getWorkspaceMembers,
} from "@/actions/api/workspace/queries";
import {
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteWorkspaceMembers,
  updateWorkspaceMemberRole,
  removeWorkspaceMembers,
} from "@/actions/api/workspace/mutations";
import { updateUserActiveSpace } from "@/actions/api/user/mutations";
import { useUtils } from "./use-utils";
import { toast } from "sonner";
import { redirect, useRouter } from "next/navigation";

export const useWorkspace = () => {
  const queryClient = getQueryClient();
  const { session } = useUser();
  const router = useRouter();
  const { isValidResponse, toastUnknownError } = useUtils();

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
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      if ("id" in response) {
        router.push(`${response.id}/projects`);
        toast.success("Workspace created successfully!");
      }
    },
    onError: toastUnknownError,
  });

  // Update workspace mutation
  const update = useMutation({
    mutationFn: updateWorkspace,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      toast.success("Workspace updated successfully!");
    },
    onError: toastUnknownError,
  });

  // Delete workspace mutation
  const remove = useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      redirect("/select-workspace");
    },
    onError: toastUnknownError,
  });

  // Add workspace members mutation
  const inviteMember = useMutation({
    mutationFn: inviteWorkspaceMembers,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
      // toast.success("Update", {
      //   description: "Member added successfully!",
      // });
    },
    onError: toastUnknownError,
  });

  // Update member role mutation
  const updateMembership = useMutation({
    mutationFn: updateWorkspaceMemberRole,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
      toast.success("Update", {
        description: "user role update successfully!",
      });
    },
    onError: toastUnknownError,
  });

  // Remove member mutation
  const removeMember = useMutation({
    mutationFn: removeWorkspaceMembers,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "workspaces"],
      });
      toast.success("Delete", {
        description: "user removed successfully!",
      });
    },
    onError: toastUnknownError,
  });

  // mutate active workspace
  const setActive = useMutation({
    mutationFn: updateUserActiveSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["session"],
      });
      // toast.success("Workspace changed!");
    },
    onError: toastUnknownError,
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
    updateMembership,
    removeMember,
    setActive,

    // Utilities
    prefetchWorkspace,
  };
};
