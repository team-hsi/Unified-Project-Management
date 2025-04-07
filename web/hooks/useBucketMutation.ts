import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { createItem } from "@/actions/item-actions";
import { toast } from "sonner";
import {
  createBucket as createBucketAction,
  deleteBucket as deleteBucketAction,
  updateBucket as updateBucketAction,
} from "@/actions/bucket-actions";
import { useRouter } from "next/navigation";

export const useBucketMutation = ({
  queryKey,
  successAction,
}: {
  queryKey: string[];
  successAction?: () => void;
}) => {
  const queryClient = getQueryClient();
  const router = useRouter();

  const createBucketItem = useMutation({
    mutationFn: createItem,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createBucket = useMutation({
    mutationFn: createBucketAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error.message);
        return;
      }
      toast.success("Bucket created successfully!");
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteBucket = useMutation({
    mutationFn: deleteBucketAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error, {
          description: "Please refresh your page.",
          action: {
            label: "Refresh",
            onClick: (event) => {
              event.preventDefault();
              router.refresh();
            },
          },
        });
        return;
      }
      toast.success("Bucket deleted!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateBucket = useMutation({
    mutationFn: updateBucketAction,
    mutationKey: ["updateBucket"],
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    createBucket,
    updateBucket,
    createBucketItem,
    deleteBucket,
  };
};
