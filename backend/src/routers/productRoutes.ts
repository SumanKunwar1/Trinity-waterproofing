import { Router } from "express";
import { ProductController } from "../controllers";
import {
  validateProduct,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";
import {
  uploadMiddleware,
  appendFileDataToBody,
  parseColorsMiddleware,
} from "../config/upload";

const router = Router();
const productController = new ProductController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  parseColorsMiddleware,
  validateProduct,
  productController.createProduct.bind(productController),
  handleResponse
);

router.patch(
  "image/:id",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  validateProduct,
  productController.editProductImages.bind(productController),
  handleResponse
);
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validateProduct,
  productController.editProductImages.bind(productController),
  handleResponse
);

router.get(
  "/",
  productController.getProducts.bind(productController),
  handleResponse
);

router.get(
  "/:id",
  productController.getProductById.bind(productController),
  handleResponse
);
router.get(
  "/user/:id",
  productController.getProductByUserId.bind(productController),
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
