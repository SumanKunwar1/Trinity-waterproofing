import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Bell, Check, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

interface Notification {
  _id: string;
  userId: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

interface NotificationComponentProps {
  onNewNotification?: () => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  onNewNotification,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  <audio ref={audioRef} src="/assets/notification-sound.mp3" />;

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId") || "");
    if (!userId) return;

    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast(notification.message, { type: notification.type });
      playNotificationSound();
      if (onNewNotification) {
        onNewNotification();
      }
    });

    fetchNotifications(userId);

    return () => {
      newSocket.disconnect();
    };
  }, [onNewNotification]);

  const fetchNotifications = async (userId: string) => {
    try {
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

  const markAllAsRead = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(`/api/notification/${userId}/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (!response.ok)
        throw new Error("Failed to mark all notifications as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
      const response = await fetch(
        `/api/notification/${userId}/user/clear-all`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to clear all notifications");
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="text-gray-600" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 px-1.5 py-[1px] text-xs text-white bg-red-600"
          >
            {unreadCount}
          </Badge>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full p-2 right-0 mt-2 w-96 bg-white shadow-lg rounded-md border z-50">
          <div className="flex justify-between p-2 border-b">
            <span className="font-semibold">Notifications</span>
            <div>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                Clear All
              </Button>
            </div>
          </div>
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-2 ${notification.read ? "bg-gray-100" : ""}`}
            >
              <p>{notification.message}</p>
              <div className="flex justify-end mt-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification._id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNotification(notification._id)}
                >
                  <X className="h-4 w-4" />
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

export default NotificationComponent;
