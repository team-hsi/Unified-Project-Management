"use client";
import type { Bucket } from "./types";
import { KanbanItem } from "./kanban-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn, hexToRgba } from "@/lib/utils";
import BucketDropdown from "./bucket-dropdown";
import { Button } from "../ui/button";
import InlineEdit from "../ui/inline-edit";
import { useBucketAction } from "@/hooks/use-bucket";
import React from "react";
import { Plus } from "lucide-react";

interface KanbanBucketProps {
  bucket: Bucket;
  index: number;
}

export const KanbanBucket = ({ bucket, index }: KanbanBucketProps) => {
  const [lastAttemptedName, setLastAttemptedName] = React.useState<
    string | null
  >(null);
  const { updateBucket } = useBucketAction({
    queryKey: ["buckets", bucket.project.id],
  });
  const displayName = updateBucket.isPending
    ? updateBucket.variables?.name
    : bucket.name;

  const handleSave = (value: string) => {
    setLastAttemptedName(value);
    updateBucket.mutate({ id: bucket.id, name: value });
  };

  const handleRetry = () => {
    if (lastAttemptedName) {
      updateBucket.mutate({ id: bucket.id, name: lastAttemptedName });
    }
  };
  return (
    <Draggable key={bucket.id} draggableId={bucket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            backgroundColor: hexToRgba(bucket.color, 0.1),
          }}
          // className={cn("rounded-lg p-4 h-fit flex flex-col max-w-80 border ", {})}
          className="rounded-lg shadow-sm w-[300px] h-fit max-h-full flex flex-col p-2 pt-3"
        >
          <div
            className={cn(
              "bg-muted mb-4 flex items-center justify-between rounded-md p-2"
            )}
            style={{
              backgroundColor: hexToRgba(bucket.color, 0.2),
            }}
          >
            <div className="flex items-center justify-start gap-2 w-64">
              <div
                className={cn("rounded-full border-6")}
                style={{
                  borderColor: hexToRgba(bucket.color, 1),
                }}
              />
              {updateBucket.isError ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-destructive">
                    <span>{lastAttemptedName || bucket.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="h-6 px-2 text-xs"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <InlineEdit
                  text={displayName as string}
                  textStyle="cursor-pointer"
                  inputStyle="rounded-md"
                  onSave={handleSave}
                />
              )}
            </div>
            <BucketDropdown
              bucketId={bucket.id}
              projectId={bucket.project.id}
              color={bucket.color}
            />
          </div>
          <Droppable droppableId={bucket.id} type="item">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  "p-1 flex-1 overflow-y-auto space-y-2 scroll-container flex-col"
                )}
                style={{ transition: "background-color 0.2s ease" }}
              >
                {bucket.items?.map((item, index) => (
                  <KanbanItem key={item.id} item={item} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-muted-foreground"
          >
            <Plus size={16} className="mr-1" /> Add a card
          </Button>
        </div>
      )}
    </Draggable>
  );
};
