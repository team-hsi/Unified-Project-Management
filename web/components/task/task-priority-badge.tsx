import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "../kanban/utils";
import { memo } from "react";
import { Task } from "../kanban/types";

interface TaskPriorityBadgeProps {
  priority: Task["priority"];
}

export const TaskPriorityBadge = memo(function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const { bg, bgSpan } = getPriorityColor(priority);

  return (
    <div className="mb-2 flex items-center">
      <Badge
        variant="outline"
        className={`rounded-sm px-2 py-0.5 text-xs ${bg}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full mr-1 ${bgSpan}`}
          aria-hidden="true"
        />
        {priority}
      </Badge>
    </div>
  );
});
