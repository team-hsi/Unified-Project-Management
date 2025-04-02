"use client";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import type { Column } from "./types";

export const KanbanBoard = () => {
  const { board } = useKanbanBoard();
  return (
    <div className="w-fill grid w-fit mx-auto grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {board.map((column: Column) => (
        <KanbanColumn key={column.id} column={column} />
      ))}
    </div>
  );
};
