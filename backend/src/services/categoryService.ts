import { Category, ICategory } from "../models";
import { httpMessages } from "../middlewares";

export class CategoryService {
  public async createCategory(categoryData: ICategory) {
    try {
      const { name } = categoryData;
      const isPresent = await Category.findOne({ name });
      if (isPresent) {
        throw httpMessages.ALREADY_PRESENT(`Category ${name}`);
      }
      const category = new Category(categoryData);
      await category.save();
      return category;
    } catch (error) {
      throw error;
    }
  }

  public async getCategories() {
    try {
      const categories = await Category.find();

      if (!categories || categories.length === 0) {
        throw httpMessages.NOT_FOUND("categories");
      }

      return categories;
    } catch (error) {
      throw error;
    }
  }

  public async editCategory(
    categoryId: string,
    updateData: Partial<ICategory>
  ) {
    try {
      const updatedCategory = await Category.findById(categoryId);
      const { name, description } = updateData;

      if (!updatedCategory) {
        throw httpMessages.NOT_FOUND("category");
      }

      if (name) updatedCategory.name = name;
      if (description) updatedCategory.description = description;

      updatedCategory.save();
      return updatedCategory;
    } catch (error) {
      throw error;
    }
  }
}
