import { io, Socket } from "socket.io-client";

const url = "https://notification-push-service.onrender.com";
let socket: Socket | null = null;

export const initSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(url, {
    transports: ["websocket"],
    auth: { token },
  });

  return socket;
};

export const getSocket = () => socket;
