"use client";
import React from "react";

import { Checkbox } from "@/feature/shared/ui/checkbox";
import { Card, CardContent } from "@/feature/shared/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/feature/shared/ui/button";
import { CreateCheckList } from "../interactions/create-check-list";
import { useItemAction } from "@/feature/shared/hooks/use-item";
import type { CheckList as Check } from "@/feature/shared/@types/check-list";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/feature/shared/ui/tooltip";
import { useParams } from "next/navigation";

export const CheckList = ({
  lists,
  itemId,
}: {
  lists: Check[] | null;
  itemId: string;
}) => {
  const [checklist, setCheckList] = React.useState(lists || []);
  const { projectId } = useParams() as { projectId: string };
  const { updateItemInline } = useItemAction({
    queryKey: [projectId, "items"],
    successAction: () => {
      toast.success("Update", {
        description: "Checklist updated successfully!",
      });
    },
  });

  React.useEffect(() => {
    setCheckList(lists || []);
  }, [lists]);

  const handleToggle = async (index: number) => {
    setCheckList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
    await updateItemInline.mutateAsync({ checklist, id: itemId });
  };
  if (!checklist || checklist.length === 0) {
    return (
      <div className="p-5 w-full text-center">
        <p className="mb-4 text-muted-foreground">No checklist available</p>
        <CreateCheckList
          itemId={itemId}
          currentList={checklist}
          setCheckList={(value) => setCheckList(value)}
        >
          <Button className="px-4 py-2">Create One</Button>
        </CreateCheckList>
      </div>
    );
  }

  const total = checklist.length;
  const completed = checklist.filter(
    (task) => task.isCompleted === true
  ).length;

  return (
    <Card className="w-full max-w-xl rounded-xl border p-6 pt-3 mb-2 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Completed {completed}/{total}
          </span>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <CreateCheckList
              itemId={itemId}
              currentList={checklist}
              setCheckList={(value) => setCheckList(value)}
            >
              <Plus className="hover:cursor-pointer" />
            </CreateCheckList>
          </TooltipTrigger>
          <TooltipContent>Add New</TooltipContent>
        </Tooltip>
      </div>

      <CardContent className="space-y-4 p-0">
        {checklist.map((list, index) => (
          <div key={index} className="space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={list.isCompleted}
                onCheckedChange={() => handleToggle(index)}
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
