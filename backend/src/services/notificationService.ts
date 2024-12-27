import { httpMessages } from "../middlewares";
import { Notification, User } from "../models";
import { INotification } from "../interfaces";
import mongoose from "mongoose";

export class NotificationService {
  public static async createNotification(notificationData: INotification) {
    try {
      const notification = new Notification({
        ...notificationData,
        read: false,
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.log(error);
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

      await Notification.insertMany(notifications); // Bulk insert notifications
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
}
