import { Router } from "express";
import { BrandController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateBrand,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware } from "../config/upload";

const router = Router();
const brandController = new BrandController();

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
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
//   "/:id",
//   brandController.getBrandById.bind(brandController),
//   handleResponse
// );

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  validateBrand,
  brandController.editBrand.bind(brandController),
  handleResponse
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  brandController.deleteBrand.bind(brandController),
  handleResponse
);

router.use(handleError);

export default router;
