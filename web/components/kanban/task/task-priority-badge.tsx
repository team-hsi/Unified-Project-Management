import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "../utils";
import { memo } from "react";
import { Task } from "../types";

interface TaskPriorityBadgeProps {
  priority: Task["priority"];
}

export const TaskPriorityBadge = memo(function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const colorClass = getPriorityColor(priority);

  return (
    <div className="mb-2 flex items-center">
      <Badge
        variant="outline"
        className={`rounded-full px-2 py-0.5 text-xs ${colorClass} border-0 bg-opacity-10`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${colorClass} mr-1`}
          aria-hidden="true"
        />
        {priority}
      </Badge>
    </div>
  );
});
