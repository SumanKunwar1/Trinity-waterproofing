import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services";
import { ICategory } from "../interfaces";

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  public async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categoryData: ICategory = req.body;
      const result = await this.categoryService.createCategory(categoryData);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.categoryService.getCategories();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async editCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { categoryId } = req.params;
      const updateData: Partial<ICategory> = req.body;
      const result = await this.categoryService.editCategory(
        categoryId,
        updateData
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }
}
