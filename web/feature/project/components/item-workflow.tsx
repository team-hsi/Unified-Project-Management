"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/feature/shared/ui/tabs";
import { CheckList } from "./check-list";
import { Item } from "@/feature/shared/@types/item";

export const ItemWorkflow = ({ item }: { item: Item }) => {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="subtasks" className="flex-1 flex flex-col">
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
        <div className="flex-1 overflow-auto">
          <TabsContent
            value="subtasks"
            className="flex flex-col gap-3 px-4 py-2 m-0 h-full"
          >
            <CheckList lists={item.checklist} itemId={item.id} />
          </TabsContent>
          <TabsContent value="comments" className="p-4 m-0 h-full">
            <p className="text-center text-sm text-muted-foreground">
              Content for Tab 2
            </p>
          </TabsContent>
          <TabsContent value="activities" className="p-4 m-0 h-full">
            <p className="text-center text-sm text-muted-foreground">
              Content for Tab 3
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
