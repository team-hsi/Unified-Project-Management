"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function NotificationsView() {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl">Notifications</DialogTitle>
        <DialogDescription>
          Manage how you receive notifications.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium">Email Notifications</h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Comments</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications when someone comments on your
                  items.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mentions</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications when someone mentions you.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for updates to projects
                  you&apos;re a part of.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Push Notifications</h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable push notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications directly to your device.
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Do not disturb</h4>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable all notifications.
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
