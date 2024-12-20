import { Review, Product, User } from "../models";
import { Types } from "mongoose";
import { IReview } from "../interfaces";
import { httpMessages } from "../middlewares";

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
      const { content, rating } = reviewData;
      const newReview = new Review({
        content,
        rating,
        fullName: user.fullName,
        number: user.number,
        user: user._id,
      });

      await newReview.save();

      product.reviews.push(newReview._id as Types.ObjectId);
      await product.save();

      return newReview;
    } catch (error) {
      throw error;
    }
  }

  public async getReviews() {
    try {
      const products = await Product.find({
        reviews: { $exists: true, $not: { $size: 0 } },
      })
        .populate({
          path: "reviews",
        })
        .select("name reviews");

      if (!products || products.length === 0) {
        throw httpMessages.NOT_FOUND("No products with reviews found");
      }

      return products;
    } catch (error) {
      throw error;
    }
  }

  public async getReviewsByUser(userId: string) {
    try {
      const reviews = await Review.find({ user: userId });

      if (!reviews || reviews.length === 0) {
        throw httpMessages.NOT_FOUND("reviews for this user");
      }

      return reviews;
    } catch (error) {
      throw error;
    }
  }

  public async deleteReviewById(reviewId: string) {
    try {
      const review = await Review.findById(reviewId);

      if (!review) {
        throw httpMessages.NOT_FOUND("review");
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

      const { content, rating } = updatedData;
      if (content) review.content = content;
      if (rating) review.rating = rating;

      return review;
    } catch (error) {
      throw error;
    }
  }
}
