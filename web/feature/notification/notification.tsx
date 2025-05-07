"use client";

import { useEffect, useState } from "react";
import { initSocket } from "@/lib/notification/socket";
import { Dot } from "../shared/components/dot";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/auth/auth-provider";
import { toast } from "sonner";

export const Notification = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { session } = useUser();

  useEffect(() => {
    if (!session?.tokens.accessToken) return;
    const socket = initSocket(session.tokens.accessToken as string);
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      toast.success("✅ Connected to server!", {
        description: socket.id,
      });
      console.log("✅ Connected to server!", socket.id);
      setIsConnected(true);
    }

    function onDisconnect(reason: string) {
      toast.error("❌ Disconnected:", {
        description: reason,
      });
      console.log("❌ Disconnected:", reason);
      setIsConnected(false);
    }

    socket.onAny((event, ...args) => {
      console.log(`🌍 Event received: ${event}`, args);
      // Only show toast for non-system events
      if (!event.startsWith("connect") && !event.startsWith("disconnect")) {
        toast.info(`🌍 Event received: ${event}`, {
          description: JSON.stringify(args),
        });
      }
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [session?.tokens.accessToken]);

  return (
    <div className="flex items-center gap-2">
      <Dot
        className={cn(
          "transition-colors duration-200",
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-sm text-muted-foreground">
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
};
