import { Socket } from "socket.io-client";

export const socketListeners = (socket: Socket) => {
  if (!socket.connected) {
    console.warn("Socket not connected. Listeners may not work properly.");
  }

};
