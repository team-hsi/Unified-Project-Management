"use client";
import { Card } from "@/feature/shared/ui/card";
import { Button } from "@/feature/shared/ui/button";
import { Calendar, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/feature/shared/ui/dropdown-menu";
import { useState } from "react";
import { DeleteMilestone } from "./delete-milestone";
import { Milestone } from "@/feature/shared/@types/milestone";
import { format } from "date-fns";
import { useMilestone } from "@/feature/shared/hooks/use-milestone";

interface MilestoneItemProps {
  milestone: Milestone;
  onClick: (milestone: Milestone) => void;
}

export function MilestoneItem({ milestone, onClick }: MilestoneItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { remove } = useMilestone({ projectId: milestone.projectId });
  // const handleSave = async () => {
  //   await update.mutateAsync({
  //     id: milestone.id,
  //     name: editedName,
  //     color: editedColor,
  //   });
  //   setIsEditing(false);
  // };

  const handleDelete = async () => {
    await remove.mutateAsync(milestone.id);
  };

  return (
    <Card
      className="p-4 shadow-md rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer w-full space-y-2"
      onClick={() => onClick(milestone)}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base truncate">{milestone.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <Trash className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {milestone.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {milestone.description}
        </p>
      )}
      {(milestone.startDate || milestone.targetDate) && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          {milestone.startDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Start: {format(new Date(milestone.startDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
          {milestone.targetDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Target: {format(new Date(milestone.targetDate), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
      )}

      {isDeleting && (
        <DeleteMilestone
          open={isDeleting}
          onOpenChange={setIsDeleting}
          milestone={milestone}
          onDelete={handleDelete}
          onClose={() => setIsDeleting(false)}
        />
      )}
    </Card>
  );
}
