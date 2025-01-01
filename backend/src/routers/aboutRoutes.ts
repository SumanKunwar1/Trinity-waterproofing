import { Router } from "express";
import { AboutController } from "../controllers";
import {
  isAuthenticated,
  isAuthorized,
  validateAbout,
  handleResponse,
  handleError,
} from "../middlewares";
import { imageUploadMiddleware, appendImageDataToBody } from "../config/upload";

const router = Router();
const aboutController = new AboutController();

router.put(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  validateAbout,
  aboutController.createTab.bind(aboutController),
  handleResponse
);

router.get("/", aboutController.getTabs.bind(aboutController), handleResponse);

router.patch(
  "/:tabId",
  isAuthenticated,
  isAuthorized("admin"),
  validateAbout,
  aboutController.editTab.bind(aboutController),
  handleResponse
);

router.patch(
  "/image",
  isAuthenticated,
  isAuthorized("admin"),
  imageUploadMiddleware,
  appendImageDataToBody,
  aboutController.uploadTabImage.bind(aboutController),
  handleResponse
);

router.delete(
  "/:tabId",
  isAuthenticated,
  isAuthorized("admin"),
  aboutController.deleteTab.bind(aboutController),
  handleResponse
);

router.use(handleError);

export default router;
