import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectLabels } from "../actions/api/label/queries";
import {
  createLabel,
  updateLabel,
  deleteLabel,
} from "../actions/api/label/mutations";

export const useLabel = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();
  // Queries
  const {
    data: labels,
    isLoading,
    error,
  } = useQuery({
    queryKey: [projectId, "labels"],
    queryFn: () => getProjectLabels({ id: projectId }),
  });
  // Mutations
  const create = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      toast.success("Label created successfully");
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const update = useMutation({
    mutationFn: updateLabel,
    onSuccess: () => {
      toast.success("Label updated successfully");
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      toast.success("Label deleted successfully");
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    // Queries
    labels,
    isLoading,
    error,
    // Mutations
    create,
    update,
    remove,
  };
};
