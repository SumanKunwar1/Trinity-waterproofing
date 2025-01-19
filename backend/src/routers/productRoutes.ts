import { Router } from "express";
import { ProductController } from "../controllers";
import { compressUploadedImages } from "../config/fileCompress";
import {
  validateProduct,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
  validateProductImage,
  validateEditProduct,
  isAuthorizedUser,
} from "../middlewares";
import {
  uploadMiddleware,
  appendFileDataToBody,
  parseColorsMiddleware,
  parseExistingImageMiddleware,
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
  compressUploadedImages,
  productController.createProduct.bind(productController),
  handleResponse
);

router.patch(
  "/image/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  uploadMiddleware,
  appendFileDataToBody,
  parseExistingImageMiddleware,
  validateProductImage,
  compressUploadedImages,
  productController.editProductImages.bind(productController),
  handleResponse
);

router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  validateEditProduct,
  productController.editProductDetails.bind(productController),
  handleResponse
);

router.patch(
  "/isFeatured/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  productController.editProductIsFeatured.bind(productController),
  handleResponse
);

router.get(
  "/",
  productController.getProducts.bind(productController),
  handleResponse
);

router.get(
  "/:productId",
  productController.getProductById.bind(productController),
  handleResponse
);

router.get(
  "/user/:userId",
  isAuthenticated,
  isAuthorizedUser,
  productController.getProductByUserId.bind(productController),
  handleResponse
);

router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  productController.deleteProductById.bind(productController),
  handleResponse
);
router.use(handleError);

export default router;
