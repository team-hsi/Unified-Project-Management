"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Switch } from "@/feature/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/shared/ui/select";
import { Button } from "@/feature/shared/ui/button";
import { Textarea } from "@/feature/shared/ui/textarea";
import { AlertCircle, Globe, Lock } from "lucide-react";

export function GeneralView() {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">General</DialogTitle>
        <DialogDescription>
          Manage general workspace settings.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Workspace Information</h3>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium">Workspace Name</h4>
              <div className="mt-2">
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="My Workspace"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium">Description</h4>
              <div className="mt-2">
                <Textarea
                  placeholder="Describe your workspace..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium">Visibility</h4>
              <div className="mt-2">
                <Select defaultValue="private">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="private"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Private</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        Only members can access
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="public"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Public</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        Anyone can view
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Security</h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-factor authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Session timeout</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after a period of inactivity.
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <div className="mt-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">
                    Delete Workspace
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Permanently delete your workspace and all of its contents.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
