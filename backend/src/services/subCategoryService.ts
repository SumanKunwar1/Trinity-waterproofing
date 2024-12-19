import { Category, ISubCategory, SubCategory } from "../models";
import { httpMessages } from "../middlewares";

export class SubCategoryService {
  public async createSubCategory(subCategoryData: ISubCategory) {
    try {
      const { categoryId } = subCategoryData;
      const isPresent = await Category.findById(categoryId);
      if (!isPresent) {
        throw httpMessages.NOT_FOUND(`Category`);
      }
      const newSubCategory = new SubCategory(subCategoryData);
      await newSubCategory.save();
      return newSubCategory;
    } catch (error) {
      throw error;
    }
  }
}
