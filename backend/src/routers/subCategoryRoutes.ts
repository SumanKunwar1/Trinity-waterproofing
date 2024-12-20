import { Router } from "express";
import { SubCategoryController } from "../controllers";
import {
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
  validateSubCategory,
  validateEditSubCategory,
} from "../middlewares";

const router = Router();
const subCategoryController = new SubCategoryController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validateSubCategory,
  subCategoryController.createSubCategory.bind(subCategoryController),
  handleResponse
);

router.get(
  "/",
  subCategoryController.getSubCategories.bind(subCategoryController),
  handleResponse
);

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validateEditSubCategory,
  subCategoryController.editSubCategory.bind(subCategoryController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  subCategoryController.deleteSubCategories.bind(subCategoryController),
  handleResponse
);
router.use(handleError);

export default router;
