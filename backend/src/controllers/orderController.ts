import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services";
import { IOrderItem } from "../interfaces";
import { httpMessages } from "../middlewares";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userEmail = req.email;
      const userRole = req.role;
      const orderData: IOrderItem[] = req.body;
      const result = await this.orderService.createOrder(
        userEmail,
        orderData,
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
      const userId = req.params.id;
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
      const orderId = req.params.id;
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

  public async deleteOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const orderId = req.params.id;
      const result = await this.orderService.deleteOrderById(orderId);
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
