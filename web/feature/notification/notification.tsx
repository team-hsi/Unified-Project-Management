"use client";
import { Dot } from "../shared/components/dot";
import { cn } from "@/lib/utils";
import { socketManager } from "@/lib/notification/socket-manager";
import { useNotification } from "./hooks/use-notification";
import { NotificationBell } from "./components/notification-bell";

export const Notification = () => {
  useNotification();
  const isConnected = socketManager.isConnected();

  return (
    <div className="flex items-center gap-2">
      <Dot
        className={cn(
          "transition-colors duration-200",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <NotificationBell />
    </div>
  );
};
