import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProjectLabels } from "@/actions/api/label/queries";
import {
  createLabel,
  updateLabel,
  deleteLabel,
} from "@/actions/api/label/mutations";
import { useUtils } from "./use-utils";

export const useLabel = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
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
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
      toast.success("Label created successfully");
    },
    onError: toastUnknownError,
  });

  const update = useMutation({
    mutationFn: updateLabel,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
      toast.success("Label updated successfully");
    },
    onError: toastUnknownError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteLabel({ id, projectId }),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "labels"] });
      toast.success("Label deleted successfully");
    },
    onError: toastUnknownError,
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
