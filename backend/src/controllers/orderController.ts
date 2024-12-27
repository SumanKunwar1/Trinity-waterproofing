import { Request, Response, NextFunction } from "express";
import { OrderService, CartService } from "../services";
import { IOrderItem } from "../interfaces";
import { httpMessages } from "../middlewares";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const cartService = new CartService(); // Initialize CartService
    this.orderService = new OrderService(cartService); // Pass CartService to OrderService
  }

  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userEmail = req.email;
      const userRole = req.role;
      const orderData: IOrderItem[] = req.body.products;
      const addressId: string = req.body.addressId;
      const result = await this.orderService.createOrder(
        userEmail,
        orderData,
        addressId,
        userRole
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getOrdersByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.orderService.getOrdersByUserId(userId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.getOrderById(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const result = await this.orderService.updateOrderStatus(orderId, status);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async confirmOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.confirmOrder(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async cancelOrderByAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.cancelOrderByAdmin(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async returnRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.returnRequest(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async approveReturn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.approveReturn(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async cancelOrderByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.orderId;
      const result = await this.orderService.cancelOrderByUser(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteOrderByAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const result = await this.orderService.deleteOrderByAdmin(orderId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getAllOrders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.orderService.getAllOrders();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
