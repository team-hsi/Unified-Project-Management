import { PlusIcon } from "lucide-react";
import { KanbanCard } from "@/components/kanban/kanban-card";
import type { Column } from "./types";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "@/lib/utils";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { getStatusStyles } from "./utils";
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
      className={cn(
        "rounded-lg p-4 h-fit flex flex-col max-w-92 bg-muted",
        getStatusStyles(column.id).bg,
        {
          "bg-sidebar ": isDraggedOver,
        }
      )}
      ref={ref}
    >
      <div
        className={cn(
          "bg-muted mb-4 flex items-center justify-between rounded-md p-2",
          getStatusStyles(column.id).bg
        )}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2",
              getStatusStyles(column.id).border
            )}
          />
          <h3 className="font-medium">{column.title}</h3>
          <span className={cn(" ml-2 text-muted-foreground")}>
            {column.count}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto" ref={scrollRef}>
        {column.tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
