"use client";
import type { Bucket, Item } from "./types";
import { getProjectBuckets } from "@/actions/bucket-actions";
import { useSuspenseQueries } from "@tanstack/react-query";
import { KanbanBucket } from "./kanban-bucket";
import { getProjectItems } from "@/actions/item-actions";
import HorizontalScroll from "../ui/horizontal-scroll";
import { EmptyKanbanState } from "./empty-kanban";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export const KanbanBoard = ({ projectId }: { projectId: string }) => {
  const [
    { data: buckets, error: bucketsError, refetch: refetchBuckets },
    { data: items, error: itemsError, refetch: refetchItems },
  ] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["buckets", projectId],
        queryFn: () => getProjectBuckets({ id: projectId }),
        select: (data: Bucket[]) => {
          return data.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        },
      },
      {
        queryKey: ["items", projectId],
        queryFn: () => getProjectItems({ id: projectId }),
      },
    ],
  });

  // Handle error states
  if (bucketsError || itemsError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64">
        <div className="w-full max-w-md">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <p>Error loading data</p>
          <p>{bucketsError?.message || itemsError?.message}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetchBuckets()}>
            Retry Buckets
          </Button>
          <Button variant="outline" onClick={() => refetchItems()}>
            Retry Items
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (buckets.length === 0) {
    return <EmptyKanbanState id={projectId} />;
  }

  return (
    <HorizontalScroll>
      {buckets.map((bucket: Bucket) => (
        <KanbanBucket
          key={bucket.id}
          bucket={bucket}
          items={items.filter((item: Item) => item.bucket.id === bucket.id)}
        />
      ))}
    </HorizontalScroll>
  );
};
