import { useEffect, useRef } from "react";
import { useGlobalSocket } from "../../../lib/socket/WebSocketProvider"; // Adjust path

export function useSocketEvent<T = unknown>(
  eventName: string | null,
  handler: (data: T) => void,
  dependencies: any[] = [] // Additional dependencies for the useEffect if handler relies on them
) {
  const { socket, isConnected } = useGlobalSocket();
  const handlerRef = useRef(handler);

  // Update handler ref if handler function identity changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket || !isConnected || !eventName) {
      console.log(
        `Socket not ready or eventName not provided for ${eventName}. Socket connected: ${socket?.connected}`
      );
      return;
    }

    console.log(`Subscribing to event: ${eventName}`);
    const currentHandler = (data: T) => handlerRef.current(data);
    socket.on(eventName, currentHandler);

    return () => {
      console.log(`Unsubscribing from event: ${eventName}`);
      socket.off(eventName, currentHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, eventName, ...dependencies]); // Add socket.connected to re-subscribe if connection drops and comes back
}
