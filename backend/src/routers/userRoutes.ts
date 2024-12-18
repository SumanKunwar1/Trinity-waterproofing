import { Router } from "express";
import { UserController } from "../controllers";
import {
  handleResponse,
  validateUser,
  validateUserLogin,
  handleError,
  isAuthorized,
  isAuthenticated,
  isAuthorizedUser,
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

router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  userController.getUsers.bind(userController),
  handleResponse
);

router.patch(
  "/edit/:id",
  isAuthenticated,
  isAuthorizedUser,
  userController.editUser.bind(userController),
  handleResponse
);

router.patch(
  "/edit/password/:id",
  isAuthenticated,
  isAuthorizedUser,
  userController.editPassword.bind(userController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorizedUser,
  userController.deleteUser.bind(userController),
  handleResponse
);

router.delete(
  "/adminDelete/:id",
  isAuthenticated,
  isAuthorized("admin"),
  userController.deleteUser.bind(userController),
  handleResponse
);
router.use(handleError);

export default router;
