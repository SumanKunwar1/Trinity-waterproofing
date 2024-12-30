import { Review, Product, User, Order } from "../models";
import { Types } from "mongoose";
import { IReview } from "../interfaces";
import { httpMessages } from "../middlewares";
import { OrderStatus } from "../config/orderStatusEnum";
import { deleteImages } from "../config/deleteImages";

export class ReviewService {
  public async createReview(reviewData: IReview, userEmail: string) {
    try {
      const product = await Product.findById(reviewData.productId);
      if (!product) {
        throw httpMessages.NOT_FOUND("Product not found");
      }
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        throw httpMessages.NOT_FOUND("User not found");
      }
      if (user.role === "admin") {
        throw httpMessages.FORBIDDEN("You are forbidded to post reviews");
      }

      const order = await Order.findOne({
        user: user._id,
        "products.productId": reviewData.productId,
      });

      if (!order) {
        throw httpMessages.FORBIDDEN(
          "You can only review products you have purchased"
        );
      }

      if (order.status !== OrderStatus.SERVICE_COMPLETED) {
        throw httpMessages.FORBIDDEN(
          "You can only review products from completed orders"
        );
      }
      const existingReview = await Review.findOne({
        user: user._id,
        product: product._id,
      });
      if (existingReview) {
        throw httpMessages.FORBIDDEN("You have already reviewed this product");
      }

      const { content, rating, image } = reviewData;
      const newReview = new Review({
        content,
        rating,
        image,
        fullName: user.fullName,
        number: user.number,
        user: user._id,
      });

      await newReview.save();

      product.review.push(newReview._id as Types.ObjectId);
      await product.save();

      return newReview;
    } catch (error) {
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
