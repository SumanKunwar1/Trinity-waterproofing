import { Category, SubCategory, Product } from "../models";
import { ISubCategory } from "../interfaces";
import { httpMessages } from "../middlewares";

export class SubCategoryService {
  public async createSubCategory(subCategoryData: ISubCategory) {
    try {
      const { categoryId, name, description } = subCategoryData;
      const isPresent = await Category.findById(categoryId);
      if (!isPresent) {
        throw httpMessages.NOT_FOUND(`Category`);
      }
      const newSubCategory = new SubCategory({
        name,
        description,
        category: categoryId,
      });
      await newSubCategory.save();
      return newSubCategory;
    } catch (error) {
      throw error;
    }
  }

  public async getSubCategories() {
    try {
      const subCategories = await SubCategory.find().populate({
        path: "category",
        model: "Category",
      });

      if (!subCategories || subCategories.length === 0) {
        throw httpMessages.NOT_FOUND("subcategories");
      }

      return subCategories;
    } catch (error) {
      throw error;
    }
  }

  public async editSubCategory(
    subCategoryId: string,
    updateData: Partial<ISubCategory>
  ) {
    try {
      const updatedSubCategory = await SubCategory.findById(subCategoryId);
      if (!updatedSubCategory) {
        throw httpMessages.NOT_FOUND("subcategory");
      }

      const { categoryId, name, description } = updateData;
      if (categoryId) {
        const isCategoryPresent = await Category.findById(categoryId);
        if (!isCategoryPresent) {
          throw httpMessages.NOT_FOUND(`Category`);
        }
        updatedSubCategory.category = categoryId;
      }
      if (name) updatedSubCategory.name = name;
      if (description) updatedSubCategory.description = description;
      updatedSubCategory.save();

      return updatedSubCategory;
    } catch (error) {
      throw error;
    }
  }

  public async deleteSubCategory(subCategoryId: string) {
    try {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        throw httpMessages.NOT_FOUND("SubCategory");
      }

      const deletedProducts = await Product.deleteMany({
        subCategory: subCategoryId,
      });
      if (deletedProducts.deletedCount > 0) {
        console.log(`Deleted ${deletedProducts.deletedCount} products.`);
      }

      await SubCategory.deleteOne({ _id: subCategoryId });

      return {
        message: "SubCategory and associated products deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
