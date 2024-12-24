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
      // Step 1: Fetch Categories
      const categories = await Category.find();

      if (!categories || categories.length === 0) {
        return [];
      }

      // Step 2: Fetch SubCategories and Products separately
      const categoryResponse = await Promise.all(
        categories.map(async (category) => {
          // Step 2.1: Fetch subCategories for each category
          const subCategories = await SubCategory.find({
            category: category._id,
          });

          // Step 2.2: Fetch Products for each subCategory
          const modifiedSubCategories = await Promise.all(
            subCategories.map(async (subCategory) => {
              // Step 2.2.1: Fetch products for this subcategory
              const products = await Product.find({
                _id: { $in: subCategory.product },
              });

              // Step 2.2.2: Modify products (add full URLs for images)
              const modifiedProducts = products.map((product) => {
                const productImageUrl = product.productImage
                  ? `/api/image/${product.productImage}`
                  : null;

                const imageUrls =
                  product.image && product.image.length > 0
                    ? product.image.map((img: string) => `/api/image/${img}`)
                    : [];

                return {
                  ...product.toObject(), // Convert Mongoose document to plain object
                  productImage: productImageUrl,
                  image: imageUrls,
                };
              });

              // Step 2.3: Return the subcategory with modified products
              return {
                ...subCategory.toObject(), // Convert subcategory to plain object
                products: modifiedProducts, // Attach the modified product array
              };
            })
          );

          // Step 3: Return the category with modified subcategories
          return {
            ...category.toObject(), // Convert category to plain object
            subCategories: modifiedSubCategories, // Attach the modified subcategory array
          };
        })
      );

      console.log(JSON.stringify(categoryResponse, null, 2));
      return categoryResponse;
    } catch (error) {
      throw error; // Rethrow error if any occurs
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
