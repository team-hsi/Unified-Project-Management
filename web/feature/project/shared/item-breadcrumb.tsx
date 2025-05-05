import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/feature/shared/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
import { ChevronsRight, ChevronsDown, Trash } from "lucide-react";
import { Fragment } from "react";
import { SheetClose } from "@/feature/shared/ui/sheet";
import { Badge } from "@/feature/shared/ui/badge";
import { useIsMobile } from "@/feature/shared/hooks/use-mobile";
import { Separator } from "@/feature/shared/ui/separator";
import { Button } from "@/feature/shared/ui/button";
import { useItem } from "@/feature/shared/hooks/use-item";

export const ItemBreadcrumb = ({
  item,
  segments,
  unsavedForm,
  onClose,
}: {
  item: {
    id: string;
    bucketId: string;
    projectId: string;
  };
  onClose: () => void;
  segments: string[];
  unsavedForm: boolean;
}) => {
  const { remove } = useItem();
  const isMobile = useIsMobile();
  const Icon = isMobile ? ChevronsDown : ChevronsRight;
  return (
    <div className="flex h-12 shrink-0 items-center px-4 w-full gap-2 border-b bg-muted rounded-t-xl">
      <SheetClose className=" h-7 w-7 grid rounded-md justify-center items-center hover:bg-accent hover:text-accent-foreground">
        <Icon size={17} className=" text-muted-foreground" />
      </SheetClose>
      {/* <Link href={`/projects/${segments[0]}/tasks`}>
        <Button size="icon" variant="ghost">
          <Maximize2 className=" text-muted-foreground rotate-90" size={15} />
        </Button>
      </Link> */}
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            return (
              <Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage className="capitalize text-muted-foreground">
                    {segment}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator className="hidden md:block">
                    /
                  </BreadcrumbSeparator>
                )}
                {isLast && isMobile && (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                )}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" ml-auto flex gap-3">
        <Button
          className="rounded-none shadow-none hover:text-red-500 first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
          variant="outline"
          size="icon"
          aria-label="delete-item"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            remove.mutateAsync({
              id: item.id,
              bucketId: item.bucketId,
              projectId: item.projectId,
            });
          }}
        >
          <Trash size={16} strokeWidth={1} aria-hidden="true" />
        </Button>
        {unsavedForm ? (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Unsaved Change
          </Badge>
        ) : null}
      </div>
    </div>
  );
};
