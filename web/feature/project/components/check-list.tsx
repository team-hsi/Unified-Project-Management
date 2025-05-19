"use client";
import React from "react";

import { Checkbox } from "@/feature/shared/ui/checkbox";
import { Card, CardContent } from "@/feature/shared/ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/feature/shared/ui/button";
import { CreateCheckList } from "../overlays/create-check-list";
import type { CheckList as Check } from "@/feature/shared/@types/check-list";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/feature/shared/ui/tooltip";
import { useItem } from "@/feature/shared/hooks/use-item";

export const CheckList = ({
  lists,
  itemId,
}: {
  lists: Check[] | null;
  itemId: string;
}) => {
  const [checklist, setCheckList] = React.useState(lists || []);
  const { update } = useItem();

  React.useEffect(() => {
    setCheckList(lists || []);
  }, [lists]);

  const handleToggle = async (index: number) => {
    setCheckList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
    await update.mutateAsync({ checklist, id: itemId });
    toast.success("Update", {
      description: "Checklist updated successfully!",
    });
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
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="w-full  rounded-2xl border-none bg-gradient-to-br from-background/80 to-accent/30 shadow-lg p-0 mb-2">
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Checklist
          </span>
          <span className="text-sm font-semibold">
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
              <Button
                size="icon"
                className="rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-md transition-all duration-200"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </CreateCheckList>
          </TooltipTrigger>
          <TooltipContent>Add New</TooltipContent>
        </Tooltip>
      </div>
      {/* Progress Bar */}
      <div className="px-6 pb-2">
        <div className="w-full h-2 bg-accent/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <CardContent className="space-y-3 px-3 pt-2 pb-5">
        {checklist.map((list, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 px-4 py-3 bg-white/90 dark:bg-background/80 border border-primary/20 rounded-xl shadow-sm transition-all duration-200",
              list.isCompleted
                ? "line-through text-muted-foreground opacity-70"
                : "text-foreground hover:border-primary/40"
            )}
            style={{
              boxShadow: list.isCompleted
                ? "0 1px 4px 0 rgba(80,80,80,0.04)"
                : "0 2px 8px 0 rgba(80,80,80,0.08)",
            }}
          >
            <Checkbox
              checked={list.isCompleted}
              onCheckedChange={() => handleToggle(index)}
              className={cn(
                "border-2 h-5 w-5 rounded-full shadow-none transition-all duration-200",
                list.isCompleted
                  ? "bg-primary/80 border-primary"
                  : "bg-white dark:bg-background border-primary/40 hover:border-primary"
              )}
              style={{ accentColor: "var(--primary)" }}
            />
            <span className="text-base font-medium flex-1 truncate">
              {list.description}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
