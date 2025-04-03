"use client";
// import { KanbanColumn } from "@/components/kanban/kanban-column";
// import { useKanbanBoard } from "@/hooks/use-kanban-board";
import type { Bucket, Item } from "./types";
import { getBuckets } from "@/actions/bucket-actions";
import stringToColor from "@/lib/utils";
import { useSuspenseQueries } from "@tanstack/react-query";
import { KanbanBucket } from "./kanban-bucket";
import { getItems } from "@/actions/item-actions";
import { useKanban } from "@/hooks/use-kanban";

export const KanbanBoard = ({ projectId }: { projectId: string }) => {
  const { buckets, items } = useKanban({ projectId });
  // const [bucketsQuery, itemsQuery] = useSuspenseQueries({
  //   queries: [
  //     {
  //       queryKey: ["buckets", projectId],
  //       queryFn: getBuckets,
  //       select: (data: Bucket[]) => {
  //         return data.map((bucket: Bucket) => {
  //           const newProperties = {
  //             color: stringToColor(bucket.name + bucket.createdAt),
  //             type: "bucket",
  //           };
  //           return {
  //             ...bucket,
  //             ...newProperties,
  //           };
  //         });
  //       },
  //     },
  //     {
  //       queryKey: ["items", projectId],
  //       queryFn: getItems,
  //     },
  //   ],
  // });
  return (
    <div className="w-fill grid w-fit mx-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {buckets.map((bucket: Bucket) => (
        <KanbanBucket
          key={bucket.id}
          bucket={bucket}
          items={items.filter((item: Item) => item.bucket.id === bucket.id)}
        />
      ))}
    </div>
  );
};
