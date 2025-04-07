import type { Bucket, Item } from "./types";
import { useEffect, useRef, useState } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import stringToColor, { cn } from "@/lib/utils";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { KanbanCard } from "./kanban-item";
import BucketDropdown from "./bucket-dropdown";
import InlineEdit from "../ui/inline-edit";
import { useBucketMutation } from "@/hooks/useBucketMutation";
import { Button } from "../ui/button";

interface KanbanBucketProps {
  bucket: Bucket;
  items?: Item[];
}

export const KanbanBucket = ({ bucket, items }: KanbanBucketProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [lastAttemptedName, setLastAttemptedName] = useState<string | null>(
    null
  );
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useAutoScroll(scrollRef);
  const { updateBucket } = useBucketMutation({
    queryKey: ["buckets", bucket.project.id],
  });

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

  const color = stringToColor(bucket.name + bucket.createdAt);
  return (
    <div
      className={cn("rounded-lg p-4 h-fit flex flex-col max-w-92 border ", {})}
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
        <div className="flex items-center justify-start gap-2 w-64">
          <div
            className={cn("h-4 w-4 rounded-full border-2")}
            style={{ borderColor: color }}
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
      <div className="space-y-3 flex-1 overflow-y-auto" ref={scrollRef}>
        {items?.map((item) => (
          <KanbanCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
