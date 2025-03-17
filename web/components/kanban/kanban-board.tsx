"use client";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { boardData } from "@/lib/stores/initial-data";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import type { Column } from "./types";

export const KanbanBoard = () => {
  const { board } = useKanbanBoard(boardData);

  return (
    <div className="min-h-screen p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {board.map((column: Column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};
