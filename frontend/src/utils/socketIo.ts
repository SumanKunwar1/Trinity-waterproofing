// src/socket.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // Prevent automatic connection until we call connectSocket()
});

// Function to connect the socket and join the room based on user ID
export const connectSocket = (userId: string) => {
  // Connect to the socket server
  socket.connect();

  // Listen for successful connection
  socket.on("connect", () => {
    socket.emit("joinRoom", { roomId: userId }); // Join room with user-specific ID
  });
};

// Function to disconnect the socket
export const disconnectSocket = () => {
  socket.disconnect();
};
