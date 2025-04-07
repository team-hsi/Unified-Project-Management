import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import {
  createItem as createItemAction,
  deleteItemById,
  updateItemInline as updateItemInlineAction,
} from "@/actions/item-actions";
import { toast } from "sonner";
import { Bucket, Item } from "@/components/kanban/types";

export const useItemMutation = ({
  queryKey,
  successAction,
}: {
  queryKey: string[];
  successAction?: () => void;
}) => {
  const queryClient = getQueryClient();

  const createItem = useMutation({
    mutationFn: createItemAction,
    onMutate: async (newItemData) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData(queryKey);
      const bucketsQueryKey = ["buckets", queryKey[1]];

      const buckets =
        (queryClient.getQueryData(bucketsQueryKey) as Bucket[]) || [];
      const bucket = buckets.find((b) => b.id === newItemData.id);
      if (!bucket) {
        return { previousItems };
      }
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
        priority: newItemData.priority || null,
        dueDate: newItemData.dueDate || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: null,
        labels: newItemData.labels || [],
      };
      queryClient.setQueryData(queryKey, (old: Item[] = []) => {
        return [...old, optimisticItem];
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error(error.message);
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        queryClient.invalidateQueries({ queryKey });
        return;
      }
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateItemInline = useMutation({
    mutationFn: updateItemInlineAction,
    onMutate: async (updatedItemData) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Item[] = []) => {
        return old.map((item) =>
          item.id === updatedItemData.id
            ? {
                ...item,
                ...updatedItemData,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, revert back to the previous value
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error(error.message || "Failed to update item ");
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        queryClient.invalidateQueries({ queryKey });
        return;
      }
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });
  const deleteItem = useMutation({
    mutationFn: deleteItemById,
    onMutate: async (deleteItem) => {
      await queryClient.cancelQueries({ queryKey });
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: Item[] = []) => {
        return old.filter((item) => item.id !== deleteItem.id);
      });
      return { previousItems };
    },
    onError: (error, variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }
      toast.error(error.message || "Failed to delete item");
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error);
        queryClient.invalidateQueries({ queryKey });
        return;
      }
      queryClient.invalidateQueries({ queryKey });
      toast.success("Item deleted successfully!");
    },
  });

  return {
    createItem,
    updateItemInline,
    deleteItem,
  };
};
