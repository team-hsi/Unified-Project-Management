import { getProjectBuckets } from "@/actions/bucket-actions";
import { getProjectItems } from "@/actions/item-actions";
import { moveItem, reorderItem } from "@/actions/kanban-actions";
import { Bucket, Item } from "@/components/kanban/types";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

export const useKanban = ({ projectId }: { projectId: string }) => {
  const queryClient = getQueryClient();
  const [
    { data: buckets, error: bucketsError, refetch: bucketsRefetch },
    { data: items, error: itemsError, refetch: itemsRefetch },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["buckets", projectId],
        queryFn: () => getProjectBuckets({ id: projectId }),
        select: (data: Bucket[]) =>
          data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ),
      },
      {
        queryKey: ["items", projectId],
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets", projectId] });
      queryClient.invalidateQueries({ queryKey: ["items", projectId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to move card: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  const reorderItemMutation = useMutation({
    mutationFn: reorderItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buckets", projectId] });
      queryClient.invalidateQueries({ queryKey: ["items", projectId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to reorder card: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
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
