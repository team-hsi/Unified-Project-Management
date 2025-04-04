import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { createItem } from "@/actions/item-actions";
import { toast } from "sonner";
import { deleteBucket as deleteBucketAction } from "@/actions/bucket-actions";

export const useBucketMutation = ({ queryKey }: { queryKey: string[] }) => {
  const queryClient = getQueryClient();

  const createBucketItem = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteBucket = useMutation({
    mutationFn: deleteBucketAction,
    onSuccess: () => {
      toast.success("Bucket deleted!");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    createBucketItem,
    deleteBucket,
  };
};
