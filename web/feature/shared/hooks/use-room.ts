import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getWorkspaceRooms, getRoomMembers } from "../actions/api/room/queries";
import {
  createRoom,
  updateRoom,
  deleteRoom,
  addRoomMember,
  removeRoomMember,
} from "../actions/api/room/mutations";
import { useParams } from "next/navigation";
import { Room, RoomPayload } from "../@types/room";
import { useUser } from "@/lib/auth/auth-provider";

export const useRoom = () => {
  const queryClient = useQueryClient();
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
    onError: (error, variables, context) => {
      if (context?.previousRooms) {
        queryClient.setQueryData([workspaceId, "rooms"], context.previousRooms);
      }
      toast.error(JSON.stringify(error));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
      toast.success("Room created successfully!");
    },
  });

  const update = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [workspaceId, "rooms"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [workspaceId, "rooms"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addMember = useMutation({
    mutationFn: addRoomMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatId, "room-members"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeMember = useMutation({
    mutationFn: removeRoomMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatId, "room-members"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Prefetching
  const prefetchRooms = async () => {
    queryClient.prefetchQuery({
      queryKey: [workspaceId, "rooms"],
      queryFn: () => getWorkspaceRooms({ id: workspaceId }),
      staleTime: 60000,
    });
  };

  // const pefetchChat = () => {
  //         queryClient.prefetchQuery({
  //           queryKey: [chatId, "chat"],
  //           queryFn: () => getRoomMessages({ id: chatId }),
  //         });
  //       };

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
