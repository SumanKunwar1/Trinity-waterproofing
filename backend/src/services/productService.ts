import { Product, IProduct, SubCategory } from "../models";
import { httpMessages } from "../middlewares";

export class ProductService {
  public async createProduct(productData: IProduct) {
    try {
      const { subCategoryId } = productData;
      const isPresent = await SubCategory.findById(subCategoryId);
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
}
