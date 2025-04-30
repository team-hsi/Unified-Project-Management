import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getWorkspaceRooms } from "@/actions/workspace-actions";
import {
  createRoom as createAction,
  deleteRoom as deleteAction,
  updateRoomById,
} from "@/actions/room-actions";
import { useParams } from "next/navigation";
import { Room, RoomPayload } from "@/@types/room";
import { useUser } from "@/lib/auth/auth-provider";
import { toast } from "sonner";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useRoom = (payload?: HookProps) => {
  const queryClient = getQueryClient();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const { user } = useUser();

  const {
    data: rooms,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey: [workspaceId, "rooms"],
    queryFn: () => getWorkspaceRooms({ id: workspaceId }),
  });

  const createRoom = useMutation({
    mutationFn: createAction,
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
      toast.info(
        `error.message
        ${JSON.stringify(error)},
        ${JSON.stringify(variables)}`
      );
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
      payload?.successAction?.();
    },
  });

  const updateRoom = useMutation({
    mutationFn: updateRoomById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
      payload?.successAction?.();
    },
  });
  const deleteRoom = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
      payload?.successAction?.();
    },
  });

  return {
    rooms,
    isPending,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
