import { Bucket } from "@/feature/shared/@types/bucket";
import { Item } from "@/feature/shared/@types/item";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as React from "react";
import { moveItem, reorderItems } from "@/actions/api/item/mutations";
import { getProjectBuckets } from "@/actions/api/bucket/queries";
import { getProjectItems } from "@/actions/api/item/queries";
import { useUtils } from "./use-utils";

export const useKanban = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { isValidResponse, toastUnknownError } = useUtils();

  const queryClient = getQueryClient();
  const [
    { data: buckets, error: bucketsError, refetch: bucketsRefetch },
    { data: items, error: itemsError, refetch: itemsRefetch },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: [projectId, "buckets"],
        queryFn: () => getProjectBuckets({ id: projectId }),
        select: (data: Bucket[]) =>
          data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
      },
      {
        queryKey: [projectId, "items"],
        queryFn: () => getProjectItems({ id: projectId }),
      },
    ],
  });

  const reorder = <T>(bucket: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(bucket);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  // Mutations for updating data
  const moveItemMutation = useMutation({
    mutationFn: moveItem,
    onSuccess: (response) => {
      void isValidResponse(response);
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
    },
    onError: toastUnknownError,
  });

  const reorderItemMutation = useMutation({
    mutationFn: reorderItems,
    onSuccess: (response) => {
      void isValidResponse(response);
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
    },
    onError: toastUnknownError,
  });
  const [board, setBoard] = React.useState<Bucket[] | null>(null);
  React.useEffect(() => {
    const board = buckets.map((bucket) => ({
      ...bucket,
      items: items
        .filter((item: Item) => item.bucket.id === bucket.id)
        .sort((a: Item, b: Item) => a.position - b.position),
    }));
    setBoard(board);
  }, [items, buckets]);

  return {
    buckets,
    items,
    board,
    reorder,
    moveItemMutation,
    reorderItemMutation,
    setBoard,
    bucketsError,
    itemsError,
    bucketsRefetch,
    itemsRefetch,
  };
};
