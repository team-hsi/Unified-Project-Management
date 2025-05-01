import { Bucket } from "@/feature/shared/@types/bucket";
import { Item } from "@/feature/shared/@types/item";
import { moveItem, reorderItem } from "@/feature/shared/actions/item-actions";
import {
  getProjectBuckets,
  getProjectItems,
} from "@/feature/shared/actions/project-actions";
import { getQueryClient } from "@/lib/query-client/get-query-client";
import { useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export const useKanban = () => {
  const { projectId } = useParams<{ projectId: string }>();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
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
      queryClient.invalidateQueries({ queryKey: [projectId, "buckets"] });
      queryClient.invalidateQueries({ queryKey: [projectId, "items"] });
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
