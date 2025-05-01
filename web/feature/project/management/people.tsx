"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Button } from "@/feature/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";

export const PeopleView = () => {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">People</DialogTitle>
        <DialogDescription>
          Manage team members and permissions.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6">
        <div className="rounded-md border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div>
                <h4 className="font-medium">John Doe</h4>
                <p className="text-sm text-muted-foreground">
                  john@example.com
                </p>
              </div>
            </div>
            <Select defaultValue="admin">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted"></div>
              <div>
                <h4 className="font-medium">Jane Smith</h4>
                <p className="text-sm text-muted-foreground">
                  jane@example.com
                </p>
              </div>
            </div>
            <Select defaultValue="editor">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button>Invite People</Button>
        </div>
      </div>
    </div>
  );
};
