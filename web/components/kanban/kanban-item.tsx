import { cn, hexToRgba } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { ItemSheet } from "../sheets/item-sheet";
import { DualButton } from "../task/dual-button";
import { Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "../ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { useLabels } from "@/hooks/use-labels";
import { Item } from "@/@types/item";

interface KanbanCardProps {
  item: Item;
  index: number;
}

export const KanbanItem = ({ item, index }: KanbanCardProps) => {
  const { labels } = useLabels({
    projectId: item.bucket.project.id,
  });
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "relative rounded-lg group p-3 border-none pt-2 shadow-sm w-full bg-background hover:bg-muted hover:cursor-grab gap-0 active:cursor-grabbing"
            // snapshot.isDragging && "shadow-md rotate-2 scale-[1.02]"
          )}
          // style={{
          //   backgroundColor: hexToRgba(color, 0.9),
          // }}
        >
          <ItemSheet item={item}>
            <CardContent className="p-0 flex flex-col">
              <div className="flex items-center gap-1 mb-2">
                {item.labels?.map((label) => {
                  const itemLabel = labels.data?.data.find(
                    (l: { id: string }) => l.id === label.id
                  );
                  return (
                    itemLabel && (
                      <Badge
                        key={itemLabel.id}
                        variant="outline"
                        className="text-xs border"
                        style={{
                          backgroundColor: hexToRgba(itemLabel.color, 0.1),
                          color: itemLabel.color,
                          borderColor: itemLabel.color,
                        }}
                      >
                        {itemLabel.name}
                      </Badge>
                    )
                  );
                })}
              </div>
              <div className=" flex gap-1 items-center">
                <AnimatePresence mode="wait">
                  {item.status === "complete" && (
                    <motion.div
                      key="checkbox"
                      initial={{ opacity: 0, scale: 0.8, x: -5 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Checkbox
                        className="rounded-full data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 border-foreground cursor-pointer"
                        checked={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <h4
                  className="font-medium text-sm line-clamp-1 group-hover:line-clamp-none"
                  title={item.name}
                >
                  {item.name}
                </h4>
              </div>
              {item.description && (
                <p className="mb-3 truncate text-sm text-muted-foreground select-all">
                  {item.description}
                </p>
              )}
            </CardContent>
          </ItemSheet>
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
  );
};
