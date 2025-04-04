import { useEffect, useRef, useState } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  Edge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "./drop-indicator";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Item } from "./types";
import { ItemSheet } from "../sheets/item-sheet copy";

interface KanbanCardProps {
  item: Item;
}

export const KanbanCard = ({ item }: KanbanCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null); // NEW
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: "item", itemId: item.id }),
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop: () => {
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        getData: ({ input, element }) => {
          const data = { type: "item", itemId: item.id };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDrag: (args) => {
          if (args.source.data.id !== item.id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragEnter: (args) => {
          if (args.source.data.id !== item.id) {
            console.log("onDragEnter", args);
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [item.id]);

  return (
    <ItemSheet item={item}>
      <Card
        className={cn(
          "relative rounded-sm bg-background p-3 shadow-sm w-full hover:cursor-grab gap-0 active:cursor-grabbing",
          "bg-card hover:bg-muted",
          { "opacity-50": isDragging }
        )}
        ref={ref}
      >
        <CardContent className="p-0">
          <h4 className="mb-1 font-medium">{item.name}</h4>
          {item.description && (
            <p className="mb-3 truncate text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
        </CardContent>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </Card>
    </ItemSheet>
  );
};
