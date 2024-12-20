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

  public async getProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.productService.getProducts();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId = req.params.id;

      const result = await this.productService.getProductById(productId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteProductById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { productId } = req.params;

      const result = await this.productService.deleteProductById(productId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
