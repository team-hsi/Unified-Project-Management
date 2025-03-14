import { PlusIcon } from "lucide-react";
import { KanbanCard } from "@/components/kanban/kanban-card";
import type { Column } from "./types";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "@/lib/utils";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { getStatusColor } from "./utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

interface KanbanColumnProps {
  column: Column;
}

export const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollRef);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        onDragStart: () => setIsDraggedOver(true),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        getData: () => {
          return { columnId: column.id };
        },
        getIsSticky: () => true,
      })
    );
  }, [column]);

  return (
    <div
      className={cn("rounded-lg p-4", { "bg-blue-50": isDraggedOver })}
      ref={ref}
    >
      <div className="bg-muted mb-4 flex items-center justify-between rounded-md p-2">
        <div className="flex items-center justify-center gap-2">
          <div
            className={`h-4 w-4 rounded-full ${getStatusColor(column.id)}`}
          />
          <h3 className="font-medium text-gray-700">{column.title}</h3>
          <span className="flex size-4 items-center justify-center rounded-sm bg-violet-100 text-[10px] text-violet-900">
            {column.count}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3" ref={scrollRef}>
        {column.tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
