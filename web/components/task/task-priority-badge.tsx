import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "../kanban/utils";
import { memo } from "react";
import { Task } from "@/components/task/types";

interface TaskPriorityBadgeProps {
  priority: Task["priority"];
}

export const TaskPriorityBadge = memo(function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const { badgeBg, pingBg } = getPriorityColor(priority);

  return (
    <div className="flex items-center">
      <Badge
        variant="outline"
        className={`rounded-sm px-2 py-0.5 text-xs ${badgeBg}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full mr-1 ${pingBg}`}
          aria-hidden="true"
        />
        {priority}
      </Badge>
    </div>
  );
});
