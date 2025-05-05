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
} from "@/feature/shared/ui/dialog";
import { Columns2, Loader, PlusCircle } from "lucide-react";
import { Label } from "@/feature/shared/ui/label";
import { Input } from "@/feature/shared/ui/input";
import { ColorInput } from "@/feature/shared/ui/color-input";
import { Button } from "@/feature/shared/ui/button";
import { useBucket } from "@/feature/shared/hooks/use-bucket";

export const CreateBucket = ({
  projectId,
  children,
}: {
  projectId: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const [bucketData, setBucketData] = React.useState({
    name: "",
    projectId,
  });
  const [color, setColor] = React.useState<string>("#f5f5f4");

  const { create } = useBucket();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <PlusCircle /> New Bucket
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
            onClick={async () => {
              setOpen(false);
              await create.mutateAsync({
                ...bucketData,
                color,
              });
            }}
            disabled={!bucketData.name.trim() || bucketData.name.length < 3}
          >
            {create.isPending ? (
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
