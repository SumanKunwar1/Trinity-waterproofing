import { Router } from "express";
import { BrandController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateBrand,
  validateEditBrand,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const brandController = new BrandController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateBrand,
  brandController.createBrand.bind(brandController),
  handleResponse
);

router.get(
  "/",
  brandController.getBrands.bind(brandController),
  handleResponse
);

// router.get(
//   "/:brandId",
//   brandController.getBrandById.bind(brandController),
//   handleResponse
// );

router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditBrand,
  brandController.editBrand.bind(brandController),
  handleResponse
);

router.delete(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  brandController.deleteBrand.bind(brandController),
  handleResponse
);

router.use(handleError);

export default router;
