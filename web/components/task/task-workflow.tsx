"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const TaskWorkflow = () => {
  //TODO: Implement the  Subtasks, Comments and Activities tabs
  return (
    <div className=" w-4/5 mx-auto">
      <Tabs defaultValue="subtasks">
        <TabsList className="h-auto rounded-none border-b border-border bg-transparent w-full pb-0">
          <TabsTrigger
            value="subtasks"
            className="underline-tab data-[state=active]:bg-transparent flex-1 data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
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
          <p className="p-4 text-center text-xs text-muted-foreground">
            Content for Tab 1
          </p>
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
