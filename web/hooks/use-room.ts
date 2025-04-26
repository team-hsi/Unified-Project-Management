import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getWorkspaceRooms } from "@/actions/workspace-actions";
import {
  createRoom as createAction,
  deleteRoom as deleteAction,
  updateRoomById,
} from "@/actions/room-actions";
import { useParams } from "next/navigation";

interface HookProps {
  queryKey?: string[];
  successAction?: () => void;
}
export const useRoom = (payload?: HookProps) => {
  const queryClient = getQueryClient();
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const {
    data: rooms,
    isPending,
    isFetching,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: [workspaceId, "rooms"],
    queryFn: () => getWorkspaceRooms({ id: workspaceId }),
  });

  const createRoom = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [workspaceId, "rooms"],
      });
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
    isFetching,
    isError,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
