import { NextFunction, Request, Response } from "express";
import { SubCategoryService } from "../services";
import { ISubCategory } from "../models";

export class SubCategoryController {
  private subCategoryService: SubCategoryService;

  constructor() {
    this.subCategoryService = new SubCategoryService();
  }

  public async createSubCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subCategoryData: ISubCategory = req.body;
      const result = await this.subCategoryService.createSubCategory(
        subCategoryData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getSubCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.subCategoryService.getSubCategories();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editSubCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const subCategoryId = req.params.id;
      const updateData: Partial<ISubCategory> = req.body;
      const result = await this.subCategoryService.editSubCategory(
        subCategoryId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
