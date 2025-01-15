import { Router } from "express";
import { AboutController } from "../controllers";
import { compressUploadedImages } from "../config/fileCompress";
import {
  isAuthenticated,
  isAuthorized,
  validateAbout,
  validateEditAbout,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const aboutController = new AboutController();

// ------------------------ About Routes ------------------------

router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateAbout,
  compressUploadedImages,
  aboutController.createAbout.bind(aboutController),
  handleResponse
);

router.get("/", aboutController.getAbout.bind(aboutController), handleResponse);

router.patch(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditAbout,
  compressUploadedImages,
  aboutController.editAbout.bind(aboutController),
  handleResponse
);

// ------------------------ cores Routes ------------------------

router.post(
  "/cores",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateAbout,
  compressUploadedImages,
  aboutController.createCore.bind(aboutController),
  handleResponse
);

router.get(
  "/cores",
  aboutController.getCore.bind(aboutController),
  handleResponse
);

router.patch(
  "/cores/:coreId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditAbout,
  compressUploadedImages,
  aboutController.editCore.bind(aboutController),
  handleResponse
);

router.delete(
  "/cores/:coreId",
  isAuthenticated,
  isAuthorized("admin"),
  aboutController.deleteCore.bind(aboutController),
  handleResponse
);

// ------------------------ Tab Routes ------------------------

router.post(
  "/tabs",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateAbout,
  compressUploadedImages,
  aboutController.createTab.bind(aboutController),
  handleResponse
);

router.get(
  "/tabs",
  aboutController.getTabs.bind(aboutController),
  handleResponse
);

router.patch(
  "/tabs/:tabId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditAbout,
  compressUploadedImages,
  aboutController.editTab.bind(aboutController),
  handleResponse
);

router.delete(
  "/tabs/:tabId",
  isAuthenticated,
  isAuthorized("admin"),
  aboutController.deleteTab.bind(aboutController),
  handleResponse
);

router.use(handleError);

export default router;
