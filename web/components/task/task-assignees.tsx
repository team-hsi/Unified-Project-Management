import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { memo } from "react";
import { Task } from "./types";

interface TaskAssigneesProps {
  assignees: Task["assignees"];
}

export const TaskAssignees = memo(function TaskAssignees({
  assignees,
}: TaskAssigneesProps) {
  return (
    <div className="flex -space-x-2" role="group" aria-label="Task assignees">
      {assignees.map((assignee) => (
        <Avatar
          key={assignee.id}
          className="h-6 w-6 border-2 border-white"
          title={assignee.name}
        >
          {assignee.avatar ? (
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
          ) : null}
          <AvatarFallback className="bg-gray-100 text-[10px] text-gray-600">
            {assignee.initials}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
});
