import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUtils } from "./use-utils";
import { getProjectMilestone } from "@/actions/api/milestone/queries";
import {
  createMilestone,
  deleteMilestone,
  updateMilestone,
} from "@/actions/api/milestone/mutations";

export const useMilestone = ({ projectId }: { projectId: string }) => {
  const queryClient = useQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  // Queries
  const {
    data: milestones,
    isLoading,
    error,
  } = useQuery({
    queryKey: [projectId, "milestones"],
    queryFn: () => getProjectMilestone({ id: projectId }),
  });
  // Mutations
  const create = useMutation({
    mutationFn: createMilestone,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "milestones"] });
      toast.success("Milestone created successfully");
    },
    onError: toastUnknownError,
  });

  const update = useMutation({
    mutationFn: updateMilestone,
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "milestones"] });
    },
    onError: toastUnknownError,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteMilestone({ id, projectId }),
    onSuccess: (response) => {
      if (!isValidResponse(response)) return;
      queryClient.invalidateQueries({ queryKey: [projectId, "milestones"] });
      toast.success("Milestone deleted successfully");
    },
    onError: toastUnknownError,
  });

  return {
    // Queries
    milestones,
    isLoading,
    error,
    // Mutations
    create,
    update,
    remove,
  };
};
