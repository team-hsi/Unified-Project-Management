import * as React from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import type {
  Column,
  MoveCardParams,
  ReorderTaskParams,
} from "@/components/kanban/types";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export const useKanbanBoard = (initialData: Column[]) => {
  const [board, setBoard] = React.useState<Column[]>(initialData);

  const moveCard = React.useCallback(
    ({
      movedTaskIndexInSourceColumn,
      sourceColumnId,
      destinationColumnId,
      movedTaskIndexInDestinationColumn,
    }: MoveCardParams) => {
      setBoard((prevBoard) => {
        // Find the source and destination columns
        const sourceColumn = prevBoard.find(
          (column) => column.id === sourceColumnId
        );
        const destinationColumn = prevBoard.find(
          (column) => column.id === destinationColumnId
        );

        if (!sourceColumn || !destinationColumn) return prevBoard;

        // Identify the card to move
        const cardToMove = sourceColumn.tasks[movedTaskIndexInSourceColumn];
        if (!cardToMove) return prevBoard;

        // Insert the card into the destination column at the specified index
        const updatedDestinationItems = [...destinationColumn.tasks];
        updatedDestinationItems.splice(
          movedTaskIndexInDestinationColumn,
          0,
          cardToMove
        );

        return prevBoard.map((col) => {
          // Remove the card from the source column
          if (col.id === sourceColumnId) {
            return {
              ...col,
              tasks: sourceColumn.tasks.filter(
                (_, index) => index !== movedTaskIndexInSourceColumn
              ),
            };
          }
          if (col.id === destinationColumnId) {
            return { ...col, tasks: updatedDestinationItems };
          }
          return col;
        });
      });
    },
    []
  );

  const reorderTask = React.useCallback(
    ({ columnId, startIndex, finishIndex }: ReorderTaskParams) => {
      setBoard((prevBoard) =>
        prevBoard.map((column) =>
          column.id === columnId
            ? {
                ...column,
                tasks: reorder({ list: column.tasks, startIndex, finishIndex }),
              }
            : column
        )
      );
    },
    []
  );

  const handleDrop = React.useCallback(
    (args: BaseEventPayload<ElementDragType>) => {
      const { source, location } = args;
      if (!location.current.dropTargets.length) return;

      if (source.data.type === "task") {
        // Retrieve the ID of the card being dragged
        const draggedTaskId = source.data.id;
        const sourceColumnId = location.initial.dropTargets[1]?.data
          .columnId as string;

        const sourceColumn = board.find(
          (column) => column.id === sourceColumnId
        );

        if (!sourceColumn) return;

        const draggedTaskIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === draggedTaskId
        );

        if (draggedTaskIndex === -1) return;

        // Case 1: Dropping on a column
        if (location.current.dropTargets.length === 1) {
          const [destinationColumnRecord] = location.current.dropTargets;
          const destinationColumnId = destinationColumnRecord.data
            .columnId as string;

          // If dropping in the same column
          if (sourceColumnId === destinationColumnId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: draggedTaskIndex,
              indexOfTarget: sourceColumn.tasks.length - 1,
              closestEdgeOfTarget: null,
              axis: "vertical",
            });

            reorderTask({
              columnId: sourceColumnId,
              startIndex: draggedTaskIndex,
              finishIndex: destinationIndex,
            });
            return;
          }

          // If dropping in a different column
          const movedTaskIndexInDestinationColumn =
            board.find((column) => column.id === destinationColumnId)?.tasks
              .length ?? 0;

          moveCard({
            movedTaskIndexInSourceColumn: draggedTaskIndex,
            sourceColumnId,
            destinationColumnId,
            movedTaskIndexInDestinationColumn,
          });
          return;
        }

        // Case 2: Dropping on a task
        if (location.current.dropTargets.length === 2) {
          const [destinationTaskRecord, destinationColumnRecord] =
            location.current.dropTargets;
          const destinationColumnId = destinationColumnRecord.data
            .columnId as string;
          const destinationColumn = board.find(
            (column) => column.id === destinationColumnId
          );

          if (!destinationColumn) return;

          const indexOfTarget = destinationColumn.tasks.findIndex(
            (task) => task.id === destinationTaskRecord.data.id
          );

          if (indexOfTarget === -1) return;

          const closestEdgeOfTarget = extractClosestEdge(
            destinationTaskRecord.data
          );

          // If reordering within the same column
          if (sourceColumnId === destinationColumnId) {
            const destinationIndex = getReorderDestinationIndex({
              startIndex: draggedTaskIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "vertical",
            });

            reorderTask({
              columnId: sourceColumnId,
              startIndex: draggedTaskIndex,
              finishIndex: destinationIndex,
            });
            return;
          }

          // If moving to a different column
          const destinationIndex =
            closestEdgeOfTarget === "bottom"
              ? indexOfTarget + 1
              : indexOfTarget;

          moveCard({
            movedTaskIndexInSourceColumn: draggedTaskIndex,
            sourceColumnId,
            destinationColumnId,
            movedTaskIndexInDestinationColumn: destinationIndex,
          });
        }
      }
    },
    [board, moveCard, reorderTask]
  );

  React.useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, [handleDrop]);

  return { board, moveCard, reorderTask };
};
