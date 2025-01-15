import { Router } from "express";
import { ReviewController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  isAuthorizedUser,
  validateReview,
  // validateEditReview,
  handleResponse,
  handleError,
} from "../middlewares";
import { uploadMiddleware, appendFileDataToBody } from "../config/upload";

const router = Router();
const reviewController = new ReviewController();

router.post(
  "/:orderId",
  isAuthenticated,
  uploadMiddleware,
  appendFileDataToBody,
  validateReview,
  reviewController.createReview.bind(reviewController),
  handleResponse
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  reviewController.getReviews.bind(reviewController),
  handleResponse
);

router.get(
  "/user/:userId",
  isAuthenticated,
  isAuthorizedUser,
  reviewController.getReviewsByUser.bind(reviewController),
  handleResponse
);

router.delete(
  "/:reviewId",
  isAuthenticated,
  isAuthorized("admin"),
  reviewController.deleteReviewById.bind(reviewController),
  handleResponse
);

router.use(handleError);

export default router;
