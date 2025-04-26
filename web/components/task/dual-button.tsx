import { Button } from "@/components/ui/button";
import { useItemAction } from "@/hooks/use-item";
import { cn } from "@/lib/utils";
import { CheckCircle, Trash } from "lucide-react";

export const DualButton = ({
  className,
  data,
}: {
  className?: string;
  data: {
    itemId: string;
    projectId: string;
    status?: string;
  };
}) => {
  const { deleteItem, updateItemInline } = useItemAction({
    queryKey: [data.projectId, "items"],
  });
  return (
    <div
      className={cn(
        "absolute opacity-0 top-0 right-0  group-hover:opacity-100 transition-opacity duration-300 m-0.5 -space-x-px rounded-lg shadow-sm rtl:space-x-reverse",
        className
      )}
    >
      <Button
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant="outline"
        size="icon"
        aria-label="edit-item"
        onClick={(e) => {
          e.stopPropagation();
          updateItemInline.mutateAsync({
            status: data.status === "complete" ? "incomplete" : "complete",
            id: data.itemId,
          });
        }}
      >
        <CheckCircle
          size={16}
          strokeWidth={1}
          aria-hidden="true"
          className={`${data.status === "complete" ? "text-emerald-500" : ""}`}
        />
      </Button>
      <Button
        className="rounded-none shadow-none hover:text-red-500 first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant="outline"
        size="icon"
        aria-label="delete-item"
        onClick={(e) => {
          e.stopPropagation();
          deleteItem.mutateAsync({ id: data.itemId });
        }}
      >
        <Trash size={16} strokeWidth={1} aria-hidden="true" />
      </Button>
    </div>
  );
};
