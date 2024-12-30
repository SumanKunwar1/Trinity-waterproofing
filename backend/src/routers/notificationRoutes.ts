import express from "express";
import { NotificationController } from "../controllers/notificationController";
import {
  isAuthenticated,
  isAuthorizedUser,
  handleResponse,
} from "../middlewares";

const router = express.Router();
const notificationController = new NotificationController();

// Route to get notifications for a user
router.get(
  "/:userId",
  isAuthenticated,
  isAuthorizedUser,
  notificationController.getNotificationsByUserId.bind(notificationController),
  handleResponse
);

router.patch(
  "/:notificationId/read/:userId",
  isAuthenticated,
  isAuthorizedUser,
  notificationController.markNotificationAsRead.bind(notificationController),
  handleResponse
);

router.delete(
  "/:notificationId/:userId",
  isAuthenticated,
  isAuthorizedUser,
  notificationController.deleteNotification.bind(notificationController),
  handleResponse
);

router.patch(
  "/:userId/read-all",
  isAuthenticated,
  isAuthorizedUser,
  notificationController.markAllNotificationsAsRead.bind(
    notificationController
  ),
  handleResponse
);

router.delete(
  "/:userId/clear-all",
  isAuthenticated,
  isAuthorizedUser,
  notificationController.clearAllNotifications.bind(notificationController),
  handleResponse
);

export default router;
