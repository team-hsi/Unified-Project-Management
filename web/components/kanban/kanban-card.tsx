import { MessageSquare, CircleCheck } from "lucide-react";
import type { Task } from "./types";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "./drop-indicator";
import { cn } from "@/lib/utils";
import { TaskAssignees } from "./task/task-assignees";
import { TaskPriorityBadge } from "./task/task-priority-badge";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null); // NEW
  const ref = useRef<HTMLDivElement | null>(null);

  // Calculate completed subtasks
  const { completedSubtasks, totalSubtasks } = useMemo(() => {
    const completed = task.subtasks.filter((sub) => sub.completed).length;
    return {
      completedSubtasks: completed,
      totalSubtasks: task.subtasks.length,
    };
  }, [task.subtasks]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return combine(
      draggable({
        element,
        getInitialData: () => {
          return task as unknown as Record<string, unknown>;
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop: () => {
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          const data = task as unknown as Record<string, unknown>;
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDrag: (args) => {
          if (args.source.data.id !== task.id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragEnter: (args) => {
          if (args.source.data.id !== task.id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [task]);

  return (
    <div
      className={cn(
        "relative rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:cursor-grab",
        { "opacity-50": isDragging }
      )}
      ref={ref}
    >
      <TaskPriorityBadge priority={task.priority} />
      <h4 className="mb-1 font-medium text-gray-800">{task.title}</h4>
      {task.description && (
        <p className="mb-3 truncate text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <TaskAssignees assignees={task.assignees} />
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
          </div>
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1">
              <CircleCheck className="h-3.5 w-3.5" />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}
        </div>
      </div>
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </div>
  );
};
