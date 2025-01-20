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
  "/:userId",
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
  "/user/:userId",
  isAuthenticated,
  isAuthorizedUser,
  orderController.getOrdersByUserId.bind(orderController),
  handleResponse
);

// Get order by ID
// router.get(
//   "/:orderId",
//   isAuthenticated,
//   orderController.getOrderById.bind(orderController),
//   handleResponse
// );

// Confirm an order (admin only)
router.patch(
  "/admin/:orderId/confirm",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.confirmOrder.bind(orderController),
  handleResponse
);

// Cancel order by admin
router.patch(
  "/admin/:orderId/cancel",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.cancelOrderByAdmin.bind(orderController),
  handleResponse
);

// Return request (user)
router.patch(
  "/:userId/return-request/:orderId",
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
//order disapproved
router.patch(
  "/admin/:orderId/disapprove-return",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.disApproveReturn.bind(orderController),
  handleResponse
);
// Order shipped (admin only)
router.patch(
  "/admin/:orderId/order-shipped",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.markOrderShipped.bind(orderController),
  handleResponse
);

// Order delivered (admin only)
router.patch(
  "/admin/:orderId/order-delivered",
  isAuthenticated,
  isAuthorized("admin"),
  orderController.markOrderDelivered.bind(orderController),
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

// Cancel order (user only)
router.delete(
  "/:userId/cancel/:orderId",
  isAuthenticated,
  isAuthorizedUser,
  orderController.cancelOrderByUser.bind(orderController),
  handleResponse
);

// Error handler middleware
router.use(handleError);

export default router;
