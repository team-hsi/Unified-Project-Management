"use client";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/feature/shared/ui/dialog";
// import { Separator } from "@/feature/shared/ui/separator";
import { Switch } from "@/feature/shared/ui/switch";
import { Card } from "@/feature/shared/ui/card";
import {
  Bell,
  Mail,
  MessageSquare,
  AtSign,
  Settings,
  Globe,
} from "lucide-react";

export function NotificationsView() {
  return (
    <div className="p-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </DialogTitle>
        <DialogDescription>
          Manage how you receive notifications for this project.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6 space-y-6">
        {/* Email Notifications */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Email Notifications</h3>
          </div>

          <div className="space-y-6">
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
                <Settings className="h-5 w-5 text-primary" />
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

        {/* In-App Notifications */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">In-App Notifications</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between group hover:bg-accent/5 p-3 rounded-lg transition-colors duration-200">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors duration-200">
                    Enable in-app notifications
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications directly in the application.
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

        {/* Notification Preferences */}
        <Card className="p-6 bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-background/50">
              <h4 className="font-medium mb-2">Email Frequency</h4>
              <p className="text-sm text-muted-foreground">
                Choose how often you want to receive email notifications.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-background/50">
              <h4 className="font-medium mb-2">Notification Types</h4>
              <p className="text-sm text-muted-foreground">
                Select which types of notifications you want to receive.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
