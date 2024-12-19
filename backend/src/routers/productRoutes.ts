import { Router } from "express";
import { ProductController } from "../controllers";
import {
  validateProduct,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";
import { uploadMiddleware, appendFileDataToBody } from "../config/upload";

const router = Router();
const productController = new ProductController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  validateProduct,
  productController.createProduct.bind(productController),
  handleResponse
);
router.get(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  productController.getProducts.bind(productController),
  handleResponse
);

router.get(
  "/:id",
  isAuthenticated,
  productController.getProductById.bind(productController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  productController.deleteProductById.bind(productController),
  handleResponse
);
router.use(handleError);

export default router;
