import {
  createLabel,
  updateLabel as updateAction,
  deleteLabel as deleteAction,
} from "@/feature/shared/actions/labels-actions";
import { getProjectLabels } from "@/feature/shared/actions/project-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLabels = ({ projectId }: { projectId: string }) => {
  const queryClient = getQueryClient();

  const labels = useQuery({
    queryKey: ["labels", projectId],
    queryFn: () => getProjectLabels({ id: projectId }),
  });

  const addLabel = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      toast.success("Label created successfully!");
      queryClient.invalidateQueries({ queryKey: ["labels", projectId] });
    },
    onError: (error) => {
      console.error("Error creating label:", error);
    },
  });
  const updateLabel = useMutation({
    mutationFn: updateAction,
    onSuccess: () => {
      toast.success("Label updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["labels", projectId] });
    },
    onError: (error) => {
      console.error("Error creating label:", error);
    },
  });

  const deleteLabel = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      toast.success("Label deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["labels", projectId] });
    },
    onError: (error) => {
      console.error("Error deleting label:", error);
    },
  });
  return {
    labels,
    addLabel,
    updateLabel,
    deleteLabel,
  };
};
