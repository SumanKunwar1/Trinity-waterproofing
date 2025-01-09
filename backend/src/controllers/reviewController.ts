import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services";
import { IReview } from "../interfaces";
import { deleteImages } from "../config/deleteImages";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  public async createReview(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviewData: IReview = req.body;
      const { orderId } = req.params;
      const userEmail = req.email;
      const result = await this.reviewService.createReview(
        reviewData,
        orderId,
        userEmail
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      if (req.body.image) {
        deleteImages(req.body.image);
      }
      next(error);
    }
  }

  public async getReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.reviewService.getReviews();
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async getReviewsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const result = await this.reviewService.getReviewsByUser(userId);
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  public async deleteReviewById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviewId = req.params.reviewId;
      const userEmail = req.email;
      const result = await this.reviewService.deleteReviewById(
        reviewId,
        userEmail
      );
      res.locals.responseData = result;
      next();
    } catch (error: any) {
      next(error);
    }
  }

  // public async updateReviewById(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const reviewId = req.params.reviewId;
  //     const updatedData: Partial<IReview> = req.body;
  //     const result = await this.reviewService.updateReviewById(
  //       reviewId,
  //       updatedData
  //     );
  //     res.locals.responseData = result;
  //     next();
  //   } catch (error: any) {
  //     if (req.body.image) {
  //       deleteImages(req.body.image);
  //     }
  //     next(error);
  //   }
  // }
}
