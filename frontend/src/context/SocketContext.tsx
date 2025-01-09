// src/context/SocketContext.tsx

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

// Define the socket URL
const SOCKET_URL = "http://localhost:5000"; // Replace with your socket server URL
// Define the context for the socket
const SocketContext = createContext<Socket | null>(null);

// Define the type for the props of the SocketProvider
interface SocketProviderProps {
  children: ReactNode; // This allows any children (i.e., components wrapped in SocketProvider)
}

// Create the SocketProvider component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null); // Ref for the audio element

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem("authToken");
    const unParsedUserId = localStorage.getItem("userId");

    if (isLoggedIn && unParsedUserId) {
      const userId = JSON.parse(unParsedUserId);
      console.log("user is logged in and now onto the socket connection");

      // Create the socket connection
      const socketInstance = io(SOCKET_URL, {
        autoConnect: false, // Don't connect automatically until user logs in
      });

      // Connect the socket when the component mounts
      socketInstance.connect();

      // Join the user-specific room after connecting
      socketInstance.emit("joinRoom", { roomId: userId });

      // Set the socket state to the instance
      setSocket(socketInstance);

      // Listen for notifications
      socketInstance.on("notification", (data) => {
        console.log("Received notification:", data);
        playNotificationSound(); // Play the notification sound
      });

      // Cleanup on unmount
      return () => {
        socketInstance.disconnect();
      };
    } else {
      console.log("User is not logged in or no user ID found.");
      return () => {}; // Return an empty cleanup function
    }
  }, []); // Empty dependency array to ensure the effect runs only once on mount
  const playNotificationSound = () => {
    if (audioRef.current) {
      console.log("the adudioRef.current came as true i guess");
      audioRef.current.play().catch((error: Error) => {
        console.error("Error playing notification sound:", error);
      });
    }
    console.log("the adudioRef.current came as false i guess");
  };

  return (
    <SocketContext.Provider value={socket}>
      {/* Audio element for notification sound */}
      <audio
        ref={audioRef}
        src="/assets/notification-sound.mp3"
        preload="auto"
      />

      {children}
    </SocketContext.Provider>
  );
};

// Create a custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
