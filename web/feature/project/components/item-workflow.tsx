"use client";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/feature/shared/ui/tabs";
import { CheckList } from "./check-list";
import { ItemActivity } from "./item-activity";
import { useItem } from "@/feature/shared/hooks/use-item";
import { Button } from "@/feature/shared/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/feature/shared/ui/avatar";
import { UserPlus, UserMinus, UserX } from "lucide-react";
import { AddItemAssigneeDialog } from "./add-item-assignee-dialog";

export const ItemWorkflow = ({ itemId }: { itemId: string }) => {
  const { item, isLoading, error } = useItem(itemId);

  const handleAssign = async (userId: string) => {
    // TODO: Implement the actual assignment logic here
    console.log("Assigning user", userId, "to item", itemId);
  };

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-4">
        <div className="text-destructive font-medium">
          Failed to load item details
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

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
            value="assignees"
            className="underline-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            Assignees
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
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <CheckList
                lists={item?.checklist ?? null}
                itemId={itemId}
                bucketId={item?.bucket.id as string}
                projectId={item?.bucket.project.id as string}
              />
            )}
          </TabsContent>
          <TabsContent value="assignees" className="p-4 m-0 h-full">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Assigned Users</h3>
                  <AddItemAssigneeDialog
                    itemId={itemId}
                    projectId={item?.bucket.project.id ?? ""}
                    onAssign={handleAssign}
                  >
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Assignee
                    </Button>
                  </AddItemAssigneeDialog>
                </div>
                <div className="space-y-3">
                  {item?.assignees?.map((assignee) => (
                    <div
                      key={assignee.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={assignee.firstname}
                            alt={assignee.username}
                          />
                          <AvatarFallback>
                            {assignee.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{assignee.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignee.lastname}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!item?.assignees || item.assignees.length === 0) && (
                    <div className="text-center py-6 text-muted-foreground">
                      <UserX className="w-8 h-8 mx-auto mb-2" />
                      <p>No assignees yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
          <TabsContent value="activities" className="p-4 m-0 h-full">
            <div className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : (
                <ItemActivity
                  activities={item?.activities}
                  name={item?.name ?? ""}
                />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
