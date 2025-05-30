"use client";
import { useGlobalSocket } from "@/lib/socket/WebSocketProvider";
import { Dot } from "../../shared/components/dot";
import { cn } from "@/lib/utils";
// import { NotificationBell } from "./notification-bell";

export const Notification = () => {
  const { isConnected } = useGlobalSocket();

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
