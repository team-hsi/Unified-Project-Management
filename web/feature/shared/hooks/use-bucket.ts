"use client";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { toast } from "sonner";
import {
  createBucket,
  updateBucket,
  deleteBucket,
} from "@/actions/api/bucket/mutations";
import { Bucket } from "../@types/bucket";
import { useUtils } from "./use-utils";
import { BaseError } from "@/lib/errors";
export const useBucket = () => {
  const queryClient = getQueryClient();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { workspaceId, projectId } = useParams<{
    workspaceId: string;
    projectId: string;
  }>();

  // Create bucket mutation
  const create = useMutation({
    mutationFn: createBucket,
    onMutate: async (newBucketData) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "buckets"] });
      const previousBuckets = queryClient.getQueryData([projectId, "buckets"]);
      const optimisticBucket: Bucket = {
        id: `temp-${Date.now()}`,
        name: newBucketData.name,
        color: newBucketData.color || "#1f1f8",
        project: {
          id: projectId,
          name: "New project for Bucket",
          ownerId: projectId,
          space: workspaceId,
          permissions: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: [],
      };
      queryClient.setQueryData([projectId, "buckets"], (old: Bucket[] = []) => {
        return [...old, optimisticBucket];
      });
      return { previousBuckets };
    },
    onError: (error, variables, context) => {
      if (context?.previousBuckets) {
        queryClient.setQueryData(
          [projectId, "buckets"],
          context.previousBuckets
        );
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      void isValidResponse(response);
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
    },
  });

  // Update bucket mutation
  const update = useMutation({
    mutationFn: updateBucket,
    onMutate: async (updatedBucketData) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "buckets"] });
      const previousBuckets = queryClient.getQueryData([projectId, "buckets"]);
      queryClient.setQueryData([projectId, "buckets"], (old: Bucket[] = []) => {
        return old.map((bucket) =>
          bucket.id === updatedBucketData.id
            ? {
                ...bucket,
                ...updatedBucketData,
                updatedAt: new Date().toISOString(),
              }
            : bucket
        );
      });
      return { previousBuckets };
    },
    onError: (error, variables, context) => {
      if (context?.previousBuckets) {
        queryClient.setQueryData(
          [projectId, "buckets"],
          context.previousBuckets
        );
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      void isValidResponse(response);
    },
  });

  // Delete bucket mutation
  const remove = useMutation({
    mutationFn: deleteBucket,
    onMutate: async (deleteBucket) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "buckets"] });
      const previousBuckets = queryClient.getQueryData([projectId, "buckets"]);
      queryClient.setQueryData([projectId, "buckets"], (old: Bucket[] = []) => {
        return old.filter((bucket) => bucket.id !== deleteBucket.id);
      });
      return { previousBuckets };
    },
    onError: (error, variables, context) => {
      if (context?.previousBuckets) {
        queryClient.setQueryData(
          [projectId, "buckets"],
          context.previousBuckets
        );
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      if (isValidResponse(response)) {
        toast.success("Bucket deleted!");
      }
    },
  });

  return {
    // Mutations
    create,
    update,
    remove,
  };
};
