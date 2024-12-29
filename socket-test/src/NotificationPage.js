import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);
  const adminId = "6770ea39ba2dc6c23d4d40f5"; // Admin ID (This can be dynamically fetched from user context)

  // Connect to the WebSocket server
  useEffect(() => {
    const socket = io("http://localhost:5000"); // Your WebSocket server URL

    // Listen for successful connection
    socket.on("connect", () => {
      console.log("Connected to WebSocket server!");
      setConnected(true);

      // Join the admin-specific room after connection
      socket.emit("joinRoom", { roomId: adminId }); // Emit to join the room with admin ID
    });

    // Listen for notification messages
    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server!");
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  return (
    <div>
      <h1>Admin Notifications</h1>
      <p>{connected ? "Connected to WebSocket" : "Connecting..."}</p>
      <h3>Notifications:</h3>
      {notifications.length === 0 ? (
        <p>No notifications received yet.</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              <strong>{notification.type}</strong>: {notification.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
