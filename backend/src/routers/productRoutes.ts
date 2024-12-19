import { Router } from "express";
import { ProductController } from "../controllers";
import {
  validateProduct,
  handleResponse,
  isAuthenticated,
  isAuthorized,
  handleError,
} from "../middlewares";
import { NextFunction, Request, Response } from "express";
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
router.use(handleError);

export default router;
