// import * as React from "react";
// import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
// import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
// import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
// import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
// import type {
//   Bucket,
//   Column,
//   Item,
//   MoveCardParams,
//   ReorderBucketParams,
// } from "@/components/kanban/types";
// import {
//   BaseEventPayload,
//   ElementDragType,
// } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
// import stringToColor from "@/lib/utils";
import { useSuspenseQueries } from "@tanstack/react-query";
import { getBuckets } from "@/actions/bucket-actions";
import { getItems } from "@/actions/item-actions";

export const useKanban = ({ projectId }: { projectId: string }) => {
  const [bucketsQuery, itemsQuery] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["buckets", projectId],
        queryFn: getBuckets,
      },
      {
        queryKey: ["items", projectId],
        queryFn: getItems,
      },
    ],
  });
  //Todo: Implement the drag and drop functionality
  // const moveCard = React.useCallback(
  //   ({
  //     movedTaskIndexInSourceColumn,
  //     destinationColumnId,
  //     movedTaskIndexInDestinationColumn,
  //   }: MoveCardParams) => {
  //     setBoard((prevBoard) => {
  //       // Find the source and destination columns
  //       const sourceColumn = prevBoard.find(
  //         (column) => column.id === sourceColumnId
  //       );
  //       const destinationColumn = prevBoard.find(
  //         (column) => column.id === destinationColumnId
  //       );

  //       if (!sourceColumn || !destinationColumn) return prevBoard;

  //       // Identify the card to move
  //       const cardToMove = sourceColumn.tasks[movedTaskIndexInSourceColumn];
  //       if (!cardToMove) return prevBoard;

  //       // Insert the card into the destination column at the specified index
  //       const updatedDestinationItems = [...destinationColumn.tasks];
  //       updatedDestinationItems.splice(
  //         movedTaskIndexInDestinationColumn,
  //         0,
  //         cardToMove
  //       );

  //       return prevBoard.map((col) => {
  //         // Remove the card from the source column
  //         if (col.id === sourceColumnId) {
  //           return {
  //             ...col,
  //             tasks: sourceColumn.tasks.filter(
  //               (_, index) => index !== movedTaskIndexInSourceColumn
  //             ),
  //           };
  //         }
  //         if (col.id === destinationColumnId) {
  //           return { ...col, tasks: updatedDestinationItems };
  //         }
  //         return col;
  //       });
  //     });
  //   },
  //   []
  // );

  // const reorderItems = React.useCallback(
  //   ({ bucketId, startIndex, finishIndex }: ReorderBucketParams) => {
  //     setItems((prevItems) => {
  //       const orderItems = prevItems.filter(
  //         (item) => item.bucket.id === bucketId
  //       );
  //       console.log("before reorderItems", orderItems);
  //       const reorderedItems = reorder({
  //         list: orderItems,
  //         startIndex,
  //         finishIndex,
  //       });
  //       console.log("after reorderItems", reorderedItems);
  //       return { ...prevItems, ...reorderedItems };
  //     });
  //   },
  //   []
  // );

  // const handleDrop = React.useCallback(
  //   (args: BaseEventPayload<ElementDragType>) => {
  //     const { source, location } = args;
  //     if (!location.current.dropTargets.length) return;

  //     if (source.data.type === "item") {
  //       // Retrieve the ID of the card being dragged
  //       const draggedItemId = source.data.itemId;
  //       const sourceBucketId = location.initial.dropTargets[1]?.data
  //         .bucketId as string;
  //       const sourceBucket = buckets.find(
  //         (bucket) => bucket.id === sourceBucketId
  //       );
  //       if (!sourceBucket) return;
  //       const draggedItemIndex = items.findIndex(
  //         (item: Item) => item.id === draggedItemId
  //       );
  //       const sourceBucketItems = items.filter(
  //         (item: Item) => item.bucket.id === sourceBucketId
  //       );
  //       // Case 1: Dropping on a bucket (empty space)
  //       if (location.current.dropTargets.length === 1) {
  //         const [destinationBucketRecord] = location.current.dropTargets;
  //         const destinationBucketId = destinationBucketRecord.data
  //           .bucketId as string;
  //         // If dropping in the same bucket

  //         if (sourceBucketId === destinationBucketId) {
  //           const destinationIndex = getReorderDestinationIndex({
  //             startIndex: draggedItemIndex,
  //             indexOfTarget: sourceBucketItems.length - 1,
  //             closestEdgeOfTarget: null,
  //             axis: "vertical",
  //           });
  //           // reorder
  //           return;
  //         }
  //         // Move if dropping in a different bucket
  //         return;
  //       }
  //       // Case 2: Dropping on a task
  //       if (location.current.dropTargets.length === 2) {
  //         //     const [destinationTaskRecord, destinationColumnRecord] =
  //         //       location.current.dropTargets;
  //         //     const destinationColumnId = destinationColumnRecord.data
  //         //       .columnId as string;
  //         //     const destinationColumn = board.find(
  //         //       (column) => column.id === destinationColumnId
  //         //     );
  //         //     if (!destinationColumn) return;
  //         //     const indexOfTarget = destinationColumn.tasks.findIndex(
  //         //       (task) => task.id === destinationTaskRecord.data.id
  //         //     );
  //         //     if (indexOfTarget === -1) return;
  //         //     const closestEdgeOfTarget = extractClosestEdge(
  //         //       destinationTaskRecord.data
  //         //     );
  //         // If reordering within the same column
  //         //     if (sourceColumnId === destinationColumnId) {
  //         //       const destinationIndex = getReorderDestinationIndex({
  //         //         startIndex: draggedTaskIndex,
  //         //         indexOfTarget,
  //         //         closestEdgeOfTarget,
  //         //         axis: "vertical",
  //         //       });
  //         //       reorderTask({
  //         //         columnId: sourceColumnId,
  //         //         startIndex: draggedTaskIndex,
  //         //         finishIndex: destinationIndex,
  //         //       });
  //         //       return;
  //         //     }
  //         //     // If moving to a different column
  //         //     const destinationIndex =
  //         //       closestEdgeOfTarget === "bottom"
  //         //         ? indexOfTarget + 1
  //         //         : indexOfTarget;
  //         //     moveCard({
  //         //       movedTaskIndexInSourceColumn: draggedTaskIndex,
  //         //       sourceColumnId,
  //         //       destinationColumnId,
  //         //       movedTaskIndexInDestinationColumn: destinationIndex,
  //         //     });
  //       }
  //     }
  //   },
  //   []
  // );

  // React.useEffect(() => {
  //   return monitorForElements({
  //     onDrop: handleDrop,
  //   });
  // }, [handleDrop]);

  return { bucketsQuery, itemsQuery };
};
