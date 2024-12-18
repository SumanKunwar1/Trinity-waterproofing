import { Router } from "express";
import { UserController } from "../controllers";
import {
  handleResponse,
  validateUser,
  validateUserLogin,
} from "../middlewares";

const router = Router();
const userController = new UserController();

router.post(
  "/register",
  validateUser,
  userController.createUser.bind(userController),
  handleResponse
);
router.post(
  "/login",
  validateUserLogin,
  userController.loginUser.bind(userController),
  handleResponse
);

export default router;
