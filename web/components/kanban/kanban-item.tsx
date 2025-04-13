import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Item } from "./types";
import { ItemSheet } from "../sheets/item-sheet";
import { DualButton } from "../task/dual-button";
import { Draggable } from "@hello-pangea/dnd";

interface KanbanCardProps {
  item: Item;
  index: number;
}

export const KanbanItem = ({ item, index }: KanbanCardProps) => {
  return (
    <ItemSheet item={item}>
      <Draggable draggableId={item.id} index={index}>
        {(provided) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            // {...provided.dragHandleProps}
            className={cn(
              "relative rounded-lg group p-3 shadow-sm w-full hover:cursor-grab gap-0 active:cursor-grabbing",
              "bg-card hover:bg-muted"
              // snapshot.isDragging && "shadow-md rotate-2 scale-[1.02]"
            )}
          >
            <CardContent className="p-0 flex flex-col">
              <h4 className="mb-1 font-medium text-sm">{item.name}</h4>
              {item.description && (
                <p className="mb-3 truncate text-sm text-muted-foreground select-all">
                  {item.description}
                </p>
              )}
            </CardContent>
            <DualButton
              className="bg-muted"
              data={{
                itemId: item.id,
                projectId: item.bucket.project.id,
                status: item.status,
              }}
            />
          </Card>
        )}
      </Draggable>
    </ItemSheet>
  );
};
