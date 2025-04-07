import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation } from "@tanstack/react-query";
import {
  createItem as createItemAction,
  deleteItemById,
  updateItemInline as updateItemInlineAction,
} from "@/actions/item-actions";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("Item created successfully!");
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });

  const updateItemInline = useMutation({
    mutationFn: updateItemInlineAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });
  const deleteItem = useMutation({
    mutationFn: deleteItemById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      successAction?.();
    },
  });

  return {
    createItem,
    updateItemInline,
    deleteItem,
  };
};
