import { Product, SubCategory, Brand } from "../models";
import { IProduct } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";

export class ProductService {
  public async createProduct(productData: IProduct) {
    try {
      const { subCategory, brand } = productData;
      const isPresent = await SubCategory.findById(subCategory);
      if (!isPresent) {
        throw httpMessages.NOT_FOUND(`subCategory`);
      }
      const isBrandPresent = await Brand.findById(brand);
      if (!isBrandPresent) {
        throw httpMessages.NOT_FOUND(`Brand`);
      }

      const newProduct = new Product(productData);
      isPresent.product.push(newProduct._id);

      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  public async editProduct(productId: string, productData: IProduct) {
    try {
      const { subCategory, brand } = productData;

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }

      const isSubCategoryPresent = await SubCategory.findById(subCategory);
      if (!isSubCategoryPresent) {
        throw httpMessages.NOT_FOUND(`subCategory`);
      }

      const isBrandPresent = await Brand.findById(brand);
      if (!isBrandPresent) {
        throw httpMessages.NOT_FOUND(`Brand`);
      }

      const filesToDelete: string[] = [];

      if (existingProduct.productImage) {
        filesToDelete.push(existingProduct.productImage);
      }

      if (existingProduct.image && existingProduct.image.length > 0) {
        filesToDelete.push(...existingProduct.image);
      }

      await deleteImages(filesToDelete);
      if (existingProduct.subCategory !== subCategory) {
        // Remove the product ID from the old subcategory's product array
        const oldSubCategory = await SubCategory.findById(
          existingProduct.subCategory
        );
        if (oldSubCategory) {
          oldSubCategory.product = oldSubCategory.product.filter(
            (productId) => !productId.equals(existingProduct._id)
          );
          await oldSubCategory.save();
        }

        // Add the product ID to the new subcategory's product array
        isSubCategoryPresent.product.push(existingProduct._id);
        await isSubCategoryPresent.save();
      }

      existingProduct.set(productData);

      await existingProduct.save();

      return existingProduct;
    } catch (error) {
      throw error;
    }
  }

  public async getProducts() {
    try {
      const products = await Product.find()
        .populate({
          path: "subCategory",
          populate: {
            path: "category",
            model: "Category",
          },
        })
        .populate({
          path: "review",
          model: "Review",
        });

      if (!products || products.length === 0) {
        throw httpMessages.NOT_FOUND("products");
      }

      const productResponse = products.map((product) => ({
        ...product.toObject(),
        productImage: product.productImage
          ? `/api/image/${product.productImage}`
          : null, // Modify productImage field
        image: product.image
          ? product.image.map((img: string) => `/api/image/${img}`)
          : [], // Modify image field
      }));

      return productResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getProductById(productId: string) {
    try {
      const product = await Product.findById(productId).populate({
        path: "subCategory",
        populate: {
          path: "category",
          model: "Category",
        },
      });

      if (!product) {
        throw httpMessages.NOT_FOUND(`product`);
      }

      const productResponse = {
        ...product.toObject(),
        productImage: product.productImage
          ? `/api/image/${product.productImage}`
          : null,
        image: product.image
          ? product.image.map((img: string) => `/api/image/${img}`)
          : [],
      };

      return productResponse;
    } catch (error) {
      throw error;
    }
  }

  public async deleteProductById(productId: string) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        throw httpMessages.NOT_FOUND(`product`);
      }
      const filesToDelete: string[] = [];

      if (product.productImage) {
        filesToDelete.push(product.productImage);
      }

      if (product.image && product.image.length > 0) {
        filesToDelete.push(...product.image);
      }

      await deleteImages(filesToDelete);
      await Product.deleteOne({ _id: productId });
      return {
        message: "Product deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
