import { Badge } from "@/feature/shared/ui/badge";
import { memo } from "react";
import { Item } from "@/@types/item";
import { getPriorityColor } from "../project/views/kanban/shared/utils";

interface TaskPriorityBadgeProps {
  priority: Item["priority"];
}

export const TaskPriorityBadge = memo(function TaskPriorityBadge({
  priority,
}: TaskPriorityBadgeProps) {
  const { badgeBg } = getPriorityColor(priority ?? "default");

  return (
    <div className="flex items-center">
      <Badge
        variant="outline"
        className={`rounded-sm px-2 py-0.5 text-xs ${badgeBg}`}
      >
        {priority}
      </Badge>
    </div>
  );
});
