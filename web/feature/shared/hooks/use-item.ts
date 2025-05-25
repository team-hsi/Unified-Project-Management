"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { toast } from "sonner";
import {
  assignUser,
  unassignUser,
  updateItem,
} from "@/actions/api/item/mutations";
import { Item } from "../@types/item";
import { useUtils } from "./use-utils";
import { BaseError } from "@/lib/errors";
import { getItemById } from "@/actions/api/item/queries";

export const useItem = (id: string) => {
  const queryClient = getQueryClient();
  const { projectId } = useParams<{ projectId: string }>();
  const { isValidResponse, toastUnknownError } = useUtils();

  const {
    data: item,
    isLoading,
    error,
  } = useQuery<Item>({
    queryKey: [projectId, "item"],
    queryFn: () => getItemById({ id }),
  });

  // Update item mutation
  const update = useMutation({
    mutationFn: updateItem,
    onMutate: async (updatedItemData) => {
      await queryClient.cancelQueries({ queryKey: [projectId, "item"] });
      const previousItem = queryClient.getQueryData([projectId, "item"]);

      queryClient.setQueryData([projectId, "item"], (old: Item) => ({
        ...old,
        checklist: updatedItemData.checklist,
        updatedAt: new Date().toISOString(),
      }));

      return { previousItem };
    },
    onError: (error, variables, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData([projectId, "item"], context.previousItem);
      }
      toastUnknownError(error as BaseError);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [projectId, "item"] });
      if (isValidResponse(response)) {
        toast.success("Checklist updated successfully!");
      }
    },
  });

  const assign = useMutation({
    mutationFn: assignUser,
  });

  const unAssign = useMutation({
    mutationFn: unassignUser,
  });

  return {
    item,
    isLoading,
    error,
    update,
    assign,
    unAssign,
  };
};
