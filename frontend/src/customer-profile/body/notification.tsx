import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { io, Socket } from "socket.io-client";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

const CustomerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchNotifications();

    const userId = JSON.parse(localStorage.getItem("userId") || "");
    if (!userId) return;

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast(notification.message, { type: notification.type });
      playNotificationSound();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(`/api/notification/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/notification/${notificationId}/read/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to mark notification as read");
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const userId = JSON.parse(localStorage.getItem("userId") || "");
    try {
      const response = await fetch(
        `/api/notification/${notificationId}/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to delete notification");
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg shadow ${
                notification.read ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p
                className={`mb-2 ${
                  notification.read ? "text-gray-600" : "text-black"
                }`}
              >
                {notification.message}
              </p>
              <div className="flex justify-end space-x-2">
                {!notification.read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteNotification(notification._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <audio ref={audioRef} src="/notification-sound.mp3" />
    </div>
  );
};

export default CustomerNotifications;
