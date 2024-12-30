import { getSocketIO } from "../config/socket";
import { httpMessages } from "../middlewares"; // Error handling middleware
import { Notification, User } from "../models"; // Notification and User models
import { INotification } from "../interfaces"; // Notification interface
import mongoose from "mongoose";

export class NotificationService {
  public static async createNotification(notificationData: INotification) {
    try {
      const notification = new Notification({
        ...notificationData,
        read: false,
      });

      await notification.save();

      // Emit real-time notification to the user
      const io = getSocketIO();
      io.to(notificationData.userId.toString()).emit(
        "notification",
        notification
      );

      return notification;
    } catch (error) {
      console.error(error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async createAdminNotification(
    message: string,
    type: "success" | "info" | "warning" | "error"
  ) {
    try {
      const admins = await User.find({ role: "admin" }); // Fetch all admins

      if (!admins || admins.length === 0) {
        console.log("No admin users found to notify.");
        return;
      }

      // Create notifications for all admins
      const notifications = admins.map((admin) => ({
        userId: new mongoose.Types.ObjectId(admin._id),
        message,
        type,
        read: false,
      }));

      await Notification.insertMany(notifications);

      // Emit notifications to all admins
      const io = getSocketIO();
      console.log("Emitting notification to admins:");

      admins.forEach((admin) => {
        io.to(admin._id.toString()).emit("notification", { message, type });
      });

      console.log("Admin notifications created successfully.");
    } catch (error) {
      console.error("Error creating admin notifications:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async getNotificationsByUserId(userId: string) {
    try {
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .exec();
      return notifications;
    } catch (error) {
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async markNotificationAsRead(notificationId: string) {
    try {
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true }
      ).exec();

      if (!notification) {
        throw httpMessages.NOT_FOUND("Notification not found");
      }

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async deleteNotification(notificationId: string) {
    try {
      const notification = await Notification.findByIdAndDelete(
        notificationId
      ).exec();

      if (!notification) {
        throw httpMessages.NOT_FOUND("Notification not found");
      }

      return notification;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async markAllNotificationsAsRead(userId: string) {
    try {
      const result = await Notification.updateMany(
        { userId, read: false },
        { read: true }
      ).exec();

      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }

  public static async clearAllNotifications(userId: string) {
    try {
      const result = await Notification.deleteMany({ userId }).exec();

      if (!result.deletedCount) {
        throw httpMessages.NOT_FOUND("No notifications found to clear");
      }

      return result;
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}
