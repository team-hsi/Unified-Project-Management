"use client";
import { Dot } from "../../shared/components/dot";
import { cn } from "@/lib/utils";
import { useWebSocket } from "../hooks/use-web-socket";
// import { NotificationBell } from "./notification-bell";

export const Notification = () => {
  // Use a dummy event and handler just to get connection status
  const isConnected = useWebSocket("__connection_status__", () => {});

  return (
    <div className="flex items-center gap-2">
      <Dot
        className={cn(
          "transition-colors duration-200",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      {/* <p className="text-sm text-gray-500">
        {isConnected ? "Connected" : "Disconnected"}
      </p> */}
      {/* <NotificationBell /> */}
    </div>
  );
};
