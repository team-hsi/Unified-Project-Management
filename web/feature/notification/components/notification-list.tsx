"use client";

import { useNotificationStore } from "../store/notification-store";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/feature/shared/ui/scroll-area";
import { Button } from "@/feature/shared/ui/button";
import { Trash2 } from "lucide-react";

export const NotificationList = () => {
  const { notifications, clearAll } = useNotificationStore();

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h4 className="font-medium">Notifications</h4>
        <Button
          variant="ghost"
          size="icon"
          onClick={clearAll}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        {notifications.map((notification) => (
          <NotificationItem
            key={`notification-${notification.id}`}
            notification={notification}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
