import { getSocketIO } from "../config/socket";
import { httpMessages } from "../middlewares";
import { Notification, User } from "../models";
import { INotification } from "../interfaces";
import { sendBrevoEmail } from "../config/sendBrevoEmail";
import { UserService, OrderService } from "../services";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.BASE_URL;

import mongoose from "mongoose";

export class NotificationService {
  public static async createNotification(notificationData: INotification) {
    try {
      const notification = new Notification({
        ...notificationData,
        read: false,
      });

      await notification.save();

      const io = getSocketIO();
      io.to(notificationData.userId.toString()).emit(
        "notification",
        notification
      );

      const user = await UserService.getUserById(
        notificationData.userId.toString()
      );

      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }

      // Call the new function to send the order notification email
      if (notificationData.orderId) {
        await sendOrderNotificationEmail(
          notificationData.orderId.toString(),
          notificationData.userId.toString()
        );
      }

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

      return result;
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      throw httpMessages.INTERNAL_SERVER_ERROR;
    }
  }
}
export const sendOrderNotificationEmail = async (
  orderId: string,
  userId: string
) => {
  try {
    const userData: any = await UserService.getUserById(userId);
    const orderData: any = await OrderService.getOrderById(orderId);

    if (!userData) {
      throw new Error("User not found");
    }
    if (!orderData) {
      throw new Error("Order not found");
    }

    const { fullName, email } = userData;
    const {
      status,
      products,
      address,
      paymentMethod,
      subtotal,
      total,
      createdAt,
    } = orderData;

    // Format date
    const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Estimate delivery date (5 days from order date)
    const deliveryDate = new Date(createdAt);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const estimatedDelivery = deliveryDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subject = `Order #${orderId} Status Update: ${status}`;

    const content = {
      html: `
    <div style="font-family: sans-serif; background-color: #f3f4f6; padding: 2rem; color: #111827;">
      <div style="max-width: 48rem; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 0.5rem; padding: 1.5rem;">
        <h2 style="font-size: 1.5rem; font-weight: bold; text-align: center; color: #2563eb;">
          Thank you for your order, ${fullName}!
        </h2>
        <p style="text-align: center; color: #4b5563; margin-top: 0.5rem;">
          Your order <strong>#${orderId}</strong> has been successfully placed on <strong>${orderDate}</strong>.
        </p>

        <div style="margin-top: 1.5rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">
            📦 Order Summary
          </h3>
          <div style="margin-top: 0.5rem; line-height: 1.7;">
            <p><strong>Order Number:</strong> ${orderId}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Order Status:</strong> <span style="color: #059669;">${status}</span></p>
            <p><strong>Payment Method:</strong> ${paymentMethod || "N/A"}</p>
            <p><strong>Shipping Address:</strong> ${address.street}, ${
        address.city
      }, ${address.province}, ${address.district}, ${address.postalCode}, ${
        address.country
      }</p>
            <p><strong>Estimated Delivery Date:</strong> ${estimatedDelivery}</p>
          </div>
        </div>

        <div style="margin-top: 1.5rem;">
          <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">
            🛍️ Ordered Items
          </h3>
          <div style="margin-top: 0.5rem;">
            ${products
              .map((product: any) => {
                return `
                  <div style="display: flex; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; margin-bottom: 1rem;">
                   <img 
  src="${BASE_URL}${product.productId?.productImage}" 
  alt="${product.productId?.name}" 
  style="width: 160px; height: 160px; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  />

                    <div style="margin-left: 1rem;">
                      <a href="#" style="color: #2563eb; font-weight: 600; text-decoration: none;">
                        ${product.productId?.name}
                      </a>
                      <p style="color: #4b5563;">Quantity: ${product.quantity}</p>
                      <p style="color: #1f2937; font-weight: bold;">Price: Rs. ${product.price}</p>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>

        <div style="margin-top: 1.5rem; border-top: 1px solid #e5e7eb; padding-top: 1rem;">
          <p style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">
            💳 Order Total: Rs. ${subtotal}
          </p>
        </div>

        <div style="margin-top: 2rem; text-align: center; font-size: 0.875rem; color: #6b7280;">
          Need help? Contact our support team at 
          <a href="mailto:info@trinitywaterproofing.com.np" style="color: #2563eb;">
            info@trinitywaterproofing.com.np
          </a>
        </div>

        <div style="margin-top: 1.5rem; text-align: center; color: #4b5563;">
          <p>
            Thank you for shopping with <strong>Trinity Waterproofing</strong>.
            We hope to serve you again soon!
          </p>
        </div>

        <div style="margin-top: 2rem; font-size: 0.75rem; color: #6b7280; text-align: center;">
          <p>This is an automated email, please do not reply to this message.</p>
          <p>&copy; ${new Date().getFullYear()} Trinity Waterproofing, All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
      text: `Hi ${fullName},

Your order #${orderId} has been updated to status: ${status}

Order Summary:
- Order Date: ${orderDate}
- Payment Method: ${paymentMethod}
- Shipping Address: ${address}
- Estimated Delivery: ${estimatedDelivery}

Ordered Items:
${products
  .map(
    (product: any) =>
      `- ${product.productId?.name} - Quantity: ${product.quantity} - Price: Rs. ${product.price}`
  )
  .join("\n")}

Order Total: Rs. ${total}

Need help? Contact us at info@trinitywaterproofing.com.np

Thank you for shopping with Trinity Waterproofing!`,
    };

    await sendBrevoEmail({ name: fullName, email }, subject, content);
  } catch (error) {
    console.error("Error sending order notification email:", error);
    throw new Error("Failed to send order notification email");
  }
};
