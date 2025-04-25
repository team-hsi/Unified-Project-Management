import { Badge } from "@/components/ui/badge";
import { getPriorityColor } from "../kanban/utils";
import { memo } from "react";
import { Item } from "@/@types/item";

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
