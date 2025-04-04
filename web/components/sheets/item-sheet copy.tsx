import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskBreadcrumb } from "./task-breadcrumb";
import { TaskWorkflow } from "../task/task-workflow";
import { Item } from "../kanban/types";
import { ItemDetails } from "../task/item-details";

export function ItemSheet({
  children,
  item,
}: {
  children: React.ReactNode;
  item: Item;
}) {
  const segments = ["design", "in-progress"];
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className="rounded-xl max-w-lg  md:max-w-xl lg:max-w-2xl"
        hideClose
      >
        <SheetTitle className="sr-only"> task detail side sheet</SheetTitle>
        <TaskBreadcrumb segments={segments} />
        <ItemDetails item={item} />
        <TaskWorkflow />
      </SheetContent>
    </Sheet>
  );
}
