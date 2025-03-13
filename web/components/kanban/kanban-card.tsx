import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, CircleCheck } from "lucide-react";
import type { Task, Priority } from "./types";
import { useEffect, useRef, useState } from "react";
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

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null); // NEW
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const cleanup = combine(
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

    return cleanup;
  }, [task]);
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "Low":
        return "bg-cyan-500";
      case "Medium":
        return "bg-amber-500";
      case "High":
        return "bg-rose-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate completed subtasks
  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div
      className={cn(
        "relative rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:cursor-grab",
        { "opacity-50": isDragging }
      )}
      ref={ref}
    >
      <div className="mb-2 flex items-center">
        <Badge
          variant="outline"
          className={`rounded-full px-2 py-0.5 text-xs ${getPriorityColor(
            task.priority
          )} border-0 bg-opacity-10`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${getPriorityColor(
              task.priority
            )} mr-1`}
          ></span>
          {task.priority}
        </Badge>
      </div>
      <h4 className="mb-1 font-medium text-gray-800">{task.title}</h4>
      {task.description && (
        <p className="mb-3 truncate text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex -space-x-2">
          {task.assignees.map((assignee) => (
            <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white">
              {assignee.avatar ? (
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
              ) : null}
              <AvatarFallback className="bg-gray-100 text-[10px] text-gray-600">
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
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
}
