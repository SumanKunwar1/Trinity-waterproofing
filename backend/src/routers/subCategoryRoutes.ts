import { Router } from "express";
import { SubCategoryController } from "../controllers";
import {
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";

const router = Router();
const subCategoryController = new SubCategoryController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  subCategoryController.createSubCategory.bind(subCategoryController),
  handleResponse
);
router.use(handleError);

export default router;
