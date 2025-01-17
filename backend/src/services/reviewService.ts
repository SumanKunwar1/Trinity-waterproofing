import { Review, Product, User, Order, IOrder } from "../models";
import { Types } from "mongoose";
import { IReview } from "../interfaces";
import { httpMessages } from "../middlewares";
import { OrderStatus } from "../config/orderStatusEnum";
import { deleteImages } from "../config/deleteImages";

export class ReviewService {
  public async createReview(
    reviewData: IReview,
    orderId: string,
    userEmail: string
  ) {
    try {
      // Step 1: Find the product by ID
      const product = await Product.findById(reviewData.productId);
      if (!product) {
        throw httpMessages.NOT_FOUND("Product not found");
      }

      // Step 2: Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }

      // Step 3: Check if the user is an admin
      if (user.role === "admin") {
        throw httpMessages.FORBIDDEN("You are forbidden to post reviews");
      }

      // Step 4: Find the order by orderId
      const order = await Order.findById(orderId);
      if (!order) {
        throw httpMessages.NOT_FOUND("Order not found");
      }

      // Step 5: Check if the order status is "delivered"
      if (order.status !== OrderStatus.ORDER_DELIVERED) {
        throw httpMessages.FORBIDDEN(
          "You can only review products from completed orders"
        );
      }

      // Log the order for debugging
      console.log("order we got", order);

      const productInOrder = order.products.some((orderProduct) => {
        console.log("Order Product ID:", orderProduct.productId.toString());
        console.log("Review Product ID:", reviewData.productId.toString());
        return (
          orderProduct.productId.toString() === reviewData.productId.toString()
        );
      });

      console.log("Product found in order:", productInOrder);
      if (!productInOrder) {
        throw httpMessages.FORBIDDEN(
          "You can only review products you have purchased"
        );
      }

      const productWithReviews = await Product.findById(product._id).populate({
        path: "review", // Populate the review array
        match: { user: user._id }, // Filter reviews for the specific user
      });

      if (productWithReviews?.review && productWithReviews.review.length > 0) {
        throw httpMessages.FORBIDDEN("You have already reviewed this product");
      }

      // Step 8: Create the new review
      const newReview = new Review({
        content: reviewData.content,
        rating: reviewData.rating,
        image: reviewData.image || [], // Ensure empty array if no image
        fullName: user.fullName,
        number: user.number,
        user: user._id,
        product: product._id, // Link the review to the product
      });

      await newReview.save();

      // Step 9: Link the review to the product
      product.review.push(newReview._id);
      await product.save();

      return newReview;
    } catch (error) {
      console.error("Error while creating review:", error);
      throw error;
    }
  }

  public async getReviews() {
    try {
      // Fetch all products that have at least one review
      const products = await Product.find({ "review.0": { $exists: true } }) // Ensure that the review array is not empty
        .select("name") // Select only the product name
        .populate({
          path: "review",
          model: "Review", // Populate the reviews for the product
        });

      if (!products || products.length === 0) {
        return [];
      }

      // Modify the image URLs for each review
      products.forEach((product: any) => {
        product.review.forEach((review: any) => {
          if (review.image && review.image.length > 0) {
            review.image = review.image.map((img: any) => `/api/image/${img}`);
          }
        });
      });

      return products;
    } catch (error) {
      throw error;
    }
  }

  public async getReviewsByUser(userId: string) {
    try {
      // Find all products and populate their reviews
      const products = await Product.find()
        .select("name") // Select only the product name
        .populate({
          path: "review",
          model: "Review", // Populate the reviews
          match: { user: userId }, // Only reviews by the specific user
        });

      if (!products || products.length === 0) {
        return [];
      }

      products.forEach((product: any) => {
        // Remove null entries (if no match)
        product.review = product.review.filter((review: any) => review);
        product.review.forEach((review: any) => {
          if (review.image && review.image.length > 0) {
            review.image = review.image.map((img: any) => `/api/image/${img}`);
          }
        });
      });

      // Return only products with reviews by the user
      return products.filter((product: any) => product.review.length > 0);
    } catch (error) {
      throw error;
    }
  }

  public async deleteReviewById(reviewId: string, userEmail: string) {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw httpMessages.NOT_FOUND("review");
      }

      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }

      const result = await Product.updateOne(
        { review: review._id },
        { $pull: { review: review._id } }
      );

      if (result.modifiedCount === 0) {
        throw httpMessages.NOT_FOUND("Review not found in the product");
      }
      await Review.deleteOne({ _id: reviewId });

      return {
        message: "Review deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  // public async updateReviewById(
  //   reviewId: string,
  //   updatedData: Partial<IReview>
  // ) {
  //   try {
  //     const review = await Review.findById(reviewId);

  //     if (!review) {
  //       throw httpMessages.NOT_FOUND("review");
  //     }

  //     const { content, rating, image } = updatedData;
  //     if (content) review.content = content;
  //     if (rating) review.rating = rating;
  //     if (image) {
  //       if (review.image) {
  //         deleteImages(review.image);
  //       }
  //       review.image = image;
  //     }
  //     await review.save();
  //     return review;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
