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
        setSocket(newSocket);
      });
      newSocket.onAny((event, ...args) => {
        console.log("asdfasdf", event);
        // console.log(🌍 Event received: ${event}, args);
      });
      newSocket.on("disconnect", (reason) => {
        console.log("🔌 Global WebSocket Disconnected:", reason);
        // setSocket(null); // Keep the socket instance for reconnection attempts
        // unless the disconnect is due to explicit logout or auth error.
        if (reason === "io server disconnect") {
          // Server explicitly disconnected client
          newSocket.connect(); // Attempt to reconnect
        }
      });

      newSocket.on("connect_error", (err) => {
        console.error("🔌 Global WebSocket Connection Error:", err.message);
        // Potentially handle token expiry here by prompting re-login
        // or attempting token refresh and re-auth if your setup allows.
        // If auth error, server might disconnect.
        if (err.message.includes("Authentication error")) {
          // Or similar error message from your backend
          // Handle auth error, maybe sign out user or attempt token refresh
        }
      });

      // Set socket early to allow context consumers to attempt to use it,
      // they should check for socket.connected status.
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
      // If session is lost (logout), disconnect existing socket
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
  // You might want to return an object with isConnected status too
  return { socket, isConnected: socket?.connected ?? false };
  // return socket;
};
