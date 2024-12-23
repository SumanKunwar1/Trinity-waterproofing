import { Order, Product, User } from "../models";
import { IOrderItem } from "../interfaces";
import { httpMessages } from "../middlewares";
import { OrderStatus } from "../config/orderStatusEnum";
import moment from "moment";

export class OrderService {
  public async createOrder(
    userId: string,
    orderData: IOrderItem[],
    userRole: string
  ) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw httpMessages.NOT_FOUND("User");
      }

      let subtotal = 0;
      const validatedProducts = [];

      for (const orderItem of orderData) {
        const { productId, color, quantity } = orderItem;

        const product = await Product.findById(productId);
        if (!product) {
          throw httpMessages.NOT_FOUND(`Product with ID ${productId}`);
        }

        const price =
          userRole.toLowerCase() === "b2b"
            ? product.wholeSalePrice
            : product.retailPrice;

        if (product.colors && product.colors.length > 0) {
          if (!color) {
            throw httpMessages.BAD_REQUEST(
              `Color is required for product ${
                product.name
              } with available colors: ${product.colors.join(", ")}`
            );
          }
          if (!product.colors.includes(color)) {
            throw httpMessages.BAD_REQUEST(
              `Invalid color '${color}' for product ${
                product.name
              }. Available colors: ${product.colors.join(", ")}`
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
        })),
        userId,
        subtotal,
        status: "pending",
      });

      await newOrder.save();

      for (const { productId, quantity } of validatedProducts) {
        await Product.findByIdAndUpdate(productId, {
          $inc: { inStock: -quantity },
        });
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
        throw httpMessages.NOT_FOUND("Orders for this user");
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }

  public async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId).populate(
        "products.productId"
      );

      if (!order) {
        throw httpMessages.NOT_FOUND("Order");
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

  public async deleteOrderById(orderId: string) {
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
          "Orders older than 30 minutes cannot be deleted."
        );
      }
      for (const productItem of order.products) {
        await Product.findByIdAndUpdate(productItem.productId, {
          $inc: { inStock: productItem.quantity },
        });
      }
      await Order.deleteOne({ _id: orderId });

      return {
        message: "Order deleted successfully",
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
      if (order.status !== "completed") {
        // Update stock for each product in the order
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
        throw httpMessages.NOT_FOUND("Orders");
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }
}
