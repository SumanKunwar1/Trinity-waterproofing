import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services";
import { IProduct } from "../models";
import { deleteImages } from "../config/deleteImages";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productData: IProduct = req.body;

      const result = await this.productService.createProduct(productData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteImages(req);
      next(error);
    }
  }
}
