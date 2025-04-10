"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { CreateBucket } from "./create-bucket-dialog";

export const EmptyKanbanState = ({ id }: { id: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No buckets yet</CardTitle>
          <CardDescription>
            Create your first bucket to get started with your Kanban board
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateBucket id={id}>
            <Button className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Create your first bucket
            </Button>
          </CreateBucket>
        </CardContent>
      </Card>
    </div>
  );
};
