import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ChevronsRight, Maximize2 } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import { SheetClose } from "../ui/sheet";
import Link from "next/link";
import { Badge } from "../ui/badge";

export const TaskBreadcrumb = ({
  segments,
  unsavedForm,
}: {
  segments: string[];
  unsavedForm: boolean;
}) => {
  return (
    <div className="flex h-12 shrink-0 items-center px-4 w-full gap-2 border-b bg-muted rounded-t-xl">
      <SheetClose className=" h-7 w-7 grid rounded-md justify-center items-center hover:bg-accent hover:text-accent-foreground">
        <ChevronsRight size={17} className=" text-muted-foreground" />
      </SheetClose>
      <Link href={`/projects/${segments[0]}/tasks`}>
        <Button size="icon" variant="ghost">
          <Maximize2 className=" text-muted-foreground rotate-90" size={15} />
        </Button>
      </Link>
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
                {!isLast && <BreadcrumbSeparator> / </BreadcrumbSeparator>}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className=" ml-auto flex gap-2">
        {unsavedForm ? (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Unsaved Change
          </Badge>
        ) : null}
      </div>
    </div>
  );
};
