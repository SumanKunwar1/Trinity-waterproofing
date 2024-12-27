import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services";
import { IProduct, IEditableProduct } from "../interfaces";
import { deleteProductImages } from "../config/deleteImages";
import { Types } from "mongoose";

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
      deleteProductImages(req);
      next(error);
    }
  }

  public async editProductImages(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId: string = req.params.productId;
      const productData: IProduct = req.body;
      const result = await this.productService.editProductImages(
        productId,
        productData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteProductImages(req);
      next(error);
    }
  }
  public async editProductDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const productId: string = req.params.productId;
      const productData: IEditableProduct = req.body;
      const result = await this.productService.editProductDetails(
        productId,
        productData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteProductImages(req);
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
      const productId = req.params.productId;

      const result = await this.productService.getProductById(productId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getProductByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.productService.getProductByUserId(userId);
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
      const productId = req.params.productId;

      const result = await this.productService.deleteProductById(productId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
