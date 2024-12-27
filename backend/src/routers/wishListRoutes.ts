import { Router } from "express";
import { WishListController } from "../controllers";
import {
  handleResponse,
  isAuthenticated,
  isAuthorizedUser,
  handleError,
} from "../middlewares";

const router = Router();
const wishListController = new WishListController();

router.post(
  "/:userId/:productId",
  isAuthenticated,
  isAuthorizedUser,
  wishListController.addToWishList.bind(wishListController),
  handleResponse
);

router.delete(
  "/:userId/:productId",
  isAuthenticated,
  isAuthorizedUser,
  wishListController.removeFromWishList.bind(wishListController),
  handleResponse
);

router.get(
  "/:userId/",
  isAuthenticated,
  isAuthorizedUser,
  wishListController.getWishlist.bind(wishListController),
  handleResponse
);

router.use(handleError);

export default router;
