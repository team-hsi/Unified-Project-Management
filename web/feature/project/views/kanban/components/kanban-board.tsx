"use client";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { useKanban } from "@/feature/shared/hooks/use-kanban";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/feature/shared/ui/button";
import { Item } from "@/feature/shared/@types/item";
import { Bucket } from "@/feature/shared/@types/bucket";
import { EmptyKanbanState } from "../shared/empty-kanban";
import { KanbanBucket } from "./kanban-bucket";

export const KanbanBoard = () => {
  const {
    buckets,
    board,
    reorder,
    moveItemMutation,
    reorderItemMutation,
    setBoard,
    bucketsError,
    itemsError,
    bucketsRefetch,
    itemsRefetch,
  } = useKanban();

  // Error state
  if (bucketsError || itemsError) {
    toast.error(`Failed to load data`);
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64">
        <div className="w-full max-w-md">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <p>Error loading data</p>
          <p>{bucketsError?.message || itemsError?.message}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              bucketsRefetch();
              itemsRefetch();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (buckets.length === 0) {
    return <EmptyKanbanState />;
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination, return
    if (!destination) return;

    // If the destination is the same as the source and the index is the same, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If we're dragging a bucket
    if (type === "bucket") {
      const items = reorder(board || [], source.index, destination.index).map(
        (bucket, index) => ({
          ...bucket,
          order: index,
        })
      );

      toast.success("Reorder", {
        description: "Buckets have been reordered.",
      });
      setBoard(items);
      return;
    }
    if (type === "item") {
      const newState = board ? [...board] : [];
      const srcBucket = newState.find(
        (bucket) => bucket.id === source.droppableId
      );
      const destBucket = newState.find(
        (bucket) => bucket.id === destination.droppableId
      );
      if (!srcBucket || !destBucket) return;

      if (!srcBucket.items) {
        srcBucket.items = [];
      }
      if (!destBucket.items) {
        destBucket.items = [];
      }
      const getItemIdAtIndex = (
        items: Item[],
        index: number
      ): string | null => {
        return items[index]?.id || null;
      };
      const getBucketItemIdAtIndex = (
        bucket: Bucket,
        index: number
      ): string | null => {
        return bucket.items[index]?.id || null;
      };

      // moving item within the same bucket
      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorder(
          srcBucket.items,
          source.index,
          destination.index
        );
        reorderedItems.forEach((item, index) => {
          item.position = index;
        });
        srcBucket.items = reorderedItems;
        const prevItemId = getItemIdAtIndex(
          reorderedItems,
          destination.index - 1
        );
        const nextItemId = getItemIdAtIndex(
          reorderedItems,
          destination.index + 1
        );
        toast.success("Reorder", {
          description: "Item has been reordered.",
        });
        setBoard(newState);
        reorderItemMutation.mutateAsync({
          id: draggableId,
          prevItemId,
          nextItemId,
          bucketId: srcBucket.id,
          projectId: srcBucket.project.id,
        });
      } else {
        // moving item to a different bucket
        // Remove the item from its source
        const [movedItem] = srcBucket.items.splice(source.index, 1);
        movedItem.bucket.id = destination.droppableId;
        destBucket.items.splice(destination.index, 0, movedItem);

        srcBucket.items.forEach((item, index) => {
          item.position = index;
        });
        destBucket.items.forEach((item, index) => {
          item.position = index;
        });
        const prevItemIdDest = getBucketItemIdAtIndex(
          destBucket,
          destination.index - 1
        );
        const nextItemIdDest = getBucketItemIdAtIndex(
          destBucket,
          destination.index + 1
        );
        toast.success("Move", {
          description: "Item moved to another bucket.",
        });
        setBoard(newState);
        moveItemMutation.mutateAsync({
          id: movedItem.id,
          bucketId: destBucket.id,
          prevItemId: prevItemIdDest,
          nextItemId: nextItemIdDest,
          projectId: srcBucket.project.id,
          srcBucketId: srcBucket.id,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="buckets" type="bucket" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-4 overflow-x-auto p-4 h-full flex-1"
          >
            {board?.map((bucket, index) => (
              <KanbanBucket key={bucket.id} bucket={bucket} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
