import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createWorkspace as createAction,
  deleteWorkspace as deleteAction,
  updateWorkspace as updateAction,
} from "@/actions/workspace-actions";
import { getUserWorkspaces } from "@/actions/workspace-actions";

export const useWorkspace = (queryKey = ["workspaces", "user"]) => {
  const queryClient = getQueryClient();

  const {
    data: workspaces,
    isPending,
    error,
  } = useSuspenseQuery({
    queryKey,
    queryFn: getUserWorkspaces,
  });

  const createWorkspace = useMutation({
    mutationFn: createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Workspace created successfully!");
    },
  });

  const updateWorkspace = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  const deleteWorkspace = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    workspaces,
    isPending,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
};
