import { NextFunction, Request, Response } from "express";
import { BrandService } from "../services";
import { IBrand } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  public async createBrand(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brandData: IBrand = req.body;
      const result = await this.brandService.createBrand(brandData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteImages([req.body.image]);
      next(error);
    }
  }

  public async getBrands(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.brandService.getBrands();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getBrandById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brandId = req.params.id;
      const result = await this.brandService.getBrandById(brandId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editBrand(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brandId = req.params.id;
      const updateData: Partial<IBrand> = req.body;
      const result = await this.brandService.editBrand(brandId, updateData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      deleteImages([req.body.image]);
      next(error);
    }
  }

  public async deleteBrand(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const brandId = req.params.id;
      const result = await this.brandService.deleteBrandById(brandId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
