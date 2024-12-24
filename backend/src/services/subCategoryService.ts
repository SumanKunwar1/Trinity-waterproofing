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

      isPresent.subCategory.push(newSubCategory._id);
      await newSubCategory.save();
      return newSubCategory;
    } catch (error) {
      throw error;
    }
  }

  public async getSubCategories() {
    try {
      const subCategories = await SubCategory.find().populate({
        path: "product",
        model: "Product",
      });

      if (!subCategories || subCategories.length === 0) {
        return [];
      }

      const subCategoryResponse = await Promise.all(
        subCategories.map(async (subCategory) => {
          // Extract product IDs from the subcategory
          const productIds = subCategory.product;

          // Step 3: Fetch the products based on the extracted product IDs
          const products = await Product.find({
            _id: { $in: productIds }, // Match products whose _id is in the list of productIds
          });

          // Step 4: Modify each product (e.g., include full URLs for productImage and images)
          const modifiedProducts = products.map((product) => {
            const productImageUrl = product.productImage
              ? `/api/image/${product.productImage}`
              : null;

            const imageUrls =
              product.image && product.image.length > 0
                ? product.image.map((img: string) => `/api/image/${img}`)
                : [];

            // Return modified product data
            return {
              ...product.toObject(),
              productImage: productImageUrl,
              image: imageUrls,
            };
          });

          // Step 5: Return the subcategory data with the modified products
          return {
            ...subCategory.toObject(),
            product: modifiedProducts,
          };
        })
      );
      console.log(JSON.stringify(subCategoryResponse, null, 2));
      return subCategoryResponse;
    } catch (error) {
      throw error; // Rethrow error if any occurs
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
          throw httpMessages.NOT_FOUND("Category");
        }

        // If the category is changing, we need to remove this subcategory from the previous category's subcategory array
        const oldCategoryId = updatedSubCategory.category;
        if (oldCategoryId !== categoryId) {
          const oldCategory = await Category.findById(oldCategoryId);
          if (oldCategory) {
            oldCategory.subCategory = oldCategory.subCategory.filter(
              (subCategory) => !subCategory.equals(updatedSubCategory._id)
            );
            await oldCategory.save();
          }

          // Add the subcategory to the new category's subcategory array
          isCategoryPresent.subCategory.push(updatedSubCategory._id);
          await isCategoryPresent.save();
        }

        // Update the subcategory's category
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
