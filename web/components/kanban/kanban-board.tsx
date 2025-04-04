"use client";
import type { Bucket, Item } from "./types";
import { getBuckets } from "@/actions/bucket-actions";
import { useSuspenseQueries } from "@tanstack/react-query";
import { KanbanBucket } from "./kanban-bucket";
import { getItems } from "@/actions/item-actions";
import HorizontalScroll from "../ui/horizontal-scroll";

export const KanbanBoard = ({ projectId }: { projectId: string }) => {
  const [bucketsQuery, itemsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["buckets", projectId],
        queryFn: getBuckets,
        select: (data: Bucket[]) => {
          return data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        },
      },
      {
        queryKey: ["items", projectId],
        queryFn: getItems,
      },
    ],
  });
  //TODO: implement horizontal scroll with drag
  return (
    <HorizontalScroll>
      {bucketsQuery.data.map((bucket: Bucket) => (
        <KanbanBucket
          key={bucket.id}
          bucket={bucket}
          items={itemsQuery.data.filter(
            (item: Item) => item.bucket.id === bucket.id
          )}
        />
      ))}
    </HorizontalScroll>
  );
};
