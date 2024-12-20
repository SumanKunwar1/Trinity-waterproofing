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
  parseVariantsMiddleware,
} from "../config/upload";

const router = Router();
const productController = new ProductController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  parseVariantsMiddleware,
  parseVariantsMiddleware,
  validateProduct,
  productController.createProduct.bind(productController),
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

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  productController.deleteProductById.bind(productController),
  handleResponse
);
router.use(handleError);

export default router;
