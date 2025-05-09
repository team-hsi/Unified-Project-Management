import { initSocket, getSocket } from "./socket";
import { toast } from "sonner";

type EventHandler<T = unknown> = (data: T) => void;
type EventHandlers = Map<string, Set<EventHandler>>;

// Create a closure to store our state
const createSocketManager = () => {
  const eventHandlers: EventHandlers = new Map();
  let isConnecting = false;

  const connect = (token: string) => {
    if (isConnecting) return;
    isConnecting = true;

    try {
      const socket = initSocket(token);

      socket.on("connect", () => {
        toast.success("Connected to notification service");
        isConnecting = false;
      });

      socket.on("disconnect", () => {
        toast.warning("Disconnected from notification service");
        isConnecting = false;
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
        toast.error("Connection error. Please try again.");
        isConnecting = false;
      });

      // Set up event forwarding
      socket.onAny((eventName, ...args) => {
        console.log(`🌍 Event received: ${eventName}`, args);
        const handlers = eventHandlers.get(eventName);
        if (handlers) {
          handlers.forEach((handler) => handler(args));
        }
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      toast.error("Failed to connect to notification service");
      isConnecting = false;
    }
  };

  const disconnect = () => {
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
      eventHandlers.clear();
    }
  };

  const subscribe = <T = unknown>(
    eventName: string,
    handler: EventHandler<T>
  ) => {
    if (!eventHandlers.has(eventName)) {
      eventHandlers.set(eventName, new Set());
    }
    eventHandlers.get(eventName)?.add(handler as EventHandler);
  };

  const unsubscribe = <T = unknown>(
    eventName: string,
    handler: EventHandler<T>
  ) => {
    eventHandlers.get(eventName)?.delete(handler as EventHandler);
  };

  const isConnected = () => {
    const socket = getSocket();
    return socket?.connected ?? false;
  };

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected,
  };
};

// Export a singleton instance
export const socketManager = createSocketManager();
