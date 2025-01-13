import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

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
    try {
      const userId = JSON.parse(localStorage.getItem("userId") || "");
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
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
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
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
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
      toast.success("All notifications cleared");
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      toast.error("Failed to clear all notifications");
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing notification sound:", error);
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle className="text-green-500" />;
      case "error":
        return <FaExclamationCircle className="text-red-500" />;
      case "warning":
        return <FaExclamationCircle className="text-yellow-500" />;
      case "info":
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FaBell className="mr-2 text-primary" />
            Notifications
          </h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
            <Button variant="destructive" onClick={clearAllNotifications}>
              Clear All
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 my-8">No notifications</p>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`mb-4 ${
                      notification.read ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <p
                            className={`mb-2 ${
                              notification.read ? "text-gray-600" : "text-black"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4 space-x-2">
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="cursor-pointer"
                              onClick={() => markAsRead(notification._id)}
                            >
                              Mark as Read
                            </Badge>
                          )}
                          <Badge
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => deleteNotification(notification._id)}
                          >
                            <Button variant="outline" size="sm">
                              <FaTrash className="mr-1" /> Delete
                            </Button>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
      <audio ref={audioRef} src="/notification-sound.mp3" />
    </Card>
  );
};

export default CustomerNotifications;
