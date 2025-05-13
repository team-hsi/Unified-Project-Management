import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/feature/shared/ui/sheet";
import { ItemBreadcrumb } from "./item-breadcrumb";
import { useIsMobile } from "@/feature/shared/hooks/use-mobile";
import { Item } from "@/feature/shared/@types/item";
import { ItemDetails } from "@/feature/project/components/item-details";
import { ItemWorkflow } from "@/feature/project/components/item-workflow";

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
        className={`rounded-xl overflow-hidden ${
          isMobile ? "h-full" : "max-w-lg md:max-w-xl lg:max-w-2xl"
        }`}
        side={isMobile ? "bottom" : "right"}
        hideClose
      >
        <SheetTitle className="sr-only">task detail side sheet</SheetTitle>
        <div className="flex flex-col h-full">
          <ItemBreadcrumb
            segments={segments}
            unsavedForm={unsavedForm}
            item={{
              id: item.id,
              bucketId: item.bucket.id,
              projectId: item.bucket.project.id,
            }}
            onClose={() => {
              setOpen(false);
            }}
          />
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col">
              <ItemDetails
                item={item}
                setUnsavedForm={setUnsavedForm}
                unsavedForm={unsavedForm}
              />
              <div className="border-t border-border">
                <ItemWorkflow item={item} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
