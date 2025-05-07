import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getWorkspaceRooms,
  getRoomMembers,
} from "../../../actions/api/room/queries";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  addRoomMember,
  removeRoomMember,
} from "../../../actions/api/room/mutations";
import { useParams } from "next/navigation";
import { Room, RoomPayload } from "../@types/room";
import { useUser } from "@/lib/auth/auth-provider";
import { useCallback } from "react";
import { useUtils } from "./use-utils";
import { BaseError } from "@/lib/errors";

export const useRoom = () => {
  const queryClient = useQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { user } = useUser();
  const { workspaceId, chatId } = useParams<{
    workspaceId: string;
    chatId: string;
  }>();

  // Queries
  const {
    data: rooms,
    isPending: isPendingRooms,
    error: errorRooms,
  } = useSuspenseQuery({
    queryKey: [workspaceId, "rooms"],
    queryFn: () => getWorkspaceRooms({ id: workspaceId }),
  });

  const {
    data: roomMembers,
    isPending: isPendingRoomMembers,
    error: errorRoomMembers,
  } = useQuery({
    queryKey: [chatId, "room-members"],
    queryFn: () => getRoomMembers({ id: chatId }),
    enabled: !!chatId,
  });

  // Mutations
  const create = useMutation({
    mutationFn: ({ name }: { name: string }) =>
      createRoom({ name, spaceId: workspaceId }),
    onMutate: async (payload: Pick<RoomPayload, "name">) => {
      await queryClient.cancelQueries({
        queryKey: [workspaceId, "rooms"],
      });
      const previousRooms = queryClient.getQueryData([workspaceId, "rooms"]);

      queryClient.setQueryData([workspaceId, "rooms"], (old: Room[]) => {
        return [
          ...old,
          {
            id: `temp-${Math.random().toString(36).substring(2, 9)}`,
            name: payload.name,
            type: "GROUP",
            owner: user,
            members: [],
            spaceId: workspaceId,
          },
        ];
      });
      return { previousRooms };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
      if (isValidResponse(response)) {
        toast.success("Room created successfully!");
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousRooms) {
        queryClient.setQueryData([workspaceId, "rooms"], context.previousRooms);
      }
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
      toastUnknownError(error as BaseError);
    },
  });

  const update = useMutation({
    mutationFn: updateRoom,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [workspaceId, "rooms"] });
    },
    onError: toastUnknownError,
  });

  const remove = useMutation({
    mutationFn: async (id: string) =>
      await deleteRoom({ id, spaceId: workspaceId }),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [workspaceId, "rooms"] });
    },
    onError: toastUnknownError,
  });

  const addMember = useMutation({
    mutationFn: addRoomMember,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [chatId, "room-members"] });
    },
    onError: toastUnknownError,
  });

  const removeMember = useMutation({
    mutationFn: removeRoomMember,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [chatId, "room-members"] });
    },
    onError: toastUnknownError,
  });

  // Prefetching
  const prefetchRooms = useCallback(() => {
    if (!workspaceId) return;

    console.log("Prefetching rooms for workspace:", workspaceId);

    return queryClient.prefetchQuery({
      queryKey: [workspaceId, "rooms"],
      queryFn: () => getWorkspaceRooms({ id: workspaceId }),
      staleTime: 60000, // Consider data fresh for 1 minute
    });
  }, [workspaceId, queryClient]);

  return {
    // Queries
    rooms,
    isPendingRooms,
    errorRooms,
    roomMembers,
    isPendingRoomMembers,
    errorRoomMembers,
    // Mutations
    create,
    update,
    remove,
    addMember,
    removeMember,

    // Utilities
    prefetchRooms,
  };
};
