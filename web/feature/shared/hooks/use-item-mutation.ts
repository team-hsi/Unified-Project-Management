"use client";

import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { toast } from "sonner";
import {
  createItem,
  updateItem,
  deleteItem,
} from "@/actions/api/item/mutations";
import { Bucket } from "../@types/bucket";
import { Item } from "../@types/item";
import { useUtils } from "./use-utils";
import { BaseError } from "@/lib/errors";
import { useLabel } from "./use-label";
import { Label } from "../@types/label";
export const useItemMutation = () => {
  const queryClient = getQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const { isValidResponse, toastUnknownError } = useUtils();
  const { labels: allLabels } = useLabel({ projectId });

  // Create item mutation
  const create = useMutation({
    mutationFn: createItem,
    onMutate: async (newItemData) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "items"] });
      const previousItems = queryClient.getQueryData([projectId, "items"]);
      const bucketsQueryKey = [projectId, "buckets"];

      const buckets =
        (queryClient.getQueryData(bucketsQueryKey) as Bucket[]) || [];
      const bucket = buckets.find((b) => b.id === newItemData.bucketId);
      if (!bucket) {
        return { previousItems };
      }
      const maxPosition =
        bucket.items?.reduce((max, item) => Math.max(max, item.position), 0) ||
        0;

      const optimisticItem: Item = {
        id: `temp-${Date.now()}`,
        name: newItemData.name || "New Item",
        description: newItemData.description || "",
        bucket: {
          id: bucket.id,
          name: bucket.name,
          color: bucket.color,
          project: {
            name: "",
            ownerId: "",
            id: "",
            createdAt: "",
            updatedAt: "",
          },
          createdAt: "",
          updatedAt: "",
        },
        status: newItemData.status || "incomplete",
        position: maxPosition + 100,
        priority: newItemData.priority || null,
        dueDate: newItemData.dueDate || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: null,
        labels: [],
        checklist: [],
      };
      queryClient.setQueryData([projectId, "items"], (old: Item[] = []) => {
        return [...old, optimisticItem];
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData([projectId, "items"], context.previousItems);
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
      if (isValidResponse(response)) {
        // toast.success("Item created successfully!");
      }
    },
  });

  // Update item mutation
  const update = useMutation({
    mutationFn: updateItem,
    onMutate: async (updatedItemData) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "items"] });
      const previousItems = queryClient.getQueryData([projectId, "items"]);
      let optimisticLabels: Label[];
      if (Array.isArray(updatedItemData.labels) && allLabels) {
        optimisticLabels = updatedItemData.labels
          .map((id: string) => allLabels.find((label) => label.id === id))
          .filter(Boolean) as Label[];
      }

      queryClient.setQueryData([projectId, "items"], (old: Item[] = []) => {
        return old.map((item) =>
          item.id === updatedItemData.id
            ? {
                ...item,
                ...updatedItemData,
                labels: optimisticLabels,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData([projectId, "items"], context.previousItems);
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "item"] });
      void isValidResponse(response);
    },
  });

  // Delete item mutation
  const remove = useMutation({
    mutationFn: deleteItem,
    onMutate: async (deleteItem) => {
      await queryClient.cancelQueries({
        queryKey: [deleteItem.projectId, "items"],
      });
      const previousItems = queryClient.getQueryData([
        deleteItem.projectId,
        "items",
      ]);
      queryClient.setQueryData(
        [deleteItem.projectId, "items"],
        (old: Item[] = []) => {
          return old.filter((item) => item.id !== deleteItem.id);
        }
      );
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData([projectId, "items"], context.previousItems);
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
      if (isValidResponse(response)) {
        toast.success("Item deleted successfully!");
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
