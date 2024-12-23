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
  validateAddressBook,
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

router.patch(
  "/addressBook/:id",
  isAuthenticated,
  isAuthorizedUser,
  validateAddressBook,
  userController.addAddress.bind(userController),
  handleResponse
);

router.get(
  "/addressBook/:id",
  isAuthenticated,
  isAuthorizedUser,
  userController.getAddress.bind(userController),
  handleResponse
);

router.patch(
  "/addressBook/:id/:addressBookId",
  isAuthenticated,
  isAuthorizedUser,
  validateAddressBook,
  userController.editAddress.bind(userController),
  handleResponse
);
router.patch(
  "/addressBook/default/:id/:addressBookId",
  isAuthenticated,
  isAuthorizedUser,
  userController.editDefaultAddress.bind(userController),
  handleResponse
);

router.delete(
  "/addressBook/:id/:addressBookId",
  isAuthenticated,
  isAuthorizedUser,
  userController.deleteAddress.bind(userController),
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
