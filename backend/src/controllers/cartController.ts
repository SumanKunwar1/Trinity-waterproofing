import { Request, Response, NextFunction } from "express";
import { CartService } from "../services";
import { ICartItem } from "../interfaces";
import { httpMessages } from "../middlewares";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const cartItem: ICartItem = req.body;
      const result = await this.cartService.addToCart(userId, cartItem);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async updateQuantity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const cartItemId = req.params.cartItemId;
      const { quantity } = req.body;

      if (typeof quantity !== "number" || isNaN(quantity)) {
        throw httpMessages.BAD_REQUEST(
          "Invalid quantity. Quantity must be a valid number."
        );
      }

      const result = await this.cartService.updateQuantity(
        userId,
        cartItemId,
        quantity
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async removeFromCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const cartItemId = req.params.cartItemId;
      const message = await this.cartService.removeFromCart(userId, cartItemId);
      res.locals.responseData = { message };
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.cartService.getCartByUserId(userId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async clearCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.cartService.clearCart(userId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
