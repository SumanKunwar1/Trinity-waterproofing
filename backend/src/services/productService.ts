import {
  Product,
  SubCategory,
  Brand,
  WishList,
  Order,
  Review,
} from "../models";
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
      if (!isPresent.product.includes(newProduct._id)) {
        isPresent.product.push(newProduct._id);
        await isPresent.save();
      }

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

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        throw httpMessages.NOT_FOUND(`Product with ID: ${productId}`);
      }

      const filesToDelete: string[] = [];

      // Check if the productImage is different from existing images
      if (existingProduct.productImage) {
        if (productImage) {
          // Ensure productImage is a valid string
          const productImageFileName = productImage.split("/").pop();

          filesToDelete.push(existingProduct.productImage);
        }
      }

      // Check if the additional images need to be deleted
      if (existingProduct.image && existingProduct.image.length > 0) {
        existingProduct.image.forEach((existingImage) => {
          if (existingImage) {
            // Ensure existingImage is a valid string
            const imageFileName = existingImage.split("/").pop();

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
              }
            }
          }
        });
      }
      // Log the files to delete before deleting

      // Delete only the files that are not in the existingImages list
      if (filesToDelete.length > 0) {
        await deleteImages(filesToDelete);
      }

      // Update the product image
      if (productImage) {
        existingProduct.productImage = productImage;
      }

      // Update the additional images
      if (newImages && newImages.length > 0) {
        existingProduct.image.push(...newImages); // Append new images
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
              (id) => id.toString() !== existingProduct._id.toString()
            );
            await oldSubCategory.save();
          }

          // Add the product ID to the new subcategory, but check for duplicates
          if (!isNewSubCategoryPresent.product.includes(existingProduct._id)) {
            isNewSubCategoryPresent.product.push(existingProduct._id);
            await isNewSubCategoryPresent.save();
          }
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
      if (pdfUrl !== undefined && pdfUrl !== null)
        existingProduct.pdfUrl = pdfUrl;
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
      return {
        message: "Product isFeatured updated successfully",
      };
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
      const product = await Product.findById(productId)
        .populate({
          path: "brand",
          model: "Brand",
        })
        .populate({
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

  public async getPopularProducts(limit: number = 10) {
    try {
      // Step 1: Get the count of orders for each product

      const orderCounts = await Order.aggregate([
        { $unwind: "$products" }, // Unwinds the products array to count individual products
        {
          $group: {
            _id: "$products.productId", // Group by productId
            count: { $sum: 1 }, // Count how many times each product appears in the orders
          },
        },
      ]);

      // Step 2: Calculate average ratings for each product based on the reviews

      const productPopularityData = await Promise.all(
        orderCounts.map(async (orderCount) => {
          // Step 2.1: Get the product details by ID

          const product: any = await Product.findById(orderCount._id).populate(
            "review"
          ); // Populate the review array

          // Step 2.2: Calculate the average rating for this product from its reviews
          let avgRating = 0;
          if (product && product.review && product.review.length > 0) {
            const totalRating = await product.review.reduce(
              async (sum: number, reviewId: any) => {
                const review = await Review.findById(reviewId); // Fetch the review by ID
                return sum + (review ? review.rating : 0); // Add the review rating to sum
              },
              0
            ); // Start with sum as 0

            avgRating = totalRating / product.review.length; // Calculate average rating
          }

          // Step 2.3: Combine order count and average rating

          return {
            product: product, // Full product data
            orderCount: orderCount.count,
            avgRating: avgRating, // Average rating
          };
        })
      );

      // Step 3: Sort products by the combination of order count and average rating

      const filteredProductPopularityData = productPopularityData.filter(
        (item) => item.product !== null && item.product !== undefined
      );

      filteredProductPopularityData.sort((a, b) => {
        const scoreA = a.orderCount * 0.7 + a.avgRating * 0.3;
        const scoreB = b.orderCount * 0.7 + b.avgRating * 0.3;

        return scoreB - scoreA; // Sort in descending order
      });

      // Step 4: Return the top products based on the given limit

      const popularProducts = filteredProductPopularityData
        .slice(0, limit)
        .map((data) => data.product);

      const formattedPopularProducts = popularProducts.map((product: any) => {
        return {
          ...product.toObject(), // Convert the Mongoose document to a plain object
          productImage: `/api/image/${product.productImage}`, // Format the productImage
          image: product.image.map((img: string) => `/api/image/${img}`), // Format each image in the images array
        };
      });

      return formattedPopularProducts;
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
