"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Columns2, Loader, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ColorInput } from "../ui/color-input";
import { Button } from "../ui/button";
import { useBucketMutation } from "@/hooks/useBucketMutation";

export const CreateBucket = ({
  id,
  children,
}: {
  id: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const [bucketData, setBucketData] = React.useState({
    name: "",
    id,
  });
  const [color, setColor] = React.useState<string>("#f5f5f4");

  const { createBucket } = useBucketMutation({
    queryKey: ["buckets", id],
    successAction: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus /> New Bucket
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
            aria-hidden="true"
          >
            <Columns2 className="opacity-80" size={16} strokeWidth={2} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Create Bucket</DialogTitle>
            <DialogDescription className="sm:text-center">
              Fill in the details below to create your new bucket.
            </DialogDescription>
          </DialogHeader>
        </div>
        <Label>Name</Label>
        <Input
          placeholder="Enter new bucket name"
          value={bucketData.name}
          onChange={(e) =>
            setBucketData({ ...bucketData, name: e.target.value })
          }
        />
        <ColorInput onChange={setColor} defaultValue={color} />
        <DialogFooter>
          <Button
            className="flex-1"
            onClick={async () =>
              await createBucket.mutateAsync({
                name: bucketData.name,
                color,
                id,
              })
            }
            disabled={
              createBucket.isPending ||
              !bucketData.name.trim() ||
              bucketData.name.length < 3
            }
          >
            {createBucket.isPending ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
