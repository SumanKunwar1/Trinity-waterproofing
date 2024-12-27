import { Order, Product, User, Cart } from "../models";
import { IOrderItem } from "../interfaces";
import { httpMessages } from "../middlewares";
import { OrderStatus } from "../config/orderStatusEnum";
import { CartService } from "./cartService";
import moment from "moment";

export class OrderService {
  private cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }
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
        })),
        userId,
        subtotal,
        status: OrderStatus.ORDER_REQUESTED,
      });

      await newOrder.save();

      for (const { productId, quantity } of validatedProducts) {
        await Product.findByIdAndUpdate(productId, {
          $inc: { inStock: -quantity },
        });
      }

      // Validate if the order items match the cart items
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        throw httpMessages.NOT_FOUND("Cart not found");
      }

      const cartItemsMatch = validatedProducts.every((orderItem) =>
        cart.items.some(
          (cartItem) =>
            cartItem.productId.toString() === orderItem.productId.toString() &&
            cartItem.color === orderItem.color &&
            cartItem.quantity === orderItem.quantity
        )
      );

      if (cartItemsMatch) {
        await this.cartService.clearCart(userId);
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

      // await NotificationService.sendOrderConfirmation(updatedOrder);

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

      // Notify the customer about cancellation
      // await NotificationService.sendOrderCancellation(updatedOrder);

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

      // Notify the customer about the return request
      // await NotificationService.sendReturnRequestNotification(updatedOrder);

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

      // Notify the customer about return approval
      // await NotificationService.sendReturnApproval(updatedOrder);

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
