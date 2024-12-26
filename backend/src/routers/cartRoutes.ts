import { Router } from "express";
import { CartController } from "../controllers";
import {
  isAuthenticated,
  isAuthorizedUser,
  isAuthorized,
  validateCart,
  handleResponse,
  handleError,
} from "../middlewares";

const router = Router();
const cartController = new CartController();

router.post(
  "/:id",
  isAuthenticated,
  isAuthorizedUser,
  validateCart,
  cartController.addToCart.bind(cartController),
  handleResponse
);

router.patch(
  "/:id/:cartItemId",
  isAuthenticated,
  isAuthorizedUser,
  cartController.updateQuantity.bind(cartController),
  handleResponse
);

router.delete(
  "/:id/:cartItemId",
  isAuthenticated,
  isAuthorizedUser,
  cartController.removeFromCart.bind(cartController),
  handleResponse
);

router.get(
  "/:id",
  isAuthenticated,
  isAuthorizedUser,
  cartController.getCart.bind(cartController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorizedUser,
  cartController.clearCart.bind(cartController),
  handleResponse
);

router.use(handleError);

export default router;
