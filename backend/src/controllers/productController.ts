import { NextFunction, Request, Response } from "express";
import { ProductService } from "../services";
import { IProduct, IEditableProduct } from "../interfaces";
import { deleteProductImages } from "../config/deleteImages";

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
      const productId: string = req.params.id;
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
      const productId: string = req.params.id;
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
      const productId = req.params.id;

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
      const userId = req.params.id;
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
      const productId = req.params.id;

      const result = await this.productService.deleteProductById(productId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
