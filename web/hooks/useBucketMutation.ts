import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBucket as createBucketAction,
  deleteBucket as deleteBucketAction,
  updateBucket as updateBucketAction,
} from "@/actions/bucket-actions";
import { useRouter } from "next/navigation";
import { Bucket } from "@/components/kanban/types";

export const useBucketMutation = ({
  queryKey,
  successAction,
}: {
  queryKey: string[];
  successAction?: () => void;
}) => {
  const queryClient = getQueryClient();
  const router = useRouter();

  const createBucket = useMutation({
    mutationFn: createBucketAction,
    onMutate: async (newBucketData) => {
      console.log("new BD", newBucketData);
      await queryClient.cancelQueries({ queryKey });
      const previousBuckets = queryClient.getQueryData(queryKey);
      const optimisticBucket: Bucket = {
        id: `temp-${Date.now()}`,
        name: newBucketData.name,
        color: newBucketData.color,
        project: {
          id: queryKey[1],
          name: "New project for Bucket",
          ownerId: queryKey[1],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log("OPD", optimisticBucket);

      queryClient.setQueryData(queryKey, (old: Bucket[] = []) => {
        return [...old, optimisticBucket];
      });
      return { previousBuckets };
    },
    onError: (error, variables, context) => {
      if (context?.previousBuckets) {
        queryClient.setQueryData(queryKey, context.previousBuckets);
      }
      console.log("error", error);
      toast.error(JSON.stringify(error));
      toast.error("something went wrong");
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error.message);
        queryClient.invalidateQueries({ queryKey });
        return;
      }
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });

  const deleteBucket = useMutation({
    mutationFn: deleteBucketAction,
    onMutate: async (deleteBucket) => {
      await queryClient.cancelQueries({ queryKey });
      const previousBuckets = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Bucket[] = []) => {
        return old.filter((bucket) => bucket.id !== deleteBucket.id);
      });
      return { previousBuckets };
    },
    onError: (error, variables, context) => {
      if (context?.previousBuckets) {
        queryClient.setQueryData(queryKey, context.previousBuckets);
      }
      toast.error("something went wrong refresh the page");
    },
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
        queryClient.invalidateQueries({ queryKey });
        return;
      }
      queryClient.invalidateQueries({ queryKey });
      toast.success("Bucket deleted!");
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
    deleteBucket,
  };
};
