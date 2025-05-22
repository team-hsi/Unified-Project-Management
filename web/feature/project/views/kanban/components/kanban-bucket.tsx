"use client";
import { KanbanItem } from "./kanban-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn, hexToRgba } from "@/lib/utils";
import { Button } from "@/feature/shared/ui/button";
import InlineEdit from "@/feature/shared/ui/inline-edit";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Bucket } from "@/feature/shared/@types/bucket";
import { BucketDropdown } from "../dropdown/bucket-dropdown";
import { useBucket } from "@/feature/shared/hooks/use-bucket";
import AddCardForm from "./add-item-form";
import { useItem } from "@/feature/shared/hooks/use-item";

interface KanbanBucketProps {
  bucket: Bucket;
  index: number;
}

export const KanbanBucket = ({ bucket, index }: KanbanBucketProps) => {
  const [lastAttemptedName, setLastAttemptedName] = React.useState<
    string | null
  >(null);
  const [isAddingCard, setIsAddingCard] = useState(false);

  const { update } = useBucket();
  const { create } = useItem();
  const displayName = update.isPending ? update.variables?.name : bucket.name;

  const handleAddCard = async (content: string) => {
    setIsAddingCard(false);
    await create.mutateAsync({
      name: content,
      bucketId: bucket.id,
      projectId: bucket.project.id,
    });
  };

  const handleCancelAdd = () => {
    setIsAddingCard(false);
  };
  const handleSave = (value: string) => {
    setLastAttemptedName(value);
    update.mutate({ id: bucket.id, name: value });
  };

  const handleRetry = () => {
    if (lastAttemptedName) {
      update.mutate({ id: bucket.id, name: lastAttemptedName });
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
              {update.isError ? (
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
            <BucketDropdown bucket={bucket} />
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
          {!isAddingCard ? (
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                onClick={() => setIsAddingCard(true)}
              >
                <Plus size={16} className="mr-1" /> Add a card
              </Button>
            </div>
          ) : (
            <div className="p-2">
              <AddCardForm
                onSubmit={handleAddCard}
                onCancel={handleCancelAdd}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
