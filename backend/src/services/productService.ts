import { Product, SubCategory } from "../models";
import { IProduct } from "../interfaces";
import { httpMessages } from "../middlewares";

export class ProductService {
  public async createProduct(productData: IProduct) {
    try {
      const { subCategory } = productData;
      const isPresent = await SubCategory.findById(subCategory);
      if (!isPresent) {
        throw httpMessages.NOT_FOUND(`subCategory`);
      }
      const newProduct = new Product(productData);
      await newProduct.save();
      return newProduct;
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

      return products;
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

      return product;
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

      await Product.deleteOne({ _id: productId });
      return {
        message: "Product deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }
}
