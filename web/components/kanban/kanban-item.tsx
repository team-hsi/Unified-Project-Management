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
// import { TaskAssignees } from "@/components/task/task-assignees";
import { Card, CardContent, CardFooter } from "../ui/card";
// import { TaskSheet } from "../sheets/task-sheet";
// import { CircleCheck, CornerLeftUp, MessageSquare } from "lucide-react";
import { MessageSquare } from "lucide-react";
// import { TaskPriorityBadge } from "../task/task-priority-badge";
// import { getStatusStyles } from "./utils";
import { Item } from "./types";

interface KanbanCardProps {
  item: Item;
}

export const KanbanCard = ({ item }: KanbanCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null); // NEW
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "item", itemId: item.id }),
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
          const data = { type: "item", itemId: item.id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDrag: (args) => {
          if (args.source.data.id !== item.id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragEnter: (args) => {
          if (args.source.data.id !== item.id) {
            console.log("onDragEnter", args);
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
  }, [item.id]);

  return (
    <Card
      className={cn(
        "relative rounded-sm bg-background p-3 shadow-sm  hover:cursor-grab gap-0 active:cursor-grabbing",
        "bg-card hover:bg-muted",
        { "opacity-50": isDragging }
      )}
      ref={ref}
    >
      {/* <CardHeader className="p-0 pb-2 m-0">
        {task.labels.length > 0 ? (
          <div
            className={cn(
              "flex items-center text-xs gap-2 text-muted-foreground"
            )}
          >
            <CornerLeftUp size={10} />
            <span>{task.parentTaskId}</span>
          </div>
        ) : (
          <TaskPriorityBadge priority={task.priority} />
        )}
      </CardHeader> */}
      <CardContent className="p-0 border-b">
        <h4 className="mb-1 font-medium">{item.name}</h4>
        {item.description && (
          <p className="mb-3 truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="px-0 pt-2 flex items-center justify-between">
        {/* <TaskAssignees assignees={task.assignees} /> */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {/* {task.childTasksCount && (
            <div className="flex items-center gap-1">
              <CircleCheck className="h-3.5 w-3.5" />
              <span>
                {task.childTasksCompleted}/{task.childTasksCount}
              </span>
            </div>
          )} */}
        </div>
      </CardFooter>
      {closestEdge && <DropIndicator edge={closestEdge} />}
    </Card>
  );
};
