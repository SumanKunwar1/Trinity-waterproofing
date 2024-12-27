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

// Create an order
router.post(
  "/",
  isAuthenticated,
  isAuthorizedUser,
  validateOrder,
  orderController.createOrder.bind(orderController),
  handleResponse
);

// Get all orders (admin only)
router.get(
  "/admin",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.getAllOrders.bind(orderController),
  handleResponse
);

// Get orders by user ID
router.get(
  "/user/:id",
  isAuthenticated,
  isAuthorizedUser,
  orderController.getOrdersByUserId.bind(orderController),
  handleResponse
);

// Get order by ID
router.get(
  "/:orderId",
  isAuthenticated,
  orderController.getOrderById.bind(orderController),
  handleResponse
);

// Confirm an order (admin only)
router.patch(
  "/admin/:id/confirm",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.confirmOrder.bind(orderController),
  handleResponse
);

// Cancel order (user only)
router.delete(
  "/:id/cancel/:orderId",
  isAuthenticated,
  isAuthorizedUser,
  orderController.cancelOrderByUser.bind(orderController),
  handleResponse
);

// Cancel order by admin
router.delete(
  "/admin/:id/cancel",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.cancelOrderByAdmin.bind(orderController),
  handleResponse
);

// Return request (user)
router.patch(
  "/:id/return-request/:orderId",
  isAuthenticated,
  isAuthorizedUser,
  orderController.returnRequest.bind(orderController),
  handleResponse
);

// Approve return request (admin only)
router.patch(
  "/admin/:orderId/approve-return",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.approveReturn.bind(orderController),
  handleResponse
);

// Delete order (admin only)
router.delete(
  "/admin/:orderId",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.deleteOrderByAdmin.bind(orderController),
  handleResponse
);

// Error handler middleware
router.use(handleError);

export default router;
