import { Router } from "express";
import { OrderController } from "../controllers";
import {
  isAuthenticated,
  isAuthorizedUser,
  isAuthorized,
  validateOrder,
  handleResponse,
  handleError,
} from "../middlewares";

const router = Router();
const orderController = new OrderController();

router.post(
  "/",
  isAuthenticated,
  isAuthorizedUser,
  validateOrder,
  orderController.createOrder.bind(orderController),
  handleResponse
);

router.get(
  "/admin",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.getAllOrders.bind(orderController),
  handleResponse
);

router.get(
  "/:id",
  isAuthenticated,
  orderController.getOrdersByUserId.bind(orderController),
  handleResponse
);

router.get(
  "/:id",
  isAuthenticated,
  orderController.getOrderById.bind(orderController),
  handleResponse
);

router.patch(
  "/admin/:id",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.updateOrderStatus.bind(orderController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorizedUser,
  orderController.deleteOrderById.bind(orderController),
  handleResponse
);

router.delete(
  "/admin/:id",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.deleteOrderByAdmin.bind(orderController),
  handleResponse
);

router.use(handleError);

export default router;
