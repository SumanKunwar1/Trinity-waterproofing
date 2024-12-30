import express from "express";
import { NotificationController } from "../controllers/notificationController";
import {
  isAuthenticated,
  isAuthorizedUser,
  handleResponse,
} from "../middlewares";

const router = express.Router();
const notificationController = new NotificationController();

// router.post(
//   "/create",
//   isAuthenticated,
//   isAuthorizedUser,
//   notificationController.createNotification.bind(notificationController),
//   handleResponse
// );

router.get(
  "/:userId",
  isAuthenticated,
  notificationController.getNotificationsByUserId.bind(notificationController),
  handleResponse
);

export default router;
