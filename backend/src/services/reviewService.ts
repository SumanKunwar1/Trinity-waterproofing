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

      // Log the order for debugging
      console.log("order we got", order);

      // Step 5: Ensure the product is in the order
      const productInOrder = order.products.some(
        (orderProduct) =>
          orderProduct.productId.toString() === reviewData.productId.toString()
      );
      if (!productInOrder) {
        throw httpMessages.FORBIDDEN(
          "You can only review products you have purchased"
        );
      }

      // Step 6: Check if the order status is "delivered"
      if (order.status !== OrderStatus.ORDER_DELIVERED) {
        throw httpMessages.FORBIDDEN(
          "You can only review products from completed orders"
        );
      }

      // Step 7: Check if the user has already reviewed the product
      const existingReview = await Review.findOne({
        user: user._id,
        product: product._id,
      });
      if (existingReview) {
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
      const reviews = await Review.find().populate({
        path: "productId",
        select: "name",
      });

      if (!reviews || reviews.length === 0) {
        return [];
      }

      reviews.forEach((review) => {
        if (review.image && review.image.length > 0) {
          review.image = review.image.map((rev) => `/api/image/${rev}`);
        }
      });

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  public async getReviewsByUser(userId: string) {
    try {
      const reviews = await Review.find({ user: userId }).populate({
        path: "productId",
        select: "name",
      });

      if (!reviews || reviews.length === 0) {
        return [];
      }

      // Modify the image URLs for each review
      reviews.forEach((review) => {
        if (review.image && review.image.length > 0) {
          review.image = review.image.map((rev) => `/api/image/${rev}`);
        }
      });

      return reviews;
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

      if (!review.user || review.user.toString() !== user._id.toString()) {
        throw httpMessages.FORBIDDEN(
          "You do not have permission to delete this review"
        );
      }

      await Product.updateOne(
        { review: reviewId },
        { $pull: { review: reviewId } }
      );
      await Review.deleteOne({ _id: reviewId });

      return {
        message: "Review deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  }

  public async updateReviewById(
    reviewId: string,
    updatedData: Partial<IReview>
  ) {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw httpMessages.NOT_FOUND("review");
      }

      const { content, rating, image } = updatedData;
      if (content) review.content = content;
      if (rating) review.rating = rating;
      if (image) {
        if (review.image) {
          deleteImages(image);
        }
        review.image = image;
      }

      return review;
    } catch (error) {
      throw error;
    }
  }
}
