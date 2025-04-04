"use client";
import type { Bucket, Item } from "./types";
import { getBuckets } from "@/actions/bucket-actions";
import stringToColor from "@/lib/utils";
import { useSuspenseQueries } from "@tanstack/react-query";
import { KanbanBucket } from "./kanban-bucket";
import { getItems } from "@/actions/item-actions";
import HorizontalScroll from "../ui/horizontal-scroll";
// import { useKanban } from "@/hooks/use-kanban";

export const KanbanBoard = ({ projectId }: { projectId: string }) => {
  // const { buckets, items } = useKanban({ projectId });
  const [bucketsQuery, itemsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["buckets", projectId],
        queryFn: getBuckets,
        select: (data: Bucket[]) => {
          return data.map((bucket: Bucket) => {
            const newProperties = {
              color: stringToColor(bucket.name + bucket.createdAt),
              type: "bucket",
            };
            return {
              ...bucket,
              ...newProperties,
            };
          });
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
      {/* <div className="flex h-full w-full gap-4 border-2  overflow-auto"> */}
      {/* // <div className="w-fill grid w-fit mx-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> */}
      {bucketsQuery.data.map((bucket: Bucket) => (
        <KanbanBucket
          key={bucket.id}
          bucket={bucket}
          items={itemsQuery.data.filter(
            (item: Item) => item.bucket.id === bucket.id
          )}
        />
      ))}
      {/* </div> */}
    </HorizontalScroll>
  );
};
