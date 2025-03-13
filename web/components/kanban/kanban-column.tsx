import { PlusIcon } from "lucide-react";
import { TaskCard } from "@/components/kanban/kanban-card";
import type { Column } from "./types";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { cn } from "@/lib/utils";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

interface KanbanColumnProps {
  column: Column;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
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
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    return autoScrollForElements({
      element,
    });
  }, []);

  const getStatusColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "border-2 border-gray-400";
      case "progress":
        return "border-2 border-blue-400";
      case "review":
        return "border-2 border-amber-400";
      case "completed":
        return "border-2 border-green-400";
      default:
        return "border-2 border-gray-400";
    }
  };

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
      <div className="space-y-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
