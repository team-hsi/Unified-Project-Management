import { PlusIcon } from "lucide-react";
// import { KanbanCard } from "@/components/kanban/kanban-card";
import type { Bucket, Item } from "./types";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import stringToColor, { cn } from "@/lib/utils";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
// import { getStatusStyles } from "./utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { KanbanCard } from "./kanban-item";

interface KanbanColumnProps {
  bucket: Bucket;
  items?: Item[];
}

export const KanbanBucket = ({ bucket, items }: KanbanColumnProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollRef);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        onDragStart: () => setIsDraggedOver(true),
        onDragEnter: () => setIsDraggedOver(true),
        onDragLeave: () => setIsDraggedOver(false),
        onDrop: () => setIsDraggedOver(false),
        getData: () => {
          return { type: "bucket", bucketId: bucket.id, items: items };
        },
        getIsSticky: () => true,
      })
    );
  }, [bucket.id, items]);
  const color = stringToColor(bucket.name + bucket.createdAt);

  return (
    <div
      className={cn("rounded-lg p-4 h-fit flex flex-col w-92 border", {
        // "bg-white/20 ": isDraggedOver,
      })}
      style={{
        backgroundColor: isDraggedOver
          ? "rgba(255, 255, 255, 0.3)"
          : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
              color.slice(3, 5),
              16
            )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`, // 0.5 is 50% opacity
      }}
      ref={ref}
    >
      <div
        className={cn(
          "bg-muted mb-4 flex items-center justify-between rounded-md p-2"
        )}
        style={{
          backgroundColor: `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
            color.slice(3, 5),
            16
          )}, ${parseInt(color.slice(5, 7), 16)}, 0.2)`, // 0.5 is 50% opacity
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className={cn(
              "h-4 w-4 rounded-full border-2"

              // getStatusStyles(bucket.id).border
            )}
            style={{ borderColor: color }}
          />
          <h3 className="font-medium">{bucket.name}</h3>
          {/* <span className={cn(" ml-2 text-muted-foreground")}>
            {bucket.count}
          </span> */}
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto" ref={scrollRef}>
        {items?.map((item) => (
          <KanbanCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
