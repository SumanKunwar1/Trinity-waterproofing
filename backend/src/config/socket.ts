import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initializeSocket = (server: http.Server): void => {
  io = new Server(server, {
    cors: {
      origin: "*", // Replace with your client URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // Handle user authentication (e.g., joining room with user ID)
    socket.on("authenticate", (userId: string) => {
      socket.join(userId); // Join the user to a room with their user ID
    });

    // Handle joinRoom event (for admins or specific users)
    socket.on("joinRoom", ({ roomId }) => {
      socket.join(roomId); // Join the specified room
    });

    // Handle disconnection
    socket.on("disconnect", () => {});
  });
};

// Export the instance to use it in other files
export const getSocketIO = (): Server => {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized. Please call initializeSocket first."
    );
  }
  return io;
};
