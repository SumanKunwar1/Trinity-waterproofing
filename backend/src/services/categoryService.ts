import { Category, Product, SubCategory } from "../models";
import { ICategory } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

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
      // Step 1: Find the category by ID
      const category = await Category.findById(categoryId);
      if (!category) {
        throw httpMessages.NOT_FOUND("Category");
      }

      // Step 2: Find all subcategories associated with this category
      const subCategories = await SubCategory.find({ category: categoryId });

      if (subCategories.length > 0) {
        // Step 3: Delete all products under each subcategory and delete their images
        for (const subCategory of subCategories) {
          // Find all products under this subcategory
          const products = await Product.find({ subCategory: subCategory._id });

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

            // Call deleteImages function to remove the files
            if (filesToDelete.length > 0) {
              await deleteImages(filesToDelete);
              console.log(
                `Successfully deleted files for product ${product._id}:`,
                filesToDelete
              );
            }

            // Delete the product from the database
            await Product.deleteMany({ subCategory: subCategory._id });
          }
        }

        // Step 4: Delete all subcategories under this category
        await SubCategory.deleteMany({ category: categoryId });
      }

      // Step 5: Delete the category itself
      await Category.deleteOne({ _id: categoryId });

      // Step 6: Return success message
      return {
        message:
          "Category, subcategories, and associated products and images deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
