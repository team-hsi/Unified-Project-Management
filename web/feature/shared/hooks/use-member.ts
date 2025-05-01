import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addWorkspaceMembers,
  deleteWorkspace as deleteAction,
  getWorkspaceMembers,
  getWorkspaceProjects,
} from "@/feature/shared/actions/workspace-actions";
import { getUserWorkspaces } from "@/feature/shared/actions/user-actions";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/lib/auth/auth-provider";
import {
  addRoomMember,
  getRoomMembers,
  removeRoomMember,
} from "@/feature/shared/actions/room-actions";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useMember = (payload?: HookProps) => {
  const queryClient = getQueryClient();
  const { chatId } = useParams<{ chatId: string }>();

  const router = useRouter();
  const { session } = useUser();

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
  const {
    data: space,
    isPending,
    error,
  } = useQuery({
    queryKey: [session?.activeSpace, "ws-members"],
    queryFn: getWorkspaceMembers,
    enabled: !!session?.activeSpace,
  });

  const inviteMember = useMutation({
    mutationFn: addWorkspaceMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
      payload?.successAction?.();
    },
  });
  const {
    data: chatMembers,
    isPending: isChatMembersPending,
    error: chatError,
  } = useQuery({
    queryKey: [chatId, "chat-members"],
    queryFn: () => getRoomMembers({ id: chatId }),
    enabled: !!chatId,
  });

  const addChatMember = useMutation({
    mutationFn: addRoomMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [chatId, "chat-members"],
      });
      payload?.successAction?.();
    },
  });

  const removeChatMember = useMutation({
    mutationFn: removeRoomMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [chatId, "chat-members"],
      });
      payload?.successAction?.();
    },
  });
  const removeSpaceMember = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [session?.activeSpace, "ws-members"],
      });
      payload?.successAction?.();
    },
  });

  return {
    prefetchWorkspace,
    inviteMember,
    removeSpaceMember,
    space,
    isPending,
    error,
    chatMembers,
    isChatMembersPending,
    chatError,
    addChatMember,
    removeChatMember,
  };
};
