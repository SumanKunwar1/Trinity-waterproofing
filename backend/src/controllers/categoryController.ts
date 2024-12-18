import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '../services';  
import { ICategory } from '../models';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();  
  }

  public async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categoryData:ICategory = req.body;
      const result = await this.categoryService.createCategory(categoryData); 
      res.locals.responseData =  result;
      next();
    } catch (error:any) {
      next(error);
      }
  }
}
