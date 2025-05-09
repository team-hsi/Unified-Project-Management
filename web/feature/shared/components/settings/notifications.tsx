"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
import { Separator } from "@/feature/shared/ui/separator";
import { Switch } from "@/feature/shared/ui/switch";
import { Card } from "@/feature/shared/ui/card";
import { Bell, Mail, MessageSquare, AtSign, BellOff } from "lucide-react";

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
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Notifications
          </h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Comments
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when someone comments on your
                    items.
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <AtSign className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Mentions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications when someone mentions you.
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Updates
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for updates to projects
                    you&apos;re a part of.
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Separator />

        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Push Notifications
          </h3>

          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Enable push notifications
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications directly to your device.
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <BellOff className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Do not disturb
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable all notifications.
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
