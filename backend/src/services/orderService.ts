import { Order, Product, User, Cart } from "../models";
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
        console.log("User not found.");
        throw httpMessages.NOT_FOUND("User");
      }
      console.log("User found:", user);

      let subtotal = 0;
      const validatedProducts = [];

      for (const orderItem of orderData) {
        console.log("Processing order item:", orderItem);

        const { productId, color, quantity } = orderItem;

        const product = await Product.findById(productId);
        if (!product) {
          console.log(`Product not found for ID: ${productId}`);
          throw httpMessages.NOT_FOUND(`Product with ID ${productId}`);
        }
        console.log("Product found:", product);

        const price =
          userRole.toLowerCase() === "b2b"
            ? product.wholeSalePrice
            : product.retailPrice;
        console.log(
          `Price for product '${product.name}' determined as: ${price}`
        );

        if (product.colors && product.colors.length > 0) {
          console.log(
            "Validating color for product with colors:",
            product.colors
          );

          if (!color) {
            console.log("Color is required but not provided.");
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
            console.log(`Invalid color: ${color}`);
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
          console.log(
            `Insufficient stock for product ${product.name}. Available: ${product.inStock}, Requested: ${quantity}`
          );
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
        console.log("Validated product added:", {
          productId,
          color,
          quantity,
          price,
        });

        subtotal += price * quantity;
        console.log("Updated subtotal:", subtotal);
      }

      console.log("All products validated. Creating new order...");
      const newOrder = new Order({
        products: validatedProducts.map((item) => ({
          productId: item.productId,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        userId: user._id,
        addressId,
        subtotal,
        status: OrderStatus.ORDER_REQUESTED,
      });
      console.log("New Order Object:", newOrder);

      await newOrder.save();
      console.log("Order saved to database.");

      for (const { productId, quantity } of validatedProducts) {
        console.log(
          `Updating stock for product ID: ${productId}, decrement by: ${quantity}`
        );
        await Product.findByIdAndUpdate(productId, {
          $inc: { inStock: -quantity },
        });
      }
      console.log("Product stock updated.");

      // **User Notification**
      const formattedDate = moment(newOrder.created_at).format(
        "MMMM Do YYYY, h:mm A"
      );

      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(user._id),
        message: `Your order placed on ${formattedDate} containing has been successfully placed. Total: $${subtotal}.`,
        type: "success",
      };
      await NotificationService.createNotification(userNotificationData);

      const adminNotificationData = {
        message: `New order created by ${user.fullName} (${user.email}) on ${formattedDate}. Subtotal: $${subtotal}.`,
        type: "info",
      };
      await NotificationService.createAdminNotification(
        `New order created by ${user.fullName} (${user.email}) on ${formattedDate}. Subtotal: $${subtotal}.`,
        "info"
      );

      const cart = await Cart.findOne({ userId: user._id });
      if (cart) {
        console.log("User cart found:", cart);

        // Remove only items that match the order
        for (const orderItem of validatedProducts) {
          const { productId, color, quantity } = orderItem;
          console.log(
            `Removing cart item for product ID: ${productId}, color: ${color}, quantity: ${quantity}`
          );

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
        console.log("Matching items removed from cart.");
      }

      console.log("Order creation complete.");
      return newOrder;
    } catch (error) {
      console.error("Error during order creation:", error);
      throw error;
    }
  }

  public async getOrdersByUserId(userId: string) {
    try {
      const orders = await Order.find({ userId })
        .populate("products.productId")
        .populate("addressId");

      if (!orders || orders.length === 0) {
        return [];
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }

  public async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId)
        .populate("products.productId")
        .populate("addressId");

      if (!order) {
        return null;
      }

      return order;
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
        message: `Your order placed on ${existingOrder.created_at} has been successfully placed.`,
        type: "success",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async cancelOrderByAdmin(orderId: string) {
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

      for (const productItem of existingOrder.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        message: `Your order placed on ${existingOrder.created_at} has been cancelled. Please Contact Us to Know the details.`,
        type: "error",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async returnRequest(orderId: string) {
    try {
      const existingOrder = await Order.findById(orderId);

      if (!existingOrder) {
        throw httpMessages.NOT_FOUND("Order");
      }

      if (existingOrder.status !== OrderStatus.SERVICE_COMPLETED) {
        throw httpMessages.BAD_REQUEST(
          "Only completed orders are eligible for return requests."
        );
      }

      const updatedOrder = await this.updateOrderStatusInternal(
        orderId,
        OrderStatus.RETURN_REQUESTED
      );
      const userNotificationData: INotification = {
        userId: new mongoose.Types.ObjectId(existingOrder.userId),
        message: `Your order placed on ${existingOrder.created_at} has been set to return.Confirmation require 24-48 hours.`,
        type: "info",
      };
      await NotificationService.createAdminNotification(
        `A new order with ID ${existingOrder._id} has been requested to return. Please review it.`,
        "info"
      );
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
        message: `Your order placed on ${existingOrder.created_at} has been approved for Return. PLease contact Us for more details.`,
        type: "info",
      };
      await NotificationService.createNotification(userNotificationData);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  public async cancelOrderByUser(orderId: string) {
    try {
      const order = await Order.findById(orderId);

      if (!order) {
        throw httpMessages.NOT_FOUND("Order");
      }
      const orderCreatedAt = moment(order.created_at);
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
      if (order.status !== OrderStatus.SERVICE_COMPLETED) {
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
        .populate("userId", "name role number") // Only populate name, role, and number from the User document
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
