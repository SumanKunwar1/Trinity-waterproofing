import { Router } from "express";
import { AboutController } from "../controllers";
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
  aboutController.editAbout.bind(aboutController),
  handleResponse
);

// ------------------------ Core Routes ------------------------

router.post(
  "/core",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateAbout,
  aboutController.createCore.bind(aboutController),
  handleResponse
);

router.get(
  "/core",
  aboutController.getCore.bind(aboutController),
  handleResponse
);

router.patch(
  "/core/:coreId",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  validateEditAbout,
  aboutController.editCore.bind(aboutController),
  handleResponse
);

router.delete(
  "/core/:coreId",
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
