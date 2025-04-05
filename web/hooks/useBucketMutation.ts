import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { createItem } from "@/actions/item-actions";
import { toast } from "sonner";
import {
  createBucket as createBucketAction,
  deleteBucket as deleteBucketAction,
  updateBucket as updateBucketAction,
} from "@/actions/bucket-actions";

export const useBucketMutation = ({
  queryKey,
  successAction,
}: {
  queryKey: string[];
  successAction?: () => void;
}) => {
  const queryClient = getQueryClient();

  const createBucketItem = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const createBucket = useMutation({
    mutationFn: createBucketAction,
    onSuccess: () => {
      toast.success("Bucket created successfully!");
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });

  const deleteBucket = useMutation({
    mutationFn: deleteBucketAction,
    onSuccess: () => {
      toast.success("Bucket deleted!");
      queryClient.invalidateQueries({ queryKey });
    },
  });
  const updateBucket = useMutation({
    mutationFn: updateBucketAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    createBucket,
    updateBucket,
    createBucketItem,
    deleteBucket,
  };
};
