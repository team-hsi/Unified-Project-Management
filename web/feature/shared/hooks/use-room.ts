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
  getUserRooms,
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
  const { session, user } = useUser();
  const { workspaceId, chatId } = useParams<{
    workspaceId: string;
    chatId: string;
  }>();

  // Queries
  const {
    data: userRooms,
    isPending: isPendingRooms,
    error: errorRooms,
  } = useSuspenseQuery({
    queryKey: [session?.userId, "rooms"],
    queryFn: () => getUserRooms(),
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
    mutationFn: async ({ name }: { name: string }) =>
      await createRoom({
        name,
        spaceId: workspaceId,
      }),
    onMutate: async (payload: Pick<RoomPayload, "name">) => {
      await queryClient.cancelQueries({
        queryKey: [session?.userId, "rooms"],
      });
      console.log("seId", session?.userId);
      const previousRooms = queryClient.getQueryData([
        session?.userId,
        "rooms",
      ]);

      queryClient.setQueryData([session?.userId, "rooms"], (old: Room[]) => {
        return [
          ...old,
          {
            id: `temp-${Date.now()}-${Math.random()
              .toString(36)
              .substring(2, 9)}`,
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
        queryKey: [session?.userId, "rooms"],
      });
      if (isValidResponse(response)) {
        toast.success("Room created successfully!");
      }
    },
    onError: (error, variables, context) => {
      if (context?.previousRooms) {
        queryClient.setQueryData(
          [session?.userId, "rooms"],
          context.previousRooms
        );
      }
      queryClient.invalidateQueries({
        queryKey: [session?.userId, "rooms"],
      });
      toastUnknownError(error as BaseError);
    },
  });

  const update = useMutation({
    mutationFn: updateRoom,
    onMutate: async (updatedRoom: { id: string; name: string }) => {
      await queryClient.cancelQueries({ queryKey: [session?.userId, "rooms"] });
      const previousRooms = queryClient.getQueryData([
        session?.userId,
        "rooms",
      ]) as Room[] | undefined;

      // Optimistically update the room in the cache
      queryClient.setQueryData([session?.userId, "rooms"], (old: Room[] = []) =>
        old.map((room) =>
          room.id === updatedRoom.id
            ? { ...room, name: updatedRoom.name }
            : room
        )
      );

      return { previousRooms };
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [session?.userId, "rooms"] });
      if (isValidResponse(response)) {
      }
    },
    onError: (error, updatedRoom, context) => {
      // Rollback to previous rooms if error
      if (context?.previousRooms) {
        queryClient.setQueryData(
          [session?.userId, "rooms"],
          context.previousRooms
        );
      }
      queryClient.invalidateQueries({ queryKey: [session?.userId, "rooms"] });
      toastUnknownError(error as BaseError);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => await deleteRoom({ id }),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [session?.userId, "rooms"] });
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
      queryClient.invalidateQueries({ queryKey: [session?.userId, "rooms"] });
    },
    onError: toastUnknownError,
  });

  // Prefetching
  const prefetchRooms = useCallback(() => {
    if (!session?.userId) return;

    console.log("Prefetching rooms for workspace:", workspaceId);

    return queryClient.prefetchQuery({
      queryKey: [session?.userId, "rooms"],
      queryFn: () => getUserRooms(),
      staleTime: 60000,
    });
  }, [session?.userId, queryClient]);

  return {
    // Queries
    userRooms,
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
