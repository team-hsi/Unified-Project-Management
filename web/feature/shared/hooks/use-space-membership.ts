import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useUser } from "@/lib/auth/auth-provider";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import {
  getUserWorkspaces,
  getWorkspaceMembers,
} from "@/actions/api/workspace/queries";
import {
  inviteWorkspaceMembers,
  updateWorkspaceMemberRole,
} from "@/actions/api/workspace/mutations";
import { useUtils } from "./use-utils";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export const useWorkspace = () => {
  const queryClient = getQueryClient();
  const { session } = useUser();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  // Get user's membership
  const {
    data: userMembership,
    isPending,
    error,
  } = useQuery({
    queryKey: [session?.userId, "workspaces"],
    queryFn: getUserWorkspaces,
    enabled: !!workspaceId,
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

  // Add workspace members mutation
  const inviteMember = useMutation({
    mutationFn: inviteWorkspaceMembers,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
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

  return {
    // Queries
    userMembership,
    isPending,
    error,
    workspaceMembers,
    isLoadingWsMembers,
    errorWsMembers,
    // Mutations
    updateMembership,
    inviteMember,
  };
};
