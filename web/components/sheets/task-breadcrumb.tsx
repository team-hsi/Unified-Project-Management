import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Edit, Maximize2, MoreHorizontal } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";

export const TaskBreadcrumb = ({ segments }: { segments: string[] }) => {
  return (
    <div className="flex h-16 shrink-0 items-center px-4 w-full gap-2 border-b">
      <Button size="icon" variant="ghost">
        <Maximize2 className=" text-muted-foreground rotate-90" size={15} />
      </Button>
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
                  <BreadcrumbPage className=" capitalize text-muted-foreground">
                    {segment}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" ml-auto flex gap-2">
        <Button size="icon" variant="ghost">
          <Edit className=" text-muted-foreground" size={15} />
        </Button>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className=" text-muted-foreground" size={15} />
        </Button>
      </div>
    </div>
  );
};
