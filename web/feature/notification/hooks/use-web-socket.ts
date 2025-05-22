import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/lib/auth/auth-provider";
// import { toast } from "sonner";

export function useWebSocket<T = unknown>(
  eventName: string,
  handler: (data: T) => void
) {
  const { session } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!session?.tokens.accessToken) return;
    console.log("session?.tokens.accessToken", session?.tokens.accessToken);
    console.log(
      "process.env.NEXT_PUBLIC_WS_URL",
      process.env.NEXT_PUBLIC_WS_URL
    );

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
        transports: ["websocket"],
        auth: { token: session.tokens.accessToken },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    const socket = socketRef.current;
    socket.on("connect", () => {
      setIsConnected(true);
      // toast.success("🔌 Socket Connected");
    });
    socket.on("disconnect", () => setIsConnected(false));
    socket.on(eventName, handler);

    // Cleanup on unmount or dependency change
    return () => {
      if (socket) {
        socket.off(eventName, handler);
      }
    };
  }, [session?.tokens.accessToken, eventName, handler]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  return isConnected;
}
