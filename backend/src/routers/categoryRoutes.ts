import { Router } from "express";
import { CategoryController } from "../controllers";
import {
  validateCategory,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
  validateEditCategory,
} from "../middlewares";

const router = Router();
const categoryController = new CategoryController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validateCategory,
  categoryController.createCategory.bind(categoryController),
  handleResponse
);

router.get(
  "/",
  categoryController.getCategories.bind(categoryController),
  handleResponse
);

router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  validateEditCategory,
  categoryController.editCategory.bind(categoryController),
  handleResponse
);

router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  categoryController.deleteCategory.bind(categoryController),
  handleResponse
);

router.use(handleError);

export default router;
