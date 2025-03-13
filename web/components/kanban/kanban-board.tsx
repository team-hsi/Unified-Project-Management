"use client";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { data } from "@/components/kanban/kanban-data";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import type { Column } from "./types";

export default function KanbanBoard() {
  const { columns } = useKanbanBoard(data);

  return (
    <div className="min-h-screen p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column: Column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
