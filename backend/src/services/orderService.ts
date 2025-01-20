import { Order, Product, User, Cart, IOrder } from "../models";
import { IOrderItem, INotification } from "../interfaces";
import { httpMessages } from "../middlewares";
import { OrderStatus } from "../config/orderStatusEnum";
import { CartService, NotificationService } from "./index";
import moment from "moment";
import mongoose from "mongoose";

export class OrderService {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }
  public async createOrder(
    userEmail: string,
    orderData: IOrderItem[],
    addressId: string,
    userRole: string
  ) {
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      const address = user.addressBook.find(
        (addr) => addr._id.toString() === addressId.toString()
      );

      if (!address) {
        throw httpMessages.NOT_FOUND("Address");
      }

      let subtotal = 0;
      const validatedProducts = [];

      for (const orderItem of orderData) {
        const { productId, color, quantity } = orderItem;
        const orderItemPrice = orderItem.price;

        const product = await Product.findById(productId);
        if (!product) {
          throw httpMessages.NOT_FOUND(`Product with ID ${productId}`);
        }

        const price =
          userRole.toLowerCase() === "b2b"
            ? product.wholeSaleDiscountedPrice &&
              product.wholeSaleDiscountedPrice > 0
              ? product.wholeSaleDiscountedPrice
              : product.wholeSalePrice // Use discounted wholesale price only if it's greater than 0
            : product.retailDiscountedPrice && product.retailDiscountedPrice > 0
            ? product.retailDiscountedPrice
            : product.retailPrice; // Use discounted retail price only if it's greater than 0

        if (price !== orderItemPrice) {
          throw httpMessages.BAD_REQUEST(
            `Detected Mismatch between the prices .... for ${product.name}. Price gotten:${orderItemPrice}, price Calculated:${price}`
          );
        }

        if (product.colors && product.colors.length > 0) {
          if (!color) {
            throw httpMessages.BAD_REQUEST(
              `Color is required for product ${
                product.name
              } with available colors: ${product.colors.join(", ")}`
            );
          }

          const colorExists = product.colors.some(
            (c) => c.name === color || c.hex === color
          );

          if (!colorExists) {
            throw httpMessages.BAD_REQUEST(
              `Invalid color '${color}' for product ${
                product.name
              }. Available colors: ${product.colors
                .map((c) => c.name)
                .join(", ")}`
            );
          }
        }

        if (product.inStock < quantity) {
          throw httpMessages.BAD_REQUEST(
            `Insufficient stock for product ${product.name}. Available: ${product.inStock}, Requested: ${quantity}`
          );
        }

        validatedProducts.push({
          productId,
          color: color || null,
          quantity,
          price,
        });

        subtotal += price * quantity;
      }

      const newOrder = new Order({
        products: validatedProducts.map((item) => ({
          productId: item.productId,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        userId: user._id,
        address: address,
        subtotal,
        status: OrderStatus.ORDER_REQUESTED,
      });

      await newOrder.save();

      for (const { productId, quantity } of validatedProducts) {
        await Product.findByIdAndUpdate(productId, {
          $inc: { inStock: -quantity },
        });
      }

      // **User Notification**
      const formattedDate = moment(newOrder.createdAt).format(
        "MMMM Do YYYY, h:mm A"
      );

      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(user._id),
        orderId: newOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${newOrder._id} placed on ${formattedDate} has been successfully placed. Total: $${subtotal}.`,
        type: "success",
      };
      await NotificationService.createNotification(userNotificationData);

      const adminNotificationData = {
        message: `New order created by ${user.fullName} (${user.email}) on ${formattedDate}. Subtotal: Rs ${subtotal}.`,
        type: "info",
      };
      await NotificationService.createAdminNotification(
        `New order created by ${user.fullName} (${user.email}) on ${formattedDate}. Subtotal: Rs ${subtotal} given by orderId:${newOrder._id}.`,
        "info"
      );

      const cart = await Cart.findOne({ userId: user._id });
      if (cart) {
        // Remove only items that match the order
        for (const orderItem of validatedProducts) {
          const { productId, color, quantity } = orderItem;

          await Cart.updateOne(
            { userId: user._id },
            {
              $pull: {
                items: {
                  productId: productId,
                  color: color || null,
                  quantity: quantity,
                },
              },
            }
          );
        }
      }

      return newOrder;
    } catch (error) {
      throw error;
    }
  }

  public async getOrdersByUserId(userId: string) {
    try {
      const orders = await Order.find({ userId }).populate(
        "products.productId"
      );

      if (!orders || orders.length === 0) {
        return [];
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const ordersWithAddresses: any = await Promise.all(
        orders.map(async (order) => {
          order.products = order.products.map((product: any) => {
            if (product.productId) {
              const updatedProduct = product.productId; // Directly use the populated productId

              // Modify productImage
              updatedProduct.productImage = `/api/image/${updatedProduct.productImage}`;

              // Modify all images in the image array
              updatedProduct.image = updatedProduct.image.map(
                (image: string) => `/api/image/${image}`
              );

              // Return updated product with formatted images
              return { ...product.toObject(), productId: updatedProduct }; // Replace productId with updatedProduct
            }
            return product;
          });
        })
      );

      return orders;
    } catch (error) {
      throw error;
    }
  }

  public static async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId"
      );

      if (!order) {
        return null;
      }

      order.products = order.products.map((product: any) => {
        if (product.productId) {
          const updatedProduct = product.productId;

          updatedProduct.productImage = `/api/image/${updatedProduct.productImage}`;

          updatedProduct.image = updatedProduct.image.map(
            (image: string) => `/api/image/${image}`
          );

          return { ...product.toObject(), productId: updatedProduct };
        }

        return product; // If no productId, just return the product
      });

      return order; // Return the order with the formatted products
    } catch (error) {
      throw error;
    }
  }

  public async updateOrderStatus(orderId: string, status: string) {
    try {
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
        throw httpMessages.BAD_REQUEST(`Invalid status value: ${status}`);
      }

      existingOrder.status = status as OrderStatus;
      await existingOrder.save();

      return existingOrder;
    } catch (error) {
      throw error;
    }
  }

  private async updateOrderStatusInternal(
    orderId: string,
    status: OrderStatus
  ) {
    const existingOrder = await Order.findById(orderId);

    if (!existingOrder) {
      throw httpMessages.NOT_FOUND("Order");
    }

    existingOrder.status = status;
    await existingOrder.save();

    return existingOrder;
  }

  public async confirmOrder(orderId: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.ORDER_REQUESTED) {
        throw httpMessages.BAD_REQUEST(
          "Only requested orders can be confirmed."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.ORDER_CONFIRMED
      );

      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id}placed on ${existingOrder.createdAt} has been successfully placed.`,
        type: "success",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async cancelOrderByAdmin(orderId: string, reason: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.ORDER_REQUESTED) {
        throw httpMessages.BAD_REQUEST(
          "Only requested orders can be canceled."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.ORDER_CANCELLED
      );

      updatedOrder.reason = reason;
      await updatedOrder.save();

      for (const productItem of existingOrder.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id} placed on ${existingOrder.createdAt} has been cancelled due to ${reason} Please Contact Us to Know the details.`,
        type: "error",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async returnRequest(orderId: string, reason: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.ORDER_DELIVERED) {
        throw httpMessages.BAD_REQUEST(
          "Only completed orders are eligible for return requests."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.RETURN_REQUESTED
      );

      updatedOrder.reason = reason;
      await updatedOrder.save();

      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id} placed on ${existingOrder.createdAt} has been set to return.Confirmation require 24-48 hours.`,
        type: "info",
      };
      await NotificationService.createAdminNotification(
        `A new order with ID ${existingOrder._id} has been requested to return.Reason:${reason} Please review it.`,
        "info"
      );
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async markOrderShipped(orderId: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.ORDER_CONFIRMED) {
        throw httpMessages.BAD_REQUEST(
          "Only orders with confirmation can be shipped."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.ORDER_SHIPPED
      );

      // Handle return stock restoration or other tasks
      for (const productItem of existingOrder.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id} placed on ${existingOrder.createdAt} has been shipped. PLease contact Us for more details.`,
        type: "info",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async markOrderDelivered(orderId: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.ORDER_SHIPPED) {
        throw httpMessages.BAD_REQUEST(
          "Only orders with shipped status can be delivered."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.ORDER_DELIVERED
      );

      // Handle return stock restoration or other tasks
      for (const productItem of existingOrder.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id} placed on ${existingOrder.createdAt} has been Delivered. Please confirm.`,
        type: "info",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async approveReturn(orderId: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.RETURN_REQUESTED) {
        throw httpMessages.BAD_REQUEST(
          "Only orders with return requested can be approved."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.RETURN_APPROVED
      );

      // Handle return stock restoration or other tasks
      for (const productItem of existingOrder.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message: `Your order ${updatedOrder._id} placed on ${existingOrder.createdAt} has been approved for Return. PLease contact Us for more details.`,
        type: "info",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async disApproveReturn(orderId: string, reason: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.RETURN_REQUESTED) {
        throw httpMessages.BAD_REQUEST(
          "Only orders with return requested can be disapproved."
        );
      }

      // Change order status to RETURN_DISAPPROVED
      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.RETURN_DISAPPROVED
      );
      updatedOrder.reason = reason;
      await updatedOrder.save();

      // Notify user about the disapproval
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        orderId: updatedOrder._id as mongoose.Types.ObjectId,
        message:
          `Your return request for the order ` +
          existingOrder._id +
          ` placed on ${existingOrder.createdAt} has been disapproved.Reason:${reason} Please contact support for more details.`,
        type: "error",
      };
      await NotificationService.createNotification(userNotificationData);

      // Optionally, create admin notification
      await NotificationService.createAdminNotification(
        `Return request for order ID ${existingOrder._id} has been disapproved.`,
        "info"
      );

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async cancelOrderByUser(orderId: string, reason: string) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw httpMessages.NOT_FOUND("Order");
      }
      const orderCreatedAt = moment(order.createdAt);
      const now = moment();
      const timeDifference = now.diff(orderCreatedAt, "minutes");

      if (timeDifference > 30) {
        throw httpMessages.BAD_REQUEST(
          "Orders older than 30 minutes cannot be cancelled."
        );
      }

      for (const productItem of order.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }

      order.status = OrderStatus.ORDER_CANCELLED;
      order.reason = reason;
      await order.save();

      return {
        message: "Order cancelled successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  public async deleteOrderByAdmin(orderId: string) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw httpMessages.NOT_FOUND("Order");
      }

      const deletableStatuses = [
        OrderStatus.ORDER_CANCELLED,
        OrderStatus.RETURN_DISAPPROVED,
        OrderStatus.RETURN_APPROVED,
        OrderStatus.ORDER_DELIVERED,
      ];

      if (!deletableStatuses.includes(order.status)) {
        throw httpMessages.FORBIDDEN(
          `Cannot delete order in status '${order.status}'`
        );
      }
      if (
        order.status !== OrderStatus.ORDER_DELIVERED &&
        order.status !== OrderStatus.ORDER_SHIPPED
      ) {
        for (const productItem of order.products) {
          await Product.findByIdAndUpdate(productItem.productId, {
            $inc: { inStock: productItem.quantity },
          });
        }
      }
      await Order.deleteOne({ _id: orderId });

      return {
        message: "Order deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  public async getAllOrders() {
    try {
      const orders = await Order.find()
        .populate("userId", "fullName role number") // Only populate name, role, and number from the User document
        .populate({
          path: "products.productId",
          select: "name retailPrice wholeSalePrice", // Only select specific fields from Product (e.g., name, retailPrice, wholeSalePrice)
        });

      if (!orders || orders.length === 0) {
        return [];
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }
}
