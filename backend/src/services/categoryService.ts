import { Category, Product, SubCategory } from "../models";
import { ICategory } from "../interfaces";
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
      console.log(categoryId);
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

  public async deleteCategory(categoryId: string) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw httpMessages.NOT_FOUND("Category");
      }

      // Step 1: Delete all subcategories associated with this category
      const subCategories = await SubCategory.find({ category: categoryId });
      if (subCategories.length > 0) {
        // Step 2: Delete all products under each subcategory
        for (const subCategory of subCategories) {
          await Product.deleteMany({ subCategory: subCategory._id });
        }

        // Step 3: Delete all subcategories
        await SubCategory.deleteMany({ category: categoryId });
      }

      // Step 4: Delete the category itself
      await Category.deleteOne({ _id: categoryId });

      return {
        message:
          "Category, subcategories, and associated products deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
