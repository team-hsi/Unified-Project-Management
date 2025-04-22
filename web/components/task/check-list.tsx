"use client";
import React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { CheckList as Check } from "../kanban/types";
import { Button } from "../ui/button";
import { CreateCheckList } from "./create-check-list";
// import { useItemAction } from "@/hooks/use-item";
// import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const CheckList = ({
  lists,
  itemId,
}: {
  lists: Check[] | null;
  itemId: string;
}) => {
  // const [checklist, setChecklist] = React.useState(lists || []);
  // const { updateItemInline } = useItemAction({
  //   queryKey: ["items", itemId],
  //   successAction: () => {
  //     toast.success("Update", {
  //       description: "Checklist updated successfully!",
  //     });
  //   },
  // });

  if (!lists || lists.length === 0) {
    return (
      <div className="p-5 w-full text-center">
        <p className="mb-4 text-muted-foreground">No checklist available</p>
        <CreateCheckList itemId={itemId}>
          <Button className="px-4 py-2">Create One</Button>
        </CreateCheckList>
      </div>
    );
  }

  const total = lists.length;
  const completed = lists.filter((task) => task.isCompleted === true).length;

  return (
    <Card className="w-full max-w-xl rounded-xl border p-6 pt-3 mb-2 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Completed {completed}/{total}
          </span>
        </div>
        <CreateCheckList itemId={itemId}>
          <Tooltip>
            <TooltipTrigger>
              <Plus className="hover:cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent>Hello</TooltipContent>
          </Tooltip>
        </CreateCheckList>
      </div>

      <CardContent className="space-y-4 p-0">
        {lists.map((list, index) => (
          <div key={index} className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                // checked={list.isCompleted}
                className="mt-1 border-white"
              />
              <span
                className={cn(
                  "text-base",
                  list.isCompleted && "line-through text-muted-foreground"
                )}
              >
                {list.description}
              </span>
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
