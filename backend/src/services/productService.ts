import { Product, SubCategory, Brand, WishList, Cart } from "../models";
import { IProduct, IEditableProduct } from "../interfaces";
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

      await isPresent.save();
      await newProduct.save();
      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  public async editProductImages(
    productId: string,
    productData: {
      productImage: string;
      image: string[];
      existingImages: string[];
    }
  ) {
    try {
      const { productImage, image: newImages, existingImages } = productData;

      // Log the input data
      // console.log("Received Product Data:", productData);

      // Extract file names from the existingImages URLs
      const existingImageFileNames = existingImages
        .map((url) => {
          if (url) {
            const parts = url.split("/");
            return parts[parts.length - 1]; // Extract file name from URL
          }
          return ""; // Return empty string if URL is invalid
        })
        .filter(Boolean); // Remove any empty strings from the list

      // console.log("Existing Image File Names:", existingImageFileNames);

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        // console.log(`Product with ID: ${productId} not found`);
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }

      // console.log("Found existing product:", existingProduct);

      const filesToDelete: string[] = [];

      // Check if the productImage is different from existing images
      if (existingProduct.productImage) {
        if (productImage) {
          // Ensure productImage is a valid string
          const productImageFileName = productImage.split("/").pop();
          // console.log(
          //   "Existing product main image file name:",
          //   existingProduct.productImage
          // );
          // console.log("New product image file name:", productImageFileName);
          filesToDelete.push(existingProduct.productImage);
          // console.log(`Added ${existingProduct.productImage} to delete list`);
        }
      }

      // Check if the additional images need to be deleted
      if (existingProduct.image && existingProduct.image.length > 0) {
        existingProduct.image.forEach((existingImage) => {
          if (existingImage) {
            // Ensure existingImage is a valid string
            const imageFileName = existingImage.split("/").pop();
            // console.log("Existing additional image file name:", existingImage);
            // console.log("New image file name:", imageFileName);

            if (
              imageFileName &&
              !existingImageFileNames.includes(imageFileName)
            ) {
              // Add to delete list and remove from existing images
              filesToDelete.push(existingImage);
              const indexToRemove =
                existingProduct.image.indexOf(existingImage);
              if (indexToRemove !== -1) {
                existingProduct.image.splice(indexToRemove, 1); // Remove from existing images array
                // console.log(
                // `Removed ${existingImage} from existing images list`
                // );
              }
              // console.log(`Added ${existingImage} to delete list`);
            }
          }
        });
      }
      // Log the files to delete before deleting
      // console.log("Files to delete:", filesToDelete);

      // Delete only the files that are not in the existingImages list
      if (filesToDelete.length > 0) {
        // console.log("Deleting files:", filesToDelete);
        await deleteImages(filesToDelete);
      }

      // Update the product image
      if (productImage) {
        // console.log("Updating product image:", productImage);
        existingProduct.productImage = productImage;
      }

      // Update the additional images
      if (newImages && newImages.length > 0) {
        // console.log("Appending new images:", newImages);
        existingProduct.image.push(...newImages); // Append new images
      }

      await existingProduct.save();

      // console.log("Updated product:", existingProduct);
      return existingProduct;
    } catch (error) {
      console.error("Error occurred while editing product images:", error);
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
        retailDiscountedPrice,
        wholeSaleDiscountedPrice,
        pdfUrl,
        isFeatured,
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
      if (wholeSalePrice !== undefined && wholeSalePrice !== null)
        existingProduct.wholeSalePrice = wholeSalePrice;
      if (
        wholeSaleDiscountedPrice !== undefined &&
        wholeSaleDiscountedPrice !== null
      )
        existingProduct.wholeSaleDiscountedPrice = wholeSaleDiscountedPrice;

      if (retailDiscountedPrice !== undefined && retailDiscountedPrice !== null)
        existingProduct.retailDiscountedPrice = retailDiscountedPrice;

      if (retailPrice !== undefined && retailPrice !== null)
        existingProduct.retailPrice = retailPrice;
      if (colors) existingProduct.colors = colors;
      if (features) existingProduct.features = features;
      if (brand) existingProduct.brand = brand;
      if (inStock) existingProduct.inStock = inStock;
      if (pdfUrl) existingProduct.pdfUrl = pdfUrl;
      if (isFeatured !== undefined && isFeatured !== null)
        existingProduct.isFeatured = isFeatured;

      await existingProduct.save();

      return existingProduct;
    } catch (error) {
      throw error;
    }
  }

  public async editProductIsFeatured(productId: string, isFeatured: boolean) {
    try {
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }
      existingProduct.isFeatured = isFeatured;
      existingProduct.save();
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
