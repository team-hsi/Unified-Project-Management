"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Task } from "../kanban/types";
export const TaskWorkflow = ({ subtasks }: { subtasks: Task["subtasks"] }) => {
  return (
    <div className="px-6">
      <Tabs defaultValue="subtasks">
        <TabsList className="h-auto rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger
            value="subtasks"
            className="underline-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            Subtasks
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="underline-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            Comments
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="underline-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="subtasks" className="flex flex-col gap-3">
          <div className="flex justify-between items-center mb-4">
            <p>Completed</p>
            <p>
              {subtasks.filter((subtask) => subtask.completed).length} /{" "}
              {subtasks.length}
            </p>
          </div>
          {subtasks.map((subtask) => (
            <Card
              key={subtask.id}
              className="border-input has-data-[state=checked]:border-ring flex w-full items-start rounded-md border p-4 shadow-xs"
            >
              <div className="colored-checkbox">
                <Checkbox
                  id={`test-${subtask.id}`}
                  defaultChecked={subtask.completed}
                />
                <Label
                  htmlFor={`test-${subtask.id}`}
                  className="checked-line-through "
                >
                  {subtask.title}
                </Label>
              </div>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="comments">
          <p className="p-4 text-center text-xs text-muted-foreground">
            Content for Tab 2
          </p>
        </TabsContent>
        <TabsContent value="activities">
          <p className="p-4 text-center text-xs text-muted-foreground">
            Content for Tab 3
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
