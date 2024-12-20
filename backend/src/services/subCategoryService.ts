import { Category, SubCategory, Product } from "../models";
import { ISubCategory } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

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
      // Step 1: Find the subcategory by ID
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        throw httpMessages.NOT_FOUND("SubCategory");
      }

      // Step 2: Find all products related to this subcategory
      const products = await Product.find({ subCategory: subCategoryId });

      // Step 3: Delete images for each product before deleting the product
      for (const product of products) {
        const filesToDelete: string[] = [];

        // Add the product image (if exists)
        if (product.productImage) {
          filesToDelete.push(product.productImage);
        }

        // Add the additional images (if any exist)
        if (product.image && product.image.length > 0) {
          filesToDelete.push(...product.image);
        }

        // Call deleteImages function to remove files
        if (filesToDelete.length > 0) {
          await deleteImages(filesToDelete);
          console.log(
            `Successfully deleted files for product ${product._id}:`,
            filesToDelete
          );
        }

        // Step 4: Delete the product from the database
        await Product.deleteOne({ _id: product._id });
      }

      // Step 5: Delete the subcategory from the database
      await SubCategory.deleteOne({ _id: subCategoryId });

      // Step 6: Return a success message
      return {
        message:
          "SubCategory and associated products and images deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
