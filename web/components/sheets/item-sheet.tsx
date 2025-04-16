import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TaskBreadcrumb } from "./task-breadcrumb";
// import { TaskWorkflow } from "../task/task-workflow";
import { Item } from "../kanban/types";
import { ItemDetails } from "../task/item-details";
import { useIsMobile } from "@/hooks/use-mobile";

export const ItemSheet = ({
  children,
  item,
}: {
  children: React.ReactNode;
  item: Item;
}) => {
  const segments = [item.bucket.project.name, item.bucket.name];
  const [unsavedForm, setUnsavedForm] = React.useState(false);
  const isMobile = useIsMobile();
  const [, setOpen] = React.useState(false);

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={`rounded-xl ${
          isMobile ? "h-full" : "max-w-lg md:max-w-xl lg:max-w-2xl"
        }`}
        side={isMobile ? "bottom" : "right"}
        hideClose
      >
        <SheetTitle className="sr-only"> task detail side sheet</SheetTitle>
        <TaskBreadcrumb
          segments={segments}
          unsavedForm={unsavedForm}
          item={{ id: item.id, projectId: item.bucket.project.id }}
          onClose={() => {
            setOpen(false);
          }}
        />
        <ItemDetails
          item={item}
          setUnsavedForm={setUnsavedForm}
          unsavedForm={unsavedForm}
        />
        {/* <TaskWorkflow /> */}
      </SheetContent>
    </Sheet>
  );
};
