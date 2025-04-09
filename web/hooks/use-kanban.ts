import * as React from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type {
  Bucket,
  Item,
  MoveItemParams,
  ReorderBucketParams,
} from "@/components/kanban/types";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import stringToColor from "@/lib/utils";
import { useSuspenseQueries } from "@tanstack/react-query";
import { getBuckets } from "@/actions/bucket-actions";
import { getItems } from "@/actions/item-actions";
// import { kanbanData } from "@/data1";

export const useKanban = ({ projectId }: { projectId: string }) => {
  // const [bucketsQuery, itemsQuery] = useSuspenseQueries({
  //   queries: [
  //     {
  //       queryKey: ["buckets", projectId],
  //       queryFn: getBuckets,
  //     },
  //     {
  //       queryKey: ["items", projectId],
  //       queryFn: getItems,
  //     },
  //   ],
  // });
  const [board, setBoard] = React.useState<Bucket[]>([]);
  console.log("board", board);
  // React.useEffect(() => {
  //   // Since we're using suspense, we know data exists when we get here
  //   const buckets = bucketsQuery.data;
  //   const items = itemsQuery.data;

  //   const newBoard = buckets.map((bucket: Bucket) => ({
  //     ...bucket,
  //     items: items.filter((item: Item) => item.bucket.id === bucket.id),
  //     // .sort((a: Item, b: Item) => a.position - b.position),
  //   }));

  //   setBoard(newBoard);
  // }, [bucketsQuery.data, itemsQuery.data]);

  const moveItem = React.useCallback(
    ({
      movedItemIndexInSourceBucket,
      sourceBucketId,
      destinationBucketId,
      movedItemIndexInDestinationBucket,
    }: MoveItemParams) => {
      setBoard((prevBoard) => {
        // Find the source and destination columns
        const sourceBucket = prevBoard.find(
          (bucket) => bucket.id === sourceBucketId
        );
        const destinationBucket = prevBoard.find(
          (bucket) => bucket.id === destinationBucketId
        );

        if (!sourceBucket || !destinationBucket) return prevBoard;

        // Identify the card to move
        const itemToMove = sourceBucket.items[movedItemIndexInSourceBucket];
        if (!itemToMove) return prevBoard;

        // Insert the card into the destination column at the specified index
        const updatedDestinationItems = [...destinationBucket.items];
        updatedDestinationItems.splice(
          movedItemIndexInDestinationBucket,
          0,
          itemToMove
        );

        return prevBoard.map((bucket) => {
          // Remove the card from the source column
          if (bucket.id === sourceBucketId) {
            return {
              ...bucket,
              items: sourceBucket.items.filter(
                (_, index) => index !== movedItemIndexInSourceBucket
              ),
            };
          }
          if (bucket.id === destinationBucketId) {
            return { ...bucket, items: updatedDestinationItems };
          }
          return bucket;
        });
      });
    },
    []
  );

  const reorderItems = React.useCallback(
    ({ bucketId, startIndex, finishIndex }: ReorderBucketParams) => {
      setBoard((prevBoard) =>
        prevBoard.map((bucket) =>
          bucket.id === bucketId
            ? {
                ...bucket,
                items: reorder({ list: bucket.items, startIndex, finishIndex }),
              }
            : bucket
        )
      );
    },
    []
  );

  const handleDrop = React.useCallback(
    (args: BaseEventPayload<ElementDragType>) => {
      const { source, location } = args;
      if (!location.current.dropTargets.length) return;

      if (source.data.type === "item") {
        // Retrieve the ID of the card being dragged
        const draggedItemId = source.data.itemId;
        const sourceBucketId = location.initial.dropTargets[1]?.data
          .bucketId as string;

        const sourceBucket = board.find(
          (bucket: Bucket) => bucket.id === sourceBucketId
        );

        if (!sourceBucket) return;

        const draggedItemIndex = sourceBucket.items.findIndex(
          (item: Item) => item.id === draggedItemId
        );

        if (draggedItemIndex === -1) return;

        // Case 1: Dropping on a bucket (empty space)
        if (location.current.dropTargets.length === 1) {
          const [destinationBucketRecord] = location.current.dropTargets;
          const destinationBucketId = destinationBucketRecord.data
            .bucketId as string;
          console.log("sourceBucketId", sourceBucketId);
          console.log("destinationBucketId", destinationBucketId);

          // If dropping in the same bucket
          if (sourceBucketId === destinationBucketId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: draggedItemIndex,
              indexOfTarget: sourceBucket.items.length - 1,
              closestEdgeOfTarget: null,
              axis: "vertical",
            });
            console.log("destinationIndex", destinationIndex);
            // reorder
            reorderItems({
              bucketId: sourceBucketId,
              startIndex: draggedItemIndex,
              finishIndex: destinationIndex,
            });
            return;
          }
          // Move if dropping in a different bucket
          const movedItemIndexInDestinationBucket =
            board.find((bucket) => bucket.id === destinationBucketId)?.items
              .length ?? 0;
          moveItem({
            movedItemIndexInSourceBucket: draggedItemIndex,
            sourceBucketId,
            destinationBucketId,
            movedItemIndexInDestinationBucket,
          });
          return;
        }
        // Case 2: Dropping on a task
        if (location.current.dropTargets.length === 2) {
          const [destinationItemRecord, destinationBucketRecord] =
            location.current.dropTargets;
          const destinationBucketId = destinationBucketRecord.data
            .bucketId as string;
          const destinationBucket = board.find(
            (bucket) => bucket.id === destinationBucketId
          );
          if (!destinationBucket) return;

          const indexOfTarget = destinationBucket.items.findIndex(
            (item) => item.id === destinationItemRecord.data.id
          );
          if (indexOfTarget === -1) return;
          const closestEdgeOfTarget = extractClosestEdge(
            destinationItemRecord.data
          );
          //If reordering within the same bucket
          if (sourceBucketId === destinationBucketId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: draggedItemIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "vertical",
            });
            reorderItems({
              bucketId: sourceBucketId,
              startIndex: draggedItemIndex,
              finishIndex: destinationIndex,
            });
            return;
          }
          // If moving to a different bucket
          const destinationIndex =
            closestEdgeOfTarget === "bottom"
              ? indexOfTarget + 1
              : indexOfTarget;
          moveItem({
            movedItemIndexInSourceBucket: draggedItemIndex,
            sourceBucketId,
            destinationBucketId,
            movedItemIndexInDestinationBucket: destinationIndex,
          });
        }
      }
    },
    []
  );

  React.useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  return { buckets: board };
};
