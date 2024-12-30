import { Product, SubCategory, Brand, WishList, Cart } from "../models";
import { IProduct, IEditableProduct } from "../interfaces";
import { httpMessages } from "../middlewares";
import { deleteImages } from "../config/deleteImages";
import { Types } from "mongoose";

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

      await isPresent.save();
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  public async editProductImages(
    productId: string,
    productData: { productImage: string; image: string[] }
  ) {
    try {
      const { productImage, image } = productData;

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }

      const filesToDelete: string[] = [];

      if (existingProduct.productImage) {
        filesToDelete.push(existingProduct.productImage);
      }

      if (existingProduct.image && existingProduct.image.length > 0) {
        filesToDelete.push(...existingProduct.image);
      }

      await deleteImages(filesToDelete);

      if (productImage) {
        existingProduct.productImage = productImage;
      }

      if (image && image.length > 0) {
        existingProduct.image = image;
      }

      await existingProduct.save();

      return existingProduct;
    } catch (error) {
      throw error;
    }
  }

  public async editProductDetails(
    productId: string,
    productData: IEditableProduct
  ) {
    try {
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }

      const {
        name,
        description,
        wholeSalePrice,
        retailPrice,
        colors,
        features,
        brand,
        inStock,
        subCategory,
      } = productData;

      // Handle brand validation if provided
      if (brand) {
        const isBrandPresent = await Brand.findById(brand);
        if (!isBrandPresent) {
          throw httpMessages.NOT_FOUND("Brand");
        }
      }

      // Handle subCategory logic
      if (subCategory) {
        const isNewSubCategoryPresent = await SubCategory.findById(subCategory);
        if (!isNewSubCategoryPresent) {
          throw httpMessages.NOT_FOUND("SubCategory");
        }

        const oldSubCategoryId = existingProduct.subCategory;

        // If subCategory is changing, update the relationships
        if (oldSubCategoryId && oldSubCategoryId !== subCategory) {
          const oldSubCategory = await SubCategory.findById(oldSubCategoryId);
          if (oldSubCategory) {
            // Remove the product ID from the old subcategory
            oldSubCategory.product = oldSubCategory.product.filter(
              (id) => id !== existingProduct._id
            );
            await oldSubCategory.save();
          }

          // Add the product ID to the new subcategory
          isNewSubCategoryPresent.product.push(existingProduct._id);
          await isNewSubCategoryPresent.save();
        }

        existingProduct.subCategory = subCategory;
      }

      // Update other product details
      if (name) existingProduct.name = name;
      if (description) existingProduct.description = description;
      if (wholeSalePrice) existingProduct.wholeSalePrice = wholeSalePrice;
      if (retailPrice) existingProduct.retailPrice = retailPrice;
      if (colors) existingProduct.colors = colors;
      if (features) existingProduct.features = features;
      if (brand) existingProduct.brand = brand;
      if (inStock) existingProduct.inStock = inStock;

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
          path: "brand",
          model: "Brand",
        })
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
        return [];
      }

      const productResponse = products.map((product) => {
        // Modify product images
        const modifiedProduct = {
          ...product.toObject(),
          productImage: product.productImage
            ? `/api/image/${product.productImage}`
            : null, // Modify productImage field
          image: product.image
            ? product.image.map((img: string) => `/api/image/${img}`)
            : [],
          review: product.review.map((review: any) => {
            return {
              ...review.toObject(),
              image: review.image
                ? review.image.map((img: string) => `/api/image/${img}`)
                : [],
            };
          }),
        };

        return modifiedProduct;
      });

      return productResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getProductById(productId: string) {
    try {
      const product = await Product.findById(productId).populate({
        path: "review",
        model: "Review",
      });

      if (!product) {
        return null;
      }

      const productResponse = {
        ...product.toObject(),
        productImage: product.productImage
          ? `/api/image/${product.productImage}`
          : null,
        image: product.image
          ? product.image.map((img: string) => `/api/image/${img}`)
          : [],
        // Modify review images if they exist
        review: product.review.map((review: any) => {
          return {
            ...review.toObject(),
            image: review.image
              ? review.image.map((img: string) => `/api/image/${img}`)
              : [], // Modify image URLs in the review field
          };
        }),
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
        return null;
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

  public async getProductByUserId(userId: string) {
    try {
      const wishlist = await WishList.findOne({ user_id: userId });

      const products = await Product.find()
        .populate({
          path: "brand",
          model: "Brand",
        })
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
        return [];
      }

      const wishlistProductIds = new Set(
        wishlist ? wishlist.product_id.map((id) => id) : []
      );

      // const cartProductIds = new Set(
      //   cart ? cart.items.map((item) => item.productId) : []
      // );

      const productResponse = products.map((product) => {
        const isAddedToWishlist = wishlistProductIds.has(product._id);
        // const isAddedToCart = cartProductIds.has(product._id);

        return {
          ...product.toObject(),
          productImage: product.productImage
            ? `/api/image/${product.productImage}`
            : null,
          image: product.image
            ? product.image.map((img: string) => `/api/image/${img}`)
            : [],
          isAddedToWishlist,
          // isAddedToCart,
          // Modify review images if they exist
          review: product.review.map((review: any) => {
            return {
              ...review.toObject(),
              image: review.image
                ? review.image.map((img: string) => `/api/image/${img}`)
                : [], // Modify image URLs in the review field
            };
          }),
        };
      });

      return productResponse;
    } catch (error) {
      throw error;
    }
  }
}
