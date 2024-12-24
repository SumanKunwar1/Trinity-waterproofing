import { Request, Response, NextFunction } from "express";
import { WishListService } from "../services";

export class WishListController {
  private wishListService: WishListService;

  constructor() {
    this.wishListService = new WishListService();
  }

  public async addToWishList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const userId = req.params.id;
      const result = await this.wishListService.addToWishlist(
        userId,
        productId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
  public async removeFromWishList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;
      const userId = req.params.id;
      const result = await this.wishListService.removeFromWishlist(
        userId,
        productId
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
