"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/lib/auth/auth-provider"; // Your auth hook
// import { toast } from "sonner";

export const WebSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { session } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (session?.tokens.accessToken) {
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
      if (!wsUrl) {
        console.error(
          "NEXT_PUBLIC_WS_URL is not defined. WebSocket cannot connect."
        );
        return;
      }
      const newSocket = io(wsUrl, {
        transports: ["websocket"],
        auth: { token: session.tokens.accessToken },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      newSocket.on("connect", () => {
        console.log("🔌 Global WebSocket Connected:", newSocket.id);
        // toast.info("🔌  WebSocket Connected:", { description: newSocket.id });
        setSocket(newSocket);
      });
      newSocket.on("disconnect", (reason) => {
        // toast.warning("🔌 WebSocket Disconnected", { description: reason });
        console.log("🔌 Global WebSocket Disconnected:", reason);

        if (reason === "io server disconnect") {
          newSocket.connect();
        }
      });

      newSocket.on("connect_error", (err) => {
        console.log("🔌 Global WebSocket Error:", err.message);
        // toast.error("🔌 WebSocket Connection Error:", {
        //   description: err.message,
        // });
      });
      setSocket(newSocket);

      return () => {
        console.log("Cleaning up global WebSocket connection.");
        newSocket.off("connect");
        newSocket.off("disconnect");
        newSocket.off("connect_error");
        newSocket.disconnect();
        setSocket(null);
      };
    } else if (socket) {
      console.log("User session lost, disconnecting global WebSocket.");
      socket.disconnect();
      setSocket(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.tokens.accessToken]); // Re-run if token changes

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useGlobalSocket = () => {
  const socket = useContext(WebSocketContext);
  return { socket, isConnected: socket?.connected ?? false };
  // return socket;
};
